#!/usr/bin/env node
/**
 * Verify the OpenNext packaged server functions can resolve their runtime deps.
 *
 * WHY
 *   The Next.js build passes while `opennextjs-cloudflare build` fails, because
 *   only the latter performs server-function bundling. Worse: when the copy
 *   step drops a dependency, the OpenNext build can still SUCCEED and only the
 *   deploy-time bundling fails. So neither the Next build nor the OpenNext build
 *   alone is a sufficient signal. This script is the executable assertion.
 *
 * HOW IT FAITHFULLY REPRODUCES THE PRODUCTION FAILURE
 *   Production failed at:
 *     .open-next/server-functions/default/node_modules/.pnpm/
 *       @libsql+hrana-client@0.10.0/node_modules/@libsql/hrana-client/lib-cjs/index.js:18
 *   i.e. esbuild resolved the dependency *relative to the file that requires
 *   it*. This script therefore locates every packaged file that requires or
 *   imports each watched dependency and resolves from THAT file's own location.
 *   A copy that exists but cannot be resolved from its requirer fails, exactly
 *   as it did in run 38960641361 / job 117174521770.
 *
 * MODES
 *   node scripts/verify-opennext-bundle.mjs            # verify real build output
 *   node scripts/verify-opennext-bundle.mjs --selftest # prove the assertion bites
 *
 * EXIT
 *   0 = every watched dependency resolves from every packaged requirer
 *   1 = at least one does not
 */

import {
  existsSync,
  readFileSync,
  readdirSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  copyFileSync,
} from "node:fs";
import { join, dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OPEN_NEXT = join(ROOT, "apps", "ai-institute", ".open-next");
const SERVER_FN = join(OPEN_NEXT, "server-functions", "default");

/**
 * Dependencies that must resolve from inside the packaged tree.
 *
 * `@libsql/isomorphic-ws` is the one that broke production:
 * `@libsql/hrana-client/lib-cjs/index.js` performs an UNCONDITIONAL top-level
 * `require("@libsql/isomorphic-ws")`, so it cannot be marked external — doing
 * so only moves the failure to Worker startup.
 */
const WATCHED = ["@libsql/isomorphic-ws", "@libsql/hrana-client"];

const SOURCE_EXT = /\.(mjs|cjs|js)$/;

/** Recursively list files under dir (bounded depth for safety). */
function listFiles(dir, maxDepth = 12) {
  const out = [];
  const walk = (d, depth) => {
    if (depth > maxDepth) return;
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) {
        // Skip symlinked dirs to avoid cycles; pnpm nests symlinks.
        try {
          if (e.isSymbolicLink()) continue;
        } catch {
          /* ignore */
        }
        walk(full, depth + 1);
      } else if (e.isFile() && SOURCE_EXT.test(e.name)) {
        out.push(full);
      }
    }
  };
  walk(dir, 0);
  return out;
}

/** Find files that statically reference a watched dependency. */
function findRequirers(files, dep) {
  const needle = dep;
  const found = [];
  for (const f of files) {
    let src;
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    // Match require("@libsql/x") / from "@libsql/x" / require('@libsql/x')
    const re = new RegExp(
      `(?:require\\(|from\\s*)\\s*['"]${needle.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&")}['"]`,
    );
    if (re.test(src)) found.push(f);
  }
  return found;
}

/** Resolve `spec` from the directory of `fromFile`, like esbuild would. */
function resolveFrom(fromFile, spec) {
  const req = createRequire(pathToFileURL(fromFile).href);
  try {
    return req.resolve(`${spec}/package.json`);
  } catch {
    try {
      return req.resolve(spec);
    } catch (e) {
      return { error: String(e.message).split("\n")[0] };
    }
  }
}

function describeVersion(resolvedPath) {
  let version = "unknown";
  let license = "unknown";
  const pkgPath = resolvedPath.endsWith("package.json")
    ? resolvedPath
    : join(resolvedPath, "package.json");
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    version = pkg.version ?? "unknown";
    license =
      typeof pkg.license === "string"
        ? pkg.license
        : JSON.stringify(pkg.license ?? "unknown");
  } catch {
    /* non-fatal */
  }
  return { version, license };
}

/**
 * Core check, parameterised by the packaged tree so --selftest can exercise it.
 * Returns { failures: [{dep, file, reason}], checked: n }
 */
function checkTree(treeDir, label) {
  const files = listFiles(treeDir);
  const failures = [];
  let checked = 0;

  for (const dep of WATCHED) {
    const requirers = findRequirers(files, dep);
    if (requirers.length === 0) {
      // Not referenced from the packaged tree: nothing to assert.
      continue;
    }
    for (const r of requirers) {
      checked++;
      const res = resolveFrom(r, dep);
      if (res && typeof res === "object" && res.error) {
        failures.push({
          dep,
          file: relative(treeDir, r),
          reason: `cannot resolve from the packaged requirer — ${res.error}`,
        });
        continue;
      }
      const abs = isAbsolute(res) ? res : resolve(r, res);
      const rel = relative(treeDir, abs);
      const inside = !rel.startsWith("..") && !isAbsolute(rel);
      if (!inside) {
        failures.push({
          dep,
          file: relative(treeDir, r),
          reason:
            `resolved OUTSIDE the packaged tree (${relative(ROOT, abs)}) — ` +
            `would pass locally and fail at deploy time`,
        });
      }
    }
  }
  return { failures, checked, files: files.length };
}

