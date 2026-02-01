"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";


import {
Home,
Building2,
PlusCircle,
BarChart3,
LogOut,
} from "lucide-react";


export default function DashboardNav() {
const router = useRouter();


const logout = async () => {
await signOut(auth);
router.push("/login");
};


return (
<aside className="w-64 bg-white border-r hidden md:flex flex-col">


{/* Logo */}
<div className="p-6 text-xl font-bold text-primary border-b">
Find A Home
</div>


{/* Menu */}
<nav className="flex-1 p-4 space-y-2 text-sm">


<Link
href="/dashboard"
className="flex items-center gap-3 p-3 rounded-lg hover:bg-light"
>
<Home size={18} /> Dashboard
</Link>


<Link
href="/dashboard/listings"
className="flex items-center gap-3 p-3 rounded-lg hover:bg-light"
>
<Building2 size={18} /> My Listings
</Link>


<Link
href="/dashboard/add"
className="flex items-center gap-3 p-3 rounded-lg hover:bg-light"
>
<PlusCircle size={18} /> Add Property
</Link>


<Link
href="/dashboard/analytics"
className="flex items-center gap-3 p-3 rounded-lg hover:bg-light"
>
<BarChart3 size={18} /> Analytics
</Link>


</nav>


{/* Logout */}
<button
onClick={logout}
className="flex items-center gap-3 p-4 border-t text-red-600 hover:bg-red-50"
>
<LogOut size={18} /> Logout
</button>


</aside>
);
}