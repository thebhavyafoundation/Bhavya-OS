import { fileURLToPath } from "url";
import path from "path";
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize OpenNext for local dev only — skipped during `next build` (NODE_ENV=production)
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  transpilePackages: [
    "@bhavya/platform-ui",
    "@bhavya/impact-runtime",
    "@bhavya/project-runtime",
  ],
  // Only genuinely native, Node-only packages belong here. Next excludes
  // everything listed from tracing and bundling, so a package that is bundled
  // but requires something listed here produces a bundle that cannot resolve it.
  // `@libsql/*` must therefore NOT be listed: `@libsql/hrana-client` requires
  // `@libsql/isomorphic-ws`, and excluding the latter while bundling the former
  // fails the build at hrana-client's unconditional require. `@libsql/client`
  // is reached through its `/web` entry, which is fetch-based and free of
  // native code, so it bundles cleanly for Workers.
  // `better-sqlite3` stays external: it is a native addon and must never be
  // bundled into a Worker.
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingExcludes: {
    "next-server": ["**/.ignored_*"],
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    const cspReportOnly = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://f002.backblazeb2.com",
      "style-src 'self' 'unsafe-inline' https://f002.backblazeb2.com",
      "img-src 'self' data: https: https://f002.backblazeb2.com",
      "font-src 'self' data: https://f002.backblazeb2.com",
      "connect-src 'self' https://bnuqwcponnhlldlybbpw.supabase.co https://f002.backblazeb2.com wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspReportOnly,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default defineCloudflareConfig(nextConfig);
