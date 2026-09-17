import {
  Document,
  DocumentCategory,
  DocumentStatus,
  GraphNode,
  Entity,
  EntityType,
} from "./models";
import { readJSON, readMD, listDir } from "./io";

// ── Metadata Parsing ───────────────────────────────────────

export function parseMarkdownMetadata(content: string): {
  title: string;
  status?: string;
  date?: string;
  tags: string[];
} {
  const titleMatch = content.match(/^# (.+)/m);
  const statusMatch = content.match(/\*\*Status:\*\*\s*([^|\n]+)/i);
  const dateMatch = content.match(/\*\*Date:\*\*\s*([^|\n]+)/i);
  return {
    title: titleMatch?.[1] || "",
    status: statusMatch?.[1]?.trim(),
    date: dateMatch?.[1]?.trim(),
    tags: [],
  };
}

export function parseJsonMetadata(data: Record<string, unknown>): {
  title: string;
  content: string;
  summary: string;
  status?: string;
  date?: string;
} {
  const sections = (data.sections as { heading: string; body: string }[]) || [];
  const content = sections
    .map((s) => `## ${s.heading}\n\n${s.body}`)
    .join("\n\n");
  return {
    title: (data.title as string) || "",
    content,
    summary: (data.summary as string) || (data.description as string) || "",
    status: data.status as string | undefined,
    date: data.date as string | undefined,
  };
}

// ── Document Building ──────────────────────────────────────

function buildAdrs(): Document[] {
  const docs: Document[] = [];
  for (const f of listDir("docs/adr")) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`docs/adr/${f}`);
    const meta = parseMarkdownMetadata(content);
    const id = f.replace(".md", "");
    docs.push({
      id,
      title: meta.title.replace(/^ADR-\d+\s*[:\u2013\u2014-]*\s*/, "") || f,
      category: "adr",
      path: `/documents/${id}`,
      content,
      summary:
        content
          .split("\n")
          .find((l) => l.length > 20 && !l.startsWith("#"))
          ?.trim() || "",
      tags: ["adr", "governance", "architecture"],
      status: (meta.status as DocumentStatus) || "published",
      created: meta.date,
      readingTime: 0,
      version: 1,
      links: [],
      citations: [],
      entityIds: [],
      metadata: {},
    });
  }
  return docs;
}

function buildRfcs(): Document[] {
  const docs: Document[] = [];
  for (const f of listDir("rfcs")) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`rfcs/${f}`);
    const meta = parseMarkdownMetadata(content);
    const id = f.replace(".md", "");
    docs.push({
      id,
      title: meta.title || f.replace(/-/g, " ").replace(".md", ""),
      category: "rfc",
      path: `/documents/${id}`,
      content,
      summary:
        content
          .split("\n")
          .find((l) => l.length > 20 && !l.startsWith("#"))
          ?.trim() || "",
      tags: ["rfc", "technical"],
      status: (meta.status as DocumentStatus) || "published",
      created: meta.date,
      readingTime: 0,
      version: 1,
      links: [],
      citations: [],
      entityIds: [],
      metadata: {},
    });
  }
  return docs;
}

function buildStandards(): Document[] {
  const docs: Document[] = [];
  for (const f of listDir("standards")) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`standards/${f}`);
    const meta = parseMarkdownMetadata(content);
    const id = f.replace(".md", "");
    docs.push({
      id: `standard-${id}`,
      title: meta.title || f.replace(/-/g, " ").replace(".md", ""),
      category: "standard",
      path: `/documents/standard-${id}`,
      content,
      summary:
        content
          .split("\n")
          .find((l) => l.length > 20 && !l.startsWith("#"))
          ?.trim() || "",
      tags: ["standard", "engineering"],
      status: "published",
      created: meta.date,
      readingTime: 0,
      version: 1,
      links: [],
      citations: [],
      entityIds: [],
      metadata: {},
    });
  }
  return docs;
}

function buildGovernance(): Document[] {
  const docs: Document[] = [];
  for (const f of listDir("content/governance")) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/governance/${f}`, {});
    if (!data.id) continue;
    const meta = parseJsonMetadata(data);
    docs.push({
      id: data.id,
      title: meta.title || f,
      category: "governance",
      path: `/documents/${data.id}`,
      content: meta.content,
      summary: meta.summary,
      tags: ["governance", data.type || "document"],
      status: (meta.status as DocumentStatus) || "published",
      created: meta.date,
      readingTime: 0,
      version: 1,
      links: [],
      citations: [],
      entityIds: [],
      metadata: {},
    });
  }
  return docs;
}

function buildPolicies(): Document[] {
  const docs: Document[] = [];
  for (const f of listDir("content/policies")) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/policies/${f}`, {});
    if (!data.id) continue;
    const meta = parseJsonMetadata(data);
    docs.push({
      id: data.id,
      title: meta.title || f,
      category: "policy",
      path: `/documents/${data.id}`,
      content: meta.content,
      summary: meta.summary,
      tags: ["policy"],
      status: (meta.status as DocumentStatus) || "published",
      created: meta.date,
      readingTime: 0,
      version: 1,
      links: [],
      citations: [],
      entityIds: [],
      metadata: {},
    });
  }
  return docs;
}

