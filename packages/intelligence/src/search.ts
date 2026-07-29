// ── Global Search ────────────────────────────────────────
// Cross-mission search across all content types.
// Searches documents, entities, and mission data in a unified index.

import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getSearchIndex,
} from "@bhavya/content-core";

// ── Types ─────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  type: "document" | "entity" | "mission";
  title: string;
  summary: string;
  category: string;
  score: number;
  highlights: string[];
  metadata: Record<string, unknown>;
}

export interface SearchOptions {
  query: string;
  types?: ("document" | "entity" | "mission")[];
  categories?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  facets: {
    types: Record<string, number>;
    categories: Record<string, number>;
  };
}

// ── Search Scoring ────────────────────────────────────────

function calculateDocumentScore(
  doc: { title: string; summary: string; content: string; category: string },
  queryLower: string,
): number {
  let score = 0;
  const titleLower = doc.title.toLowerCase();
  const summaryLower = doc.summary.toLowerCase();
  const contentLower = doc.content.toLowerCase();

  // Title match (highest weight)
  if (titleLower.includes(queryLower)) score += 10;
  if (titleLower.startsWith(queryLower)) score += 5;

  // Summary match
  if (summaryLower.includes(queryLower)) score += 5;

  // Content match
  if (contentLower.includes(queryLower)) score += 1;

  // Category bonus for specific types
  if (doc.category === "rfc") score += 2;
  if (doc.category === "adr") score += 2;
  if (doc.category === "standard") score += 1;

  return score;
}

function calculateEntityScore(
  entity: { name: string; type: string },
  queryLower: string,
): number {
  let score = 0;
  const nameLower = entity.name.toLowerCase();

  if (nameLower.includes(queryLower)) score += 10;
  if (nameLower.startsWith(queryLower)) score += 5;

  return score;
}

// ── Search Functions ──────────────────────────────────────

export function search(options: SearchOptions): SearchResponse {
  const {
    query,
    types = ["document", "entity", "mission"],
    categories,
    limit = 20,
    offset = 0,
  } = options;

  const queryLower = query.toLowerCase().trim();
  if (!queryLower) {
    return {
      results: [],
      total: 0,
      query,
      facets: { types: {}, categories: {} },
    };
  }

  const results: SearchResult[] = [];
  const facets: {
    types: Record<string, number>;
    categories: Record<string, number>;
  } = { types: {}, categories: {} };

  // Search documents
  if (types.includes("document")) {
    const docs = getDocuments();
    for (const doc of docs) {
      const score = calculateDocumentScore(doc, queryLower);
      if (score > 0) {
        const matches = doc.content
          .split("\n")
          .filter((line) => line.toLowerCase().includes(queryLower))
          .slice(0, 3);

        results.push({
          id: doc.id,
          type: "document",
          title: doc.title,
          summary: doc.summary,
          category: doc.category,
          score,
          highlights: matches,
          metadata: {
            status: doc.status,
            created: doc.created,
            readingTime: doc.readingTime,
          },
        });

        facets.types.document = (facets.types.document || 0) + 1;
        facets.categories[doc.category] =
          (facets.categories[doc.category] || 0) + 1;
      }
    }
  }

  // Search entities
  if (types.includes("entity")) {
    const entities = getEntities();
    for (const entity of entities) {
      const score = calculateEntityScore(entity, queryLower);
      if (score > 0) {
        results.push({
          id: entity.id,
          type: "entity",
          title: entity.name,
          summary: `Entity type: ${entity.type}`,
          category: entity.type,
          score,
          highlights: [],
          metadata: {
            mentions: entity.mentions,
            documentIds: entity.documentIds,
          },
        });

        facets.types.entity = (facets.types.entity || 0) + 1;
        facets.categories[entity.type] =
          (facets.categories[entity.type] || 0) + 1;
      }
    }
  }

  // Search knowledge graph
  if (types.includes("mission")) {
    const kg = getKnowledgeGraph();
    for (const node of kg) {
      const titleLower = node.title.toLowerCase();
      if (titleLower.includes(queryLower)) {
        results.push({
          id: node.id,
          type: "mission",
          title: node.title,
          summary: `Type: ${node.type}, Status: ${node.status}`,
          category: node.type,
          score: titleLower.includes(queryLower) ? 8 : 0,
          highlights: [],
          metadata: {
            status: node.status,
            owner: node.owner,
            created: node.created,
          },
        });

        facets.types.mission = (facets.types.mission || 0) + 1;
        facets.categories[node.type] =
          (facets.categories[node.type] || 0) + 1;
      }
    }
  }

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  // Apply pagination
  const paginatedResults = results.slice(offset, offset + limit);

  return {
    results: paginatedResults,
    total: results.length,
    query,
    facets,
  };
}

export function searchDocuments(
  query: string,
  limit: number = 10,
): SearchResult[] {
  return search({ query, types: ["document"], limit }).results;
}

export function searchEntities(
  query: string,
  limit: number = 10,
): SearchResult[] {
  return search({ query, types: ["entity"], limit }).results;
}

export function searchAll(query: string, limit: number = 20): SearchResult[] {
  return search({ query, limit }).results;
}
