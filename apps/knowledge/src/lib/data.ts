import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "../..");

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    const full = path.isAbsolute(filePath)
      ? filePath
      : path.join(ROOT, filePath);
    if (fs.existsSync(full)) {
      return JSON.parse(fs.readFileSync(full, "utf8"));
    }
  } catch {
    /* fallback */
  }
  return fallback;
}

function readMD(filePath: string): string {
  try {
    const full = path.isAbsolute(filePath)
      ? filePath
      : path.join(ROOT, filePath);
    if (fs.existsSync(full)) {
      return fs.readFileSync(full, "utf8");
    }
  } catch {
    /* fallback */
  }
  return "";
}

function listDir(dirPath: string): string[] {
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

// ── Document Types ────────────────────────────────────────

export type DocumentCategory =
  | "governance"
  | "policy"
  | "standard"
  | "adr"
  | "rfc"
  | "release"
  | "research"
  | "report"
  | "project"
  | "content"
  | "financial";

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  path: string;
  content: string;
  summary: string;
  tags: string[];
  status?: string;
  owner?: string;
  created?: string;
  updated?: string;
  links: string[];
  citations: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  documentIds: string[];
  category: DocumentCategory;
  created: string;
}

export interface GraphNode {
  id: string;
  type: string;
  title: string;
  owner?: string;
  status?: string;
  created?: string;
  updated?: string;
  links?: string[];
}

export interface SearchDocument {
  id: string;
  title: string;
  category: string;
  path: string;
  content: string;
  tags?: string[];
}

// ── Documents ─────────────────────────────────────────────

function buildDocuments(): KnowledgeDocument[] {
  const docs: KnowledgeDocument[] = [];

  // ADRs
  const adrFiles = listDir("governance/adr");
  for (const f of adrFiles) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`governance/adr/${f}`);
    const titleMatch = content.match(/^# (.+)/m);
    const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/i);
    const dateMatch = content.match(/\*\*Date:\*\*\s*(.+)/i);
    const id = f.replace(".md", "");
    docs.push({
      id,
      title: titleMatch?.[1]?.replace(/^ADR-\d+\s*--\s*/, "") || f,
      category: "adr",
      path: `/documents/${id}`,
      content,
      summary:
        content
          .split("\n")
          .find((l) => l.length > 20 && !l.startsWith("#"))
          ?.trim() || "",
      tags: ["adr", "governance", "architecture"],
      status: statusMatch?.[1]?.trim(),
      created: dateMatch?.[1]?.trim(),
      links: [],
      citations: [],
    });
  }

  // RFCs
  const rfcFiles = listDir("rfcs");
  for (const f of rfcFiles) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`rfcs/${f}`);
    const titleMatch = content.match(/^# (.+)/m);
    const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/i);
    const id = f.replace(".md", "");
    docs.push({
      id,
      title: titleMatch?.[1] || f.replace(/-/g, " ").replace(".md", ""),
      category: "rfc",
      path: `/documents/${id}`,
      content,
      summary:
        content
          .split("\n")
          .find((l) => l.length > 20 && !l.startsWith("#"))
          ?.trim() || "",
      tags: ["rfc", "technical"],
      status: statusMatch?.[1]?.trim(),
      links: [],
      citations: [],
    });
  }

  // Standards
  const standardFiles = listDir("standards");
  for (const f of standardFiles) {
    if (!f.endsWith(".md")) continue;
    const content = readMD(`standards/${f}`);
    const titleMatch = content.match(/^# (.+)/m);
    const id = f.replace(".md", "");
    docs.push({
      id: `standard-${id}`,
      title: titleMatch?.[1] || f.replace(/-/g, " ").replace(".md", ""),
      category: "standard",
      path: `/documents/standard-${id}`,
      content,
      summary:
        content
          .split("\n")
          .find((l) => l.length > 20 && !l.startsWith("#"))
          ?.trim() || "",
      tags: ["standard", "engineering"],
      status: "Active",
      links: [],
      citations: [],
    });
  }

  // Governance documents
  const govFiles = listDir("content/governance");
  for (const f of govFiles) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/governance/${f}`, {});
    if (!data.id) continue;
    const content =
      data.sections
        ?.map(
          (s: { heading: string; body: string }) =>
            `## ${s.heading}\n\n${s.body}`,
        )
        .join("\n\n") || "";
    docs.push({
      id: data.id,
      title: data.title || f,
      category: "governance",
      path: `/documents/${data.id}`,
      content,
      summary: data.summary || "",
      tags: ["governance", data.type || "document"],
      status: data.status,
      links: [],
      citations: [],
    });
  }

  // Policies
  const policyFiles = listDir("content/policies");
  for (const f of policyFiles) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/policies/${f}`, {});
    if (!data.id) continue;
    const content =
      data.sections
        ?.map(
          (s: { heading: string; body: string }) =>
            `## ${s.heading}\n\n${s.body}`,
        )
        .join("\n\n") || "";
    docs.push({
      id: data.id,
      title: data.title || f,
      category: "policy",
      path: `/documents/${data.id}`,
      content,
      summary: data.description || "",
      tags: ["policy"],
      status: data.status,
      links: [],
      citations: [],
    });
  }

  // Releases
  const releaseFiles = listDir("content/releases");
  for (const f of releaseFiles) {
    if (!f.endsWith(".json")) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = readJSON<any>(`content/releases/${f}`, {});
    if (!data.id) continue;
    docs.push({
      id: data.id,
      title: `${data.version} — ${data.name}`,
      category: "release",
      path: `/documents/${data.id}`,
      content: `# ${data.version} — ${data.name}\n\n${data.description}\n\n## Highlights\n\n${data.highlights?.map((h: string) => `- ${h}`).join("\n") || ""}`,
      summary: data.description || "",
      tags: ["release", data.status?.toLowerCase() || "stable"],
      status: data.status,
      created: data.date,
      links: [],
      citations: [],
    });
  }

  // Content pages
  const contentFiles = listDir("content");
  for (const f of contentFiles) {
    if (!f.endsWith(".mdx")) continue;
    const content = readMD(`content/${f}`);
    const titleMatch = content.match(/^title:\s*(.+)/m);
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
      links: [],
      citations: [],
    });
  }

  return docs;
}

