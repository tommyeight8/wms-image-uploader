import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

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
    const { orderId, fileName, contentType } = await req.json();
    if (!orderId || !fileName || !contentType)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const filePath = `orders/${orderId}/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    const [url] = await file.getSignedUrl({
      action: "write",
      expires: Date.now() + 5 * 60 * 1000,
      contentType,
    });

    return NextResponse.json({
      uploadUrl: url,
      publicUrl: `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${filePath}`,
    });
  } catch (err: any) {
    console.error("Error generating signed URL:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
