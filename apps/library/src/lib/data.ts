import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "../..");

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    const full = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
    if (fs.existsSync(full)) {
      return JSON.parse(fs.readFileSync(full, "utf8"));
    }
  } catch { /* fallback */ }
  return fallback;
}

function readMD(filePath: string): string {
  try {
    const full = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
    if (fs.existsSync(full)) {
      return fs.readFileSync(full, "utf8");
    }
  } catch { /* fallback */ }
  return "";
}

function listDir(dirPath: string): string[] {
  try {
    const full = path.join(ROOT, dirPath);
    if (fs.existsSync(full)) {
      return fs.readdirSync(full).filter((f) => !f.startsWith("."));
    }
  } catch { /* fallback */ }
  return [];
}

// ── Types ─────────────────────────────────────────────────

export type DocCategory =
  | "governance" | "policy" | "standard" | "adr" | "rfc"
  | "release" | "research" | "report" | "project" | "content";

export interface LibraryDocument {
  id: string;
  title: string;
  category: DocCategory;
  content: string;
  summary: string;
  tags: string[];
  status?: string;
  created?: string;
  readingTime: number;
  links: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  documentIds: string[];
}

// ── Document Building ─────────────────────────────────────

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function buildDocuments(): LibraryDocument[] {
  const docs: LibraryDocument[] = [];

  // ADRs
  for (const f of listDir("governance/adr")) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`governance/adr/${f}`);
    const titleMatch = content.match(/^# (.+)/m);
    const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/i);
    const id = f.replace(".md", "");
    docs.push({
      id,
      title: titleMatch?.[1]?.replace(/^ADR-\d+\s*--\s*/, "") || f,
      category: "adr",
      content,
      summary: content.split("\n").find((l) => l.length > 20 && !l.startsWith("#"))?.trim() || "",
      tags: ["adr", "architecture"],
      status: statusMatch?.[1]?.trim(),
      readingTime: estimateReadingTime(content),
      links: [],
    });
  }

  // RFCs
  for (const f of listDir("rfcs")) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`rfcs/${f}`);
    const titleMatch = content.match(/^# (.+)/m);
    const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/i);
    const id = f.replace(".md", "");
    docs.push({
      id,
      title: titleMatch?.[1] || f.replace(/-/g, " ").replace(".md", ""),
      category: "rfc",
      content,
      summary: content.split("\n").find((l) => l.length > 20 && !l.startsWith("#"))?.trim() || "",
      tags: ["rfc", "technical"],
      status: statusMatch?.[1]?.trim(),
      readingTime: estimateReadingTime(content),
      links: [],
    });
  }

  // Standards
  for (const f of listDir("standards")) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`standards/${f}`);
    const titleMatch = content.match(/^# (.+)/m);
    const id = f.replace(".md", "");
    docs.push({
      id: `standard-${id}`,
      title: titleMatch?.[1] || f.replace(/-/g, " ").replace(".md", ""),
      category: "standard",
      content,
      summary: content.split("\n").find((l) => l.length > 20 && !l.startsWith("#"))?.trim() || "",
      tags: ["standard"],
      status: "Active",
      readingTime: estimateReadingTime(content),
      links: [],
    });
  }

  // Governance
  for (const f of listDir("content/governance")) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/governance/${f}`, {});
    if (!data.id) continue;
    const content = data.sections?.map((s: { heading: string; body: string }) => `## ${s.heading}\n\n${s.body}`).join("\n\n") || "";
    docs.push({
      id: data.id,
      title: data.title || f,
      category: "governance",
      content,
      summary: data.summary || "",
      tags: ["governance"],
      status: data.status,
      readingTime: estimateReadingTime(content),
      links: [],
    });
  }

  // Policies
  for (const f of listDir("content/policies")) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/policies/${f}`, {});
    if (!data.id) continue;
    const content = data.sections?.map((s: { heading: string; body: string }) => `## ${s.heading}\n\n${s.body}`).join("\n\n") || "";
    docs.push({
      id: data.id,
      title: data.title || f,
      category: "policy",
      content,
      summary: data.description || "",
      tags: ["policy"],
      status: data.status,
      readingTime: estimateReadingTime(content),
      links: [],
    });
  }

  // Releases
  for (const f of listDir("content/releases")) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/releases/${f}`, {});
    if (!data.id) continue;
    const content = `# ${data.version} \u2014 ${data.name}\n\n${data.description}\n\n## Highlights\n\n${data.highlights?.map((h: string) => `- ${h}`).join("\n") || ""}`;
    docs.push({
      id: data.id,
      title: `${data.version} \u2014 ${data.name}`,
      category: "release",
      content,
      summary: data.description || "",
      tags: ["release"],
      status: data.status,
      created: data.date,
      readingTime: estimateReadingTime(content),
      links: [],
    });
  }

  // Content pages
  for (const f of listDir("content")) {
    if (!f.endsWith(".mdx")) continue;
    const content = readMD(`content/${f}`);
    const titleMatch = content.match(/title:\s*(.+)/m);
    const id = f.replace(".mdx", "");
    docs.push({
      id: `content-${id}`,
      title: titleMatch?.[1]?.replace(/"/g, "") || f.replace(/-/g, " ").replace(".mdx", ""),
      category: "content",
      content,
      summary: content.split("\n").find((l) => l.length > 20 && !l.startsWith("#") && !l.startsWith("---"))?.trim() || "",
      tags: ["content"],
      readingTime: estimateReadingTime(content),
      links: [],
    });
  }

  return docs;
}

