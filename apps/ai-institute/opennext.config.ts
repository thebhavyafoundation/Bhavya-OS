import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext on Cloudflare requires this file. The repository did not have one, so
// the adapter was running on defaults with no control over how the server
// functions are packaged.
//
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
// Under pnpm, `hrana-client` is reachable only through the virtual store: its
// sibling entry is a symlink to
// `.pnpm/@libsql+isomorphic-ws@<version>/node_modules/@libsql/isomorphic-ws`.
// That copy step does not bring the symlink target along, so the require has
// nothing to resolve to.
//
// `install` runs a real install into the server-function output directory,
// producing flat, physical `node_modules/@libsql/*` directories. Normal node
// resolution from `hrana-client` then finds `isomorphic-ws`, because it is
// reachable by plain upward traversal rather than through a store symlink.
//
// This is why the earlier attempts could not work: `serverExternalPackages` is
// honoured by Next's bundler and never reaches OpenNext's own, and Next's
// `outputFileTracingIncludes` does not govern OpenNext's copy. Neither was
// operating on the tree esbuild actually resolves from.
//
// Versions are pinned to what this workspace currently resolves, so the install
// matches the lockfile rather than drifting to latest.
//
// `ws` is included because `isomorphic-ws` resolves to `node.cjs`, which
// requires it, under the `node` condition. If the packager selects `web.cjs`
// under `workerd` instead it is unused and harmless.
export default defineCloudflareConfig({
  default: {
    install: {
      packages: [
        "@libsql/isomorphic-ws@0.1.5",
        "@libsql/hrana-client@0.10.0",
        "@libsql/client@0.17.4",
        "ws@8.21.3",
      ],
    },
  },
});
