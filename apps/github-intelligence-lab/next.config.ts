import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@bhavya/intelligence",
    "@bhavya/github-intelligence",
    "@bhavya/mcp-manager",
    "@bhavya/plugin-manager",
    "@bhavya/browser-automation",
    "@bhavya/technology-radar",
    "@bhavya/capability-registry",
    "@bhavya/platform",
    "@bhavya/platform-ui",
  ],
};

export default nextConfig;
