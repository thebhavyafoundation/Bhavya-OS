#!/usr/bin/env node

/**
 * Serves the built component proof fixture over loopback for the remote
 * Playwright harness.
 *
 * The server only answers for files inside dist/ and never reaches the
 * network. It exits with a failure when the fixture has not been built, so
 * a missing build is reported as a build problem rather than as a browser
 * timeout.
 *
 * Usage:
 *   node apps/ai-institute/tests/fixtures/ui-proof/serve.mjs
 *
 * Environment:
 *   FIXTURE_PORT  port to listen on, 4173 by default.
 */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize, sep } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "dist");
const HOST = "127.0.0.1";
const PORT = Number(process.env.FIXTURE_PORT || 4173);

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

if (!existsSync(join(ROOT, "index.html"))) {
  process.stderr.write(
    "fixture dist/ is missing. Run: node apps/ai-institute/tests/fixtures/ui-proof/build.mjs\n",
  );
  process.exit(1);
}

const server = createServer((request, response) => {
  const requested = new URL(request.url ?? "/", `http://${HOST}:${PORT}`).pathname;
  const relative = normalize(requested === "/" ? "/index.html" : requested).replace(
    /^([/\\])+/,
    "",
  );
  const target = join(ROOT, relative);

  if (!target.startsWith(ROOT + sep)) {
    response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    response.end("forbidden\n");
    return;
  }

  readFile(target).then(
    (body) => {
      const type = CONTENT_TYPES[target.slice(target.lastIndexOf("."))] ??
        "application/octet-stream";
      response.writeHead(200, {
        "content-type": type,
        "cache-control": "no-store",
      });
      response.end(body);
    },
    () => {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("not found\n");
    },
  );
});

server.listen(PORT, HOST, () => {
  process.stdout.write("fixture server listening on http://" + HOST + ":" + PORT + "\n");
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
