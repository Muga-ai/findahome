"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

/* =====================
   TYPES
===================== */

interface Listing {
  title: string;
  description?: string;
  price: number;
  location: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  virtualTour?: string;
}

/* =====================
   PAGE
===================== */

export default function ListingDetailsPage() {
  const { id } = useParams();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  /* =====================
     FETCH
  ===================== */

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const snap = await getDoc(doc(db, "listings", id as string));

        if (snap.exists()) {
          setListing(snap.data() as Listing);
        }
      } catch (err) {
        console.error("Failed to load listing", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  /* =====================
     UI
  ===================== */

  if (loading) return <p className="p-8">Loading...</p>;

  if (!listing) return <p className="p-8">Property not found.</p>;

  return (
    <main className="min-h-screen bg-light text-dark p-8">

      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <Link
          href="/listings"
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back to listings
        </Link>

        {/* Gallery */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {listing.images.map((img, i) => (
            <div
              key={i}
              className="relative h-64 rounded-xl overflow-hidden"
            >
              <Image
                src={img}
                alt="Property"
                fill
                className="object-cover"
              />
            </div>
          ))}

        </div>

        {/* Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">

          <h1 className="text-3xl font-bold">
            {listing.title}
          </h1>

          <p className="text-gray-600 flex items-center gap-1">
            <MapPin size={16} />
            {listing.location}
          </p>

          <p className="text-primary text-2xl font-bold">
            Ksh {listing.price.toLocaleString()}
          </p>

          {/* Features */}
          <div className="flex gap-6 text-gray-600">

            <span className="flex items-center gap-1">
              <BedDouble size={18} />
              {listing.bedrooms ?? "-"} Beds
            </span>

            <span className="flex items-center gap-1">
              <Bath size={18} />
              {listing.bathrooms ?? "-"} Baths
            </span>

            <span className="flex items-center gap-1">
              <Car size={18} />
              {listing.parking ?? "-"} Parking
            </span>

          </div>

          {/* Description */}
          {listing.description && (
            <p className="text-gray-700 leading-relaxed">
              {listing.description}
            </p>
          )}

          {/* Virtual Tour */}
          {listing.virtualTour && (
            <a
              href={listing.virtualTour}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              <ExternalLink size={18} />
              View Virtual Tour
            </a>
          )}

        </div>

      </div>
    </main>
  );
}
