import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.shipengine.com/v1/carriers", {
    headers: {
      "API-Key": process.env.SHIPENGINE_API_KEY!,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json({ error }, { status: res.status });
  }

  const data = await res.json();

  // Return just carriers array (with services, packages, options inside)
  return NextResponse.json(data.carriers || []);
}
