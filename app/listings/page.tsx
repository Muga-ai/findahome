"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Search,
  SlidersHorizontal,
  Home,
  ChevronDown,
  X,
  Building2,
} from "lucide-react";

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
  listingType?: "sale" | "rent";
  status?: string;
}

const SANS = { fontFamily: "'system-ui', sans-serif" };
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };

/* =====================
   PAGE
===================== */

export default function PublicListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [typeFilter, setTypeFilter] = useState<"all" | "sale" | "rent">(
    (searchParams.get("type") as "sale" | "rent") ?? "all"
  );
  const [minBeds, setMinBeds] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  /* =====================
     FETCH
  ===================== */
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
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
     FILTER LOGIC
  ===================== */
  const applyFilters = useCallback(() => {
    let result = [...listings];

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(s) ||
          l.location.toLowerCase().includes(s)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((l) => l.listingType === typeFilter);
    }

    if (minBeds > 0) {
      result = result.filter((l) => (l.beds ?? 0) >= minBeds);
    }

    if (maxPrice > 0) {
      result = result.filter((l) => l.price <= maxPrice);
    }

    setFiltered(result);
  }, [listings, search, typeFilter, minBeds, maxPrice]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setMinBeds(0);
    setMaxPrice(0);
  };

  const hasActiveFilters =
    search || typeFilter !== "all" || minBeds > 0 || maxPrice > 0;

  /* =====================
     UI
  ===================== */
  return (
    <main
      className="min-h-screen bg-gray-50 text-gray-900"
      style={SANS}
    >
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl"
            style={SERIF}
          >
            <Home className="w-5 h-5 text-amber-500" />
            <span>
              Find<span className="text-amber-500">A</span>Home
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-300 transition"
            >
              List Property
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HEADER ===== */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-amber-600 text-xs font-semibold tracking-widest uppercase mb-2">
            Kenya&apos;s Property Marketplace
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1" style={SERIF}>
            Browse Properties
          </h1>
          <p className="text-gray-500 text-sm">
            {loading ? "Loading..." : `${filtered.length} propert${filtered.length === 1 ? "y" : "ies"} found`}
          </p>
        </div>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="bg-white border-b border-gray-200 sticky top-[65px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">

          {/* Top row */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="City, estate, area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Buy / Rent tabs */}
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              {(["all", "sale", "rent"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2.5 text-sm font-medium transition capitalize ${
                    typeFilter === t
                      ? "bg-amber-400 text-gray-900"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t === "all" ? "All" : t === "sale" ? "For Sale" : "For Rent"}
                </button>
              ))}
            </div>

            {/* More filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              <SlidersHorizontal size={15} />
              Filters
              <ChevronDown
                size={14}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Min Bedrooms
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinBeds(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium border transition ${
                        minBeds === n
                          ? "bg-amber-400 border-amber-400 text-gray-900"
                          : "border-gray-200 text-gray-600 hover:border-amber-300"
                      }`}
                    >
                      {n === 0 ? "Any" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Max Price (Ksh)
                </label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value={0}>Any Price</option>
                  <option value={5000000}>Under 5M</option>
                  <option value={10000000}>Under 10M</option>
                  <option value={20000000}>Under 20M</option>
                  <option value={50000000}>Under 50M</option>
                  <option value={100000000}>Under 100M</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== GRID ===== */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="h-56 bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No properties found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-5 py-2 bg-amber-400 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-300 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
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
    listing.images?.length > 0 ? listing.images[0] : "/placeholder.png";
  const isRent = listing.listingType === "rent";

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200">

        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={image}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isRent
                  ? "bg-blue-600 text-white"
                  : "bg-amber-400 text-gray-900"
              }`}
            >
              {isRent ? "For Rent" : "For Sale"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p
            className="text-amber-600 font-bold text-xl mb-1"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            Ksh {listing.price.toLocaleString()}
            {isRent && (
              <span className="text-sm font-normal text-gray-400">/mo</span>
            )}
          </p>

          <h3
            className="font-semibold text-gray-900 text-base leading-snug line-clamp-1 mb-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {listing.title}
          </h3>

          <p
            className="text-gray-500 text-sm flex items-center gap-1 mb-4"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            <MapPin size={13} className="shrink-0" />
            {listing.location}
          </p>

          {/* Stats */}
          <div
            className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            <span className="flex items-center gap-1">
              <BedDouble size={14} className="text-gray-400" />
              {listing.beds ?? "-"} Beds
            </span>
            <span className="flex items-center gap-1">
              <Bath size={14} className="text-gray-400" />
              {listing.baths ?? "-"} Baths
            </span>
            <span className="flex items-center gap-1">
              <Car size={14} className="text-gray-400" />
              {listing.parking ?? "-"} Parking
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}
