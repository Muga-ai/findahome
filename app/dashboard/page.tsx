"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
  orderBy,
  limit,
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
  Bell,
  MessageCircle,
  Mail,
  Phone,
  X,
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

interface Notification {
  id: string;
  listingTitle: string;
  type: "whatsapp" | "email" | "phone";
  createdAt: { seconds: number } | null;
  read?: boolean;
}

/* ================================
   MAIN PAGE
================================ */

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  /* ----- auth ----- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) { router.push("/login"); return; }
      setUser(currentUser);
    });
    return () => unsub();
  }, [router]);

  /* ----- fetch listings + notifications ----- */
  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        // listings
        const lSnap = await getDocs(
          query(collection(db, "listings"), where("createdBy", "==", user.uid))
        );
        const listingData: Listing[] = lSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? "",
            description: data.description ?? "",
            price: Number(data.price ?? 0),
            location: data.location ?? "",
            images: data.images ?? [],
            beds: data.beds ?? 0,
            baths: data.baths ?? 0,
            parking: data.parking ?? 0,
            virtualTour: data.virtualTour ?? "",
            createdBy: data.createdBy ?? "",
            createdAt: data.createdAt ?? null,
          };
        });
        setListings(listingData);

        // notifications (latest 20)
        const nSnap = await getDocs(
          query(
            collection(db, "notifications"),
            where("ownerId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(20)
          )
        );
        const notifData = nSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Notification[];
        setNotifications(notifData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  /* ----- close notif panel on outside click ----- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ----- actions ----- */
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    await deleteDoc(doc(db, "listings", id));
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (ts: { seconds: number } | null) => {
    if (!ts) return "";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-KE", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  };

  const notifIcon = (type: string) => {
    if (type === "whatsapp") return <MessageCircle size={13} className="text-green-500" />;
    if (type === "email") return <Mail size={13} className="text-blue-500" />;
    return <Phone size={13} className="text-amber-500" />;
  };

  /* ================================
     UI
  ================================ */
  return (
    <main className="min-h-screen flex bg-light text-dark relative">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
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
          <NavItem icon={<PlusCircle size={18} />} label="Add Listing" onClick={() => router.push("/dashboard/listings/add")} />
          <NavItem icon={<BarChart size={18} />} label="Analytics" onClick={() => router.push("/dashboard/analytics")} />
          <NavItem icon={<UserIcon size={18} />} label="Profile" onClick={() => router.push("/dashboard/profile")} />
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-secondary text-dark px-4 py-2 rounded-lg w-full justify-center font-semibold hover:opacity-90 mt-auto"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <section className="flex-1 p-8 overflow-y-auto md:ml-0">

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button className="p-2 bg-primary text-black rounded-lg" onClick={() => setIsSidebarOpen(true)}>
            Menu
          </button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        {/* HEADER */}
        <div className="hidden md:flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <div className="flex items-center gap-3">
            {/* NOTIFICATION BELL */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifPanel((p) => !p)}
                className="relative w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-amber-400 transition shadow-sm"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION PANEL */}
              {showNotifPanel && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-sm text-gray-900">Enquiries</p>
                    <button onClick={() => setShowNotifPanel(false)}>
                      <X size={14} className="text-gray-400 hover:text-gray-700" />
                    </button>
                  </div>
                  <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <li className="px-4 py-8 text-center text-xs text-gray-400">
                        No enquiries yet
                      </li>
                    ) : (
                      notifications.map((n) => (
                        <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition">
                          <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            {notifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900">
                              <span className="capitalize">{n.type}</span> tap on listing
                            </p>
                            <p className="text-xs text-gray-500 truncate">{n.listingTitle}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatTime(n.createdAt)}</p>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                  {notifications.length > 0 && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      <button
                        onClick={() => { router.push("/dashboard/analytics"); setShowNotifPanel(false); }}
                        className="text-xs text-amber-600 font-semibold hover:underline"
                      >
                        View all in Analytics →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => router.push("/dashboard/listings/add")}
              className="bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 flex items-center gap-2"
            >
              <PlusCircle size={18} /> New Listing
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard title="My Listings" value={listings.length} />
          <StatCard title="Total Views" value={listings.reduce((s, l) => s + ((l as any).views ?? 0), 0)} />
          <StatCard title="Enquiries" value={notifications.length} />
        </div>

        {/* RECENT LISTINGS */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">Your Recent Listings</h2>
            <Link href="/dashboard/listings" className="text-sm text-amber-600 hover:underline font-medium">
              View all →
            </Link>
          </div>
          {loading ? (
            <p>Loading listings...</p>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <PlusCircle size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm">No listings yet. Click New Listing to add one.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 3).map((listing) => (
                <ListingCard key={listing.id} listing={listing} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        {/* TOOLS */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="font-semibold text-lg mb-6 text-primary">Your Property Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard title="Valuation" link="https://valora.vercel.app" />
            <ToolCard title="AgentCRM" link="https://agentcrm.vercel.app" />
            <ToolCard title="Housify" link="https://housify-chi.vercel.app" />
            <ToolCard title="FundiPlus" link="https://fundiplus.vercel.app" />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-6 text-primary">Quick Links</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/listings" className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-90">My Listings</Link>
            <Link href="/dashboard/listings/add" className="px-4 py-2 bg-secondary text-dark rounded-lg font-semibold hover:opacity-90">Upload Property</Link>
            <Link href="/dashboard/analytics" className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100">Analytics</Link>
            <Link href="/dashboard/profile" className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100">My Profile</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================================
   COMPONENTS
================================ */

function NavItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition"
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function ToolCard({ title, link }: { title: string; link: string }) {
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

function ListingCard({ listing, onDelete }: { listing: Listing; onDelete?: (id: string) => void }) {
  const imageUrl = listing.images.length > 0 ? listing.images[0] : "/placeholder.png";

  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col">
      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
        <Image src={imageUrl} alt={listing.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <h3 className="font-semibold text-lg">{listing.title}</h3>
      <p className="text-gray-600">{listing.location}</p>
      <p className="text-primary font-bold mb-2">Ksh {listing.price.toLocaleString()}</p>
      <div className="flex items-center gap-4 mb-2 text-gray-500">
        {listing.beds ? <span className="flex items-center gap-1"><BedDouble size={16} /> {listing.beds}</span> : null}
        {listing.baths ? <span className="flex items-center gap-1"><ShowerHead size={16} /> {listing.baths}</span> : null}
        {listing.parking ? <span className="flex items-center gap-1"><Car size={16} /> {listing.parking}</span> : null}
      </div>
      {listing.virtualTour && (
        <a href={listing.virtualTour} target="_blank" rel="noopener noreferrer" className="text-accent flex items-center gap-1 mb-2 hover:underline">
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
