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
  // `@libsql/isomorphic-ws` IS in serverExternalPackages because its package
  // (`@libsql/isomorphic-ws@0.1.5`) declares `"workerd": "./web.cjs"` in its
  // package.json, but `web.cjs` does not exist in the published package.
  // Bundling it causes OpenNext to fail with "Could not resolve
  // @libsql/isomorphic-ws" because the bundled file references a missing
  // `./web.cjs`. Externalising it lets the require resolve at runtime in the
  // Cloudflare Workers environment, where `@libsql/client` (also externalised)
  // already brings `@libsql/isomorphic-ws` as a transitive dependency.
  serverExternalPackages: [
    "better-sqlite3",
    "@libsql/client",
    "@libsql/isomorphic-ws",
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingExcludes: {
    "next-server": ["**/.ignored_*"],
  },
  // These globs are scoped to the Turso chain only, never all of node_modules.
  //
  // They MUST point into the pnpm virtual store. A pnpm workspace has no
  // `node_modules/@libsql/*` directory -- those paths are symlinks that Next's
  // tracer does not follow -- so the previous hoisted-shaped globs matched zero
  // files and the package entry was never carried into the packaged tree,
  // producing "Could not resolve @libsql/isomorphic-ws".
  //
  // The version segment is wildcarded so a dependency bump does not silently
  // reintroduce a dead glob.
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/.pnpm/@libsql+hrana-client@*/node_modules/@libsql/hrana-client/**/*",
      "./node_modules/.pnpm/@libsql+client@*/node_modules/@libsql/client/**/*",
      "./node_modules/.pnpm/ws@*/node_modules/ws/**/*",
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
