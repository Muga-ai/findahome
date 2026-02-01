"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignUp = async (): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User registered!");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Unexpected error during signup");
      }
    }
  };

  const handleSignIn = async (): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Signed in!");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Unexpected error during sign in");
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSignIn}
          className="bg-primary text-black px-4 py-2 rounded"
        >
          Sign In
        </button>
        <button
          onClick={handleSignUp}
          className="bg-secondary text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
