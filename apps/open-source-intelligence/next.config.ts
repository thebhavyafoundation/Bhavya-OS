import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@bhavya/intelligence",
    "@bhavya/capability-registry",
    "@bhavya/crawlers",
    "@bhavya/mcp-manager",
    "@bhavya/github-intelligence",
    "@bhavya/technology-radar",
    "@bhavya/analyzers",
    "@bhavya/knowledge-extraction",
    "@bhavya/browser-automation",
    "@bhavya/platform",
    "@bhavya/platform-ui",
  ],
};

export default nextConfig;
