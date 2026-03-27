"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import {
  Home,
  Search,
  Building2,
  BarChart3,
  ShieldCheck,
  Users,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Tag,
  CheckCircle2,
  Eye,
  Zap,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ================= HERO IMAGES ================= */

const heroImages: string[] = Array.from(
  { length: 37 },
  (_, i) => `/hero/hero${i + 1}.jpg`
);

/* ================= PAGE ================= */

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [listingType, setListingType] = useState<"buy" | "rent">("buy");

  /* ================= FETCH FEATURED ================= */

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("isFeatured", "==", true),
          where("status", "==", "active"),
          limit(10)
        );

        const snapshot = await getDocs(q);

        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFeaturedListings(listings);
      } catch (error) {
        console.error("Error loading featured listings:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          <div className="flex items-center gap-2 font-bold text-xl tracking-tight" style={{ fontFamily: "inherit" }}>
            <Home className="w-5 h-5 text-amber-400" />
            <span>Find<span className="text-amber-400">A</span>Home</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium" style={{ fontFamily: "'system-ui', sans-serif" }}>
            <Link href="/listings" className="opacity-80 hover:opacity-100 hover:text-amber-400 transition">
              Browse Properties
            </Link>
            <Link href="/listings?type=rent" className="opacity-80 hover:opacity-100 hover:text-amber-400 transition">
              Rentals
            </Link>
            <Link href="/login" className="opacity-80 hover:opacity-100 transition">
              Login
            </Link>
            <Link
              href="/register"
              className="hidden md:inline-block px-4 py-2 rounded-lg bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition text-sm"
            >
              List Property
            </Link>
          </div>

        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative h-[90vh] w-full overflow-hidden">

        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[EffectFade, Autoplay]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            className="w-full h-full"
          >
            {heroImages.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt="Find A Home Kenya"
                    fill
                    priority={i === 0}
                    quality={85}
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85 z-10 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-6">

          {/* Pill badge */}
          <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/60 bg-amber-400/10 text-amber-300 text-xs font-medium tracking-widest uppercase" style={{ fontFamily: "'system-ui', sans-serif" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
            Kenya&apos;s Trusted Property Marketplace
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl" style={{ letterSpacing: "-0.02em" }}>
            Find Your Perfect
            <span className="text-amber-400"> Home.</span>
            <br />
            <span className="font-light italic">Anywhere in Kenya.</span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-gray-300 max-w-xl" style={{ fontFamily: "'system-ui', sans-serif", fontWeight: 400 }}>
            Verified properties, trusted agents, and real market data — all in one platform.
          </p>

          {/* ===== SEARCH BAR ===== */}
          <div className="mt-9 w-full max-w-2xl">

            {/* Buy / Rent Toggle */}
            <div className="flex mb-0 w-fit">
              <button
                type="button"
                onClick={() => setListingType("buy")}
                className={`px-6 py-2 text-sm font-semibold rounded-tl-xl rounded-tr-none transition ${
                  listingType === "buy"
                    ? "bg-amber-400 text-gray-900"
                    : "bg-black/40 text-white border border-white/20 hover:bg-white/10"
                }`}
                style={{ fontFamily: "'system-ui', sans-serif" }}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setListingType("rent")}
                className={`px-6 py-2 text-sm font-semibold rounded-tr-xl rounded-tl-none transition ${
                  listingType === "rent"
                    ? "bg-amber-400 text-gray-900"
                    : "bg-black/40 text-white border border-white/20 hover:bg-white/10"
                }`}
                style={{ fontFamily: "'system-ui', sans-serif" }}
              >
                Rent
              </button>
            </div>

            {/* Search input row */}
            <form
              action="/listings"
              method="GET"
              className="flex bg-white rounded-b-xl rounded-tr-xl overflow-hidden shadow-2xl"
            >
              <input type="hidden" name="type" value={listingType} />

              <div className="flex items-center px-4 text-gray-400">
                <MapPin size={18} />
              </div>

              <input
                name="q"
                placeholder={`Search city, estate or area for ${listingType === "buy" ? "sale" : "rent"}...`}
                className="flex-1 py-4 px-2 outline-none text-gray-900 text-sm bg-transparent"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              />

              <button
                type="submit"
                className="bg-amber-400 px-7 flex items-center text-gray-900 font-semibold hover:bg-amber-300 transition text-sm gap-2"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              >
                <Search size={16} />
                Search
              </button>
            </form>
          </div>

          {/* Quick stats row */}
          <div className="mt-8 flex gap-8 text-center" style={{ fontFamily: "'system-ui', sans-serif" }}>
            <div>
              <p className="text-xl font-bold text-amber-400">10K+</p>
              <p className="text-xs text-gray-400 mt-0.5">Active Listings</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-xl font-bold text-amber-400">1K+</p>
              <p className="text-xs text-gray-400 mt-0.5">Verified Agents</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-xl font-bold text-amber-400">47</p>
              <p className="text-xs text-gray-400 mt-0.5">Counties Covered</p>
            </div>
          </div>

        </div>

      </section>

      {/* ================= FEATURED LISTINGS ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-amber-600 text-xs font-semibold tracking-widest uppercase mb-2" style={{ fontFamily: "'system-ui', sans-serif" }}>
                Hand-picked for you
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Properties
              </h2>
            </div>
            <Link
              href="/listings?featured=true"
              className="text-sm font-medium text-amber-600 hover:text-amber-700 underline underline-offset-4 transition"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              View all featured →
            </Link>
          </div>

          {loadingFeatured && (
            <div className="flex gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 h-72 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          )}

          {!loadingFeatured && featuredListings.length === 0 && (
            <div className="text-center py-16 text-gray-400" style={{ fontFamily: "'system-ui', sans-serif" }}>
              <Building2 size={40} className="mx-auto mb-3 opacity-30" />
              <p>No featured listings at the moment.</p>
            </div>
          )}

          {!loadingFeatured && featuredListings.length > 0 && (
            <Swiper
              modules={[Navigation, Autoplay]}
              slidesPerView={1}
              spaceBetween={24}
              navigation
              autoplay={{ delay: 6000 }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {featuredListings.map((item) => (
                <SwiperSlide key={item.id}>
                  <FeaturedCard listing={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

        </div>
      </section>

      {/* ================= WHY FIND A HOME ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="text-amber-600 text-xs font-semibold tracking-widest uppercase mb-2" style={{ fontFamily: "'system-ui', sans-serif" }}>
              Built for Kenya
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose FindAHome?
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base" style={{ fontFamily: "'system-ui', sans-serif" }}>
              We built the tools serious buyers, renters, and sellers need — and nothing they don&apos;t.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              icon={<CheckCircle2 size={22} />}
              title="Verified Listings"
              text="Every property is validated before it goes live. No ghost listings, no bait-and-switch."
            />
            <Feature
              icon={<BarChart3 size={22} />}
              title="Live Market Insights"
              text="Real-time pricing trends and neighbourhood data so you always negotiate from strength."
            />
            <Feature
              icon={<ShieldCheck size={22} />}
              title="Secure Platform"
              text="Your data and transactions are protected end-to-end. We take security seriously."
            />
            <Feature
              icon={<Users size={22} />}
              title="Top-Rated Agents"
              text="Connect with vetted, reviewed professionals across all 47 counties."
            />
            <Feature
              icon={<Eye size={22} />}
              title="Virtual Tours"
              text="Tour properties remotely in HD before stepping through the door."
            />
            <Feature
              icon={<Zap size={22} />}
              title="Instant Alerts"
              text="Get notified the moment a property matching your criteria hits the market."
            />
          </div>

        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to list your property?
          </h2>
          <p className="text-gray-400 mb-8 text-base" style={{ fontFamily: "'system-ui', sans-serif" }}>
            Reach thousands of verified buyers and renters across Kenya. It only takes a few minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-amber-400 text-gray-900 font-semibold rounded-xl hover:bg-amber-300 transition"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              List a Property
            </Link>
            <Link
              href="/listings"
              className="px-8 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-950 text-gray-400" style={{ fontFamily: "'system-ui', sans-serif" }}>

        {/* Main footer grid */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-4" style={{ fontFamily: "Georgia, serif" }}>
              <Home className="w-5 h-5 text-amber-400" />
              <span>Find<span className="text-amber-400">A</span>Home</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Kenya&apos;s trusted property marketplace. Connecting buyers, renters, sellers, and agents with the tools they need.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: <Facebook size={16} />, href: "#" },
                { icon: <Twitter size={16} />, href: "#" },
                { icon: <Instagram size={16} />, href: "#" },
                { icon: <Linkedin size={16} />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-400 hover:text-gray-900 transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* About column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "How It Works", href: "#" },
                { label: "For Buyers", href: "/listings" },
                { label: "For Renters", href: "/listings?type=rent" },
                { label: "For Sellers", href: "/register" },
                { label: "For Agents", href: "/register" },
                { label: "Pricing", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Browse All Properties", href: "/listings" },
                { label: "Featured Listings", href: "/listings?featured=true" },
                { label: "Nairobi Properties", href: "/listings?q=nairobi" },
                { label: "Mombasa Properties", href: "/listings?q=mombasa" },
                { label: "Kisumu Properties", href: "/listings?q=kisumu" },
                { label: "List Your Property", href: "/register" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">
                  Westlands Business Park,<br />
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <a href="tel:+254700000000" className="hover:text-white transition">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <a href="mailto:hello@findahome.co.ke" className="hover:text-white transition">
                  hello@findahome.co.ke
                </a>
              </li>
            </ul>

            {/* Compliance badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">
                EPRA Compliant
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">
                Kenya Data Protection
              </span>
            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
            <span>© {new Date().getFullYear()} FindAHome Kenya. All rights reserved.</span>
            <div className="flex gap-5">
              <Link href="#" className="hover:text-gray-400 transition">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-400 transition">Terms of Service</Link>
              <Link href="#" className="hover:text-gray-400 transition">Cookie Policy</Link>
            </div>
          </div>
        </div>

      </footer>

    </main>
  );
}

/* ================= COMPONENTS ================= */

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-amber-200 hover:shadow-lg transition-all group">
      <div className="w-11 h-11 mb-4 flex items-center justify-center bg-amber-50 text-amber-500 rounded-xl group-hover:bg-amber-400 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-lg mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'system-ui', sans-serif" }}>
        {text}
      </p>
    </div>
  );
}

function FeaturedCard({ listing }: any) {
  const isRent = listing.listingType === "rent";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={listing.images?.[0] || "/hero/hero5.jpg"}
          alt={listing.title || "Property"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isRent
              ? "bg-blue-600 text-white"
              : "bg-amber-400 text-gray-900"
          }`} style={{ fontFamily: "'system-ui', sans-serif" }}>
            {isRent ? "For Rent" : "For Sale"}
          </span>
        </div>
        {/* Featured badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm" style={{ fontFamily: "'system-ui', sans-serif" }}>
            ★ Featured
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="font-bold text-xl text-amber-600 mb-1" style={{ fontFamily: "'system-ui', sans-serif" }}>
          {typeof listing.price === "number"
            ? `Ksh ${listing.price.toLocaleString()}${isRent ? "/mo" : ""}`
            : listing.price}
        </p>

        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1">
          {listing.title}
        </h3>

        <p className="text-sm text-gray-500 flex items-center gap-1 mb-4" style={{ fontFamily: "'system-ui', sans-serif" }}>
          <MapPin size={13} />
          {listing.location}
        </p>

        <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3" style={{ fontFamily: "'system-ui', sans-serif" }}>
          <span className="flex items-center gap-1">
            <Bed size={14} className="text-gray-400" />
            {listing.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} className="text-gray-400" />
            {listing.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <Ruler size={14} className="text-gray-400" />
            {listing.size} sqm
          </span>
        </div>
      </div>
    </Link>
  );
}
