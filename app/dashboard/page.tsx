"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import {
  Home,
  PlusCircle,
  BarChart,
  User,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex bg-light text-dark">


      {/* SIDEBAR */}
      <aside className="w-64 bg-primary text-black p-6 flex flex-col">

        <h2 className="text-xl font-bold mb-8">
          Find A Home
        </h2>

        <nav className="space-y-3 text-sm flex-1">

          <NavItem icon={<Home size={18} />} label="Dashboard" />
          <NavItem icon={<PlusCircle size={18} />} label="Add Listing" />
          <NavItem icon={<BarChart size={18} />} label="Analytics" />
          <NavItem icon={<User size={18} />} label="Profile" />

        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-secondary text-dark px-4 py-2 rounded-lg w-full justify-center font-semibold hover:opacity-90"
        >
          <LogOut size={16} />
          Logout
        </button>

      </aside>


      {/* MAIN */}
      <section className="flex-1 p-8">


        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold text-black">
            Dashboard
          </h1>

          <Link
            href="/sell"
            className="bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            + New Listing
          </Link>

        </div>


        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <StatCard title="Listings" value="0" />
          <StatCard title="Views" value="0" />
          <StatCard title="Leads" value="0" />

        </div>


        {/* Ecosystem */}
        <div className="bg-white rounded-xl shadow p-6">

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

      </section>

    </main>
  );
}


/* COMPONENTS */

function NavItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition">
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
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h3 className="text-sm text-gray-500">
        {title}
      </h3>

      <p className="text-2xl font-bold text-primary">
        {value}
      </p>

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

      <span className="font-medium">
        {title}
      </span>

      <ExternalLink size={16} />

    </a>
  );
}
