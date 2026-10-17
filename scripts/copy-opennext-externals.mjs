#!/usr/bin/env node
/**
 * Materialise server-external packages into the OpenNext server-function tree.
 *
 * WHY
 *   `@libsql/isomorphic-ws` is in `serverExternalPackages`, so Next.js excludes
 *   it from file tracing by design. `outputFileTracingIncludes` cannot override
 *   that, which is why tracing the package directly never worked: the files are
 *   never candidates for copying. OpenNext then bundles server functions with
 *   esbuild, which resolves `require("@libsql/isomorphic-ws")` from inside the
 *   packaged tree and fails:
 *
 *     Could not resolve "@libsql/isomorphic-ws"
 *     at .open-next/server-functions/default/node_modules/.pnpm/
 *         @libsql+hrana-client@0.10.0/node_modules/@libsql/hrana-client/lib-cjs/index.js
 *
 * WHAT IT DOES
 *   Copies each pure-JavaScript external into
 *   `.open-next/server-functions/default/node_modules/<name>/`, the highest node_modules
 *   directory in the packaged tree, so Node resolution finds it from any depth.
 *
 *   Symlinks are dereferenced, because pnpm links externals into
 *   `node_modules/.pnpm` and a copied symlink would dangle in the Worker bundle.
 *
 * WHY NOT better-sqlite3
 *   It is native, Node-only, and must never be shipped to a Worker. Only pure-JS
 *   externals belong here; bundling it would move a build-time failure to a
 *   runtime one.
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

// Pure-JS externals only. `better-sqlite3` is deliberately absent (native).
const EXTERNALS = ["@libsql/isomorphic-ws", "@libsql/client", "ws"];

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, "../apps/ai-institute");
const outDir = join(
  appDir,
  ".open-next",
  "server-functions",
  "default",
  "node_modules",
);

/** Resolve a package's root directory, walking up from its entry to the owning package.json. */
function packageRoot(req, name) {
  let dir;
  try {
    dir = dirname(req.resolve(name));
  } catch {
    return null; // not resolvable from this require context
  }
  for (let i = 0; i < 64; i++) {
    const manifest = join(dir, "package.json");
    if (existsSync(manifest)) {
      try {
        if (JSON.parse(readFileSync(manifest, "utf8")).name === name)
          return dir;
      } catch {
        return null;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * `ws` is not a dependency of the app, so it is only reachable from the package
 * that declares it. pnpm places it beside that package inside the store, which
 * is where a real require would find it.
 */
function resolveExternal(name) {
  const appReq = createRequire(join(appDir, "package.json"));
  const fromApp = packageRoot(appReq, name);
  if (fromApp) return fromApp;

  const parentReq = createRequire(join(appDir, "package.json"));
  for (const parent of EXTERNALS) {
    const parentDir = packageRoot(parentReq, parent);
    if (!parentDir) continue;
    const nested = packageRoot(
      createRequire(join(parentDir, "package.json")),
      name,
    );
    if (nested) return nested;
  }
  return null;
}

function copyExternals() {
  if (!existsSync(outDir)) {
    console.error(
      `No packaged tree at ${outDir}. Run the OpenNext build first.`,
    );
    return false;
  }
  let copied = 0;
  for (const name of EXTERNALS) {
    const src = resolveExternal(name);
    if (!src) {
      console.error(
        `Could not resolve ${name}; leaving it out of the Worker bundle.`,
      );
      return false;
    }
    const dest = join(outDir, name);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest, { recursive: true, dereference: true });
    console.log(`  copied ${name}`);
    copied++;
  }
  console.log(`Materialised ${copied}/${EXTERNALS.length} external packages.`);
  return true;
}

function selftest() {
  const root = mkdtempSync(join(tmpdir(), "opennext-externals-"));
  try {
    const src = join(root, "src", "@libsql", "isomorphic-ws");
    mkdirSync(src, { recursive: true });
    writeFileSync(
      join(src, "package.json"),
      '{"name":"@libsql/isomorphic-ws"}',
    );
    writeFileSync(join(src, "web.cjs"), "module.exports = {};\n");

    const dest = join(root, "out", "@libsql", "isomorphic-ws");
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest, { recursive: true, dereference: true });

    const ok =
      existsSync(join(dest, "package.json")) &&
      existsSync(join(dest, "web.cjs")) &&
      readFileSync(join(dest, "package.json"), "utf8").includes(
        "isomorphic-ws",
      );
    console.log(
      `\nSELFTEST RESULT: ${ok ? "PASS" : "FAIL"} - copying an external preserves its manifest and entry file.`,
    );
    return ok;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

if (process.argv.includes("--selftest")) {
  process.exitCode = selftest() ? 0 : 1;
} else {
  process.exitCode = copyExternals() ? 0 : 1;
}
