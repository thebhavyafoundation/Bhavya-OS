/**
 * Runtime Configuration — Single source of truth for all path resolution
 *
 * Every engine module, manager, and the API must import paths from here.
 * No module should compute ROOT, BHAVYA_LAB, or data directories independently.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Root Paths ──────────────────────────────────────────────────────

export const ROOT = (() => {
  const r = path.resolve(__dirname, "../../..");
  const marker = path.join(r, "bhavya-ai-lab");
  if (!fs.existsSync(marker)) {
    console.error(`[config] Fatal: project root not found at ${r} (missing bhavya-ai-lab/ marker)`);
    process.exit(1);
  }
  return r;
})();

export const BHAVYA_LAB = path.join(ROOT, "bhavya-ai-lab");

// ── Path Resolution ─────────────────────────────────────────────────

export function resolveOSPath(rel) {
  const p = path.join(BHAVYA_LAB, rel);
  if (fs.existsSync(p)) return p;
  const fallback = path.join(ROOT, rel);
  if (fs.existsSync(fallback)) return fallback;
  return p; // BHAVYA_LAB path is the primary — caller must handle absence
}

// ── File Helpers ────────────────────────────────────────────────────

export function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch { return null; }
}

export function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  return fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}
