#!/usr/bin/env node
/**
 * Restore the pnpm private dependency layout inside a traced or packaged tree.
 *
 * WHY THIS EXISTS
 *   Next.js output file tracing records the real path of every traced file, so
 *   a dependency that is reached through a pnpm symlink is recorded at the
 *   virtual store location, for example
 *     node_modules/.pnpm/ws@8.21.3/node_modules/ws/...
 *   It never reproduces the symlinked private directory that pnpm creates
 *   next to the package that needs it, for example
 *     node_modules/.pnpm/@libsql+hrana-client@0.10.0/node_modules/ws
 *
 *   Node resolves a bare specifier by walking up from the requiring file, so
 *   a require of "ws" from
 *     .pnpm/@libsql+hrana-client@0.10.0/node_modules/@libsql/isomorphic-ws/node.cjs
 *   looks in
 *     .../@libsql/isomorphic-ws/node_modules
 *     .../@libsql/node_modules
 *     .../@libsql+hrana-client@0.10.0/node_modules   <-- the private dir
 *     .../@libsql+hrana-client@0.10.0
 *     .../.pnpm/node_modules
 *   None of those exist in the traced tree, so the require cannot resolve,
 *   even though the package itself was traced.
 *
 *   This script puts the missing package in the private directory that Node
 *   will look in, copying it from the repository's pnpm store, which is the
 *   same layout pnpm itself would create.
 *
 * SCOPE
 *   Only packages that a traced package declares as a dependency or an
 *   optional dependency, and that cannot already be resolved from the
 *   requiring package, are copied. Nothing is deleted and nothing outside
 *   the given tree is written.
 *
 * USAGE
 *   node scripts/restore-dependency-layout.mjs <tree-root>
 *
 * SAFETY
 *   - Idempotent: an existing package directory is left untouched.
 *   - Refuses to run when the tree does not exist.
 *   - Never deletes, never overwrites an existing package.
 *   - Copies only the package directory that pnpm itself would place there.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const STORE = path.join(REPO, "node_modules", ".pnpm");

const treeRoot = process.argv[2];
if (!treeRoot) {
  console.error("[layout] usage: node restore-dependency-layout.mjs <tree-root>");
  process.exit(1);
}
const TREE = path.resolve(treeRoot);
if (!fs.existsSync(TREE)) {
  console.error(`[layout] FAIL: ${path.relative(REPO, TREE)} does not exist`);
  process.exit(1);
}

const fail = (msg) => {
  console.error(`[layout] FAIL: ${msg}`);
  process.exit(1);
};

/** Every package directory under a node_modules directory, scoped names included. */
function packageDirs(nodeModules) {
  const found = [];
  let entries;
  try {
    entries = fs.readdirSync(nodeModules, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const full = path.join(nodeModules, entry.name);
    if (entry.name.startsWith("@")) {
      let scoped;
      try {
        scoped = fs.readdirSync(full, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const inner of scoped) {
        if (!inner.isDirectory()) continue;
        const pkgDir = path.join(full, inner.name);
        if (fs.existsSync(path.join(pkgDir, "package.json"))) found.push(pkgDir);
      }
      continue;
    }
    if (fs.existsSync(path.join(full, "package.json"))) found.push(full);
  }
  return found;
}

/** The pnpm virtual store directory that owns a package directory. */
function owningStoreDir(pkgDir) {
  let dir = path.dirname(pkgDir);
  while (dir !== path.dirname(dir)) {
    const name = path.basename(dir);
    if (/@[^@/]*\+[^@/]*@/.test(name) || /^[^@/]+@[^@/]+$/.test(name)) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

/** The private node_modules directory pnpm gives a package. */
function privateModulesDir(pkgDir) {
  const storeDir = owningStoreDir(pkgDir);
  if (!storeDir) return null;
  return path.join(storeDir, "node_modules");
}

/** The package directory in the repository's pnpm store. */
function storePackageDir(name, version) {
  if (!fs.existsSync(STORE)) return null;
  const scope = name.replace("/", "+");
  for (const entry of fs.readdirSync(STORE)) {
    if (!entry.startsWith(`${scope}@`)) continue;
    if (version && !entry.endsWith(`@${version}`)) continue;
    const dir = path.join(STORE, entry, "node_modules", name);
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
  }
  return null;
}

function resolvableFrom(fromFile, spec) {
  try {
    const req = createRequire(fromFile);
    req.resolve(spec);
    return true;
  } catch {
    return false;
  }
}

function copyPackage(srcDir, destDir) {
  fs.mkdirSync(path.dirname(destDir), { recursive: true });
  fs.cpSync(srcDir, destDir, { recursive: true, force: false, errorOnExist: false });
}

function main() {
  const storeDir = path.join(TREE, "node_modules", ".pnpm");
  if (!fs.existsSync(storeDir)) {
    fail(`${path.relative(REPO, storeDir)} not found under ${path.relative(REPO, TREE)}`);
  }

  const pkgs = [];
  for (const entry of fs.readdirSync(storeDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    pkgs.push(...packageDirs(path.join(storeDir, entry.name, "node_modules")));
  }

  let copied = 0;
  let checked = 0;

  for (const pkgDir of pkgs) {
    const manifestPath = path.join(pkgDir, "package.json");
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch {
      continue;
    }
    const deps = {
      ...(manifest.dependencies ?? {}),
      ...(manifest.optionalDependencies ?? {}),
    };
    const privateDir = privateModulesDir(pkgDir);
    if (!privateDir) continue;

    for (const [name, range] of Object.entries(deps)) {
      if (name.startsWith("@bhavya/")) continue;
      checked += 1;
      const probe = path.join(pkgDir, "package.json");
      if (resolvableFrom(probe, name)) continue;

      const dest = path.join(privateDir, name);
      if (fs.existsSync(path.join(dest, "package.json"))) continue;

      const version = String(range).replace(/^[\^~>=<\s]*/, "").split(" ")[0];
      const src = storePackageDir(name, version) ?? storePackageDir(name, null);
      if (!src) continue;

      copyPackage(src, dest);
      copied += 1;
      console.log(`[layout]   restored ${name} -> ${path.relative(REPO, dest)}`);
    }
  }

  console.log(
    `[layout] ${path.relative(REPO, TREE)}: ${pkgs.length} package dir(s), ${checked} dependency check(s), ${copied} restored`,
  );
}

main();