#!/usr/bin/env node
/**
 * Materialise missing conditional-export targets into the traced standalone tree.
 *
 * WHY THIS EXISTS
 *   Next.js output file tracing emits a package's `main` entry but does not
 *   retain the other conditional-export targets. For
 *   @libsql/isomorphic-ws@0.1.5 the traced tree contains `package.json` and
 *   `node.cjs` but omits `web.cjs`, which the package's exports map selects
 *   under the `workerd` and `default` conditions.
 *
 *   OpenNext then bundles the server function with the workerd condition
 *   active, resolves `@libsql/isomorphic-ws` to `./web.cjs`, and fails:
 *
 *     Could not resolve "@libsql/isomorphic-ws"
 *     The module "./web.cjs" was not found on the file system
 *
 *   @libsql/hrana-client requires @libsql/isomorphic-ws unconditionally at
 *   `lib-cjs/index.js:18`, so the missing entry point is fatal.
 *
 *   The package in the source store is correct. The loss happens in the traced
 *   tree, so that is the only place this script writes.
 *
 * WHY HERE AND NOT AFTER THE BUILD
 *   `opennextjs-cloudflare build --skipNextBuild` is a supported option
 *   (build/build.js: `if (projectOpts.skipNextBuild) { ... } else {
 *   buildNextjsApp }`). It clears `.open-next` and leaves `.next/standalone`
 *   intact, so this script runs at the boundary that actually works: after
 *   `next build` has traced the output, and before OpenNext copies that
 *   output and bundles it. A post-build copy could not help, because the
 *   build fails before any post step runs.
 *
 * SCOPE
 *   Only files that the package's own exports map promises, and that the
 *   traced tree is missing, are copied. The set of targets is derived from the
 *   exports map rather than hardcoded, so a dependency bump cannot silently
 *   reintroduce a gap.
 *
 * SAFETY
 *   - Refuses to run unless the traced standalone tree exists.
 *   - Never deletes, never writes outside the standalone tree.
 *   - Idempotent: an existing file is left untouched.
 *   - --verify asserts only, and exits non-zero if a promised target is
 *     still missing, so CI fails here rather than later inside esbuild.
 *
 * REMOVAL
 *   Delete this script and its two workflow steps once Next.js retains
 *   conditional-export targets, or once the OpenNext adapter is upgraded to
 *   a version that copies whole external packages.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, "..");
const REPO = path.resolve(APP, "..", "..");
const STANDALONE = path.join(APP, ".next", "standalone");
const VERIFY_ONLY = process.argv.includes("--verify");

const PACKAGES = ["@libsql/isomorphic-ws"];

const fail = (msg) => {
  console.error(`[materialise] FAIL: ${msg}`);
  process.exit(1);
};

const rel = (p) => path.relative(REPO, p).replace(/\\/g, "/");

/** Every string leaf reachable in an exports/imports condition map. */
function conditionTargets(node, out = new Set()) {
  if (typeof node === "string") {
    if (node.startsWith("./")) out.add(node.slice(2));
    return out;
  }
  if (node && typeof node === "object") {
    for (const value of Object.values(node)) conditionTargets(value, out);
  }
  return out;
}

/** Directories inside the traced tree that hold this package. */
function tracedPackageDirs(packageName) {
  const found = new Set();
  const walk = (dir, depth) => {
    if (depth > 6) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const full = path.join(dir, entry.name);
      if (entry.name === "node_modules") {
        const pkgDir = path.join(full, packageName);
        if (fs.existsSync(path.join(pkgDir, "package.json"))) found.add(pkgDir);
        continue;
      }
      walk(full, depth + 1);
    }
  };
  const store = path.join(STANDALONE, "node_modules", ".pnpm");
  if (fs.existsSync(store)) {
    for (const entry of fs.readdirSync(store, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      walk(path.join(store, entry.name), 0);
    }
  }
  const hoisted = path.join(STANDALONE, "node_modules", packageName);
  if (fs.existsSync(path.join(hoisted, "package.json"))) found.add(hoisted);
  return [...found];
}

/** The pristine package directory in the repository's pnpm store. */
function sourcePackageDir(packageName) {
  const base = path.join(REPO, "node_modules", ".pnpm");
  if (!fs.existsSync(base)) return null;
  const scope = packageName.replace("@", "").replace("/", "+");
  for (const entry of fs.readdirSync(base)) {
    if (!entry.startsWith(`${scope}@`)) continue;
    const dir = path.join(base, entry, "node_modules", packageName);
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
  }
  return null;
}

function processPackage(packageName) {
  const dirs = tracedPackageDirs(packageName);
  if (dirs.length === 0) {
    fail(
      `${packageName} is not present in the traced standalone tree. ` +
        "Run the Next.js build before this script, and re-derive the package list rather than guessing.",
    );
  }

  const sourceDir = sourcePackageDir(packageName);
  if (!sourceDir) {
    fail(`${packageName} is not installed in ${rel(path.join(REPO, "node_modules"))}.`);
  }
  const sourceManifest = JSON.parse(
    fs.readFileSync(path.join(sourceDir, "package.json"), "utf8"),
  );
  const targets = conditionTargets(sourceManifest.exports);
  if (targets.size === 0) {
    fail(`${packageName} has no conditional-export targets; the premise of this script changed.`);
  }

  let missing = 0;
  let copied = 0;

  for (const dir of dirs) {
    const manifestPath = path.join(dir, "package.json");
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const promised = conditionTargets(manifest.exports);

    for (const target of promised) {
      const dest = path.join(dir, target);
      if (fs.existsSync(dest)) continue;
      missing += 1;
      const src = path.join(sourceDir, target);
      if (!fs.existsSync(src)) {
        fail(`source file missing: ${rel(src)}`);
      }
      if (!VERIFY_ONLY) {
        fs.copyFileSync(src, dest);
        copied += 1;
        console.log(`[materialise]   copied ${target} -> ${rel(dest)}`);
      }
    }
  }

  if (missing > 0 && VERIFY_ONLY) {
    fail(
      `${missing} promised conditional-export target(s) are missing from the traced tree. ` +
        "Run this script without --verify before the OpenNext build.",
    );
  }

  console.log(
    `[materialise] ${packageName}@${sourceManifest.version}: ` +
      `${dirs.length} traced dir(s), ${missing} missing target(s), ${copied} copied`,
  );
  return { package: packageName, version: sourceManifest.version, dirs, missing, copied };
}

function main() {
  if (!fs.existsSync(STANDALONE)) {
    fail(
      `${rel(STANDALONE)} not found. Run "next build" before this script. ` +
        "If the standalone output has moved, update STANDALONE rather than guessing.",
    );
  }
  console.log(
    `[materialise] ${VERIFY_ONLY ? "verifying" : "materialising"} in ${rel(STANDALONE)}`,
  );
  for (const packageName of PACKAGES) processPackage(packageName);
  console.log("[materialise] done");
}

main();