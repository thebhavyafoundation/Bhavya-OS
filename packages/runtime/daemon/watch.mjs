#!/usr/bin/env node
/**
 * Bhavya Runtime Daemon
 *
 * Watches source files, auto-recompiles, validates, emits events,
 * writes history, and refreshes repository state.
 *
 * Usage: node packages/runtime/daemon/watch.mjs [--once]
 *
 *   --once    Run one compile+validate cycle and exit (for CI)
 *   (no flag) Persistent watcher that runs until SIGINT
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../../..");
const AI_DIR = path.join(ROOT, ".ai");
const COMPILER = path.join(AI_DIR, "build/compile-runtime.mjs");
const VALIDATOR = path.join(AI_DIR, "build/validate-runtime.mjs");
const EVENT_LOG = path.join(AI_DIR, "events/event-log.jsonl");
const STATE_FILE = path.join(AI_DIR, "state/repository.json");
const HISTORY_DIR = path.join(AI_DIR, "history");

const RUN_ONCE = process.argv.includes("--once");

// ── Helpers ──────────────────────────────────────────────────────

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch { return null; }
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

function emitEvent(type, data) {
  const event = {
    time: new Date().toISOString(),
    type,
    agent: "daemon",
    data,
  };
  try {
    fs.appendFileSync(EVENT_LOG, JSON.stringify(event) + "\n");
  } catch { /* silently fail if log is locked */ }
}

function writeHistory(type, payload) {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const dir = path.join(HISTORY_DIR, year, month);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${year}-${month}-${day}.jsonl`;
  const record = {
    time: now.toISOString(),
    type,
    ...payload,
  };
  try {
    fs.appendFileSync(path.join(dir, filename), JSON.stringify(record) + "\n");
  } catch { /* silently fail */ }
}

function log(msg, level = "info") {
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
  const prefix = level === "error" ? "✗" : level === "warn" ? "⚠" : "●";
  console.log(`${ts} ${prefix} ${msg}`);
}

// ── Compile + Validate Cycle ────────────────────────────────────

async function runCycle(trigger) {
  log(`Change detected: ${trigger}`);
  log("Running compile...");

  try {
    // Dynamic import of the compiler module
    await import(/* @vite-ignore */ `file://${COMPILER.replace(/\\/g, "/")}`);
    log("Compile succeeded", "info");

    emitEvent("build.passed", { command: "compile-runtime.mjs", trigger });

    log("Running validate...");
    try {
      await import(/* @vite-ignore */ `file://${VALIDATOR.replace(/\\/g, "/")}`);
      log("Validation passed", "info");
      emitEvent("validation.passed", { check: "validate-runtime.mjs", trigger });

      // Update state
      const state = readJSON(STATE_FILE) || {};
      state.dirty = false;
      state.last_build = new Date().toISOString();
      state.last_validation = new Date().toISOString();
      state.last_event_sequence = (state.last_event_sequence || 0) + 1;
      writeJSON(STATE_FILE, state);

      writeHistory("cycle.completed", {
        trigger,
        status: "passed",
        compile: true,
        validate: true,
      });
    } catch (validateErr) {
      log(`Validation failed: ${validateErr.message}`, "error");
      emitEvent("validation.failed", { check: "validate-runtime.mjs", error: validateErr.message });
      writeHistory("cycle.completed", {
        trigger,
        status: "validation_failed",
        compile: true,
        validate: false,
        error: validateErr.message,
      });
    }
  } catch (compileErr) {
    log(`Compile failed: ${compileErr.message}`, "error");
    emitEvent("build.failed", { command: "compile-runtime.mjs", error: compileErr.message });

    const state = readJSON(STATE_FILE) || {};
    state.dirty = true;
    state.last_build = new Date().toISOString();
    writeJSON(STATE_FILE, state);

    writeHistory("cycle.completed", {
      trigger,
      status: "compile_failed",
      compile: false,
      error: compileErr.message,
    });
  }
}

// ── File Watcher ──────────────────────────────────────────────────

function startWatcher() {
  const watchedPaths = [
    path.join(ROOT, "config"),
    path.join(ROOT, "registry"),
    path.join(AI_DIR, "agents"),
    path.join(AI_DIR, "memory"),
    path.join(AI_DIR, "releases"),
    path.join(AI_DIR, "state"),
    path.join(AI_DIR, "tasks"),
    path.join(AI_DIR, "build"),
  ];

  // Map of app package.json files
  // We watch all apps/*/package.json
  const appsDir = path.join(ROOT, "apps");
  if (fs.existsSync(appsDir)) {
    for (const appDir of fs.readdirSync(appsDir)) {
      const pkgPath = path.join(appsDir, appDir, "package.json");
      if (fs.existsSync(pkgPath)) watchedPaths.push(pkgPath);
    }
  }

  // Map of package package.json files  
  const pkgsDir = path.join(ROOT, "packages");
  if (fs.existsSync(pkgsDir)) {
    for (const pkgDir of fs.readdirSync(pkgsDir)) {
      if (pkgDir === "runtime") continue; // don't watch ourselves
      const pkgPath = path.join(pkgsDir, pkgDir, "package.json");
      if (fs.existsSync(pkgPath)) watchedPaths.push(pkgPath);
    }
  }

  let debounceTimer = null;
  const pendingChanges = new Set();

  function onFileChange(filePath) {
    const relative = path.relative(ROOT, filePath);
    pendingChanges.add(relative);

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const changes = Array.from(pendingChanges);
      pendingChanges.clear();
      debounceTimer = null;
      await runCycle(changes.join(", "));
    }, 500);
  }

  // Register watchers
  let watcherCount = 0;
  for (const watchPath of watchedPaths) {
    try {
      if (fs.existsSync(watchPath)) {
        fs.watch(watchPath, { recursive: false }, (eventType, filename) => {
          if (filename && !filename.startsWith(".") && !filename.includes("~")) {
            onFileChange(path.join(watchPath, filename));
          }
        });
        watcherCount++;
      }
    } catch (err) {
      log(`Cannot watch ${path.relative(ROOT, watchPath)}: ${err.message}`, "warn");
    }
  }

  log(`Runtime daemon watching ${watcherCount} paths`, "info");
  log("Watching for file changes... Press Ctrl+C to stop.", "info");
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  log("═══════════════════════════════════════════", "info");
  log("  Bhavya Runtime Daemon", "info");
  log(`  Root: ${ROOT}`, "info");
  log("═══════════════════════════════════════════", "info");

  // Always run initial cycle
  log("Running initial compile+validate cycle...", "info");
  await runCycle("startup");

  emitEvent("session.start", { task: "runtime-daemon" });

  if (RUN_ONCE) {
    log("--once flag set. Exiting after single cycle.", "info");
    process.exit(0);
  }

  // Start persistent watcher
  startWatcher();
}

// ── Handle Shutdown ─────────────────────────────────────────────

process.on("SIGINT", () => {
  log("Shutting down runtime daemon...", "info");
  emitEvent("session.end", { task: "runtime-daemon", outcome: "shutdown" });
  process.exit(0);
});

process.on("SIGTERM", () => {
  log("Received SIGTERM. Shutting down...", "info");
  emitEvent("session.end", { task: "runtime-daemon", outcome: "sigterm" });
  process.exit(0);
});

main().catch((err) => {
  log(`Daemon crashed: ${err.message}`, "error");
  console.error(err);
  process.exit(1);
});
