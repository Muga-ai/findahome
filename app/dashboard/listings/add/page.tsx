"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";

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
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/* ================================
   PAGE
================================ */

export default function AddListingPage() {
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
  const [isFeatured, setIsFeatured] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================================
     FILE HANDLER - FIXED FOR MULTIPLE IMAGES
  ================================ */

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    const newFiles = [...files, ...selected];

    // Check total count
    if (newFiles.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    // Validate each file
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
    setFiles(newFiles);

    // Create previews
    const newPreviews = selected.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  /* ================================
     REMOVE IMAGE
  ================================ */

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  /* ================================
     CLOUDINARY UPLOAD
  ================================ */

  const uploadImages = async (): Promise<string[]> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary not configured");
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
     SUBMIT
  ================================ */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    if (files.length === 0) {
      setError("Upload at least one image");
      return;
    }

    if (!beds || !baths || !size) {
      setError("Fill in property details");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const imageUrls = await uploadImages();

      await addDoc(collection(db, "listings"), {
        title,
        description,
        price: Number(price),
        location,
        beds: Number(beds),
        baths: Number(baths),
        size: Number(size),
        images: imageUrls,
        virtualTour: virtualTour || null,
        isFeatured,
        status: "active",
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard/listings");
    } catch (err) {
      console.error(err);
      setError("Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     UI
  ================================ */

  return (
    <main className="min-h-screen p-8 bg-light text-dark">
      <h1 className="text-3xl font-bold mb-6">Add Property</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white p-6 rounded-xl shadow space-y-5"
      >
        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Title */}
        <Input label="Title" value={title} set={setTitle} />

        {/* Description */}
        <Textarea label="Description" value={description} set={setDescription} />

        {/* Price */}
        <NumberInput label="Price (Ksh)" value={price} set={setPrice} />

        {/* Location */}
        <Input label="Location" value={location} set={setLocation} />

        {/* Property Info */}
        <div className="grid grid-cols-3 gap-3">
          <NumberInput label="Beds" value={beds} set={setBeds} />
          <NumberInput label="Baths" value={baths} set={setBaths} />
          <NumberInput label="Size (sqm)" value={size} set={setSize} />
        </div>

        {/* Images - ENHANCED */}
        <div>
          <label className="block mb-2 font-semibold">
            Images ({files.length}/{MAX_IMAGES})
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            disabled={files.length >= MAX_IMAGES}
            className="w-full mb-3"
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previews.map((preview, i) => (
                <div
                  key={i}
                  className="relative h-32 rounded-lg overflow-hidden group"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>

                  {/* First image badge */}
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-black text-xs px-2 py-1 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Virtual Tour */}
        <Input
          label="Virtual Tour Link (Optional)"
          value={virtualTour}
          set={setVirtualTour}
          type="url"
          placeholder="https://..."
        />

        {/* Featured Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="featured" className="font-semibold cursor-pointer">
            Mark as Featured Listing
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Listing"}
        </button>
      </form>
    </main>
  );
}

/* ================================
   FORM COMPONENTS
================================ */

function Input({
  label,
  value,
  set,
  type = "text",
  placeholder = "",
}: any) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
        required={type !== "url"}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function Textarea({ label, value, set }: any) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        rows={4}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function NumberInput({ label, value, set }: any) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => set(e.target.valueAsNumber)}
        required
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}
