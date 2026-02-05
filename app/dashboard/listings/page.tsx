"use client";

import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

import Link from "next/link";
import Image from "next/image";

import { PlusCircle, Trash2, Edit } from "lucide-react";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

/* ================================
   TYPES
================================ */

interface Listing {
  id: string;

  title: string;
  price: number;
  location: string;

  beds: number;
  baths: number;
  size: number;

  images: string[];

  createdAt: Timestamp | null;
}

/* ================================
   PAGE
================================ */

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchListings = async () => {
      const q = query(
        collection(db, "listings"),
        where("createdBy", "==", auth.currentUser!.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Listing[];

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;

    await deleteDoc(doc(db, "listings", id));

    setListings(prev =>
      prev.filter(l => l.id !== id)
    );
  };

  /* ================= UI ================= */

  return (
    <main className="min-h-screen p-8 bg-light">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">
          My Listings
        </h1>

        <Link
          href="/dashboard/listings/add"
          className="bg-primary px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Add Listing
        </Link>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : listings.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(l => (
            <ListingCard
              key={l.id}
              listing={l}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}

/* ================================
   COMPONENTS
================================ */

function ListingCard({
  listing,
  onDelete,
}: {
  listing: Listing;
  onDelete: (id: string) => void;
}) {
  const image =
    listing.images?.[0] || "/placeholder.png";

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <div className="relative h-44 mb-3 rounded overflow-hidden">
        <Image
          src={image}
          alt={listing.title}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="font-semibold">
        {listing.title}
      </h3>

      <p className="text-sm text-gray-500">
        {listing.location}
      </p>

      <p className="text-primary font-bold my-2">
        Ksh {listing.price.toLocaleString()}
      </p>

      {/* Features */}
      <div className="flex justify-between text-sm mb-3">
        <Feature icon={<FaBed />} value={listing.beds} />
        <Feature icon={<FaBath />} value={listing.baths} />
        <Feature
          icon={<FaRulerCombined />}
          value={listing.size}
        />
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <Link
          href={`/dashboard/listings/edit/${listing.id}`}
          className="flex-1 bg-secondary px-3 py-2 rounded-lg text-center"
        >
          <Edit size={15} className="inline mr-1" />
          Edit
        </Link>

        <button
          onClick={() => onDelete(listing.id)}
          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg"
        >
          <Trash2 size={15} className="inline mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
}

function Feature({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: number;
}) {
  return (
    <div className="flex items-center gap-1 text-gray-600">
      {icon}
      <span>{value}</span>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-72 bg-gray-200 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}
