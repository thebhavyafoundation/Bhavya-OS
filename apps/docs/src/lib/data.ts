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

// ── Knowledge Graph ──────────────────────────────────────
export interface KNode {
  id: string;
  type: string;
  title: string;
  owner?: string;
  status?: string;
  created?: string;
  updated?: string;
  links?: string[];
}

export interface KnowledgeGraph {
  nodes: KNode[];
}

export function getKnowledgeGraph(): KnowledgeGraph {
  return readJSON<KnowledgeGraph>("registry/knowledge-graph.json", { nodes: [] });
}

export function getNodesByType(type: string): KNode[] {
  return getKnowledgeGraph().nodes.filter((n) => n.type === type);
}

export function getNodeById(id: string): KNode | undefined {
  return getKnowledgeGraph().nodes.find((n) => n.id === id);
}

export function getLinkedNodes(nodeId: string): KNode[] {
  const node = getNodeById(nodeId);
  if (!node?.links) return [];
  const kg = getKnowledgeGraph();
  return node.links
    .map((linkId) => kg.nodes.find((n) => n.id === linkId))
    .filter(Boolean) as KNode[];
}

// ── Governance ───────────────────────────────────────────
export interface GovDocument {
  id: string;
  title: string;
  type: string;
  status: string;
  ratified?: string;
  owner?: string;
  summary?: string;
  sections?: { heading: string; body: string }[];
}

export function getGovernanceDocs(): GovDocument[] {
  const files = listDir("content/governance");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON<GovDocument>(`content/governance/${f}`, {} as GovDocument));
}

export function getGovDoc(id: string): GovDocument | undefined {
  return getGovernanceDocs().find((d) => d.id === id);
}

// ── Policies ─────────────────────────────────────────────
export interface Policy {
  id: string;
  title: string;
  status: string;
  icon?: string;
  description?: string;
  sections?: { heading: string; body: string }[];
}

export function getPolicies(): Policy[] {
  const files = listDir("content/policies");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON<Policy>(`content/policies/${f}`, {} as Policy));
}

export function getPolicy(id: string): Policy | undefined {
  return getPolicies().find((p) => p.id === id);
}

// ── Releases ─────────────────────────────────────────────
export interface Release {
  id: string;
  version: string;
  name: string;
  status: string;
  date: string;
  type: string;
  description: string;
  highlights: string[];
  breaking?: string[];
}

export function getReleases(): Release[] {
  const files = listDir("content/releases");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON<Release>(`content/releases/${f}`, {} as Release))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getRelease(version: string): Release | undefined {
  return getReleases().find((r) => r.version === version);
}

// ── Standards ────────────────────────────────────────────
export interface Standard {
  id: string;
  file: string;
}

export interface StandardsRegistry {
  items: Standard[];
}

export function getStandards(): Standard[] {
  return readJSON<StandardsRegistry>("registry/standards.json", { items: [] }).items;
}

export function getStandardContent(file: string): string {
  return readMD(`standards/${file}`);
}

// ── ADRs ─────────────────────────────────────────────────
export interface ADR {
  id: string;
  title: string;
  status: string;
  date?: string;
  approvedBy?: string;
  content: string;
}

export function getADRs(): ADR[] {
  const files = listDir("governance/adr");
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = readMD(`governance/adr/${f}`);
      const titleMatch = content.match(/^# (.+)/m);
      const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/i);
      const dateMatch = content.match(/\*\*Date:\*\*\s*(.+)/i);
      const approvedMatch = content.match(/\*\*Approved By:\*\*\s*(.+)/i);
      return {
        id: f.replace(".md", ""),
        title: titleMatch?.[1]?.replace(/^ADR-\d+\s*--\s*/, "") || f,
        status: statusMatch?.[1]?.trim() || "Unknown",
        date: dateMatch?.[1]?.trim(),
        approvedBy: approvedMatch?.[1]?.trim(),
        content,
      };
    });
}

export function getADR(id: string): ADR | undefined {
  return getADRs().find((a) => a.id === id);
}

// ── RFCs ─────────────────────────────────────────────────
export interface RFC {
  id: string;
  title: string;
  status: string;
  content: string;
}

export function getRFCs(): RFC[] {
  const files = listDir("rfcs");
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = readMD(`rfcs/${f}`);
      const titleMatch = content.match(/^# (.+)/m);
      const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/i);
      return {
        id: f.replace(".md", ""),
        title: titleMatch?.[1] || f.replace(/-/g, " ").replace(".md", ""),
        status: statusMatch?.[1]?.trim() || "Proposed",
        content,
      };
    });
}

// ── Apps ─────────────────────────────────────────────────
export interface AppEntry {
  id: string;
  name: string;
  version: string;
  owner: string;
  mission: string;
  visibility: string;
  port: number;
  path: string;
}

export function getApps(): AppEntry[] {
  return readJSON<{ items: AppEntry[] }>("registry/apps.json", { items: [] }).items || [];
}

// ── Search Index ─────────────────────────────────────────
export interface SearchDocument {
  id: string;
  title: string;
  category: string;
  path: string;
  content: string;
  tags?: string[];
}

export function getSearchIndex(): SearchDocument[] {
  return readJSON<{ documents: SearchDocument[] }>("registry/search-index.json", { documents: [] }).documents || [];
}

export function searchAll(query: string): SearchDocument[] {
  const q = query.toLowerCase();
  return getSearchIndex().filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q) ||
      doc.tags?.some((t) => t.toLowerCase().includes(q))
  );
}