/* ----------------------------- selftest ------------------------------- */
function selftest() {
  // Recreate the exact production shape: hrana-client copied, its sibling
  // isomorphic-ws omitted.
  const tmp = mkdtempSync(join(tmpdir(), "opennext-selftest-"));
  try {
    const pkg = join(
      tmp,
      "node_modules",
      ".pnpm",
      "@libsql+hrana-client@0.10.0",
      "node_modules",
      "@libsql",
    );
    mkdirSync(join(pkg, "hrana-client", "lib-cjs"), { recursive: true });
    writeFileSync(
      join(pkg, "hrana-client", "package.json"),
      JSON.stringify({
        name: "@libsql/hrana-client",
        version: "0.10.0",
        main: "lib-cjs/index.js",
      }),
    );
    writeFileSync(
      join(pkg, "hrana-client", "lib-cjs", "index.js"),
      'const isomorphic_ws_1 = require("@libsql/isomorphic-ws");\nmodule.exports = { isomorphic_ws_1 };\n',
    );

    // Broken tree: the sibling isomorphic-ws is absent.
    const broken = checkTree(tmp, "broken");
    const brokenCaught = broken.failures.some(
      (f) => f.dep === "@libsql/isomorphic-ws",
    );
    console.log("SELFTEST — production-shaped tree with isomorphic-ws omitted");
    console.log(`  files scanned        : ${broken.files}`);
    console.log(`  resolution attempts  : ${broken.checked}`);
    console.log(`  failures detected    : ${broken.failures.length}`);
    for (const f of broken.failures) {
      console.log(`    FAIL ${f.dep}  (from ${f.file})`);
      console.log(`         ${f.reason}`);
    }

    // Now add the sibling back; the same check must pass.
    mkdirSync(join(pkg, "isomorphic-ws"), { recursive: true });
    writeFileSync(
      join(pkg, "isomorphic-ws", "package.json"),
      JSON.stringify({
        name: "@libsql/isomorphic-ws",
        version: "0.1.5",
        main: "index.js",
      }),
    );
    writeFileSync(
      join(pkg, "isomorphic-ws", "index.js"),
      "module.exports = { WebSocket: class {} };\n",
    );

    const fixed = checkTree(tmp, "fixed");
    console.log("\nSELFTEST — same tree with isomorphic-ws present");
    console.log(`  failures detected    : ${fixed.failures.length}`);
    for (const f of fixed.failures)
      console.log(`    FAIL ${f.dep} — ${f.reason}`);

    const ok = brokenCaught && fixed.failures.length === 0;
    console.log(
      `\nSELFTEST RESULT: ${ok ? "PASS" : "FAIL"} — ` +
        `assertion detects the production condition (${brokenCaught ? "yes" : "no"}) ` +
        `and passes when the package is present (${fixed.failures.length === 0 ? "yes" : "no"})`,
    );
    return ok;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/* ------------------------------- main --------------------------------- */
if (process.argv.includes("--selftest")) {
  process.exit(selftest() ? 0 : 1);
}

console.log("OpenNext packaged-bundle verification");
if (!existsSync(SERVER_FN)) {
  console.error(
    `\nFAIL: OpenNext output not found at ${relative(ROOT, SERVER_FN)}`,
  );
  console.error(
    `      Run: pnpm --filter ai-institute exec opennextjs-cloudflare build\n`,
  );
  process.exit(1);
}

const result = checkTree(SERVER_FN, "real");
console.log(`  packaged tree : ${relative(ROOT, SERVER_FN)}`);
console.log(`  files scanned : ${result.files}`);
console.log(`  resolution attempts : ${result.checked}`);
console.log(`  watching      : ${WATCHED.join(", ")}`);
console.log("");

if (result.failures.length > 0) {
  console.error(
    "FAIL — a packaged server function cannot resolve a runtime dependency:\n",
  );
  for (const f of result.failures) {
    console.error(`  ${f.dep}`);
    console.error(`    required by : ${f.file}`);
    console.error(`    reason      : ${f.reason}`);
  }
  console.error(
    "\nThis is the condition that broke the Cloudflare deploy on 2026-10-16\n" +
      "(run 38960641361, job 117174521770): OpenNext copied @libsql/hrana-client into\n" +
      ".open-next/server-functions/default/node_modules but not its sibling\n" +
      "@libsql/isomorphic-ws, so esbuild could not resolve the require.\n" +
      "\nDo NOT mark it external: @libsql/hrana-client/lib-cjs/index.js requires it\n" +
      "unconditionally at top level, so externalising only moves the failure to\n" +
      "Worker startup.",
  );
  process.exit(1);
}

console.log(
  "PASS — every watched runtime dependency resolves from its packaged requirer.",
);
