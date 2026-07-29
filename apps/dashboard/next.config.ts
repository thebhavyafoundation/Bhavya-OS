import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bhavya/content-core", "@bhavya/intelligence", "@bhavya/ui"],
};

export default nextConfig;
