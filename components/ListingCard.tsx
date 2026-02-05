"use client";

import Image from "next/image";
import Link from "next/link";

import { Trash2, Edit, ExternalLink } from "lucide-react";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

/* ================================
   TYPES
================================ */

export interface Listing {
  id: string;

  title: string;
  description?: string;

  price: number;
  location: string;

  beds: number;
  baths: number;
  size: number;

  images: string[];

  virtualTour?: string;

  createdBy: string;
  createdAt: Date;
}

interface ListingCardProps {
  listing: Listing;
  onDelete?: (id: string) => void;
}

/* ================================
   COMPONENT
================================ */

export default function ListingCard({
  listing,
  onDelete,
}: ListingCardProps) {
  const mainImage =
    listing.images.length > 0
      ? listing.images[0]
      : "/placeholder.png";

  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col">
      {/* ================= IMAGE ================= */}
      <div className="relative w-full h-44 mb-4 rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* ================= INFO ================= */}
      <h3 className="font-semibold text-lg text-dark">
        {listing.title}
      </h3>

      <p className="text-gray-600 text-sm mb-1">
        {listing.location}
      </p>

      <p className="text-primary font-bold mb-3">
        Ksh {listing.price.toLocaleString()}
      </p>

      {/* ================= FEATURES ================= */}
      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <FaBed className="text-primary" />
          <span>{listing.beds} Beds</span>
        </div>

        <div className="flex items-center gap-1">
          <FaBath className="text-primary" />
          <span>{listing.baths} Baths</span>
        </div>

        <div className="flex items-center gap-1">
          <FaRulerCombined className="text-primary" />
          <span>{listing.size} sqm</span>
        </div>
      </div>

      {/* ================= VIRTUAL TOUR ================= */}
      {listing.virtualTour && (
        <a
          href={listing.virtualTour}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent flex items-center gap-1 mb-3 hover:underline text-sm"
        >
          <ExternalLink size={15} />
          Virtual Tour
        </a>
      )}

      {/* ================= ACTIONS ================= */}
      <div className="mt-auto flex gap-2 pt-2">
        <Link
          href={`/dashboard/listings/edit/${listing.id}`}
          className="flex-1 bg-secondary text-dark px-3 py-2 rounded-lg font-semibold hover:opacity-90 text-center text-sm"
        >
          <Edit size={15} className="inline mr-1" />
          Edit
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(listing.id)}
            className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg font-semibold hover:opacity-90 text-sm"
          >
            <Trash2 size={15} className="inline mr-1" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
