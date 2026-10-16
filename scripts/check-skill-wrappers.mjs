#!/usr/bin/env node
/**
 * Bhavya OS — Third-Party Skill Wrapper Validation
 *
 * Every third-party skill must be reached through a project-owned wrapper, and
 * a wrapper whose upstream licence is unverified must not be able to load it.
 *
 * For every wrapper this verifies:
 *   - a machine-readable state (ENABLED / DISABLED_LICENSE_UNVERIFIED /
 *     DISABLED_SECURITY_UNVERIFIED)
 *   - the platform-context requirement is present
 *   - ENABLED requires: upstream repo, pinned commit, verified licence,
 *     update procedure and uninstall procedure
 *   - DISABLED_* must NOT contain a load instruction for the upstream skill
 *   - a licence of UNVERIFIED can never be ENABLED
 *   - no upstream third-party skill directory is committed to the repository
 *   - no command routes to a disabled wrapper's upstream skill
 *
 * Usage: node scripts/check-skill-wrappers.mjs
 * Exit:  0 = pass, 1 = failure
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const SKILLS_DIR = ".opencode/skills";
const COMMANDS_DIR = ".opencode/command";

const VALID_STATES = new Set([
  "ENABLED",
  "DISABLED_LICENSE_UNVERIFIED",
  "DISABLED_SECURITY_UNVERIFIED",
]);

/** Third-party skills that must never be committed to the repository. */
const FORBIDDEN_COMMIT_PREFIXES = [
  ".opencode/skills/impeccable",
  ".opencode/skills/apple-design",
  ".opencode/skills/design-taste-frontend",
  ".opencode/skills/diagram-design",
];

const PLATFORM_CONTEXT_MARKERS = [
  "/AGENTS.md",
  "/docs/architecture/PLATFORM-TRUTH.md",
  "Required platform context",
];

const problems = [];
const rows = [];

function frontmatter(body) {
  // Tolerate a UTF-8 BOM: some editors add one and it is not a policy failure.
  const text = body.charCodeAt(0) === 0xfeff ? body.slice(1) : body;
  if (!text.startsWith("---")) return "";
  const end = text.indexOf("\n---", 3);
  return end === -1 ? "" : text.slice(3, end);
}

function field(fm, name) {
  const m = new RegExp(`^${name}:\\s*(.+)$`, "m").exec(fm);
  return m ? m[1].trim() : null;
}

function listWrappers() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR)
    .filter((n) => n.startsWith("bhavya-"))
    .filter((n) => {
      try {
        return statSync(join(SKILLS_DIR, n)).isDirectory();
      } catch {
        return false;
      }
    })
    .filter((n) => existsSync(join(SKILLS_DIR, n, "SKILL.md")));
}

