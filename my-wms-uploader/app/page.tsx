import { PrismaClient, OrderImage } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const images: OrderImage[] = await prisma.orderImage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">📦 Order Image Dashboard</h1>

      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img: OrderImage) => (
            <div key={img.id} className="border rounded p-2">
              <img
                src={img.url}
                alt="Order"
                className="rounded w-full object-cover"
              />
              <p className="text-xs text-gray-500 mt-2">Order: {img.orderId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
