// ── Global Search ────────────────────────────────────────
// Cross-mission search across all content types.
// Returns SearchInsight with unified results.

import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
} from "@bhavya/content-core";

import {
  SearchInsight,
  SearchResult,
  SearchFacets,
  createInsight,
  createEvidence,
  calculateConfidence,
} from "./insight";

// ── Search Options ────────────────────────────────────────

export interface SearchOptions {
  query: string;
  types?: ("document" | "entity" | "mission")[];
  categories?: string[];
  limit?: number;
  offset?: number;
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

  if (titleLower.includes(queryLower)) score += 10;
  if (titleLower.startsWith(queryLower)) score += 5;
  if (summaryLower.includes(queryLower)) score += 5;
  if (contentLower.includes(queryLower)) score += 1;

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

// ── Search Function ───────────────────────────────────────

export function search(options: SearchOptions): SearchInsight {
  const {
    query,
    types = ["document", "entity", "mission"],
    limit = 20,
    offset = 0,
  } = options;

  const queryLower = query.toLowerCase().trim();
  const results: SearchResult[] = [];
  const facets: SearchFacets = { types: {}, categories: {} };
  const evidence: ReturnType<typeof createEvidence>[] = [];

  if (!queryLower) {
    return createInsight({
      id: `search-${Date.now()}`,
      title: "Empty Search",
      description: "No search query provided",
      confidence: 0,
      evidence: [],
      data: { query, results: [], facets },
    });
  }

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
          score,
          highlights: matches,
        });

        facets.types.document = (facets.types.document || 0) + 1;
        facets.categories[doc.category] =
          (facets.categories[doc.category] || 0) + 1;

        evidence.push(
          createEvidence({
            sourceId: doc.id,
            sourceType: "document",
            relevance: `Matches "${query}" in ${doc.category}`,
            weight: score / 10,
          }),
        );
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
          score,
          highlights: [],
        });

        facets.types.entity = (facets.types.entity || 0) + 1;
        facets.categories[entity.type] =
          (facets.categories[entity.type] || 0) + 1;

        evidence.push(
          createEvidence({
            sourceId: entity.id,
            sourceType: "entity",
            relevance: `Entity "${entity.name}" matches query`,
            weight: score / 10,
          }),
        );
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
          score: titleLower.includes(queryLower) ? 8 : 0,
          highlights: [],
        });

        facets.types.mission = (facets.types.mission || 0) + 1;
        facets.categories[node.type] =
          (facets.categories[node.type] || 0) + 1;

        evidence.push(
          createEvidence({
            sourceId: node.id,
            sourceType: "mission",
            relevance: `Mission "${node.title}" matches query`,
            weight: 0.8,
          }),
        );
      }
    }
  }

  // Sort by score
  results.sort((a, b) => b.score - a.score);
  const paginatedResults = results.slice(offset, offset + limit);

  // Calculate confidence
  const confidence = calculateConfidence({
    dataCompleteness: results.length > 0 ? 1 : 0.1,
    sourceCount: evidence.length,
    recency: 1,
  });

  return createInsight({
    id: `search-${query.replace(/\s+/g, "-")}-${Date.now()}`,
    title: `Search Results for "${query}"`,
    description: `Found ${results.length} results across ${Object.keys(facets.types).length} content types`,
    confidence,
    evidence: evidence.slice(0, 10),
    data: { query, results: paginatedResults, facets },
  });
}

export function searchDocuments(
  query: string,
  limit: number = 10,
): SearchInsight {
  return search({ query, types: ["document"], limit });
}

export function searchEntities(
  query: string,
  limit: number = 10,
): SearchInsight {
  return search({ query, types: ["entity"], limit });
}

export function searchAll(query: string, limit: number = 20): SearchInsight {
  return search({ query, limit });
}
