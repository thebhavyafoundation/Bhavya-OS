import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "../..");

export function resolvePath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
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
    const full = path.join(ROOT, dirPath);
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
  const full = path.join(ROOT, dirPath);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
  fs.writeFileSync(path.join(full, fileName), JSON.stringify(data, null, 2));
}

export function ensureDir(dirPath: string): void {
  const full = path.join(ROOT, dirPath);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
}
