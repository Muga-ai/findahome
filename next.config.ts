import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Allow remote patterns
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

  
    qualities: [75, 85, 90],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
      allowedOrigins: ["https://findahome-kappa.vercel.app"],
    },
  },
};

export default nextConfig;
