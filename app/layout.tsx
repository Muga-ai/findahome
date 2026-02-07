/// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import GAWrapper from "./GAWrapper";

export const metadata: Metadata = {
  title: "Find A Home",
  description: "Global Property Marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-light text-dark">
        {children}   {/* your layout is exactly as before */}
        <GAWrapper /> {/* GA tracking injected safely */}
      </body>
    </html>
  );
}
