"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

import { MapPin, BedDouble,ShowerHead, Car, Search } from "lucide-react";

/* =====================
   TYPES
===================== */

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  beds?: number;
  baths?: number;
  parking?: number;
}

/* =====================
   PAGE
===================== */

export default function PublicListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  /* =====================
     FETCH LISTINGS
  ===================== */

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Listing[];

        setListings(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  /* =====================
     SEARCH
  ===================== */

  useEffect(() => {
    const result = listings.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);
  }, [search, listings]);

  /* =====================
     UI
  ===================== */

  return (
    <main className="min-h-screen bg-light text-dark p-8">

      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto mb-10">

        <h1 className="text-4xl font-bold mb-4">
          Find Your Next Home
        </h1>

        <p className="text-gray-600 mb-6">
          Browse verified properties from trusted agents
        </p>

        {/* Search */}
        <div className="relative max-w-lg">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by location or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

      </div>

      {/* ================= LISTINGS ================= */}

      <section className="max-w-7xl mx-auto">

        {loading ? (
          <p>Loading properties...</p>
        ) : filtered.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filtered.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}

          </div>
        )}

      </section>
    </main>
  );
}

/* =====================
   CARD
===================== */

function ListingCard({ listing }: { listing: Listing }) {
  const image =
    listing.images?.length > 0
      ? listing.images[0]
      : "/placeholder.png";

  return (
    <Link href={`/listings/${listing.id}`}>

      <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer">

        {/* Image */}
        <div className="relative h-52 w-full">

          <Image
            src={image}
            alt={listing.title}
            fill
            className="object-cover"
          />

        </div>

        {/* Content */}
        <div className="p-5 space-y-2">

          <h3 className="font-semibold text-lg line-clamp-1">
            {listing.title}
          </h3>

          {/* Location */}
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <MapPin size={14} />
            {listing.location}
          </p>

          {/* Price */}
          <p className="text-primary font-bold text-xl">
            Ksh {listing.price.toLocaleString()}
          </p>

          {/* Features */}
          <div className="flex justify-between text-gray-500 text-sm pt-2">

            <span className="flex items-center gap-1">
              <BedDouble size={16} />
              {listing.beds ?? "-"}
            </span>

            <span className="flex items-center gap-1">
              <ShowerHead size={16} />
              {listing.baths ?? "-"}
            </span>

            <span className="flex items-center gap-1">
              <Car size={16} />
              {listing.parking ?? "-"}
            </span>

          </div>

        </div>

      </div>

    </Link>
  );
}
