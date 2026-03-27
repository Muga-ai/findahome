"use client";

import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "agent", // default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.fullName });

      // Store user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
        createdAt: serverTimestamp(),
      });

      // Redirect or show success
      alert("Account created successfully! You can now log in.");
    } catch (err: any) {
      setError(err.message || "Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-primary text-white">
        <h1 className="text-4xl font-bold mb-4">Join Find A Home</h1>
        <p className="text-lg opacity-90 max-w-md mb-6">
          Create your free account and start buying, selling, and managing properties globally.
        </p>
        <ul className="space-y-2 text-sm opacity-90">
          <li>✔ Verified Listings</li>
          <li>✔ Virtual Tours</li>
          <li>✔ Market Intelligence</li>
          <li>✔ Trusted Agents</li>
        </ul>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-6">Start your MLS journey today</p>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
            >
              <option value="buyer">Buyer</option>
              <option value="agent">Agent / Seller</option>
              <option value="company">Company / Agency</option>
            </select>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-300 transition"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-black font-medium hover:underline">
              Login
            </Link>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/" className="text-gray-500 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}