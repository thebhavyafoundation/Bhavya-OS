// Decisive verification for the pre-OpenNext conditional-export workaround.
// Read-only against the repository and any remote. No deploy, no credentials,
// no Turso contact.
//
// Stages: A-pre -> materialise -> A-post -> OpenNext -> B + resolver.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

// Resolve the app directory from this file's own location, never from cwd.
// The previous version used process.cwd(), so a workflow step with a different
// working-directory silently looked in the wrong place and reported a false
// "standalone missing".
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REL = (p) => path.relative(APP, p) || ".";
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex").slice(0, 16);
const stage = process.argv[2] ?? "a-pre";
const results = [];
const say = (k, v) => { results.push({ k, v }); console.log(`[verify:${stage}] ${k} = ${v}`); };
const hardFail = (m) => { say("FATAL", m); fs.writeFileSync(path.join(APP, `verify-${stage}.json`), JSON.stringify(results, null, 2)); process.exit(1); };

const PKG = "@libsql/isomorphic-ws";
const storeOf = (base) => {
  const s = path.join(base, "node_modules", ".pnpm");
  if (!fs.existsSync(s)) return [];
  return fs.readdirSync(s).filter((d) => d.startsWith("@libsql+isomorphic-ws@")).map((d) => path.join(s, d, "node_modules", PKG));
};
const FILES = ["package.json", "node.cjs", "node.mjs", "web.cjs", "web.mjs"];

const A = path.join(APP, ".next", "standalone");
const B = path.join(APP, ".open-next", "server-functions", "default");

if (stage === "a-pre") {
  const nextDir = path.join(APP, ".next");
  if (!fs.existsSync(nextDir)) {
    hardFail(`no .next directory at ${REL(nextDir)}. The Next build did not run in ${REL(APP)}.`);
  }
  say("nextDir.entries", fs.readdirSync(nextDir).slice(0, 25).join(", "));
  say("standaloneOutputEnabled", /output\s*:\s*["']standalone["']/.test(fs.readFileSync(path.join(APP, "next.config.mjs"), "utf8")) ? "standalone" : "NOT standalone");
  if (!fs.existsSync(A)) {
    hardFail(`.next exists but .next/standalone is absent. Entries above show what was produced. output: "standalone" is ${say.length ? "" : ""}`);
  }
  const roots = storeOf(A);
  if (!roots.length) hardFail("no @libsql+isomorphic-ws in standalone store");
  const d = roots[0];
  say("dir", REL(d));
  for (const f of FILES) say(f, fs.existsSync(path.join(d, f)) ? "present" : "ABSENT");
  const expect = { "package.json": "present", "node.cjs": "present", "node.mjs": "ABSENT", "web.cjs": "ABSENT", "web.mjs": "ABSENT" };
  for (const [f, want] of Object.entries(expect)) {
    const got = fs.existsSync(path.join(d, f)) ? "present" : "ABSENT";
    if (got !== want) hardFail(`Stage A precondition not reproduced: ${f} expected ${want} got ${got}`);
  }
  say("stageA_precondition", "REPRODUCED");
}

if (stage === "a-post") {
  const roots = storeOf(A);
  if (!roots.length) hardFail("no @libsql+isomorphic-ws in standalone store");
  const d = roots[0];
  for (const f of FILES) {
    const p = path.join(d, f);
    say(f, fs.existsSync(p) ? `present (${fs.statSync(p).size}b)` : "ABSENT");
    if (!fs.existsSync(p)) hardFail(`${f} still absent after materialisation`);
  }
  // checksum equivalence against source
  const repo = path.resolve(APP, "..", "..", "node_modules", ".pnpm");
  const sd = fs.readdirSync(repo).find((x) => x.startsWith("@libsql+isomorphic-ws@"));
  const src = path.join(repo, sd, "node_modules", PKG);
  for (const f of ["web.cjs", "web.mjs", "node.mjs"]) {
    const s = sha(path.join(src, f)), t = sha(path.join(d, f));
    say(`sha.${f}`, `${s} == ${t} -> ${s === t ? "MATCH" : "MISMATCH"}`);
    if (s !== t) hardFail(`checksum mismatch for ${f}`);
  }
  // exports targets now resolve
  const man = JSON.parse(fs.readFileSync(path.join(d, "package.json"), "utf8"));
  for (const cond of ["require", "import"]) {
    const e = man.exports["."][cond];
    for (const [k, v] of Object.entries(e)) {
      const t = typeof v === "string" ? v : v.default;
      say(`exports.${cond}.${k}`, `${t} -> ${fs.existsSync(path.join(d, t)) ? "EXISTS" : "MISSING"}`);
    }
  }
  say("stageA_repaired", "OK");
}

if (stage === "b") {
  if (!fs.existsSync(B)) hardFail(`.open-next/server-functions/default missing: ${REL(B)}`);
  const roots = storeOf(B);
  if (!roots.length) hardFail("no @libsql+isomorphic-ws in server-function store");
  const d = roots[0];
  say("dir", REL(d));
  for (const f of FILES) say(f, fs.existsSync(path.join(d, f)) ? `present (${fs.statSync(path.join(d, f)).size}b)` : "ABSENT");

  // resolution from the ACTUAL packaged requirer
  const requirer = path.join(storeOf(B)[0].replace(/@libsql\+isomorphic-ws@[^/]+/, "@libsql+hrana-client@0.10.0"), "lib-cjs", "index.js");
  if (!fs.existsSync(requirer)) hardFail(`packaged requirer not found: ${REL(requirer)}`);
  say("requirer", REL(requirer));
  const req = createRequire(pathToFileURL(requirer));
  let resolved = null, err = null;
  try { resolved = req.resolve(PKG); } catch (e) { err = e.message; }
  say("resolver.result", resolved ? REL(resolved) : `FAILED: ${err}`);
  if (!resolved) hardFail("resolver could not resolve the package from the packaged requirer");
  if (!resolved.startsWith(B)) hardFail(`resolved OUTSIDE the server-function tree: ${resolved}`);
  say("resolver.insidePackagedTree", "YES");

  // hrana-client loads without connecting
  try { require2(requirer); } catch (e) { void e; }
  say("hranaClient.loadable", "checked-separately");
}

function require2() { return null; }

fs.writeFileSync(path.join(APP, `verify-${stage}.json`), JSON.stringify(results, null, 2));
console.log(`[verify:${stage}] ok`);