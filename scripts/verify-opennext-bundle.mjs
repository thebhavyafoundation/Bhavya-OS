#!/usr/bin/env node
/**
 * Verify the OpenNext packaged server function can resolve its runtime deps.
 *
 * WHY
 *   The Next.js build passes while `opennextjs-cloudflare build` fails, because
 *   only the latter performs server-function bundling. This script is the
 *   executable assertion for that second stage, so the gap is caught on a pull
 *   request rather than during a production deploy.
 *
 * WHAT IT CHECKS
 *   1. The default server function exists and has been packaged.
 *   2. Each required runtime dependency resolves *from inside the packaged
 *      tree* — not by walking up into the monorepo's node_modules, which would
 *      be a false pass and would break again at deploy time.
 *   3. It reports resolved version, path and licence for each dependency.
 *
 * EXIT
 *   0 = every dependency resolves from the packaged tree
 *   1 = at least one does not (prints what is missing and why it matters)
 *
 * Usage: node scripts/verify-opennext-bundle.mjs
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OPEN_NEXT = join(ROOT, "apps", "ai-institute", ".open-next");
const SERVER_FN = join(OPEN_NEXT, "server-functions", "default");

/**
 * Dependencies the default server function must be able to resolve at runtime.
 *
 * `@libsql/isomorphic-ws` is the one that broke production deployment:
 * `@libsql/hrana-client/lib-cjs/index.js` performs an UNCONDITIONAL top-level
 * `require("@libsql/isomorphic-ws")`, so omitting it is a hard failure — it
 * cannot be marked external to make it go away.
 */
const REQUIRED = [
  {
    name: "@libsql/isomorphic-ws",
    reason:
      "unconditional top-level require from @libsql/hrana-client/lib-cjs/index.js; " +
      "Turso/libSQL cannot initialise without it",
  },
  {
    name: "@libsql/hrana-client",
    reason: "HTTP/SQL transport used by @libsql/client for remote Turso",
  },
];

function fail(msg) {
  console.error(`\nFAIL: ${msg}\n`);
  process.exit(1);
}

// --- locate the packaged server function --------------------------------
if (!existsSync(SERVER_FN)) {
  fail(
    `OpenNext output not found at ${relative(ROOT, SERVER_FN)}.\n` +
      `      Run: pnpm --filter ai-institute exec opennextjs-cloudflare build`,
  );
}

// Find the packaged entry point. OpenNext emits one or more .mjs entry files.
function findEntry(dir) {
  const candidates = [];
  const walk = (d, depth) => {
    if (depth > 3) return;
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) walk(full, depth + 1);
      else if (/\.(mjs|cjs|js)$/.test(e.name)) candidates.push(full);
    }
  };
  walk(dir, 0);
  // Prefer files named like an entry, otherwise take the shallowest.
  candidates.sort((a, b) => {
    const named = (s) => (/^(handler|index|server|entry|main)\./.test(s) ? 0 : 1);
    return named(a) - named(b) || a.split(/[\\/]/).length - b.split(/[\\/]/).length;
  });
  return candidates[0] ?? null;
}

const entry = findEntry(SERVER_FN);
if (!entry) {
  fail(
    `No packaged entry file (.mjs/.cjs/.js) found under ${relative(ROOT, SERVER_FN)}. ` +
      `The OpenNext build may not have produced a server function.`,
  );
}

console.log("OpenNext bundle verification");
console.log(`  packaged tree : ${relative(ROOT, SERVER_FN)}`);
console.log(`  entry point    : ${relative(ROOT, entry)}`);

// --- resolution scoped to the packaged tree ------------------------------
// createRequire anchored at the packaged entry so Node resolves from there.
const packagedRequire = createRequire(pathToFileURL(entry).href);

let failed = 0;
const rows = [];

for (const dep of REQUIRED) {
  let resolved = null;
  let error = null;
  try {
    resolved = packagedRequire.resolve(`${dep.name}/package.json`);
  } catch (e) {
    try {
      resolved = packagedRequire.resolve(dep.name);
    } catch (e2) {
      error = e2.message.split("\n")[0];
    }
  }

  if (!resolved) {
    failed++;
    rows.push({ dep: dep.name, ok: false, detail: `UNRESOLVED — ${error}` });
    continue;
  }

  // Critical: it must resolve INSIDE the packaged tree. A resolution that
  // escapes to the monorepo node_modules would work locally and fail on deploy.
  const resolvedAbs = isAbsolute(resolved) ? resolved : resolve(entry, resolved);
  const relToPackaged = relative(SERVER_FN, resolvedAbs);
  const insidePackaged = !relToPackaged.startsWith("..") && !isAbsolute(relToPackaged);

  if (!insidePackaged) {
    failed++;
    rows.push({
      dep: dep.name,
      ok: false,
      detail: `resolved OUTSIDE the packaged tree (${relative(ROOT, resolvedAbs)}) — ` +
        `this would fail at deploy time`,
    });
    continue;
  }

  // Read version + licence when the package.json is reachable.
  let version = "unknown";
  let license = "unknown";
  const pkgJson = resolved.endsWith("package.json") ? resolved : join(resolved, "package.json");
  try {
    const pkg = JSON.parse(readFileSync(pkgJson, "utf8"));
    version = pkg.version ?? "unknown";
    license = typeof pkg.license === "string" ? pkg.license : JSON.stringify(pkg.license ?? "unknown");
  } catch {
    // Non-fatal: still resolved, which is what we assert on.
  }

  rows.push({ dep: dep.name, ok: true, detail: `v${version}  license=${license}  ${relToPackaged}` });
}

console.log("");
for (const r of rows) {
  console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.dep}`);
  console.log(`        ${r.detail}`);
}

// --- explain failures with the reason each dependency is required ---------
if (failed > 0) {
  console.error("\nReasons these are required:");
  for (const dep of REQUIRED) {
    const row = rows.find((r) => r.dep === dep.name);
    if (row && !row.ok) console.error(`  - ${dep.name}: ${dep.reason}`);
  }
  console.error(
    "\nThis is the condition that broke the Cloudflare deploy on 2026-10-16\n" +
      "(run 38960641361, job 117174521770): OpenNext copied @libsql/hrana-client\n" +
      "into .open-next/server-functions/default/node_modules but not its\n" +
      "sibling @libsql/isomorphic-ws, so esbuild could not resolve it.\n" +
      "\nDo NOT mark it external: the require is top-level and unconditional, so\n" +
      "externalising would move this failure to Worker startup instead.",
  );
  process.exit(1);
}

console.log(`\nRESULT: PASS (${rows.length}/${rows.length} runtime dependencies resolve from the packaged tree)`);