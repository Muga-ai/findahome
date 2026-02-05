"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/* ================================
   TYPES
================================ */

interface CloudinaryResponse {
  secure_url: string;
}

/* ================================
   CONSTANTS
================================ */

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* ================================
   COMPONENT
================================ */

export default function ListingForm() {
  const router = useRouter();

  /* ================= STATE ================= */

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState<number | "">("");
  const [location, setLocation] = useState("");

  const [beds, setBeds] = useState<number | "">("");
  const [baths, setBaths] = useState<number | "">("");
  const [size, setSize] = useState<number | "">("");

  const [virtualTour, setVirtualTour] = useState("");

  const [files, setFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================================
     FILE HANDLER
  ================================ */

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    if (selected.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    for (const file of selected) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files allowed");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Each image must be under 5MB");
        return;
      }
    }

    setError(null);
    setFiles(selected);
  };

  /* ================================
     CLOUDINARY UPLOAD
  ================================ */

  const uploadImages = async (): Promise<string[]> => {
    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary not configured correctly");
    }

    const urls: string[] = [];

    for (const file of files) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data: CloudinaryResponse = await res.json();

      urls.push(data.secure_url);
    }

    return urls;
  };

  /* ================================
     SUBMIT HANDLER
  ================================ */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    if (!beds || !baths || !size) {
      setError("Please fill in all property details");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      /* Upload images */
      const imageUrls = await uploadImages();

      /* Save to Firestore */
      await addDoc(collection(db, "listings"), {
        title,
        description,

        price: Number(price),
        location,

        beds: Number(beds),
        baths: Number(baths),
        size: Number(size),

        images: imageUrls,
        virtualTour,

        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard/listings");
    } catch (err) {
      console.error(err);
      setError("Failed to create listing. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     UI
  ================================ */

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-5 bg-white p-6 rounded-xl shadow"
    >
      {/* ================= ERROR ================= */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* ================= TITLE ================= */}
      <div>
        <label className="block mb-1 font-semibold">Title</label>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div>
        <label className="block mb-1 font-semibold">
          Description
        </label>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* ================= PRICE ================= */}
      <div>
        <label className="block mb-1 font-semibold">
          Price (Ksh)
        </label>

        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.valueAsNumber)}
          required
          min={0}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* ================= LOCATION ================= */}
      <div>
        <label className="block mb-1 font-semibold">
          Location
        </label>

        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* ================= PROPERTY DETAILS ================= */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block mb-1 font-semibold">
            Beds
          </label>

          <input
            type="number"
            value={beds}
            onChange={e =>
              setBeds(e.target.valueAsNumber)
            }
            min={0}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Baths
          </label>

          <input
            type="number"
            value={baths}
            onChange={e =>
              setBaths(e.target.valueAsNumber)
            }
            min={0}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Size (sqm)
          </label>

          <input
            type="number"
            value={size}
            onChange={e =>
              setSize(e.target.valueAsNumber)
            }
            min={0}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* ================= IMAGES ================= */}
      <div>
        <label className="block mb-1 font-semibold">
          Images (Max {MAX_IMAGES})
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          className="w-full"
        />

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="relative h-24 rounded overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= VIRTUAL TOUR ================= */}
      <div>
        <label className="block mb-1 font-semibold">
          Virtual Tour (Optional)
        </label>

        <input
          type="url"
          value={virtualTour}
          onChange={e => setVirtualTour(e.target.value)}
          placeholder="https://"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* ================= SUBMIT ================= */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-black py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Add Listing"}
      </button>
    </form>
  );
}
