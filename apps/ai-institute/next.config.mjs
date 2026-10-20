import { fileURLToPath } from "url";
import path from "path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize OpenNext for local dev only - skipped during `next build` (NODE_ENV=production)
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// This file is the Next.js config and must export a Next.js config.
//
// It previously exported `defineCloudflareConfig(nextConfig)`. That helper
// builds an OpenNext config, not a Next.js config, and it keeps only the
// OpenNext-specific keys. Every Next.js option below was therefore silently
// discarded, and Next.js itself reported it:
//   "Invalid next.config.mjs options detected: Unrecognized key(s) in object:
//    'default', 'edgeExternals', 'cloudflare', 'dangerous', 'middleware'"
// The OpenNext config belongs in open-next.config.ts, which already holds it.
//
// Consequences of the discarded options, all now fixed:
//   - `outputFileTracingRoot` was ignored, so tracing was rooted at the app
//     directory instead of the workspace root.
//   - `outputFileTracingIncludes` globs are resolved against the app
//     directory, and the pnpm virtual store lives at the workspace root, so
//     they matched zero files. The traced tree therefore carried only the
//     traced main entry of a package and not its other files.
//   - `serverExternalPackages` was ignored, so OpenNext's copyWorkerdPackages
//     had an empty external list and never copied a package whole, nor
//     rewrote its package.json to the workerd condition.
//   - `output` was ignored, so a plain `next build` produced no standalone
//     output for the tracing to land in.
//   - `headers` was ignored, so the Content-Security-Policy and the other
//     security headers were never applied.
//
// The Turso chain is externalised so OpenNext copies those packages whole
// and rewrites their exports map to the workerd condition. The packages are
// also traced whole, which is what puts the workerd entry point into the
// traced tree.
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
    "@libsql/hrana-client",
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingExcludes: {
    "next-server": ["**/.ignored_*"],
  },
  // These globs are scoped to the Turso chain only, never all of node_modules.
  //
  // They MUST point into the pnpm virtual store, and they are resolved
  // against the app directory, so the workspace root is two levels up. A
  // pnpm workspace has no node_modules/.pnpm under the app directory, so a
  // "./node_modules/.pnpm/..." glob matched zero files and the package was
  // never carried into the traced tree, producing "Could not resolve
  // @libsql/isomorphic-ws".
  //
  // Tracing the whole package directory is what carries the workerd entry
  // point alongside the main entry. Next.js traces a package's main entry but
  // not its other conditional-export targets, and @libsql/isomorphic-ws
  // selects "./web.cjs" under the workerd and default conditions.
  //
  // The version segment is wildcarded so a dependency bump does not silently
  // reintroduce a dead glob.
  outputFileTracingIncludes: {
    "/*": [
      "../../node_modules/.pnpm/@libsql+isomorphic-ws@*/node_modules/@libsql/isomorphic-ws/**/*",
      "../../node_modules/.pnpm/@libsql+hrana-client@*/node_modules/@libsql/hrana-client/**/*",
      "../../node_modules/.pnpm/@libsql+hrana-client@*/node_modules/@libsql/isomorphic-ws/**/*",
      "../../node_modules/.pnpm/@libsql+client@*/node_modules/@libsql/client/**/*",
      "../../node_modules/.pnpm/ws@*/node_modules/ws/**/*",
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
      "font-src 'self' data: https: https://f002.backblazeb2.com",
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

export default nextConfig;