import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Bhavya-OS",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Security headers must be applied at hosting level (Vercel/Cloudflare/etc.)
  // or via a _headers file for static export.
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
