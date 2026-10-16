#!/usr/bin/env node
/**
 * Verify the OpenNext packaged server functions can resolve their runtime deps.
 *
 * WHY
 *   The Next.js build passes while `opennextjs-cloudflare build` fails, because
 *   only the latter performs server-function bundling. Worse: when the copy
 *   step drops a dependency or its entry file, the OpenNext build can still
 *   SUCCEED and only deploy-time bundling fails. Neither build alone is a
 *   sufficient signal, so this is the executable assertion.
 *
 * HOW IT FAITHFULLY REPRODUCES THE PRODUCTION FAILURE
 *   Production failed at:
 *     .open-next/server-functions/default/node_modules/.pnpm/
 *       @libsql+hrana-client@0.10.0/node_modules/@libsql/hrana-client/lib-cjs/index.js:18
 *   i.e. esbuild resolved the dependency relative to the file that requires it.
 *   So this script locates every packaged file that requires or imports each
 *   watched dependency and resolves from THAT file's own location.
 *
 * WHY THE BARE SPECIFIER IS RESOLVED FIRST
 *   An earlier version preferred `<spec>/package.json`. That was too weak:
 *   file tracing copies package.json even when it fails to copy the entry files
 *   the package's `exports` map points at. That verifier reported PASS while
 *   the real deploy failed with:
 *     "Could not resolve @libsql/isomorphic-ws"
 *     at .../isomorphic-ws/package.json
 * Resolving the bare specifier makes Node apply the exports map and return the
 * actual runtime entry file, which is what must exist.
 *
 * MODES
 *   node scripts/verify-opennext-bundle.mjs            # verify real build output
 *   node scripts/verify-opennext-bundle.mjs --selftest # prove the assertion bites
 *
 * EXIT
 *   0 = every watched dependency resolves to a real file inside the packaged tree
 *   1 = at least one does not
 */

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  writeFileSync,
  mkdtempSync,
  rmSync,
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

/** Recursively list source files under dir (bounded depth for safety). */
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
        if (e.isSymbolicLink()) continue; // avoid cycles through pnpm symlinks
        walk(full, depth + 1);
      } else if (e.isFile() && SOURCE_EXT.test(e.name)) {
        out.push(full);
      }
    }
  };
  walk(dir, 0);
  return out;
}

/** Find packaged files that statically reference a watched dependency. */
function findRequirers(files, dep) {
  const escaped = dep.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");
  const re = new RegExp(`(?:require\\(|from\\s*)\\s*['"]${escaped}['"]`);
  const found = [];
  for (const f of files) {
    let src;
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    if (re.test(src)) found.push(f);
  }
  return found;
}

/**
 * Resolve `spec` from the directory of `fromFile`, the way esbuild does.
 * Bare specifier first so the package `exports` map is honoured.
 */
function resolveFrom(fromFile, spec) {
  const req = createRequire(pathToFileURL(fromFile).href);
  const errors = [];
  for (const candidate of [spec, `${spec}/package.json`]) {
    try {
      const resolved = req.resolve(candidate);
      if (candidate === spec) return resolved;
      if (existsSync(resolved)) return resolved;
      errors.push(`${candidate} resolved to a non-existent path`);
    } catch (e) {
      errors.push(`${candidate}: ${String(e.message).split("\n")[0]}`);
    }
  }
  return { error: errors.join(" | ") };
}

/** True only when the resolved path is a real file on disk. */
function isRealFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

/**
 * Core check, parameterised by the packaged tree so --selftest can exercise it.
 */
function checkTree(treeDir) {
  const files = listFiles(treeDir);
  const failures = [];
  let checked = 0;

  for (const dep of WATCHED) {
    const requirers = findRequirers(files, dep);
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
        continue;
      }

      // Must be a REAL FILE. A package.json that survives tracing while the
      // exports-map entry file does not is exactly the 2026-10-16 defect.
      if (!isRealFile(abs)) {
        failures.push({
          dep,
          file: relative(treeDir, r),
          reason:
            `resolved to ${rel}, which is not a file in the packaged tree — ` +
            `package.json was traced but its exports-map entry file was not`,
        });
      }
    }
  }
  return { failures, checked, files: files.length };
}

/* ----------------------------- selftest ------------------------------- */

/**
 * Build one INDEPENDENT pnpm-shaped fixture. Separate temp tree per scenario
 * so no Node resolution state or leftover file can leak between cases.
 *
 * mode:
 *   "missing"   hrana-client present, sibling isomorphic-ws absent
 *   "no-entry"  isomorphic-ws package.json present but entry file absent
 *   "complete"  isomorphic-ws fully present
 */
