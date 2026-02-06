"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Home,
  Search,
  Building2,
  BarChart3,
  ShieldCheck,
  Users,
  ExternalLink,
  MapPin,
  Bed,
  Bath,
  Ruler,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

/* ================= HERO IMAGES ================= */

const heroImages: string[] = Array.from(
  { length: 37 },
  (_, i) => `/hero/hero${i + 1}.jpg`
);

/* ================= SAMPLE FEATURED LISTINGS ================= */
/* Later: Replace with DB fetch */

const featuredListings = [
  {
    id: 1,
    title: "Modern Apartment - Kilimani",
    location: "Nairobi",
    price: "KSh 8.5M",
    image: "/hero/hero5.jpg",
    beds: 3,
    baths: 2,
    size: "120 sqm",
  },
  {
    id: 2,
    title: "Luxury Villa - Runda",
    location: "Nairobi",
    price: "KSh 48M",
    image: "/hero/hero12.jpg",
    beds: 5,
    baths: 4,
    size: "420 sqm",
  },
  {
    id: 3,
    title: "Studio Apartment - Westlands",
    location: "Nairobi",
    price: "KSh 4.2M",
    image: "/hero/hero18.jpg",
    beds: 1,
    baths: 1,
    size: "45 sqm",
  },
  {
    id: 4,
    title: "Townhouse - Syokimau",
    location: "Machakos",
    price: "KSh 12.7M",
    image: "/hero/hero25.jpg",
    beds: 4,
    baths: 3,
    size: "210 sqm",
  },
];

/* ================= PAGE ================= */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          <div className="flex items-center gap-2 font-bold text-xl">
            <Home className="w-6 h-6" />
            Find A Home
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/listings" className="hover:text-primary">
              Browse Homes
            </Link>

            <Link href="/login" className="hover:text-primary">
              Login
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
            >
              List Property
            </Link>
          </div>

        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative h-[85vh] w-full overflow-hidden">

        {/* Background Slider - Ensure it stays in background */}
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

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-6 max-w-5xl mx-auto">

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Find Your Perfect Home.
            <br />
            Anywhere in Kenya.
          </h1>

          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Verified homes, trusted agents, and real market intelligence — in one ecosystem.
          </p>

          {/* Search Bar */}
          <form
            action="/listings"
            method="GET"
            className="mt-7 w-full max-w-xl flex bg-white rounded-xl overflow-hidden shadow-xl relative z-30"
          >
            <div className="flex items-center px-4 text-gray-500">
              <MapPin />
            </div>

            <input
              name="q"
              placeholder="Search city, estate, area..."
              className="flex-1 py-3 px-2 outline-none text-gray-900"
            />

            <button
              type="submit"
              className="bg-primary px-6 flex items-center text-white font-semibold hover:opacity-90"
            >
              <Search size={18} className="mr-2" />
              Search
            </button>
          </form>

          {/* CTA */}
          <div className="mt-7 flex gap-4 flex-wrap justify-center">

            <Link
              href="/listings"
              className="px-6 py-3 rounded-xl bg-primary font-semibold hover:opacity-90"
            >
              Find A Home
            </Link>

            <Link
              href="/register"
              className="px-6 py-3 rounded-xl border border-white font-semibold hover:bg-white hover:text-gray-900"
            >
              List A Home
            </Link>

          </div>

        </div>

      </section>

      {/* ================= FEATURED LISTINGS ================= */}
      <section className="py-16 bg-gray-50">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Featured Listings
          </h2>

          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            spaceBetween={20}
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

        </div>

      </section>

      {/* ================= TRUST ================= */}
      <section className="py-12 bg-white border-b">

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          <Counter value="10K+" label="Active Listings" />
          <Counter value="5K+" label="Happy Clients" />
          <Counter value="3K+" label="Verified Agents" />
          <Counter value="98%" label="Success Rate" />

        </div>

      </section>

      {/* ================= ECOSYSTEM ================= */}
      <section className="py-20 px-6 bg-white">

        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Powered By Real Estate OS
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          One integrated ecosystem powering valuation, agents, transactions, listings, and last-mile property solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

          <EcosystemCard
            title="Property Valuation"
            text="Instant AI-powered property pricing."
            link="https://valora-mauve.vercel.app/"
          />

          <EcosystemCard
            title="AgentCRM"
            text="Lead & commission management for agents."
            link="https://agentcrm.vercel.app"
          />

          <EcosystemCard
            title="Housify"
            text="Smart Property Management for Modern Cities."
            link="https://housify-chi.vercel.app"
          />

          <EcosystemCard
            title="FundiPlus"
            text="Last-mile housing & renovation services."
            link="https://fundiplus.vercel.app"
          />

        </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 px-6 bg-gray-50">

        <h2 className="text-3xl font-bold text-center text-primary mb-12">
          Why Choose Find A Home
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <Feature icon={<Building2 />} title="Verified Listings" text="Every property is validated for quality and trust." />
          <Feature icon={<BarChart3 />} title="Market Insights" text="Live pricing trends and investment data." />
          <Feature icon={<ShieldCheck />} title="Secure Platform" text="Protected users and secure transactions." />
          <Feature icon={<Users />} title="Trusted Agents" text="Top-rated professionals worldwide." />
          <Feature icon={<Home />} title="Virtual Tours" text="Experience homes remotely in HD." />
          <Feature icon={<Search />} title="Smart Search" text="AI-powered discovery." />

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        © {new Date().getFullYear()} Find A Home. Built for Generations.
      </footer>

    </main>
  );
}

/* ================= COMPONENTS ================= */

function Counter({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-gray-600 mt-1">{label}</p>
    </div>
  );
}

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
    <div className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-lg transition text-center">
      <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-secondary text-primary rounded-xl">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-1 text-primary">
        {title}
      </h3>

      <p className="text-gray-600">{text}</p>
    </div>
  );
}

function EcosystemCard({
  title,
  text,
  link,
}: {
  title: string;
  text: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition block"
    >
      <div className="flex items-center justify-between mb-4">

        <h3 className="font-semibold text-lg text-primary">
          {title}
        </h3>

        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />

      </div>

      <p className="text-gray-600 mb-4">{text}</p>

      <span className="text-sm font-medium text-primary group-hover:underline">
        Open Platform →
      </span>
    </a>
  );
}

function FeaturedCard({ listing }: any) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
    >
      <div className="relative h-52">

        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="object-cover"
        />

      </div>

      <div className="p-4">

        <p className="font-semibold text-lg text-primary">
          {listing.price}
        </p>

        <h3 className="font-bold mt-1">
          {listing.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {listing.location}
        </p>

        <div className="flex justify-between text-sm text-gray-600">

          <span className="flex items-center gap-1">
            <Bed size={14} /> {listing.beds}
          </span>

          <span className="flex items-center gap-1">
            <Bath size={14} /> {listing.baths}
          </span>

          <span className="flex items-center gap-1">
            <Ruler size={14} /> {listing.size}
          </span>

        </div>

      </div>
    </Link>
  );
}
