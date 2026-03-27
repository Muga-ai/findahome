"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Home, ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };
const SANS = { fontFamily: "'system-ui', sans-serif" };

/* =====================
   TYPES
===================== */

interface ProfileData {
  displayName: string;
  phone: string;
  whatsapp: string;
  email: string;
  bio: string;
  agency: string;
  licenseNumber: string;
  city: string;
  profilePhotoUrl: string;
}

const EMPTY: ProfileData = {
  displayName: "",
  phone: "",
  whatsapp: "",
  email: "",
  bio: "",
  agency: "",
  licenseNumber: "",
  city: "",
  profilePhotoUrl: "",
};

/* =====================
   PAGE
===================== */

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ---- auth ---- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  /* ---- fetch existing profile ---- */
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setForm({ ...EMPTY, ...snap.data() });
        } else {
          // pre-fill from Firebase Auth
          setForm((prev) => ({
            ...prev,
            displayName: user.displayName ?? "",
            email: user.email ?? "",
          }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  /* ---- save ---- */
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), { ...form, updatedAt: new Date() }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Profile save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* =====================
     UI
  ===================== */
  return (
    <main className="min-h-screen bg-gray-50" style={SANS}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={SERIF}>
            <Home className="w-5 h-5 text-amber-500" />
            <span>Find<span className="text-amber-500">A</span>Home</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-amber-600 text-xs font-semibold tracking-widest uppercase mb-1">Account</p>
          <h1 className="text-3xl font-bold text-gray-900" style={SERIF}>Your Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            This information appears on your listings and is visible to potential buyers
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">

            {/* PERSONAL INFO */}
            <FormSection title="Personal Information">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Full Name" value={form.displayName} onChange={(v) => handleChange("displayName", v)} placeholder="Jane Kamau" />
                <Field label="City / Area" value={form.city} onChange={(v) => handleChange("city", v)} placeholder="Nairobi" />
                <Field label="Phone Number" value={form.phone} onChange={(v) => handleChange("phone", v)} placeholder="+254 7XX XXX XXX" type="tel" />
                <Field label="WhatsApp Number" value={form.whatsapp} onChange={(v) => handleChange("whatsapp", v)} placeholder="+254 7XX XXX XXX" type="tel" />
                <Field label="Email Address" value={form.email} onChange={(v) => handleChange("email", v)} placeholder="jane@example.com" type="email" className="md:col-span-2" />
              </div>
              <div className="mt-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Bio / About You
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell buyers a little about yourself and your experience..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>
            </FormSection>

            {/* AGENCY INFO */}
            <FormSection title="Agency & Credentials">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Agency / Company Name" value={form.agency} onChange={(v) => handleChange("agency", v)} placeholder="Kamau Properties Ltd" />
                <Field label="License Number (optional)" value={form.licenseNumber} onChange={(v) => handleChange("licenseNumber", v)} placeholder="EBK/XXXX/YYYY" />
              </div>
            </FormSection>

            {/* PROFILE PHOTO */}
            <FormSection title="Profile Photo">
              <Field
                label="Profile Photo URL"
                value={form.profilePhotoUrl}
                onChange={(v) => handleChange("profilePhotoUrl", v)}
                placeholder="https://..."
                type="url"
              />
              <p className="text-xs text-gray-400 mt-2">
                Paste a direct image URL (e.g. from Cloudinary or Firebase Storage). Photo will appear on your listings.
              </p>
              {form.profilePhotoUrl && (
                <div className="mt-4 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.profilePhotoUrl}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <p className="text-sm text-gray-500">Preview</p>
                </div>
              )}
            </FormSection>

            {/* WHAT YOUR PROFILE ENABLES */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3" style={SERIF}>Why fill out your profile?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "Your name and photo appear on every listing you publish",
                  "Buyers can call or WhatsApp you directly from listing pages",
                  "A complete profile builds trust and increases enquiry rates",
                  "Your agency name appears below your listings for brand visibility",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-amber-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* SAVE BUTTON */}
            <div className="flex items-center justify-between pt-2">
              {saved && (
                <p className="flex items-center gap-1.5 text-sm text-green-600">
                  <CheckCircle2 size={15} /> Profile saved successfully
                </p>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-amber-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-300 transition disabled:opacity-60"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* =====================
   COMPONENTS
===================== */

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-5" style={SERIF}>{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", className = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}
