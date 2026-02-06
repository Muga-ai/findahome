"use client";

import Image from "next/image";
import Link from "next/link";

import { Trash2, Edit, ExternalLink, Star } from "lucide-react";
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

  isFeatured?: boolean;
  status?: "active" | "sold" | "pending";

  createdBy: string;
  createdAt: Date;
}

interface ListingCardProps {
  listing: Listing;
  onDelete?: (id: string) => void;
  showActions?: boolean; // Control whether to show edit/delete buttons
}

/* ================================
   COMPONENT
================================ */

export default function ListingCard({
  listing,
  onDelete,
  showActions = true,
}: ListingCardProps) {
  const mainImage =
    listing.images.length > 0 ? listing.images[0] : "/placeholder.png";

  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col relative">
      
      {/* ================= FEATURED BADGE ================= */}
      {listing.isFeatured && (
        <div className="absolute top-2 left-2 z-10 bg-primary text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star size={12} fill="currentColor" />
          Featured
        </div>
      )}

      {/* ================= STATUS BADGE ================= */}
      {listing.status && listing.status !== "active" && (
        <div className="absolute top-2 right-2 z-10 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
          {listing.status}
        </div>
      )}

      {/* ================= IMAGE ================= */}
      <div className="relative w-full h-44 mb-4 rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />

        {/* Image count indicator */}
        {listing.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            +{listing.images.length - 1} more
          </div>
        )}
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
          <span>{listing.beds}</span>
        </div>

        <div className="flex items-center gap-1">
          <FaBath className="text-primary" />
          <span>{listing.baths}</span>
        </div>

        <div className="flex items-center gap-1">
          <FaRulerCombined className="text-primary" />
          <span>{listing.size} sqm</span>
        </div>
      </div>

      {/* ================= VIRTUAL TOUR - ENHANCED ================= */}
      {listing.virtualTour && (
        <a
          href={listing.virtualTour}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 bg-accent/10 text-accent px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-accent/20 transition text-sm font-semibold"
        >
          <ExternalLink size={15} />
          View Virtual Tour
        </a>
      )}

      {/* ================= ACTIONS ================= */}
      {showActions && (
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
      )}
    </div>
  );
}
