"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface Props {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: Props) {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");


  const handleSubmit = async (): Promise<void> => {

    setLoading(true);
    setError("");

    try {

      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      window.location.href = "/dashboard";

    } catch (err: unknown) {

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Authentication failed");
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-5">

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm text-gray-600">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>


      <div>
        <label className="text-sm text-gray-600">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>


      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : mode === "login"
          ? "Login"
          : "Create Account"}
      </button>

    </div>
  );
}
