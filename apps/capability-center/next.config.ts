import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@bhavya/capability-registry",
    "@bhavya/intelligence",
    "@bhavya/mcp-manager",
    "@bhavya/plugin-manager",
    "@bhavya/platform",
    "@bhavya/platform-ui",
  ],
};

export default nextConfig;
