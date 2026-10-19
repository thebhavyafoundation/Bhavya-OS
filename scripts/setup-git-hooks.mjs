#!/usr/bin/env node
/**
 * Wire Git hooks so Husky and Git LFS stop overwriting each other.
 *
 * Husky v9 sets core.hooksPath=.husky/_ and writes its shims there.
 * `git lfs install` also writes its hooks into core.hooksPath.
 * Both target .husky/_/pre-push, so the last installer wins and the loser
 * is silently destroyed.
 *
 * Fix: install LFS filters WITHOUT hooks (`git lfs install --manual`), then
 * let Husky own the hooks directory. Any tracked .husky/pre-push must then call
 * `git lfs pre-push` explicitly to preserve LFS object upload.
 *
 * Safe to run repeatedly. Never runs heavy validation.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();

function run(cmd, args, { allowFailure = false } = {}) {
  try {
    return execFileSync(cmd, args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (allowFailure) return null;
    const detail = error.stderr ? error.stderr.trim() : error.message;
    throw new Error(`${cmd} ${args.join(" ")} failed: ${detail}`);
  }
}

function has(command) {
  return run(process.platform === "win32" ? "where" : "which", [command], {
    allowFailure: true,
  }) !== null;
}

function hooksDir() {
  const configured = run("git", ["config", "--get", "core.hooksPath"], {
    allowFailure: true,
  });
  return configured || ".git/hooks";
}

function report(message) {
  process.stdout.write(`${message}\n`);
}

function installHusky() {
  if (run("husky", [], { allowFailure: true }) !== null) return true;
  return run("pnpm", ["exec", "husky"], { allowFailure: true }) !== null;
}

const checkOnly = process.argv.includes("--check");

report(
  checkOnly
    ? "Checking Git hook wiring (read-only)"
    : "Wiring Git hooks (Husky owns hooks; Git LFS installs filters only)",
);

if (checkOnly) {
  if (has("git-lfs") && run("git", ["lfs", "env"], { allowFailure: true })) {
    report("  ..  git-lfs present");
  }
} else {
  if (!has("git-lfs")) {
    report("  ! git-lfs not found on PATH - skipping LFS filter configuration");
  } else {
    run("git", ["lfs", "install", "--manual"]);
    report(
      "  ok  git lfs install --manual (filters configured, hooks NOT installed)",
    );
  }

  if (installHusky()) {
    report("  ok  husky shims regenerated");
  } else {
    report("  ! husky not installed in this worktree - run `pnpm install` first");
  }
}

const dir = hooksDir();
const dirPath = path.resolve(repoRoot, dir);
const huskyRuntime = ["husky.sh", "h"].every((file) =>
  existsSync(path.join(dirPath, file)),
);

function classify(contents) {
  if (contents.includes("git lfs pre-push")) return "git-lfs";
  if (contents.includes("husky.sh") || contents.includes(')/h"')) return "husky";
  return "unknown";
}

const shimPath = path.join(dirPath, "pre-push");
const shimOwner = existsSync(shimPath)
  ? classify(readFileSync(shimPath, "utf8"))
  : "absent";

// With Husky in control the shim only forwards; the behaviour that actually
// runs lives in the tracked .husky/<hook> file.
const trackedPath = path.join(repoRoot, ".husky", "pre-push");
const trackedOwner = existsSync(trackedPath)
  ? classify(readFileSync(trackedPath, "utf8"))
  : "absent";

const lfsUploadCovered =
  shimOwner === "git-lfs" ||
  trackedOwner === "git-lfs" ||
  (trackedOwner !== "absent" &&
    readFileSync(trackedPath, "utf8").includes("git lfs pre-push"));

report("");
report(`  core.hooksPath          : ${dir}`);
report(`  husky runtime           : ${huskyRuntime ? "present" : "MISSING"}`);
report(`  ${dir}/pre-push       : ${shimOwner}`);
report(`  .husky/pre-push (tracked): ${trackedOwner}`);
report(`  LFS pre-push covered    : ${lfsUploadCovered ? "yes" : "NO"}`);
report("");

if (!huskyRuntime) {
  report(
    "FAIL Husky runtime is missing. Run `pnpm exec husky` and re-check.",
  );
  process.exit(1);
}

if (!lfsUploadCovered) {
  report("WARN `git lfs pre-push` is not wired up.");
  report(
    "     LFS assets (.glb/.gltf/.blend/.zip) may be pushed as unresolved",
  );
  report(
    "     pointers. Add `git lfs pre-push \"$@\"` to .husky/pre-push. See",
  );
  report("     docs/tools/hooks/HOOK-WIRING.md");
  process.exitCode = 1;
} else {
  report("ok  hook wiring is consistent");
}