function buildFixture(mode) {
  const tmp = mkdtempSync(join(tmpdir(), "opennext-selftest-"));
  const ns = join(
    tmp,
    "node_modules",
    ".pnpm",
    "@libsql+hrana-client@0.10.0",
    "node_modules",
    "@libsql",
  );
  mkdirSync(join(ns, "hrana-client", "lib-cjs"), { recursive: true });
  writeFileSync(
    join(ns, "hrana-client", "package.json"),
    JSON.stringify({
      name: "@libsql/hrana-client",
      version: "0.10.0",
      main: "lib-cjs/index.js",
    }),
  );
  writeFileSync(
    join(ns, "hrana-client", "lib-cjs", "index.js"),
    'const isomorphic_ws_1 = require("@libsql/isomorphic-ws");\n' +
      "module.exports = { isomorphic_ws_1 };\n",
  );

  if (mode !== "missing") {
    mkdirSync(join(ns, "isomorphic-ws"), { recursive: true });
    writeFileSync(
      join(ns, "isomorphic-ws", "package.json"),
      // Mirrors the real package: a nested conditional `exports` map with no
      // "./package.json" subpath. Without `exports`, a resolver could fall back
      // to <spec>/package.json and mask the missing entry file, which is exactly
      // the weakness that let the original verifier pass a broken tree.
      JSON.stringify({
        name: "@libsql/isomorphic-ws",
        version: "0.1.5",
        main: "index.js",
        exports: {
          ".": {
            import: {
              workerd: "./web.mjs",
              node: "./node.mjs",
              default: "./web.mjs",
            },
            require: {
              workerd: "./web.cjs",
              node: "./node.cjs",
              default: "./web.cjs",
            },
          },
        },
      }),
    );
    if (mode === "complete") {
      // Match the real package's CJS entry for the `require` condition.
      writeFileSync(
        join(ns, "isomorphic-ws", "node.cjs"),
        "module.exports = { WebSocket: class {} };\n",
      );
    }
  }
  return tmp;
}

function selftest() {
  const scenarios = [
    {
      mode: "missing",
      label: "isomorphic-ws absent from the packaged tree",
      mustCatch: true,
    },
    {
      mode: "no-entry",
      label: "isomorphic-ws package.json present but entry file missing",
      mustCatch: true,
    },
    {
      mode: "complete",
      label: "isomorphic-ws fully packaged",
      mustCatch: false,
    },
  ];

  let allOk = true;
  for (const s of scenarios) {
    const tmp = buildFixture(s.mode);
    try {
      const r = checkTree(tmp);
      const depFailures = r.failures.filter(
        (f) => f.dep === "@libsql/isomorphic-ws",
      );
      const caught = depFailures.length > 0;
      const correct = caught === s.mustCatch;
      if (!correct) allOk = false;
      console.log("");
      console.log(`SELFTEST - ${s.label}`);
      console.log(`  files scanned : ${r.files}`);
      console.log(`  failures      : ${r.failures.length}`);
      console.log(
        `  expectation   : ${s.mustCatch ? "must be detected" : "must be clean"} -> ${correct ? "OK" : "WRONG"}`,
      );
      for (const f of r.failures) {
        console.log(`    FAIL ${f.dep}`);
        console.log(`         ${f.reason}`);
      }
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }

  console.log("");
  console.log(
    `SELFTEST RESULT: ${allOk ? "PASS" : "FAIL"} - the assertion flags every incomplete packaging state and accepts a complete one.`,
  );
  return allOk;
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
    "      Run: pnpm --filter ai-institute exec opennextjs-cloudflare build\n",
  );
  process.exit(1);
}

const result = checkTree(SERVER_FN);
console.log(`  packaged tree : ${relative(ROOT, SERVER_FN)}`);
console.log(`  files scanned : ${result.files}`);
console.log(`  resolution attempts : ${result.checked}`);
console.log(`  watching      : ${WATCHED.join(", ")}`);
console.log("");

if (result.failures.length > 0) {
  console.error(
    "FAIL - a packaged server function cannot resolve a runtime dependency:\n",
  );
  for (const f of result.failures) {
    console.error(`  ${f.dep}`);
    console.error(`    required by : ${f.file}`);
    console.error(`    reason      : ${f.reason}`);
  }
  console.error(
    "\nThis is the condition that broke the Cloudflare deploy on 2026-10-16\n" +
      "(run 38960641361, job 117174521770) and again on 2026-10-17\n" +
      "(run 38971756373, job 117211539568): OpenNext copied\n" +
      "@libsql/hrana-client into .open-next/server-functions/default/node_modules but\n" +
      "not a usable @libsql/isomorphic-ws entry file, so esbuild could not resolve\n" +
      "the require.\n" +
      "\nDo NOT mark it external: @libsql/hrana-client/lib-cjs/index.js requires it\n" +
      "unconditionally at top level, so externalising only moves the failure to\n" +
      "Worker startup.",
  );
  process.exit(1);
}

console.log(
  "PASS - every watched runtime dependency resolves to a real file inside the packaged tree.",
);
