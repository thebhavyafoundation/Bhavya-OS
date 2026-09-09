import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