function buildReleases(): Document[] {
  const docs: Document[] = [];
  for (const f of listDir("content/releases")) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/releases/${f}`, {});
    if (!data.id) continue;
    const highlights =
      data.highlights?.map((h: string) => `- ${h}`).join("\n") || "";
    const content = `# ${data.version} \u2014 ${data.name}\n\n${data.description}\n\n## Highlights\n\n${highlights}`;
    docs.push({
      id: data.id,
      title: `${data.version} \u2014 ${data.name}`,
      category: "release",
      path: `/documents/${data.id}`,
      content,
      summary: data.description || "",
      tags: ["release", data.status?.toLowerCase() || "stable"],
      status: (data.status as DocumentStatus) || "published",
      created: data.date,
      readingTime: 0,
      version: 1,
      links: [],
      citations: [],
      entityIds: [],
      metadata: { version: data.version },
    });
  }
  return docs;
}

function buildContentPages(): Document[] {
  const docs: Document[] = [];
  for (const f of listDir("content")) {
    if (!f.endsWith(".mdx")) continue;
    const content = readMD(`content/${f}`);
    const titleMatch = content.match(/title:\s*(.+)/m);
    const id = f.replace(".mdx", "");
    docs.push({
      id: `content-${id}`,
      title:
        titleMatch?.[1]?.replace(/"/g, "") ||
        f.replace(/-/g, " ").replace(".mdx", ""),
      category: "content",
      path: `/documents/content-${id}`,
      content,
      summary:
        content
          .split("\n")
          .find(
            (l) => l.length > 20 && !l.startsWith("#") && !l.startsWith("---"),
          )
          ?.trim() || "",
      tags: ["content", "page"],
      status: "published",
      readingTime: 0,
      version: 1,
      links: [],
      citations: [],
      entityIds: [],
      metadata: {},
    });
  }
  return docs;
}

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function enrichReadingTime(docs: Document[]): Document[] {
  return docs.map((d) => ({
    ...d,
    readingTime: estimateReadingTime(d.content),
  }));
}

// ── Document Repository ────────────────────────────────────

let _documentsCache: Document[] | null = null;

export function getDocuments(): Document[] {
  if (!_documentsCache) {
    const docs = enrichReadingTime([
      ...buildAdrs(),
      ...buildRfcs(),
      ...buildStandards(),
      ...buildGovernance(),
      ...buildPolicies(),
      ...buildReleases(),
      ...buildContentPages(),
    ]);

    // Cross-reference with knowledge graph
    const kg = getKnowledgeGraph();
    for (const doc of docs) {
      const node = kg.find((n) => n.id === doc.id);
      if (node?.links) {
        doc.links = node.links;
      }
      doc.citations = docs
        .filter((d) => d.links.includes(doc.id))
        .map((d) => d.id);
    }

    _documentsCache = docs;
  }
  return _documentsCache;
}

export function getDocument(id: string): Document | undefined {
  return getDocuments().find((d) => d.id === id);
}

export function getDocumentsByCategory(category: DocumentCategory): Document[] {
  return getDocuments().filter((d) => d.category === category);
}

export function getRecentDocuments(limit: number = 10): Document[] {
  return [...getDocuments()]
    .sort((a, b) => (b.created || "").localeCompare(a.created || ""))
    .slice(0, limit);
}

// ── Knowledge Graph ────────────────────────────────────────

export function getKnowledgeGraph(): GraphNode[] {
  return readJSON<{ nodes: GraphNode[] }>("registry/knowledge-graph.json", {
    nodes: [],
  }).nodes;
}

export function getGraphNode(id: string): GraphNode | undefined {
  return getKnowledgeGraph().find((n) => n.id === id);
}

export function getLinkedNodes(nodeId: string): GraphNode[] {
  const node = getGraphNode(nodeId);
  if (!node?.links) return [];
  const kg = getKnowledgeGraph();
  return node.links
    .map((linkId) => kg.find((n) => n.id === linkId))
    .filter(Boolean) as GraphNode[];
}
