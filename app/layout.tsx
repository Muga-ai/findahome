import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find A Home",
  description: "Global Property Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-light text-dark">
        {children}
      </body>
    </html>
  );
}