let _cache: LibraryDocument[] | null = null;

export function getDocuments(): LibraryDocument[] {
  if (!_cache) _cache = buildDocuments();
  return _cache;
}

export function getDocument(id: string): LibraryDocument | undefined {
  return getDocuments().find((d) => d.id === id);
}

export function getDocumentsByCategory(category: DocCategory): LibraryDocument[] {
  return getDocuments().filter((d) => d.category === category);
}

// ── Collections ───────────────────────────────────────────

const COLLECTIONS: Collection[] = [
  {
    id: "environmental-restoration",
    name: "Environmental Restoration",
    description: "Plantation standards, forest management, biodiversity reports, and environmental conservation.",
    icon: "\u{1F333}",
    documentIds: [],
  },
  {
    id: "traditional-knowledge",
    name: "Traditional Knowledge",
    description: "Indigenous heritage, cultural preservation, yoga, and traditional practices.",
    icon: "\u{1F3DB}",
    documentIds: [],
  },
  {
    id: "governance",
    name: "Governance",
    description: "Constitutional documents, policies, decision records, and institutional standards.",
    icon: "\u{2696}",
    documentIds: [],
  },
  {
    id: "research",
    name: "Research Papers",
    description: "Technical RFCs, research findings, evidence-based recommendations.",
    icon: "\u{1F52C}",
    documentIds: [],
  },
  {
    id: "education",
    name: "Education",
    description: "AI literacy, digital library resources, learning modules, curricula.",
    icon: "\u{1F4DA}",
    documentIds: [],
  },
  {
    id: "releases",
    name: "Platform Releases",
    description: "Release notes, changelogs, and version history.",
    icon: "\u{1F680}",
    documentIds: [],
  },
];

let _collectionsCache: Collection[] | null = null;

export function getCollections(): Collection[] {
  if (!_collectionsCache) {
    const docs = getDocuments();
    _collectionsCache = COLLECTIONS.map((col) => ({
      ...col,
      documentIds: docs
        .filter((d) => {
          if (col.id === "environmental-restoration") return ["standard"].includes(d.category) && d.tags.some((t) => t.includes("forest") || t.includes("environment") || t.includes("plantation"));
          if (col.id === "traditional-knowledge") return d.category === "content" && (d.id.includes("heritage") || d.id.includes("nature"));
          if (col.id === "governance") return ["governance", "policy", "adr"].includes(d.category);
          if (col.id === "research") return ["rfc", "research"].includes(d.category);
          if (col.id === "education") return d.category === "content" && (d.id.includes("knowledge") || d.id.includes("education"));
          if (col.id === "releases") return d.category === "release";
          return false;
        })
        .map((d) => d.id),
    }));
  }
  return _collectionsCache;
}

export function getCollection(id: string): Collection | undefined {
  return getCollections().find((c) => c.id === id);
}

// ── Search ────────────────────────────────────────────────

export function searchDocuments(query: string): LibraryDocument[] {
  const q = query.toLowerCase();
  return getDocuments().filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q)),
  );
}
