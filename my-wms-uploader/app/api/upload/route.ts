import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;
    const reference = formData.get("reference") as string | null;
    const customerName = formData.get("customerName") as string | null;

    if (!file || !orderId) {
      return NextResponse.json(
        { error: "Missing file or orderId" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize image using Sharp
    const optimized = await sharp(buffer)
      .resize(1024, 1024, { fit: "inside" })
      .jpeg({ quality: 75 })
      .toBuffer();

    // Generate a safe file name
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `orders/${orderId}/${Date.now()}-${sanitizedFileName}`;
    const blob = bucket.file(fileName);

    // Save to GCS (compatible with uniform bucket-level access)
    await blob.save(optimized, {
      metadata: { contentType: "image/jpeg" },
      resumable: false,
    });

    // Generate signed URL (valid for 1 hour)
    const [signedUrl] = await blob.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });

    // ✅ Ensure order exists or create a new one
    const order = await prisma.order.upsert({
      where: { id: orderId },
      update: {
        reference: reference || orderId,
      },
      create: {
        id: orderId,
        reference: reference || orderId,
        // Optional: if you want to store customerName, add to schema later
      },
    });

    // Save uploaded image record
    const image = await prisma.orderImage.create({
      data: {
        orderId: order.id,
        url: signedUrl,
      },
    });

    return NextResponse.json({
      success: true,
      image,
      order,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