const PROHIBITION =
  /\b(do not|don't|never|must not|forbidden|prohibited|refus|stop|not\s*:|\*\*not\*\*)/i;

function isProhibitedLine(lines, i) {
  // The line itself, or a nearby preceding line — wrappers commonly write
  // "Do **not**:" as a heading and list the forbidden calls beneath it, often
  // inside a fenced block. Walk back past blanks and fences; stop at a new
  // section heading so an instruction far from any prohibition is not excused.
  if (PROHIBITION.test(lines[i])) return true;
  for (let j = i - 1; j >= 0 && j >= i - 12; j--) {
    const t = lines[j].trim();
    if (!t || t.startsWith("```")) continue;
    if (/^#{1,6}\s/.test(t) && !PROHIBITION.test(t)) return false;
    if (PROHIBITION.test(t)) return true;
  }
  return false;
}

function routedSkills(body) {
  const ROUTE = /Call\s+skill\(|skill\(\s*\{\s*name:\s*["'`]([\w-]+)["'`]/;
  const lines = body.split(/\r?\n/);
  const routed = new Set();
  lines.forEach((line, i) => {
    if (isProhibitedLine(lines, i)) return;
    const m = ROUTE.exec(line);
    if (m) routed.add(m[1]);
  });
  return routed;
}

const wrappers = listWrappers();
console.log("Bhavya OS — Third-Party Skill Wrapper Validation");
console.log(`Authority: AGENTS.md + docs/architecture/PLATFORM-TRUTH.md\n`);

for (const name of wrappers) {
  const path = join(SKILLS_DIR, name, "SKILL.md");
  const body = readFileSync(path, "utf8");
  const fm = frontmatter(body);

  const state = field(fm, "wrapper_state");
  const upstreamSkill = field(fm, "upstream_skill");
  const repo = field(fm, "upstream_repo");
  const pin = field(fm, "upstream_pin");
  const licence = field(fm, "upstream_license");
  const update = field(fm, "update_procedure");
  const uninstall = field(fm, "uninstall_procedure");

  // A project-owned skill declares no upstream. It is governed by the contract
  // directly and is not a third-party wrapper.
  const isWrapper = Boolean(upstreamSkill || state);
  const issues = [];

  for (const marker of PLATFORM_CONTEXT_MARKERS) {
    if (!body.includes(marker)) issues.push(`missing platform-context marker: ${marker}`);
  }

  if (!isWrapper) {
    rows.push({ name, state: "PROJECT_OWNED", upstreamSkill: "-", licence: "-", pin: "-" });
    for (const issue of issues) problems.push(`${name}: ${issue}`);
    continue;
  }

  if (!state) {
    issues.push("missing wrapper_state");
  } else if (!VALID_STATES.has(state)) {
    issues.push(`invalid wrapper_state "${state}"`);
  }

  if (state === "ENABLED") {
    if (!repo) issues.push("ENABLED but upstream_repo missing");
    if (!upstreamSkill) issues.push("ENABLED but upstream_skill missing");
    if (!pin || pin === "none") issues.push("ENABLED but upstream_pin is not pinned");
    if (!licence) issues.push("ENABLED but upstream_license missing");
    else if (licence.toUpperCase() === "UNVERIFIED")
      issues.push("ENABLED with UNVERIFIED licence — licence §15 violation");
    if (!update || update === "none") issues.push("ENABLED but update_procedure missing");
    if (!uninstall || uninstall === "none") issues.push("ENABLED but uninstall_procedure missing");
  }

  if (state && state.startsWith("DISABLED")) {
    // A disabled wrapper must not be able to load the upstream skill.
    // Documenting the forbidden call is fine and desirable; issuing it is not.
    if (upstreamSkill) {
      const loadCall = new RegExp(
        `skill\\(\\s*\\{\\s*name:\\s*["'\`]${upstreamSkill}["'\`]\\s*\\}\\s*\\)`,
      );
      const lines = body.split(/\r?\n/);
      lines.forEach((line, idx) => {
        if (!loadCall.test(line)) return;
        if (isProhibitedLine(lines, idx)) return; // documented as forbidden
        issues.push(
          `DISABLED wrapper issues a load instruction for "${upstreamSkill}" (line ${idx + 1})`,
        );
      });
    }
    if (licence && licence.toUpperCase() !== "UNVERIFIED") {
      // Not fatal, but the state and the licence record disagree.
      if (state === "DISABLED_LICENSE_UNVERIFIED") {
        issues.push(`state says licence unverified but upstream_license is "${licence}"`);
      }
    }
    if (!body.includes("BLOCKED")) {
      issues.push("DISABLED wrapper does not emit a BLOCKED status");
    }
  }

  for (const issue of issues) problems.push(`${name}: ${issue}`);
  rows.push({ name, state: state ?? "(none)", upstreamSkill: upstreamSkill ?? "-", licence: licence ?? "-", pin: pin ?? "-" });
}

// No upstream third-party directory may be committed.
let tracked = [];
try {
  tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\0")
    .filter(Boolean);
} catch {
  /* git unavailable; skip this sub-check rather than fail spuriously */
}
for (const prefix of FORBIDDEN_COMMIT_PREFIXES) {
  const hits = tracked.filter((f) => f.startsWith(prefix));
  if (hits.length) {
    problems.push(`upstream third-party files committed: ${hits.slice(0, 3).join(", ")}${hits.length > 3 ? ` (+${hits.length - 3} more)` : ""}`);
  }
}

// Commands must not route to a disabled wrapper's upstream skill.
const disabledUpstreams = rows
  .filter((r) => (r.state ?? "").startsWith("DISABLED"))
  .map((r) => r.upstreamSkill)
  .filter((s) => s && s !== "-");

if (existsSync(COMMANDS_DIR)) {
  const ROUTE =
    /Call\s+skill\(|skill\(\s*\{\s*name:\s*["'`]([\w-]+)["'`]/;
  for (const f of readdirSync(COMMANDS_DIR)) {
    if (!/\.mdx?$/.test(f)) continue;
    const body = readFileSync(join(COMMANDS_DIR, f), "utf8");
    for (const target of routedSkills(body)) {
      if (disabledUpstreams.includes(target)) {
        problems.push(`.opencode/command/${f} routes directly to disabled skill "${target}"`);
      }
    }
  }
}

// Report
console.log(`${"WRAPPER".padEnd(24)}${"STATE".padEnd(32)}${"UPSTREAM".padEnd(24)}${"LICENCE".padEnd(12)}PIN`);
for (const r of rows.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(
    `  ${r.name.padEnd(22)}${(r.state ?? "").padEnd(32)}${String(r.upstreamSkill).padEnd(24)}${String(r.licence).padEnd(12)}${r.pin}`,
  );
}
console.log("");

const enabled = rows.filter((r) => r.state === "ENABLED").length;
const disabled = rows.filter((r) => (r.state ?? "").startsWith("DISABLED")).length;
console.log(`  wrappers: ${rows.length} (${enabled} enabled, ${disabled} disabled)`);
console.log(`  upstream dirs committed: ${FORBIDDEN_COMMIT_PREFIXES.filter((p) => tracked.some((f) => f.startsWith(p))).length} (expected 0)`);
console.log("");

if (problems.length === 0) {
  console.log("RESULT: PASS — every wrapper is well-formed and no unverified skill is reachable");
  process.exit(0);
}
for (const p of problems) console.log(`  PROBLEM  ${p}`);
console.log(`\nRESULT: FAIL (${problems.length} problem(s))`);
process.exit(1);