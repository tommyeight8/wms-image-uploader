"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

type FormValues = {
  shipFrom: {
    name: string;
    company_name?: string;
    address_line1: string;
    city_locality: string;
    state_province: string;
    postal_code: string;
    country_code: string;
    phone: string;
  };
  shipTo: {
    name: string;
    company_name?: string;
    address_line1: string;
    city_locality: string;
    state_province: string;
    postal_code: string;
    country_code: string;
    phone: string;
  };
  packages: {
    weight: number;
    unit: string;
    length?: number;
    width?: number;
    height?: number;
  }[];
};

export default function Page() {
  const [carriers, setCarriers] = useState<any[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [packagesAvailable, setPackagesAvailable] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [labelUrl, setLabelUrl] = useState<string | null>(null);
  const [labelPrice, setLabelPrice] = useState<number | null>(null);
  const [labelCurrency, setLabelCurrency] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      shipFrom: {
        name: "",
        address_line1: "",
        city_locality: "",
        state_province: "",
        postal_code: "",
        country_code: "US",
        phone: "",
      },
      shipTo: {
        name: "",
        address_line1: "",
        city_locality: "",
        state_province: "",
        postal_code: "",
        country_code: "US",
        phone: "",
      },
      packages: [{ weight: 1, unit: "pound", length: 10, width: 8, height: 4 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages",
  });

  useEffect(() => {
    fetch("/api/carriers")
      .then((res) => res.json())
      .then((data) => setCarriers(data));
  }, []);

  useEffect(() => {
    const carrier = carriers.find((c) => c.carrier_id === selectedCarrier);
    setServices(carrier?.services || []);
    setPackagesAvailable(carrier?.packages || []);
  }, [selectedCarrier, carriers]);

  async function onSubmit(data: FormValues) {
    const body = {
      shipment: {
        service_code: selectedService,
        package_code: selectedPackage || "package",
        ship_from: data.shipFrom,
        ship_to: data.shipTo,
        packages: data.packages.map((p) => ({
          weight: { value: p.weight, unit: p.unit },
          dimensions: p.length
            ? {
                length: p.length,
                width: p.width,
                height: p.height,
                unit: "inch",
              }
            : undefined,
        })),
      },
    };

    const res = await fetch("/api/label", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    console.log(result);

    if (res.ok) {
      setLabelUrl(result.label_download?.pdf);
      setLabelPrice(result.shipment_cost?.amount || null);
      setLabelCurrency(result.shipment_cost?.currency?.toUpperCase() || null);
    } else {
      alert("Error: " + JSON.stringify(result.errors || result.error));
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Shipping Label</h1>

      {/* Carrier */}
      <select
        value={selectedCarrier}
        onChange={(e) => setSelectedCarrier(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Carrier</option>
        {carriers.map((c) => (
          <option key={c.carrier_id} value={c.carrier_id}>
            {c.friendly_name || c.carrier_code}
          </option>
        ))}
      </select>

      {/* Service */}
      {services.length > 0 && (
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s.service_code} value={s.service_code}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      {/* Package type */}
      {packagesAvailable.length > 0 && (
        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Package</option>
          {packagesAvailable.map((p) => (
            <option key={p.package_code} value={p.package_code}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      {/* Addresses */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="font-semibold">Ship From</h2>
        <input
          placeholder="Name"
          {...register("shipFrom.name", { required: "Name is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.shipFrom?.name && (
          <p className="text-red-500">{errors.shipFrom.name.message}</p>
        )}

        <input
          placeholder="Address"
          {...register("shipFrom.address_line1", {
            required: "Address is required",
          })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="City"
          {...register("shipFrom.city_locality", { required: true })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="State"
          {...register("shipFrom.state_province", { required: true })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Postal Code"
          {...register("shipFrom.postal_code", { required: true })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Phone"
          {...register("shipFrom.phone", { required: "Phone is required" })}
          className="w-full border p-2 rounded"
        />

        <h2 className="font-semibold">Ship To</h2>
        <input
          placeholder="Name"
          {...register("shipTo.name", { required: true })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Address"
          {...register("shipTo.address_line1", { required: true })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="City"
          {...register("shipTo.city_locality", { required: true })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="State"
          {...register("shipTo.state_province", { required: true })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Postal Code"
          {...register("shipTo.postal_code", { required: true })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Phone"
          {...register("shipTo.phone", { required: true })}
          className="w-full border p-2 rounded"
        />

        <h2 className="font-semibold text-lg mt-6">Packages</h2>
        {fields.map((field, i) => (
          <div key={field.id} className="border p-4 rounded space-y-3 mb-4">
            <h3 className="font-medium text-gray-700">Package {i + 1}</h3>

            {/* Weight */}
            <label className="block text-sm font-medium text-gray-600">
              Weight
            </label>
            <input
              type="number"
              placeholder="Enter weight"
              {...register(`packages.${i}.weight`, {
                required: true,
                valueAsNumber: true,
              })}
              className="w-full border p-2 rounded"
            />

            {/* Unit */}
            <label className="block text-sm font-medium text-gray-600">
              Unit
            </label>
            <select
              {...register(`packages.${i}.unit`)}
              className="w-full border p-2 rounded"
            >
              <option value="pound">Pounds (lb)</option>
              <option value="ounce">Ounces (oz)</option>
              <option value="kilogram">Kilograms (kg)</option>
              <option value="gram">Grams (g)</option>
            </select>

            {/* Dimensions */}
            <label className="block text-sm font-medium text-gray-600">
              Dimensions (inches)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Length"
                {...register(`packages.${i}.length`, { valueAsNumber: true })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Width"
                {...register(`packages.${i}.width`, { valueAsNumber: true })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Height"
                {...register(`packages.${i}.height`, { valueAsNumber: true })}
                className="border p-2 rounded"
              />
            </div>

            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-500 mt-2 text-sm"
            >
              ❌ Remove Package
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              weight: 1,
              unit: "pound",
              length: 10,
              width: 8,
              height: 4,
            })
          }
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          ➕ Add Another Package
        </button>

        <button
          type="submit"
          disabled={!selectedService}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Create Label
        </button>
      </form>

      {/* Label Preview */}
      {labelUrl && (
        <div className="mt-6 border p-4 rounded">
          <h2 className="font-semibold text-lg">Label Ready</h2>
          {labelPrice !== null && (
            <p className="text-gray-700">
              Cost: ${labelPrice.toFixed(2)} {labelCurrency || "USD"}
            </p>
          )}
          <a
            href={labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download PDF
          </a>
          <iframe
            src={labelUrl}
            width="400"
            height="600"
            className="mt-4 border"
          />
        </div>
      )}
    </div>
  );
}
