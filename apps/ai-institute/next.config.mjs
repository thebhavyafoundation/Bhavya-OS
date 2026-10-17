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
  // serverExternalPackages is applied per package, so this chain is listed whole
  // or not at all. `@libsql/hrana-client` requires `@libsql/isomorphic-ws`
  // unconditionally; externalising the requiree while bundling the requirer
  // leaves a dangling require and fails the build at hrana-client/lib-cjs/index.js:18.
  // `ws` is listed because the isomorphic-ws node entry requires it.
  // `@libsql/client` is safe here only because it is reached via its `/web`
  // entry, which is fetch-based; the root entry resolves under `require` to the
  // native libsql NAPI build and throws in a Worker. `better-sqlite3` stays
  // external: native, Node-only, and must never be bundled into a Worker.
  serverExternalPackages: [
    "better-sqlite3",
    "@libsql/client",
    "@libsql/hrana-client",
    "@libsql/isomorphic-ws",
    "@libsql/core",
    "ws",
    "promise-limit",
    "js-base64",
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingExcludes: {
    "next-server": ["**/.ignored_*"],
  },
  // Next's tracer never picks up @libsql/isomorphic-ws: it is only reachable
  // through a subpath export (`@libsql/client/web`) reached by a runtime
  // require, which the module-graph tracer does not follow. It must therefore
  // be added explicitly.
  //
  // Patterns are relative to outputFileTracingRoot, which is the repository
  // root — not the app. A direct dependency materialises in the app's own
  // node_modules, so that is the path that exists after a fresh install.
  // Patterns written against a hoisted root `node_modules/@libsql/*` match
  // nothing under pnpm and were the reason the includes in #33 and #34 were
  // inert. `--check-globs` in CI now fails on any pattern that matches zero
  // files.
  outputFileTracingIncludes: {
    "/*": [
      "./apps/ai-institute/node_modules/@libsql/isomorphic-ws/**/*",
      "./apps/ai-institute/node_modules/@libsql/client/**/*",
      "./node_modules/.pnpm/@libsql+hrana-client@*/node_modules/@libsql/hrana-client/**/*",
      "./node_modules/.pnpm/@libsql+core@*/node_modules/@libsql/core/**/*",
      "./node_modules/.pnpm/ws@*/node_modules/ws/**/*",
      "./node_modules/.pnpm/promise-limit@*/node_modules/promise-limit/**/*",
      "./node_modules/.pnpm/js-base64@*/node_modules/js-base64/**/*",
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
