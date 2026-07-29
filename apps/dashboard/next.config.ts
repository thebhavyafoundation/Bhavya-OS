import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@bhavya/content-core", "@bhavya/intelligence", "@bhavya/ui"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    config.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];
    return config;
  },
};

export default nextConfig;
