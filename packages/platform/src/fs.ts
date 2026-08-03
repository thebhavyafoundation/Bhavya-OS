/**
 * @bhavya/platform — Filesystem Utilities
 *
 * Safe, consistent filesystem operations for reading JSON, Markdown,
 * listing directories, and writing files.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
} from "fs";
import { resolve } from "path";

/**
 * Read a JSON file with fallback.
 * Resolves path relative to the given base directory.
 */
export function readJSON<T>(
  filePath: string,
  fallback: T,
  baseDir?: string,
): T {
  try {
    const full = baseDir ? resolve(baseDir, filePath) : filePath;
    const raw = readFileSync(full, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Write a JSON file, creating directories as needed.
 */
export function writeJSON(
  filePath: string,
  data: unknown,
  baseDir?: string,
): void {
  const full = baseDir ? resolve(baseDir, filePath) : filePath;
  const dir = full.split("/").slice(0, -1).join("/");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(full, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Read a Markdown file, returning content as string.
 */
export function readMD(filePath: string, baseDir?: string): string {
  try {
    const full = baseDir ? resolve(baseDir, filePath) : filePath;
    return readFileSync(full, "utf-8");
  } catch {
    return "";
  }
}

/**
 * List directory entries, filtering out hidden files.
 */
export function listDir(
  dirPath: string,
  options?: { filter?: (name: string) => boolean },
): string[] {
  try {
    const entries = readdirSync(dirPath);
    return entries.filter((name) => {
      if (name.startsWith(".") || name.startsWith("_")) return false;
      if (options?.filter) return options.filter(name);
      return true;
    });
  } catch {
    return [];
  }
}

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Check if a file exists.
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}
