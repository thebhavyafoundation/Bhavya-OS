// ── Recommendations Engine ────────────────────────────────
// Surfaces relevant connections across the platform.
// Uses the knowledge graph to find related content, entities, and missions.

import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getGraphNode,
} from "@bhavya/content-core";

// ── Types ─────────────────────────────────────────────────

export interface Recommendation {
  id: string;
  type: "document" | "entity" | "mission";
  title: string;
  reason: string;
  score: number;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  total: number;
}

// ── Helper Functions ──────────────────────────────────────

function getDocumentRecommendations(
  docId: string,
  limit: number,
): Recommendation[] {
  const docs = getDocuments();
  const doc = docs.find((d) => d.id === docId);
  if (!doc) return [];

  const recommendations: Recommendation[] = [];
  const seen = new Set<string>([docId]);

  // Find documents with same category
  const sameCategory = docs.filter(
    (d) => d.id !== docId && d.category === doc.category && !seen.has(d.id),
  );

  for (const d of sameCategory.slice(0, limit)) {
    recommendations.push({
      id: d.id,
      type: "document",
      title: d.title,
      reason: `Same category: ${d.category}`,
      score: 5,
    });
    seen.add(d.id);
  }

  // Find documents with shared tags
  const sharedTags = docs.filter(
    (d) =>
      d.id !== docId &&
      !seen.has(d.id) &&
      d.tags.some((t) => doc.tags.includes(t)),
  );

  for (const d of sharedTags.slice(0, limit)) {
    const commonTags = d.tags.filter((t) => doc.tags.includes(t));
    recommendations.push({
      id: d.id,
      type: "document",
      title: d.title,
      reason: `Shared tags: ${commonTags.join(", ")}`,
      score: 3 + commonTags.length,
    });
    seen.add(d.id);
  }

  // Find documents linked in knowledge graph
  const kg = getKnowledgeGraph();
  const kgNode = kg.find((n) => n.id === docId);
  if (kgNode?.links) {
    for (const linkId of kgNode.links) {
      if (!seen.has(linkId)) {
        const linkedDoc = docs.find((d) => d.id === linkId);
        if (linkedDoc) {
          recommendations.push({
            id: linkedDoc.id,
            type: "document",
            title: linkedDoc.title,
            reason: "Linked in knowledge graph",
            score: 8,
          });
          seen.add(linkedDoc.id);
        }
      }
    }
  }

  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit);
}

function getEntityRecommendations(
  entityId: string,
  limit: number,
): Recommendation[] {
  const entities = getEntities();
  const entity = entities.find((e) => e.id === entityId);
  if (!entity) return [];

  const recommendations: Recommendation[] = [];
  const seen = new Set<string>([entityId]);

  // Find entities of same type
  const sameType = entities.filter(
    (e) => e.id !== entityId && e.type === entity.type && !seen.has(e.id),
  );

  for (const e of sameType.slice(0, limit)) {
    recommendations.push({
      id: e.id,
      type: "entity",
      title: e.name,
      reason: `Same type: ${e.type}`,
      score: 5,
    });
    seen.add(e.id);
  }

  // Find entities that share documents
  const sharedDocs = entities.filter(
    (e) =>
      e.id !== entityId &&
      !seen.has(e.id) &&
      e.documentIds.some((d) => entity.documentIds.includes(d)),
  );

  for (const e of sharedDocs.slice(0, limit)) {
    const commonDocs = e.documentIds.filter((d) =>
      entity.documentIds.includes(d),
    );
    recommendations.push({
      id: e.id,
      type: "entity",
      title: e.name,
      reason: `Co-mentioned in ${commonDocs.length} document(s)`,
      score: 4 + commonDocs.length,
    });
    seen.add(e.id);
  }

  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit);
}

function getMissionRecommendations(
  missionId: string,
  limit: number,
): Recommendation[] {
  const kg = getKnowledgeGraph();
  const mission = kg.find((n) => n.id === missionId);
  if (!mission) return [];

  const recommendations: Recommendation[] = [];
  const seen = new Set<string>([missionId]);

  // Find linked missions
  if (mission.links) {
    for (const linkId of mission.links) {
      const linkedNode = kg.find((n) => n.id === linkId);
      if (linkedNode && !seen.has(linkedNode.id)) {
        recommendations.push({
          id: linkedNode.id,
          type: "mission",
          title: linkedNode.title,
          reason: "Directly linked",
          score: 10,
        });
        seen.add(linkedNode.id);
      }
    }
  }

  // Find missions of same type
  const sameType = kg.filter(
    (n) =>
      n.id !== missionId &&
      n.type === mission.type &&
      !seen.has(n.id),
  );

  for (const n of sameType.slice(0, limit)) {
    recommendations.push({
      id: n.id,
      type: "mission",
      title: n.title,
      reason: `Same type: ${n.type}`,
      score: 5,
    });
    seen.add(n.id);
  }

  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit);
}

// ── Main Recommendation Function ──────────────────────────

export function getRecommendations(
  id: string,
  type: "document" | "entity" | "mission",
  limit: number = 5,
): RecommendationsResponse {
  let recommendations: Recommendation[];

  switch (type) {
    case "document":
      recommendations = getDocumentRecommendations(id, limit);
      break;
    case "entity":
      recommendations = getEntityRecommendations(id, limit);
      break;
    case "mission":
      recommendations = getMissionRecommendations(id, limit);
      break;
    default:
      recommendations = [];
  }

  return {
    recommendations,
    total: recommendations.length,
  };
}

// ── Related Content ───────────────────────────────────────

export function getRelatedDocuments(docId: string): string[] {
  const docs = getDocuments();
  const doc = docs.find((d) => d.id === docId);
  if (!doc) return [];

  const related = new Set<string>();

  // Documents with same category
  for (const d of docs) {
    if (d.id !== docId && d.category === doc.category) {
      related.add(d.id);
    }
  }

  // Documents with shared tags
  for (const d of docs) {
    if (d.id !== docId && d.tags.some((t) => doc.tags.includes(t))) {
      related.add(d.id);
    }
  }

  return Array.from(related);
}

export function getRelatedEntities(entityId: string): string[] {
  const entities = getEntities();
  const entity = entities.find((e) => e.id === entityId);
  if (!entity) return [];

  const related = new Set<string>();

  // Entities of same type
  for (const e of entities) {
    if (e.id !== entityId && e.type === entity.type) {
      related.add(e.id);
    }
  }

  // Entities that share documents
  for (const e of entities) {
    if (
      e.id !== entityId &&
      e.documentIds.some((d) => entity.documentIds.includes(d))
    ) {
      related.add(e.id);
    }
  }

  return Array.from(related);
}