let _documentsCache: KnowledgeDocument[] | null = null;

export function getDocuments(): KnowledgeDocument[] {
  if (!_documentsCache) {
    _documentsCache = buildDocuments();
    // Build cross-references
    const kg = getKnowledgeGraph();
    for (const doc of _documentsCache) {
      const node = kg.find((n) => n.id === doc.id);
      if (node?.links) {
        doc.links = node.links;
      }
      // Find documents that cite this one
      doc.citations = _documentsCache
        .filter((d) => d.links.includes(doc.id))
        .map((d) => d.id);
    }
  }
  return _documentsCache;
}

export function getDocument(id: string): KnowledgeDocument | undefined {
  return getDocuments().find((d) => d.id === id);
}

export function getDocumentsByCategory(
  category: DocumentCategory,
): KnowledgeDocument[] {
  return getDocuments().filter((d) => d.category === category);
}

// ── Knowledge Graph ───────────────────────────────────────

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

// ── Search ────────────────────────────────────────────────

export function getSearchIndex(): SearchDocument[] {
  return (
    readJSON<{ documents: SearchDocument[] }>("registry/search-index.json", {
      documents: [],
    }).documents || []
  );
}

export function searchAll(query: string): SearchDocument[] {
  const q = query.toLowerCase();
  return getSearchIndex().filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q) ||
      doc.tags?.some((t) => t.toLowerCase().includes(q)),
  );
}

export function searchDocuments(query: string): KnowledgeDocument[] {
  const q = query.toLowerCase();
  return getDocuments().filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

// ── Collections ───────────────────────────────────────────

const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: "governance-framework",
    name: "Governance Framework",
    description:
      "Core governing documents, decision records, and institutional policies",
    documentIds: [],
    category: "governance",
    created: "2026-07-15",
  },
  {
    id: "engineering-standards",
    name: "Engineering Standards",
    description:
      "Technical standards, architecture rules, and development practices",
    documentIds: [],
    category: "standard",
    created: "2026-07-15",
  },
  {
    id: "decision-records",
    name: "Decision Records (ADRs)",
    description:
      "Architectural Decision Records documenting key technical choices",
    documentIds: [],
    category: "adr",
    created: "2026-07-15",
  },
  {
    id: "technical-rfcs",
    name: "Technical RFCs",
    description:
      "Request for Comments — technical proposals and specifications",
    documentIds: [],
    category: "rfc",
    created: "2026-07-20",
  },
  {
    id: "release-history",
    name: "Release History",
    description: "All platform releases with changelogs and highlights",
    documentIds: [],
    category: "release",
    created: "2026-07-22",
  },
  {
    id: "institutional-policies",
    name: "Institutional Policies",
    description:
      "Organizational policies for governance, ethics, and operations",
    documentIds: [],
    category: "policy",
    created: "2026-07-15",
  },
];

let _collectionsCache: Collection[] | null = null;

export function getCollections(): Collection[] {
  if (!_collectionsCache) {
    _collectionsCache = DEFAULT_COLLECTIONS.map((col) => ({
      ...col,
      documentIds: getDocuments()
        .filter((d) => d.category === col.category)
        .map((d) => d.id),
    }));
  }
  return _collectionsCache;
}

