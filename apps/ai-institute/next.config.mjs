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
  // `@libsql/isomorphic-ws` is deliberately NOT in serverExternalPackages.
  //
  // Next.js applies serverExternalPackages per package, so externalising one
  // half of a dependency chain splits it: `@libsql/hrana-client` is bundled,
  // and it requires `@libsql/isomorphic-ws` unconditionally at
  // `lib-cjs/index.js:18`. With the required package excluded from the bundle,
  // that require has nothing to resolve to, and the OpenNext server-function
  // build fails with "Could not resolve @libsql/isomorphic-ws".
  //
  // Bundling both halves keeps the chain intact. Under the workerd condition
  // `isomorphic-ws` resolves to `web.cjs`, which uses the global WebSocket and
  // has no dependencies at all -- so bundling it also retires the `ws`
  // resolution hazard the previous configuration had to work around.
  serverExternalPackages: [
    "better-sqlite3",
    "@libsql/client",
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingExcludes: {
    "next-server": ["**/.ignored_*"],
  },
  // These globs are scoped to the Turso chain only, never all of node_modules.
  //
  // Known defect, left in place so this change stays a one-line fix: the
  // paths are written against a hoisted `node_modules/@libsql/*`, which a pnpm
  // workspace never creates, so all four currently match zero files. Removing
  // them is a separate change and should be verified on its own.
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
