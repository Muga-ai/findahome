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
  Phone,
  MessageCircle,
  Mail,
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

  beds?: number;
  baths?: number;
  parking?: number;

  virtualTour?: string;

  // Agent info (NEW – production ready)
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}

/* =====================
   PAGE
===================== */

export default function ListingDetailsPage() {
  const { id } = useParams();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  /* =====================
     FETCH LISTING
  ===================== */

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const snap = await getDoc(doc(db, "listings", id as string));

        if (snap.exists()) {
          setListing(snap.data() as Listing);
        } else {
          setListing(null);
        }
      } catch (err) {
        console.error("Failed to load listing", err);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  /* =====================
     STATES
  ===================== */

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading property…</p>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Property not found.</p>
      </main>
    );
  }

  const mainImage =
    listing.images?.[activeImage] || "/placeholder.png";

  /* =====================
     UI
  ===================== */

  return (
    <main className="min-h-screen bg-light text-dark p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <Link
          href="/listings"
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back to listings
        </Link>

        {/* =====================
            GALLERY
        ===================== */}

        <div className="grid lg:grid-cols-2 gap-8 mb-10">

          {/* Main Image */}
          <div className="relative h-[420px] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {listing.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative h-32 rounded-xl overflow-hidden border-2 ${
                  activeImage === i
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* =====================
            DETAILS + CONTACT
        ===================== */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-5">

            <h1 className="text-3xl font-bold">
              {listing.title}
            </h1>

            <p className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              {listing.location}
            </p>

            <p className="text-primary text-3xl font-bold">
              Ksh {listing.price.toLocaleString()}
            </p>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-6 text-gray-600 pt-2">
              <span className="flex items-center gap-1">
                <BedDouble size={18} />
                {listing.beds ?? "-"} Beds
              </span>

              <span className="flex items-center gap-1">
                <Bath size={18} />
                {listing.baths ?? "-"} Baths
              </span>

              <span className="flex items-center gap-1">
                <Car size={18} />
                {listing.parking ?? "-"} Parking
              </span>
            </div>

            {/* DESCRIPTION */}
            {listing.description && (
              <p className="text-gray-700 leading-relaxed pt-3">
                {listing.description}
              </p>
            )}

            {/* VIRTUAL TOUR */}
            {listing.virtualTour && (
              <a
                href={listing.virtualTour}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <ExternalLink size={18} />
                View Virtual Tour
              </a>
            )}
          </div>

          {/* =====================
              AGENT CONTACT
          ===================== */}

          <aside className="bg-white rounded-2xl shadow p-6 space-y-4 h-fit sticky top-24">

            <h3 className="text-xl font-bold">
              Contact Agent
            </h3>

            {listing.agentName && (
              <p className="text-gray-700 font-medium">
                {listing.agentName}
              </p>
            )}

            {listing.agentPhone && (
              <>
                <a
                  href={`tel:${listing.agentPhone}`}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:opacity-90"
                >
                  <Phone size={18} />
                  Call Agent
                </a>

                <a
                  href={`https://wa.me/${listing.agentPhone.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl font-semibold hover:opacity-90"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </>
            )}

            {listing.agentEmail && (
              <a
                href={`mailto:${listing.agentEmail}`}
                className="flex items-center gap-2 border px-4 py-3 rounded-xl font-medium hover:bg-gray-50"
              >
                <Mail size={18} />
                Email Agent
              </a>
            )}

            {!listing.agentPhone && !listing.agentEmail && (
              <p className="text-sm text-gray-500">
                Agent contact not available.
              </p>
            )}
          </aside>

        </div>
      </div>
    </main>
  );
}
