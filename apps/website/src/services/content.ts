import fs from "fs";
import path from "path";

const CONTENT_DIR = path.resolve(process.cwd(), "../../content");

export interface ContentItem {
  id: string;
  title: string;
  [key: string]: unknown;
}

export interface ContentEnvelope<T = ContentItem> {
  data: T;
  lastUpdated: string;
  source: string;
}

function getFileMeta(filePath: string): { lastUpdated: string; source: string } {
  const stat = fs.statSync(filePath);
  return {
    lastUpdated: stat.mtime.toISOString().slice(0, 10),
    source: path.relative(CONTENT_DIR, filePath).replace(/\\/g, "/"),
  };
}

export function readContent<T = ContentItem>(domain: string, id: string): ContentEnvelope<T> | null {
  try {
    const filePath = path.join(CONTENT_DIR, domain, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
      return { data, ...getFileMeta(filePath) };
    }
  } catch (e) {
    console.error(`ContentReader: failed to read ${domain}/${id}`, e);
  }
  return null;
}

export function readContentDir<T = ContentItem>(domain: string): (ContentEnvelope<T> & { data: T })[] {
  try {
    const dirPath = path.join(CONTENT_DIR, domain);
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
      .filter(f => f.endsWith(".json"))
      .map(f => {
        const filePath = path.join(dirPath, f);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
        return { data, ...getFileMeta(filePath) };
      });
  } catch (e) {
    console.error(`ContentReader: failed to read domain '${domain}'`, e);
    return [];
  }
}
