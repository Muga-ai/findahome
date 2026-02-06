"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";

import { doc, getDoc, updateDoc } from "firebase/firestore";
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

export default function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const listingId = params.id;

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
  const [status, setStatus] = useState<"active" | "sold" | "pending">("active");

  // Existing images from Firestore
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // New files to upload
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================================
     FETCH LISTING
  ================================ */

  useEffect(() => {
    const fetchListing = async () => {
      if (!auth.currentUser) {
        router.push("/login");
        return;
      }

      try {
        const docRef = doc(db, "listings", listingId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Listing not found");
          return;
        }

        const data = docSnap.data();

        // Check ownership
        if (data.createdBy !== auth.currentUser.uid) {
          setError("Unauthorized");
          return;
        }

        // Populate form
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price || "");
        setLocation(data.location || "");
        setBeds(data.beds || "");
        setBaths(data.baths || "");
        setSize(data.size || "");
        setVirtualTour(data.virtualTour || "");
        setIsFeatured(data.isFeatured || false);
        setStatus(data.status || "active");
        setExistingImages(data.images || []);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load listing");
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, router]);

  /* ================================
     REMOVE EXISTING IMAGE
  ================================ */

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================================
     HANDLE NEW FILES
  ================================ */

  const handleNewFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    const totalImages = existingImages.length + newFiles.length + selected.length;

    if (totalImages > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    // Validate
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
    setNewFiles([...newFiles, ...selected]);

    const previews = selected.map((file) => URL.createObjectURL(file));
    setNewPreviews([...newPreviews, ...previews]);
  };

  /* ================================
     REMOVE NEW IMAGE
  ================================ */

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================================
     UPLOAD NEW IMAGES
  ================================ */

  const uploadNewImages = async (): Promise<string[]> => {
    if (newFiles.length === 0) return [];

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary not configured");
    }

    const urls: string[] = [];

    for (const file of newFiles) {
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

      if (!res.ok) throw new Error("Image upload failed");

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

    const totalImages = existingImages.length + newFiles.length;
    if (totalImages === 0) {
      setError("Upload at least one image");
      return;
    }

    if (!beds || !baths || !size) {
      setError("Fill in property details");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Upload new images
      const newImageUrls = await uploadNewImages();

      // Combine existing + new images
      const allImages = [...existingImages, ...newImageUrls];

      // Update Firestore
      const docRef = doc(db, "listings", listingId);
      await updateDoc(docRef, {
        title,
        description,
        price: Number(price),
        location,
        beds: Number(beds),
        baths: Number(baths),
        size: Number(size),
        images: allImages,
        virtualTour: virtualTour || null,
        isFeatured,
        status,
      });

      router.push("/dashboard/listings");
    } catch (err) {
      console.error(err);
      setError("Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  /* ================================
     LOADING STATE
  ================================ */

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-light flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </main>
    );
  }

  /* ================================
     ERROR STATE
  ================================ */

  if (error && !title) {
    return (
      <main className="min-h-screen p-8 bg-light">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </main>
    );
  }

  /* ================================
     UI
  ================================ */

  return (
    <main className="min-h-screen p-8 bg-light text-dark">
      <h1 className="text-3xl font-bold mb-6">Edit Property</h1>

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

        {/* Images */}
        <div>
          <label className="block mb-2 font-semibold">
            Images ({existingImages.length + newFiles.length}/{MAX_IMAGES})
          </label>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {existingImages.map((url, i) => (
                <div
                  key={`existing-${i}`}
                  className="relative h-32 rounded-lg overflow-hidden group"
                >
                  <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
                  
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>

                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-black text-xs px-2 py-1 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New Images */}
          {newPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {newPreviews.map((preview, i) => (
                <div
                  key={`new-${i}`}
                  className="relative h-32 rounded-lg overflow-hidden group border-2 border-green-500"
                >
                  <Image src={preview} alt={`New ${i + 1}`} fill className="object-cover" />
                  
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>

                  <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    New
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Upload More */}
          {existingImages.length + newFiles.length < MAX_IMAGES && (
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewFiles}
              className="w-full"
            />
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

        {/* Status */}
        <div>
          <label className="block mb-2 font-semibold">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>

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
          disabled={saving}
          className="w-full bg-primary py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Listing"}
        </button>
      </form>
    </main>
  );
}

/* ================================
   FORM COMPONENTS
================================ */

function Input({ label, value, set, type = "text", placeholder = "" }: any) {
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
