"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  BarChart2,
  Eye,
  MessageCircle,
  Mail,
  TrendingUp,
  Home,
  ArrowLeft,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* =====================
   TYPES
===================== */

interface ListingStats {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  views: number;
  whatsappClicks: number;
  emailClicks: number;
  phoneClicks: number;
}

interface Notification {
  id: string;
  listingId: string;
  listingTitle: string;
  type: "whatsapp" | "email" | "phone";
  createdAt: { seconds: number } | null;
}

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };
const SANS = { fontFamily: "'system-ui', sans-serif" };

/* =====================
   PAGE
===================== */

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ListingStats[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "enquiries">("overview");

  /* ---- auth ---- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  /* ---- fetch ---- */
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        // listings
        const listingsSnap = await getDocs(
          query(collection(db, "listings"), where("createdBy", "==", user.uid))
        );
        const listingData: ListingStats[] = listingsSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? "",
            location: data.location ?? "",
            price: data.price ?? 0,
            images: data.images ?? [],
            views: data.views ?? 0,
            whatsappClicks: data.whatsappClicks ?? 0,
            emailClicks: data.emailClicks ?? 0,
            phoneClicks: data.phoneClicks ?? 0,
          };
        });
        setStats(listingData);

        // notifications
        const notifSnap = await getDocs(
          query(
            collection(db, "notifications"),
            where("ownerId", "==", user.uid),
            orderBy("createdAt", "desc")
          )
        );
        const notifData = notifSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Notification[];
        setNotifications(notifData);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  /* ---- totals ---- */
  const totalViews = stats.reduce((s, l) => s + l.views, 0);
  const totalWhatsapp = stats.reduce((s, l) => s + l.whatsappClicks, 0);
  const totalEmail = stats.reduce((s, l) => s + l.emailClicks, 0);
  const totalPhone = stats.reduce((s, l) => s + l.phoneClicks, 0);

  const formatTime = (ts: { seconds: number } | null) => {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-KE", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  };

  const enquiryIcon = (type: string) => {
    if (type === "whatsapp") return <MessageCircle size={14} className="text-green-500" />;
    if (type === "email") return <Mail size={14} className="text-blue-500" />;
    return <Phone size={14} className="text-amber-500" />;
  };

  return (
    <main className="min-h-screen bg-gray-50" style={SANS}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={SERIF}>
            <Home className="w-5 h-5 text-amber-500" />
            <span>Find<span className="text-amber-500">A</span>Home</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-amber-600 text-xs font-semibold tracking-widest uppercase mb-1">Seller Analytics</p>
          <h1 className="text-3xl font-bold text-gray-900" style={SERIF}>Performance Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track views, enquiries and contact interactions across all your listings
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <SummaryCard icon={<Eye size={20} />} label="Total Views" value={totalViews} color="amber" />
              <SummaryCard icon={<MessageCircle size={20} />} label="WhatsApp Taps" value={totalWhatsapp} color="green" />
              <SummaryCard icon={<Mail size={20} />} label="Email Clicks" value={totalEmail} color="blue" />
              <SummaryCard icon={<TrendingUp size={20} />} label="Total Enquiries" value={notifications.length} color="purple" />
            </div>

            {/* TABS */}
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
              {(["overview", "enquiries"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === t ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "overview" ? "Listing Breakdown" : "Enquiry Feed"}
                </button>
              ))}
            </div>

            {/* LISTING BREAKDOWN */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {stats.length === 0 ? (
                  <EmptyState message="No listings to show analytics for." />
                ) : (
                  stats.map((listing) => (
                    <ListingStatRow key={listing.id} listing={listing} maxViews={Math.max(...stats.map(s => s.views), 1)} />
                  ))
                )}
              </div>
            )}

            {/* ENQUIRY FEED */}
            {activeTab === "enquiries" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {notifications.length === 0 ? (
                  <EmptyState message="No enquiries yet. They appear when buyers contact you via a listing." />
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {notifications.map((n) => (
                      <li key={n.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          {enquiryIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Someone tapped <span className="font-semibold capitalize">{n.type}</span> on your listing
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{n.listingTitle}</p>
                        </div>
                        <p className="text-xs text-gray-400 shrink-0">{formatTime(n.createdAt)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

/* =====================
   COMPONENTS
===================== */

function SummaryCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode; label: string; value: number;
  color: "amber" | "green" | "blue" | "purple";
}) {
  const colorMap = {
    amber: "text-amber-600 bg-amber-50",
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function ListingStatRow({ listing, maxViews }: { listing: ListingStats; maxViews: number }) {
  const image = listing.images[0] ?? "/placeholder.png";
  const total = listing.whatsappClicks + listing.emailClicks + listing.phoneClicks;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex gap-4 mb-5">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
          <Image src={image} alt={listing.title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate" style={{ fontFamily: "Georgia, serif" }}>{listing.title}</h3>
          <p className="text-xs text-gray-500">{listing.location}</p>
          <p className="text-sm font-bold text-amber-600 mt-0.5">Ksh {listing.price.toLocaleString()}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-gray-900">{listing.views}</p>
          <p className="text-xs text-gray-400">views</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>View reach</span>
          <span>{listing.views} total</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((listing.views / maxViews) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-4 gap-3">
        <MiniStat icon={<MessageCircle size={13} />} label="WhatsApp" value={listing.whatsappClicks} color="text-green-600 bg-green-50" />
        <MiniStat icon={<Mail size={13} />} label="Email" value={listing.emailClicks} color="text-blue-600 bg-blue-50" />
        <MiniStat icon={<Phone size={13} />} label="Phone" value={listing.phoneClicks} color="text-amber-600 bg-amber-50" />
        <MiniStat icon={<BarChart2 size={13} />} label="Total" value={total} color="text-purple-600 bg-purple-50" />
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl p-3 flex flex-col items-center ${color}`}>
      {icon}
      <p className="font-bold text-sm mt-1">{value}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
      <BarChart2 size={36} className="mx-auto mb-3 text-gray-300" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
