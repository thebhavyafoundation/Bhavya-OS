import fs from "fs";
import path from "path";

// Content root: overridable via BHAVYA_CONTENT_ROOT so tests can run against
// an isolated temp tree instead of the tracked content/ directory.
// Production/CLI behavior is unchanged when the variable is unset.
// NOTE: resolved lazily (per call) — NOT cached at import time — so a test
// setup file that sets BHAVYA_CONTENT_ROOT before tests run will take effect
// even when this module was imported earlier in the worker lifecycle.
function getRoot(): string {
  return (
    process.env.BHAVYA_CONTENT_ROOT ?? path.resolve(process.cwd(), "../..")
  );
}

export function resolvePath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.join(getRoot(), filePath);
}

export function readJSON<T>(filePath: string, fallback: T): T {
  try {
    const full = resolvePath(filePath);
    if (fs.existsSync(full)) {
      return JSON.parse(fs.readFileSync(full, "utf8"));
    }
  } catch {
    /* fallback */
  }
  return fallback;
}

export function readMD(filePath: string): string {
  try {
    const full = resolvePath(filePath);
    if (fs.existsSync(full)) {
      return fs.readFileSync(full, "utf8");
    }
  } catch {
    /* fallback */
  }
  return "";
}

export function listDir(dirPath: string): string[] {
  try {
    const full = path.join(getRoot(), dirPath);
    if (fs.existsSync(full)) {
      return fs.readdirSync(full).filter((f) => !f.startsWith("."));
    }
  } catch {
    /* fallback */
  }
  return [];
}

export function writeJSON(
  dirPath: string,
  fileName: string,
  data: unknown,
): void {
  const full = path.join(getRoot(), dirPath);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
  fs.writeFileSync(path.join(full, fileName), JSON.stringify(data, null, 2));
}

export function ensureDir(dirPath: string): void {
  const full = path.join(getRoot(), dirPath);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
}
