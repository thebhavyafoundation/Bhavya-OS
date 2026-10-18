import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// THE DEFECT THIS FIXES
//
// esbuild fails while bundling the server functions:
//
//   Bundling the OpenNext server...
//   ERROR: Could not resolve "@libsql/isomorphic-ws"
//     .open-next/server-functions/default/node_modules/.pnpm/
//       @libsql+hrana-client@0.10.0/node_modules/@libsql/hrana-client/
//       lib-cjs/index.js:18:32
//
// The resolution path is inside `.open-next`, not source `node_modules`.
// OpenNext copies the dependency tree into
// `.open-next/server-functions/default/node_modules/` itself, and esbuild then
// bundles from that copy.
//
// Under pnpm, `hrana-client` reaches `isomorphic-ws` only through a virtual
// store symlink, and that copy does not bring the symlink target along. So the
// require has nothing to resolve to.
//
// createServerBundle.js calls `installDependencies(outputPath,
// fnOptions.install)`. That option is the mechanism that populates the
// server-function output, and it was undefined. Setting it runs a real install
// into the output directory, producing flat physical `node_modules/@libsql/*`
// directories that plain upward node resolution finds from `hrana-client`.
//
// This also explains the earlier attempts. `serverExternalPackages` is honoured
// by Next's bundler and never reaches OpenNext's own. Next's
// `outputFileTracingIncludes` does not govern OpenNext's copy. Neither operated
// on the tree esbuild actually resolves from.
//
// `defineCloudflareConfig` accepts only caching overrides, so the AWS-shaped
// `default.install` option is composed onto its return value.
const base = defineCloudflareConfig();

export default {
  ...base,
  default: {
    ...base.default,
    install: {
      packages: [
        "@libsql/isomorphic-ws@0.1.5",
        "@libsql/hrana-client@0.10.0",
        "@libsql/client@0.17.4",
        "ws@8.21.3",
      ],
    },
  },
};
