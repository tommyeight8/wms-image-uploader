import { NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    // Dynamic import for Google Cloud Storage
    const { Storage } = await import("@google-cloud/storage");

    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });

    const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const optimized = await sharp(buffer)
      .resize(1024, 1024, { fit: "inside" })
      .jpeg({ quality: 75 })
      .toBuffer();

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `orders/${orderId}/${Date.now()}-${sanitizedFileName}`;
    const blob = bucket.file(fileName);

    await blob.save(optimized, {
      metadata: { contentType: "image/jpeg" },
      resumable: false,
    });

    const [signedUrl] = await blob.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });

    const order = await prisma.order.upsert({
      where: { id: orderId },
      update: {
        reference: reference || orderId,
      },
      create: {
        id: orderId,
        reference: reference || orderId,
      },
    });

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
