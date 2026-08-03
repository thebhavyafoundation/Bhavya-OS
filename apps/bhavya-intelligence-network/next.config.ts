import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@bhavya/intelligence",
    "@bhavya/capability-registry",
    "@bhavya/crawlers",
    "@bhavya/mcp-manager",
    "@bhavya/plugin-manager",
    "@bhavya/browser-automation",
    "@bhavya/github-intelligence",
    "@bhavya/technology-radar",
    "@bhavya/analyzers",
    "@bhavya/knowledge-extraction",
    "@bhavya/events",
    "@bhavya/workflows",
    "@bhavya/platform",
    "@bhavya/platform-ui",
  ],
};

export default nextConfig;
