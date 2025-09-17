import { NextResponse } from "next/server";
import {
  getCarriers,
  isValidService,
  isValidPackage,
} from "@/utils/shipengine";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate service_code & package_code
    const carriers = await getCarriers();

    if (
      body.service_code &&
      !isValidService(body.carrier_id, body.service_code)
    ) {
      return NextResponse.json(
        { error: `Invalid service_code: ${body.service_code}` },
        { status: 400 }
      );
    }

    // Check each package if provided
    if (body.packages?.length) {
      for (const pkg of body.packages) {
        if (
          pkg.package_code &&
          !isValidPackage(body.carrier_id, pkg.package_code)
        ) {
          return NextResponse.json(
            { error: `Invalid package_code: ${pkg.package_code}` },
            { status: 400 }
          );
        }
      }
    }

    // 🚀 Forward request to ShipEngine
    const res = await fetch("https://api.shipengine.com/v1/labels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.SHIPENGINE_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
