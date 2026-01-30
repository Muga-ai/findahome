import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Find A Home | Global Property Marketplace",
  description:
    "Find A Home is the world’s intelligent real estate marketplace for buying, selling, and renting verified homes.",
  keywords: [
    "real estate",
    "property",
    "homes for sale",
    "homes for rent",
    "global real estate",
    "find a home",
  ],
  authors: [{ name: "Find A Home" }],
};

 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