export function getCollection(id: string): Collection | undefined {
  return getCollections().find((c) => c.id === id);
}

// ── Stats ─────────────────────────────────────────────────

export interface KnowledgeStats {
  totalDocuments: number;
  documentsByCategory: Record<DocumentCategory, number>;
  totalGraphNodes: number;
  totalCollections: number;
  totalSearchResults: number;
  recentDocuments: KnowledgeDocument[];
}

export function getKnowledgeStats(): KnowledgeStats {
  const documents = getDocuments();
  const graphNodes = getKnowledgeGraph();
  const collections = getCollections();
  const searchIndex = getSearchIndex();

  const documentsByCategory: Record<DocumentCategory, number> = {
    governance: 0,
    policy: 0,
    standard: 0,
    adr: 0,
    rfc: 0,
    release: 0,
    research: 0,
    report: 0,
    project: 0,
    content: 0,
    financial: 0,
  };

  for (const doc of documents) {
    documentsByCategory[doc.category]++;
  }

  const recentDocuments = [...documents]
    .sort((a, b) => (b.created || "").localeCompare(a.created || ""))
    .slice(0, 10);

  return {
    totalDocuments: documents.length,
    documentsByCategory,
    totalGraphNodes: graphNodes.length,
    totalCollections: collections.length,
    totalSearchResults: searchIndex.length,
    recentDocuments,
  };
}

// ── Entities ──────────────────────────────────────────────

export type EntityType =
  | "person"
  | "organization"
  | "location"
  | "species"
  | "project"
  | "grant"
  | "policy"
  | "law"
  | "event"
  | "concept"
  | "technology"
  | "standard"
  | "release";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  documentIds: string[];
  mentions: number;
}

// Known entities — seeded from governance/registry data
const KNOWN_ENTITIES: Entity[] = [
  {
    id: "entity-founder",
    name: "Shri Manohar Lal",
    type: "person",
    description: "Founder, Bhavya Foundation",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-bhavya",
    name: "Bhavya Foundation",
    type: "organization",
    description: "Restoring Nature. Empowering Humanity. Preserving Heritage.",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-nature",
    name: "Nature Mission",
    type: "project",
    description: "Environmental conservation, plantation, biodiversity",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-knowledge",
    name: "Knowledge Mission",
    type: "project",
    description: "AI Lab, Digital Library, Research, Education",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-heritage",
    name: "Heritage Mission",
    type: "project",
    description: "Temple restoration, archives, yoga, traditional knowledge",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-community",
    name: "Community Mission",
    type: "project",
    description: "Volunteer corps, community engagement",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-ai-gateway",
    name: "AI Gateway",
    type: "technology",
    description: "Provider-agnostic AI abstraction layer",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-bdl",
    name: "Bhavya Design Language",
    type: "standard",
    description: "UI design tokens, typography, visual hierarchy",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-bar",
    name: "Bhavya Architecture Rules",
    type: "standard",
    description: "Monorepo dependency rules, design system isolation",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-bps",
    name: "Bhavya Production Standards",
    type: "standard",
    description: "CI/CD quality gates, bundle budgets, testing requirements",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-himachal",
    name: "Himachal Pradesh",
    type: "location",
    description: "Primary operational region for Bhavya Foundation",
    documentIds: [],
    mentions: 0,
  },
  {
    id: "entity-cedrus",
    name: "Cedrus deodara",
    type: "species",
    description: "Himalayan Cedar — native tree species in plantation programs",
    documentIds: [],
    mentions: 0,
  },
];

let _entitiesCache: Entity[] | null = null;

export function getEntities(): Entity[] {
  if (!_entitiesCache) {
    const docs = getDocuments();
    _entitiesCache = KNOWN_ENTITIES.map((entity) => {
      const matchingDocs = docs.filter((d) => {
        const text = `${d.title} ${d.content} ${d.summary}`.toLowerCase();
        return (
          text.includes(entity.name.toLowerCase()) ||
          entity.name
            .split(" ")
            .some(
              (word) => word.length > 3 && text.includes(word.toLowerCase()),
            )
        );
      });
      return {
        ...entity,
        documentIds: matchingDocs.map((d) => d.id),
        mentions: matchingDocs.length,
      };
    });
  }
  return _entitiesCache;
}

export function getEntity(id: string): Entity | undefined {
  return getEntities().find((e) => e.id === id);
}

export function getEntitiesByType(type: EntityType): Entity[] {
  return getEntities().filter((e) => e.type === type);
}

export function searchEntities(query: string): Entity[] {
  const q = query.toLowerCase();
  return getEntities().filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q),
  );
}
