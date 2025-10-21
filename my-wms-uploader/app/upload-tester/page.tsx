"use client";
import { useState } from "react";

export default function UploadTester() {
  const [file, setFile] = useState<File | null>(null);
  const [orderId, setOrderId] = useState("TEST-ORDER-001");
  const [reference, setReference] = useState("REF-1234");
  const [customerName, setCustomerName] = useState("John Doe");
  const [uploaded, setUploaded] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderId", orderId);
    formData.append("reference", reference);
    formData.append("customerName", customerName);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (data.image) {
        setUploaded((prev) => [...prev, data.image]);
        setFile(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🧪 Order Image Uploader Test</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 border p-4 rounded shadow"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reference</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploaded.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Uploaded Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {uploaded.map((img) => (
              <div key={img.id} className="border rounded p-2">
                <img
                  src={img.url}
                  alt="Uploaded"
                  className="rounded w-full h-40 object-cover"
                />
                <p className="text-xs text-gray-600 break-all mt-2">
                  {img.url}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
