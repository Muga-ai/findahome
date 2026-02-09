"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";

import {
  Home,
  PlusCircle,
  BarChart,
  User as UserIcon,
  LogOut,
  ExternalLink,
  Edit,
  Trash2,
  BedDouble,
  ShowerHead,
  Car,
} from "lucide-react";

import Image from "next/image";

/* ================================
   TYPES
================================ */

interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  images: string[];
  beds?: number;
  baths?: number;
  parking?: number;
  virtualTour?: string;
  createdBy: string;
  createdAt: Timestamp | null;
}

/* ================================
   MAIN PAGE
================================ */

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // MOBILE TOGGLE

  /* -----------------------------
     AUTH LISTENER
  ------------------------------ */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
    });

    return () => unsub();
  }, [router]);

  /* -----------------------------
     FETCH LISTINGS
  ------------------------------ */
  useEffect(() => {
    if (!user) return;

    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("createdBy", "==", user.uid),
          
        );

        const snapshot = await getDocs(q);

        const data: Listing[] = snapshot.docs.map(doc => {
          const docData = doc.data();

          return {
            id: doc.id,
            title: docData.title ?? "",
            description: docData.description ?? "",
            price: Number(docData.price ?? 0),
            location: docData.location ?? "",
            images: docData.images ?? [],
            beds: docData.beds ?? 0,
            baths: docData.baths ?? 0,
            parking: docData.parking ?? 0,
            virtualTour: docData.virtualTour ?? "",
            createdBy: docData.createdBy ?? "",
            createdAt: docData.createdAt ?? null,
          };
        });

        setListings(data);
      } catch (error) {
        console.error("Failed to load listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  /* -----------------------------
     LOGOUT
  ------------------------------ */
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  /* -----------------------------
     DELETE LISTING
  ------------------------------ */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    await deleteDoc(doc(db, "listings", id));
    setListings(prev => prev.filter(l => l.id !== id));
  };

  /* ================================
     UI
  ================================ */
  return (
    <main className="min-h-screen flex bg-light text-dark relative">
      {/* ================= MOBILE OVERLAY ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-primary p-6 flex flex-col w-64
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex
        `}
      >
        <h2 className="text-xl font-bold mb-8">Find A Home</h2>

        <nav className="space-y-3 text-sm flex-1">
          <NavItem icon={<Home size={18} />} label="Dashboard" onClick={() => router.push("/dashboard")} />
          <NavItem
            icon={<PlusCircle size={18} />}
            label="Add Listing"
            onClick={() => router.push("/dashboard/listings/add")}
          />
          <NavItem icon={<BarChart size={18} />} label="Analytics" onClick={() => router.push("/dashboard/analytics")} />
          <NavItem icon={<UserIcon size={18} />} label="Profile" onClick={() => router.push("/dashboard/profile")} />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-secondary text-dark px-4 py-2 rounded-lg w-full justify-center font-semibold hover:opacity-90 mt-auto"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <section className="flex-1 p-8 overflow-y-auto md:ml-64">
        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            className="p-2 bg-primary text-black rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            Menu
          </button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        {/* HEADER */}
        <div className="hidden md:flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <button
            onClick={() => router.push("/dashboard/listings/add")}
            className="bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            New Listing
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Listings" value={listings.length} />
          <StatCard title="Views" value={0} />
          <StatCard title="Leads" value={0} />
        </div>

        {/* RECENT LISTINGS */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Your Recent Listings
          </h2>

          {loading ? (
            <p>Loading listings...</p>
          ) : listings.length === 0 ? (
            <p>No listings yet. Click New Listing to add one.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 3).map(listing => (
                <ListingCard key={listing.id} listing={listing} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        {/* TOOLS */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="font-semibold text-lg mb-6 text-primary">
            Your Property Tools
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard title="Valuation" link="https://valora.vercel.app" />
            <ToolCard title="AgentCRM" link="https://agentcrm.vercel.app" />
            <ToolCard title="Housify" link="https://housify-chi.vercel.app" />
            <ToolCard title="FundiPlus" link="https://fundiplus.vercel.app" />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-6 text-primary">
            Quick Links
          </h2>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard/listings"
              className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-90"
            >
              My Listings
            </Link>

            <Link
              href="/dashboard/listings/add"
              className="px-4 py-2 bg-secondary text-dark rounded-lg font-semibold hover:opacity-90"
            >
              Upload Property
            </Link>

            <Link
              href="/dashboard/analytics"
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100"
            >
              Analytics
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================================
   COMPONENTS
================================ */

function NavItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition"
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function ToolCard({
  title,
  link,
}: {
  title: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition flex items-center justify-between text-dark"
    >
      <span className="font-medium">{title}</span>
      <ExternalLink size={16} />
    </a>
  );
}

function ListingCard({
  listing,
  onDelete,
}: {
  listing: Listing;
  onDelete?: (id: string) => void;
}) {
  const imageUrl =
    listing.images.length > 0 ? listing.images[0] : "/placeholder.png";

  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col">
      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <h3 className="font-semibold text-lg">{listing.title}</h3>
      <p className="text-gray-600">{listing.location}</p>
      <p className="text-primary font-bold mb-2">
        Ksh {listing.price.toLocaleString()}
      </p>

      <div className="flex items-center gap-4 mb-2 text-gray-500">
        {listing.beds && (
          <span className="flex items-center gap-1">
            <BedDouble size={16} /> {listing.beds}
          </span>
        )}
        {listing.baths && (
          <span className="flex items-center gap-1">
            <ShowerHead size={16} /> {listing.baths}
          </span>
        )}
        {listing.parking && (
          <span className="flex items-center gap-1">
            <Car size={16} /> {listing.parking}
          </span>
        )}
      </div>

      {listing.virtualTour && (
        <a
          href={listing.virtualTour}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent flex items-center gap-1 mb-2 hover:underline"
        >
          <ExternalLink size={16} /> Virtual Tour
        </a>
      )}

      <div className="mt-auto flex gap-2">
        <Link
          href={`/dashboard/listings/edit/${listing.id}`}
          className="flex-1 bg-secondary text-dark px-3 py-2 rounded-lg font-semibold hover:opacity-90 text-center"
        >
          <Edit size={16} className="inline mr-1" /> Edit
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(listing.id)}
            className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            <Trash2 size={16} className="inline mr-1" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
