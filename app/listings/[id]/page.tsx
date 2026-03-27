"use client";

import { useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc, increment, addDoc, collection, serverTimestamp } from "firebase/firestore";
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
  Home,
  Ruler,
  Share2,
  Heart,
  CheckCircle2,
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
  size?: number;
  virtualTour?: string;
  listingType?: "sale" | "rent";
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  createdBy?: string;
}

const SANS = { fontFamily: "'system-ui', sans-serif" };
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };

/* =====================
   TRACKING HELPERS
===================== */

/**
 * Increment a counter field on the listing doc and write a notification
 * to the owner's notification feed.
 */
async function trackContactClick(
  listingId: string,
  ownerId: string,
  listingTitle: string,
  type: "whatsapp" | "email" | "phone"
) {
  try {
    const fieldMap = {
      whatsapp: "whatsappClicks",
      email: "emailClicks",
      phone: "phoneClicks",
    } as const;

    // Increment the counter on the listing
    await updateDoc(doc(db, "listings", listingId), {
      [fieldMap[type]]: increment(1),
    });

    // Write a notification for the owner
    await addDoc(collection(db, "notifications"), {
      ownerId,
      listingId,
      listingTitle,
      type,
      createdAt: serverTimestamp(),
      read: false,
    });

    // 🔥 Add analytics entry
    await addDoc(collection(db, "analytics"), {
      listingId,
      agentId: ownerId,
      type: type + "_click", // e.g., "whatsapp_click"
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // Non-blocking — tracking failures must never break UX
    console.warn("Tracking error:", err);
  }
}

/* =====================
   PAGE
===================== */

export default function ListingDetailsPage() {
  const { id } = useParams();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Ensure we only track views once per page load
  const viewTracked = useRef(false);

  /* ===================== 
   FETCH + VIEW TRACKING
===================== */
useEffect(() => {
  if (!id) return;

  const fetchListing = async () => {
    try {
      const snap = await getDoc(doc(db, "listings", id as string));
      if (snap.exists()) {
        const data = snap.data() as Listing;
        setListing(data);

        // Track view exactly once per page load
        if (!viewTracked.current) {
          viewTracked.current = true;

          // Increment views (fire-and-forget)
          updateDoc(doc(db, "listings", id as string), {
            views: increment(1),
          }).catch(() => {}); // silently ignore errors

          // 🔥 Add analytics entry
          addDoc(collection(db, "analytics"), {
            listingId: id,
            agentId: data.createdBy ?? "",
            type: "view",
            createdAt: serverTimestamp(),
          }).catch(() => {});
        }
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
     CONTACT HANDLERS
  ===================== */

  const handleWhatsApp = async () => {
    if (!listing || !listing.agentPhone || !id) return;
    // Track first, then open
    await trackContactClick(
      id as string,
      listing.createdBy ?? "",
      listing.title,
      "whatsapp"
    );
    window.open(
      `https://wa.me/${listing.agentPhone.replace(/\D/g, "")}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePhone = async () => {
    if (!listing || !listing.agentPhone || !id) return;
    await trackContactClick(
      id as string,
      listing.createdBy ?? "",
      listing.title,
      "phone"
    );
    window.location.href = `tel:${listing.agentPhone}`;
  };

  const handleEmail = async () => {
    if (!listing || !listing.agentEmail || !id) return;
    await trackContactClick(
      id as string,
      listing.createdBy ?? "",
      listing.title,
      "email"
    );
    window.location.href = `mailto:${listing.agentEmail}`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  /* =====================
     STATES
  ===================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm" style={SANS}>Loading property…</p>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg" style={SANS}>Property not found.</p>
          <Link
            href="/listings"
            className="mt-4 inline-block px-5 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-300 transition text-sm"
            style={SANS}
          >
            Back to Listings
          </Link>
        </div>
      </main>
    );
  }

  const mainImage = listing.images?.[activeImage] || "/placeholder.png";
  const isRent = listing.listingType === "rent";

  /* =====================
     UI
  ===================== */

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* Share toast */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium z-50 shadow-lg" style={SANS}>
          Link copied to clipboard
        </div>
      )}

      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={SERIF}>
            <Home className="w-5 h-5 text-amber-500" />
            <span>Find<span className="text-amber-500">A</span>Home</span>
          </Link>
          <div className="flex items-center gap-4 text-sm" style={SANS}>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">Login</Link>
            <Link href="/register" className="px-4 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg hover:bg-amber-300 transition">
              List Property
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ===== BREADCRUMB ===== */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" style={SANS}>
          <Link href="/" className="hover:text-amber-600 transition">Home</Link>
          <span>/</span>
          <Link href="/listings" className="hover:text-amber-600 transition">Properties</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1 max-w-xs">{listing.title}</span>
        </div>

        {/* ===== HERO IMAGE + THUMBNAILS ===== */}
        <div className="grid lg:grid-cols-5 gap-4 mb-10 rounded-3xl overflow-hidden">

          {/* Main image */}
          <div className="lg:col-span-3 relative h-[380px] md:h-[480px] bg-gray-200 rounded-2xl overflow-hidden">
            <Image src={mainImage} alt={listing.title} fill priority className="object-cover" />
            <div className="absolute top-4 left-4">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  isRent ? "bg-blue-600 text-white" : "bg-amber-400 text-gray-900"
                }`}
                style={SANS}
              >
                {isRent ? "For Rent" : "For Sale"}
              </span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setSaved(!saved)}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition ${
                  saved ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-black/60"
                }`}
              >
                <Heart size={16} fill={saved ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {listing.images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative rounded-2xl overflow-hidden border-2 transition ${
                  activeImage === i ? "border-amber-400 shadow-md" : "border-transparent hover:border-amber-200"
                }`}
                style={{ aspectRatio: "4/3" }}
              >
                <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" />
                {i === 3 && listing.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm" style={SANS}>
                    +{listing.images.length - 4} more
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ===== DETAILS + SIDEBAR ===== */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title + Price */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={SERIF}>{listing.title}</h1>
                  <p className="flex items-center gap-1.5 text-gray-500 text-sm" style={SANS}>
                    <MapPin size={14} className="text-amber-500 shrink-0" />
                    {listing.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-amber-600" style={SANS}>Ksh {listing.price.toLocaleString()}</p>
                  {isRent && <p className="text-sm text-gray-400 mt-0.5" style={SANS}>per month</p>}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <BedDouble size={18} />, label: "Bedrooms", value: listing.beds ?? "—" },
                  { icon: <Bath size={18} />, label: "Bathrooms", value: listing.baths ?? "—" },
                  { icon: <Car size={18} />, label: "Parking", value: listing.parking ?? "—" },
                  { icon: <Ruler size={18} />, label: "Size", value: listing.size ? `${listing.size} sqm` : "—" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-amber-500 mb-1">{stat.icon}</span>
                    <span className="font-bold text-gray-900 text-lg" style={SANS}>{stat.value}</span>
                    <span className="text-xs text-gray-400 mt-0.5" style={SANS}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="font-bold text-lg text-gray-900 mb-4" style={SERIF}>About This Property</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line" style={SANS}>{listing.description}</p>
              </div>
            )}

            {/* Virtual Tour */}
            {listing.virtualTour && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900" style={SERIF}>Virtual Tour Available</p>
                  <p className="text-sm text-gray-500 mt-0.5" style={SANS}>Explore this property from home</p>
                </div>
                <a
                  href={listing.virtualTour}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-gray-900 font-semibold rounded-xl hover:bg-amber-300 transition text-sm"
                  style={SANS}
                >
                  <ExternalLink size={15} /> Take Tour
                </a>
              </div>
            )}

            {/* Key features */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h2 className="font-bold text-lg text-gray-900 mb-4" style={SERIF}>Property Highlights</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Verified Listing", "Professional Photos", "Agent Supported", "Secure Transaction"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600" style={SANS}>
                    <CheckCircle2 size={15} className="text-amber-500 shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Agent card */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">

              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg" style={SERIF}>
                  {listing.agentName?.charAt(0) ?? "A"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900" style={SERIF}>{listing.agentName ?? "Listed Agent"}</p>
                  <p className="text-xs text-gray-400 mt-0.5" style={SANS}>Verified Agent · FindAHome</p>
                </div>
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-4" style={SERIF}>Interested in this property?</h3>

              <div className="space-y-3">
                {listing.agentPhone && (
                  <>
                    {/* Phone */}
                    <button
                      onClick={handlePhone}
                      className="flex items-center justify-center gap-2 w-full bg-amber-400 text-gray-900 px-4 py-3 rounded-xl font-semibold hover:bg-amber-300 transition text-sm"
                      style={SANS}
                    >
                      <Phone size={16} /> Call Agent
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-2 w-full bg-green-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-400 transition text-sm"
                      style={SANS}
                    >
                      <MessageCircle size={16} /> WhatsApp Agent
                    </button>
                  </>
                )}

                {listing.agentEmail && (
                  <button
                    onClick={handleEmail}
                    className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
                    style={SANS}
                  >
                    <Mail size={16} /> Email Agent
                  </button>
                )}

                {!listing.agentPhone && !listing.agentEmail && (
                  <p className="text-sm text-gray-400 text-center py-2" style={SANS}>Contact details not available.</p>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed" style={SANS}>
                FindAHome verifies all agents. Your inquiry is safe and confidential.
              </p>
            </div>

            <Link
              href="/listings"
              className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
              style={SANS}
            >
              <ArrowLeft size={15} /> Back to Listings
            </Link>
          </aside>

        </div>
      </div>
    </main>
  );
}
