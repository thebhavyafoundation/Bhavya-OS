// DIAGNOSTIC ONLY. Read-only with respect to the repository and to any
// remote. Runs the exact production-equivalent OpenNext build command and then
// inspects what it produced.
//
// It answers one question: when esbuild fails with
// "Could not resolve @libsql/isomorphic-ws", what actually exists on disk in
// the tree esbuild is bundling from?
//
// It never deploys, never reads Cloudflare credentials, and never contacts
// production.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const APP = path.resolve(process.cwd());
const OUT = path.resolve(APP, ".open-next");
const REPORT = path.resolve(APP, "..", "..", "opennext-diagnose");

const FN = path.join(OUT, "server-functions", "default");
const NM = path.join(FN, "node_modules");

const findings = [];
const say = (k, v) => findings.push({ check: k, result: v });

fs.mkdirSync(REPORT, { recursive: true });

// ---------------------------------------------------------------- build ----
// pipefail semantics: we WANT the failure, we do not want to stop on it.
console.log("[diagnose] running: npx opennextjs-cloudflare build");
const started = Date.now();
let buildExit = 0;
let buildLog = "";
try {
  buildLog = execSync("npx opennextjs-cloudflare build 2>&1", {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (e) {
  buildExit = e.status ?? -1;
  buildLog = `${e.stdout ?? ""}${e.stderr ?? ""}`;
}
fs.writeFileSync(path.join(REPORT, "build.log"), buildLog ?? "");
console.log(`[diagnose] build exit=${buildExit} in ${((Date.now() - started) / 1000).toFixed(0)}s`);

say("build.exitCode", String(buildExit));
say("build.failedWithCouldNotResolve", /Could not resolve "@libsql\/isomorphic-ws"/.test(buildLog) ? "YES" : "NO");
say("build.failedOnHranaClientLibCjs", /hrana-client\/lib-cjs\/index\.js:18/.test(buildLog) ? "YES" : "NO");

// --------------------------------------------------------- tree existence ----
say("serverFunctions.default.exists", fs.existsSync(FN) ? "YES" : "NO");
say("node_modules.exists", fs.existsSync(NM) ? "YES" : "NO");

const exists = (p) => fs.existsSync(p);
const isLink = (p) => {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
};
const readLink = (p) => {
  try {
    return fs.readlinkSync(p);
  } catch {
    return null;
  }
};

// Flat layout (what a successful pre-bundle install would produce)
const flat = path.join(NM, "@libsql");
say("layout.flat.node_modules_@libsql.exists", exists(flat) ? "YES" : "NO");
say("layout.flat.isomorphic-ws.exists", exists(path.join(flat, "isomorphic-ws")) ? "YES" : "NO");
say(
  "layout.flat.isomorphic-ws.isSymlink",
  isLink(path.join(flat, "isomorphic-ws")) ? `YES -> ${readLink(path.join(flat, "isomorphic-ws"))}` : "NO",
);

// pnpm store layout
const store = path.join(NM, ".pnpm");
say("layout.pnpmStore.exists", exists(store) ? "YES" : "NO");
if (exists(store)) {
  const entries = fs.readdirSync(store).filter((e) => e.startsWith("@libsql") || e.startsWith("ws@"));
  say("layout.pnpmStore.libsqlEntries", entries.length ? entries.join(", ") : "(none)");
}

// The specific resolution site from the error
const hrana = path.join(store, "@libsql+hrana-client@0.10.0", "node_modules", "@libsql", "hrana-client");
say("site.hranaClient.exists", exists(hrana) ? "YES" : "NO");

const sibling = path.join(
  store, "@libsql+hrana-client@0.10.0", "node_modules", "@libsql", "isomorphic-ws",
);
say("site.siblingSymlink.exists", exists(sibling) ? "YES" : "NO");
say("site.siblingSymlink.isSymlink", isLink(sibling) ? "YES" : "NO");
say("site.siblingSymlink.target", String(readLink(sibling)));
say("site.siblingSymlink.resolves", exists(sibling) ? "YES" : "NO");

// Is the symlink target directory present anywhere in the copied store?
if (exists(store)) {
  const iso = fs.readdirSync(store).filter((e) => e.startsWith("@libsql+isomorphic-ws"));
  say("store.isomorphicWsDirCopied", iso.length ? iso.join(", ") : "ABSENT — this is why resolution fails");
  if (iso.length) {
    const p = path.join(store, iso[0], "node_modules", "@libsql", "isomorphic-ws");
    say("store.isomorphicWsHasNodeCjs", exists(path.join(p, "node.cjs")) ? "YES" : "NO");
    say("store.isomorphicWsHasWebCjs", exists(path.join(p, "web.cjs")) ? "YES" : "NO");
  }
}

// Is the package present in SOURCE node_modules (proving install was fine)?
const srcIso = path.resolve(APP, "..", "..", "node_modules", ".pnpm");
say(
  "source.pnpmStoreHasIsomorphicWs",
  exists(srcIso)
    ? fs.readdirSync(srcIso).filter((e) => e.startsWith("@libsql+isomorphic-ws")).join(", ") || "ABSENT"
    : "source store not found",
);

// ---------------------------------------------------------------------------
// WHICH COPY DROPS THE FILE?
//
// Two candidate copy stages exist:
//   A) Next.js output file tracing  -> .next/standalone/node_modules/
//   B) OpenNext                    -> .open-next/server-functions/default/node_modules/
//
// Comparing the same package directory in both splits the problem definitively.
// If web.cjs is already absent in A, the tracer dropped it and OpenNext is
// faithful. If it is present in A but absent in B, OpenNext dropped it.
// ---------------------------------------------------------------------------
const probe = (label, base) => {
  if (!exists(base)) {
    say(`${label}.exists`, "NO");
    return;
  }
  say(`${label}.exists`, "YES");
  const storeDir = path.join(base, ".pnpm");
  const direct = path.join(base, "@libsql", "isomorphic-ws");
  const roots = [];
  if (exists(storeDir)) {
    for (const e of fs.readdirSync(storeDir)) {
      if (e.startsWith("@libsql+isomorphic-ws")) roots.push(path.join(storeDir, e, "node_modules", "@libsql", "isomorphic-ws"));
    }
  }
  if (exists(direct)) roots.push(direct);
  if (!roots.length) {
    say(`${label}.isomorphicWs`, "ABSENT");
    return;
  }
  for (const r of roots) {
    const tag = `${label}.[${path.basename(path.dirname(path.dirname(path.dirname(r))))}]`;
    for (const f of ["package.json", "node.cjs", "node.mjs", "web.cjs", "web.mjs"]) {
      say(`${tag}.${f}`, exists(path.join(r, f)) ? "PRESENT" : "ABSENT");
    }
  }
};

const STANDALONE = path.join(APP, ".next", "standalone");
probe("stageA.nextStandalone", path.join(STANDALONE, "node_modules"));
probe("stageB.openNextServerFn", NM);
say("stageA.nextStandaloneRoot.exists", exists(STANDALONE) ? "YES" : "NO");

// ------------------------------------------------------------ artefacts ----
const lines = [];
const walk = (dir, depth, acc) => {
  if (depth > 5 || acc.length > 4000) return acc;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (acc.length > 4000) break;
    const full = path.join(dir, e.name);
    const rel = path.relative(OUT, full);
    if (e.isSymbolicLink()) acc.push(`${rel} -> ${fs.readlinkSync(full)}`);
    else if (e.isDirectory()) {
      acc.push(`${rel}/`);
      walk(full, depth + 1, acc);
    } else acc.push(`${rel} (${fs.statSync(full).size}b)`);
  }
  return acc;
};
if (exists(NM)) {
  const tree = walk(NM, 0, []);
  lines.push(...tree);
  fs.writeFileSync(path.join(REPORT, "node_modules.tree.txt"), lines.join("\n"));
  say("artefact.node_modulesEntryCount", String(tree.length));
}

// server function package.json
const fnPkg = path.join(FN, "package.json");
if (exists(fnPkg)) {
  fs.copyFileSync(fnPkg, path.join(REPORT, "server-function-package.json"));
  say("artefact.serverFunctionPackageJson", "captured");
}

fs.writeFileSync(path.join(REPORT, "findings.json"), JSON.stringify(findings, null, 2));
for (const f of findings) console.log(`[diagnose] ${f.check} = ${f.result}`);
console.log("[diagnose] artefacts written to opennext-diagnose/");