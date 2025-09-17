// utils/shipengine.ts
let cachedCarriers: any[] = [];

export async function getCarriers() {
  if (cachedCarriers.length) return cachedCarriers;

  const res = await fetch("https://api.shipengine.com/v1/carriers", {
    headers: { "API-Key": process.env.SHIPENGINE_API_KEY! },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch carriers from ShipEngine");
  }

  const data = await res.json();
  cachedCarriers = data.carriers || [];
  return cachedCarriers;
}

export function isValidService(carrierId: string, serviceCode: string) {
  const carrier = cachedCarriers.find((c) => c.carrier_id === carrierId);
  return carrier?.services.some((s: any) => s.service_code === serviceCode);
}

export function isValidPackage(carrierId: string, packageCode: string) {
  const carrier = cachedCarriers.find((c) => c.carrier_id === carrierId);
  return carrier?.packages.some((p: any) => p.package_code === packageCode);
}
