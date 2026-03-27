"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { X, Loader2, Home as HomeIcon } from "lucide-react";
import Link from "next/link";

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
const SANS = { fontFamily: "'system-ui', sans-serif" };
const SERIF = { fontFamily: "Georgia, serif" };

/* ================================
   PAGE
================================ */

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id as string | undefined;

  /* ================= STATE ================= */

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");

  const [price, setPrice] = useState<number | "">("");
  const [location, setLocation] = useState("");

  const [beds, setBeds] = useState<number | "">("");
  const [baths, setBaths] = useState<number | "">("");
  const [size, setSize] = useState<number | "">("");

  const [virtualTour, setVirtualTour] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<"active" | "sold" | "pending">("active");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================================
     FETCH LISTING
  ================================ */

  useEffect(() => {
    if (!listingId) return;

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
          setLoading(false);
          return;
        }

        const data = docSnap.data();

        if (data.createdBy !== auth.currentUser.uid) {
          setError("Unauthorized");
          setLoading(false);
          return;
        }

        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setListingType(data.listingType ?? "sale");   // ← NEW FIELD
        setPrice(data.price ?? "");
        setLocation(data.location ?? "");
        setBeds(data.beds ?? "");
        setBaths(data.baths ?? "");
        setSize(data.size ?? "");
        setVirtualTour(data.virtualTour ?? "");
        setIsFeatured(Boolean(data.isFeatured));
        setStatus(data.status ?? "active");
        setExistingImages(data.images ?? []);

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
     IMAGE HANDLING
  ================================ */

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    const total = existingImages.length + newFiles.length + selected.length;

    if (total > MAX_IMAGES) {
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
    setNewFiles((prev) => [...prev, ...selected]);
    setNewPreviews((prev) => [
      ...prev,
      ...selected.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================================
     CLOUDINARY UPLOAD
  ================================ */

  const uploadNewImages = async (): Promise<string[]> => {
    if (newFiles.length === 0) return [];

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) throw new Error("Cloudinary not configured");

    const urls: string[] = [];

    for (const file of newFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
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

    if (!auth.currentUser || !listingId) return;

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

      const uploaded = await uploadNewImages();
      const images = [...existingImages, ...uploaded];

      await updateDoc(doc(db, "listings", listingId), {
        title,
        description,
        listingType,                       // ← NEW FIELD
        price: Number(price),
        location,
        beds: Number(beds),
        baths: Number(baths),
        size: Number(size),
        images,
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
     LOADING / ERROR STATES
  ================================ */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-amber-400 mx-auto mb-3" size={40} />
          <p className="text-gray-500 text-sm" style={SANS}>Loading listing…</p>
        </div>
      </main>
    );
  }

  if (error && !title) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow text-center max-w-sm">
          <p className="text-red-600 font-medium mb-4" style={SANS}>{error}</p>
          <Link
            href="/dashboard/listings"
            className="px-5 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm hover:bg-amber-300 transition inline-block"
          >
            Back to Listings
          </Link>
        </div>
      </main>
    );
  }

  /* ================================
     UI
  ================================ */

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900" style={SANS}>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={SERIF}>
            <HomeIcon className="w-5 h-5 text-amber-500" />
            <span>Find<span className="text-amber-500">A</span>Home</span>
          </Link>
          <Link
            href="/dashboard/listings"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← My Listings
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-amber-600 text-xs font-semibold tracking-widest uppercase mb-1">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-gray-900" style={SERIF}>
            Edit Property
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update your listing details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* ===== LISTING TYPE ===== */}
          <FormSection title="Listing Type">
            <div className="flex gap-3">
              {(["sale", "rent"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setListingType(t)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition capitalize ${
                    listingType === t
                      ? t === "sale"
                        ? "bg-amber-400 border-amber-400 text-gray-900"
                        : "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {t === "sale" ? "For Sale" : "For Rent"}
                </button>
              ))}
            </div>
          </FormSection>

          {/* ===== BASIC INFO ===== */}
          <FormSection title="Basic Information">
            <div className="space-y-4">
              <Input label="Property Title" value={title} set={setTitle} />
              <Textarea label="Description" value={description} set={setDescription} />
            </div>
          </FormSection>

          {/* ===== PRICE + LOCATION ===== */}
          <FormSection title="Price & Location">
            <div className="space-y-4">
              <NumberInput
                label={listingType === "rent" ? "Monthly Rent (Ksh)" : "Asking Price (Ksh)"}
                value={price}
                set={setPrice}
              />
              <Input label="Location" value={location} set={setLocation} />
            </div>
          </FormSection>

          {/* ===== PROPERTY DETAILS ===== */}
          <FormSection title="Property Details">
            <div className="grid grid-cols-3 gap-4">
              <NumberInput label="Bedrooms" value={beds} set={setBeds} />
              <NumberInput label="Bathrooms" value={baths} set={setBaths} />
              <NumberInput label="Size (sqm)" value={size} set={setSize} />
            </div>
          </FormSection>

          {/* ===== IMAGES ===== */}
          <FormSection title={`Photos (${existingImages.length + newFiles.length}/${MAX_IMAGES})`}>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">Current photos</p>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative h-32 rounded-xl overflow-hidden group border border-gray-200">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 bg-amber-400 text-gray-900 text-xs px-2 py-0.5 rounded-full font-semibold">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {newPreviews.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">New photos (not yet saved)</p>
                <div className="grid grid-cols-3 gap-3">
                  {newPreviews.map((url, i) => (
                    <div key={i} className="relative h-32 rounded-xl overflow-hidden group border-2 border-green-400">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {existingImages.length + newFiles.length < MAX_IMAGES && (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewFiles}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
              />
            )}
          </FormSection>

          {/* ===== EXTRAS ===== */}
          <FormSection title="Extras">
            <div className="space-y-4">
              <Input
                label="Virtual Tour Link (Optional)"
                value={virtualTour}
                set={setVirtualTour}
                type="url"
              />

              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">
                  Listing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold / Taken</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as Featured Listing
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    (Appears on the homepage)
                  </span>
                </span>
              </label>
            </div>
          </FormSection>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-amber-400 text-gray-900 py-4 rounded-xl font-bold text-base hover:bg-amber-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>

        </form>
      </div>
    </main>
  );
}

/* ================================
   FORM SECTION WRAPPER
================================ */

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-sm uppercase tracking-wide mb-4 text-gray-500">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ================================
   FORM INPUTS
================================ */

function Input({ label, value, set, type = "text", placeholder = "" }: any) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
      />
    </div>
  );
}

function Textarea({ label, value, set, placeholder = "" }: any) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
      />
    </div>
  );
}

function NumberInput({ label, value, set }: any) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => set(e.target.valueAsNumber)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
      />
    </div>
  );
}
