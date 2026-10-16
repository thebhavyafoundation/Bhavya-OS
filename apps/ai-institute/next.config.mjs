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
  serverExternalPackages: [
    "better-sqlite3",
    "@libsql/client",
    "@libsql/isomorphic-ws",
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingExcludes: {
    "next-server": ["**/.ignored_*"],
  },
  // `@libsql/isomorphic-ws` is in serverExternalPackages above, so Next leaves
  // it as a runtime require and OpenNext must carry its files into the Worker.
  // Tracing alone is not enough: it resolves through a nested conditional
  // `exports` map, and the tracer copies package.json but not the .cjs/.mjs
  // entry it points at, so esbuild finds the package and cannot load the entry.
  // `ws` is listed because this package resolves to web.cjs (global WebSocket, no
  // dependency) under workerd/default but to node.cjs, which require()s `ws`,
  // under the node condition. Which one the packager picks depends on the
  // conditions it passes to esbuild, so `ws` must resolve either way. It is
  // already a transitive dependency (MIT); this adds no new dependency.
  // Scoped to the Turso chain only, never all of node_modules.
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@libsql/isomorphic-ws/**/*",
      "./node_modules/@libsql/hrana-client/**/*",
      "./node_modules/@libsql/client/**/*",
      "./node_modules/ws/**/*",
    ],
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
