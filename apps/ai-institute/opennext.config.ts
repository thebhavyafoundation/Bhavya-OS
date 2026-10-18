import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext on Cloudflare requires this file. The repository did not have one, so
// the adapter has been running entirely on defaults, with no ability to tune how
// the server functions are bundled.
//
// This starts deliberately minimal: the documented default configuration. It is
// introduced as a single variable so that its effect on the build can be read
// cleanly, rather than bundled together with an externals experiment.
//
// The open question this file exists to answer: esbuild fails to resolve
// "@libsql/isomorphic-ws" while bundling .open-next/server-functions from the
// copied dependency tree. Options such as `edgeExternals` are the next lever to
// try here, one at a time.
export default defineCloudflareConfig();
