import { Document, ContentStats, DocumentCategory } from "./models";
import { getDocuments, getKnowledgeGraph } from "./documents";
import { getCollections } from "./collections";
import { getEntities } from "./entities";

// ── Search Index ───────────────────────────────────────────

export interface SearchDocument {
  id: string;
  title: string;
  category: string;
  path: string;
  content: string;
  tags?: string[];
  summary?: string;
}

let _searchIndexCache: SearchDocument[] | null = null;

export function getSearchIndex(): SearchDocument[] {
  if (!_searchIndexCache) {
    _searchIndexCache = getDocuments().map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      path: d.path,
      content: d.content,
      tags: d.tags,
      summary: d.summary,
    }));
  }
  return _searchIndexCache;
}

// ── Search ─────────────────────────────────────────────────

export function searchAll(query: string): SearchDocument[] {
  const q = query.toLowerCase();
  return getSearchIndex().filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q) ||
      doc.tags?.some((t) => t.toLowerCase().includes(q)),
  );
}

export function searchDocuments(query: string): Document[] {
  const q = query.toLowerCase();
  return getDocuments().filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export function getContentStats(): ContentStats {
  const documents = getDocuments();
  const graphNodes = getKnowledgeGraph();
  const collections = getCollections();
  const entities = getEntities();
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
    source: 0,
    evidence: 0,
  };

  for (const doc of documents) {
    documentsByCategory[doc.category]++;
  }

  return {
    totalDocuments: documents.length,
    documentsByCategory,
    totalGraphNodes: graphNodes.length,
    totalCollections: collections.length,
    totalEntities: entities.length,
    totalSearchResults: searchIndex.length,
    recentDocuments: [...documents]
      .sort((a, b) => (b.created || "").localeCompare(a.created || ""))
      .slice(0, 10),
  };
}
