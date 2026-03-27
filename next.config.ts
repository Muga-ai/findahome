import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],

    // 🔥 ADD THIS (prevents random optimization failures in production)
    formats: ["image/avif", "image/webp"],

    // optional but safe
    minimumCacheTTL: 60,

    qualities: [75, 85, 90],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",

      // 🔥 IMPORTANT: allow both prod + local
      allowedOrigins: [
        "https://findahome-kappa.vercel.app",
        "http://localhost:3000",
      ],
    },
  },
};

export default nextConfig;