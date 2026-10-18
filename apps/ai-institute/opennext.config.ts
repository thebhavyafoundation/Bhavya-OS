import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext on Cloudflare requires this file. The repository did not have one, so
// the adapter has been running entirely on defaults, with no ability to tune how
// the server functions are bundled.
//
// Config presence alone did not change the build outcome, so this now adds the one lever the esbuild error names: externalising the Turso chain from the server-function bundle.
//
// Config presence was measured first and on its own was insufficient.
export default defineCloudflareConfig({
  // esbuild cannot resolve "@libsql/isomorphic-ws" while bundling the server
  // functions from the dependency tree OpenNext copies into
  // .open-next/server-functions/default/node_modules. Next's own
  // `serverExternalPackages` does not reach this bundler, which is why
  // toggling that setting changed nothing.
  //
  // The esbuild error itself names this remedy: "You can mark the path
  // @libsql/isomorphic-ws as external to exclude it from the bundle."
  //
  // `ws` is included because under the `node` condition isomorphic-ws resolves
  // to node.cjs, which requires it, while under `workerd` it resolves to
  // web.cjs, which uses the global WebSocket and has no dependencies. Which one
  // is chosen depends on the conditions the packager passes to esbuild, so both
  // must resolve.
  edgeExternals: [
    "@libsql/isomorphic-ws",
    "@libsql/hrana-client",
    "@libsql/client",
    "ws",
  ],
});
