// ── Recommendations Engine ────────────────────────────────
// Surfaces relevant connections across the platform.
// Uses deterministic rules based on shared attributes.

import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
} from "@bhavya/content-core";

import {
  RecommendationInsight,
  Recommendation,
  createInsight,
  createEvidence,
  calculateConfidence,
} from "./insight";

// ── Document Recommendations ──────────────────────────────

function getDocumentRecommendations(
  docId: string,
  limit: number,
): RecommendationInsight {
  const docs = getDocuments();
  const doc = docs.find((d) => d.id === docId);
  if (!doc) {
    return {
      ...createInsight({
        id: `rec-doc-${docId}-not-found`,
        title: "Document Not Found",
        description: `No document found with ID "${docId}"`,
        confidence: 1,
        evidence: [],
        data: { targetId: docId, targetType: "document", recommendations: [] },
      }),
      category: "recommendation",
    };
  }

  const recommendations: Recommendation[] = [];
  const seen = new Set<string>([docId]);
  const evidence: ReturnType<typeof createEvidence>[] = [];

  // Rule 1: Same category (score: 5)
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

    evidence.push(
      createEvidence({
        sourceId: d.id,
        sourceType: "document",
        relevance: `Shares category "${d.category}"`,
        weight: 0.5,
      }),
    );
  }

  // Rule 2: Shared tags (score: 3 + tag count)
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

    evidence.push(
      createEvidence({
        sourceId: d.id,
        sourceType: "document",
        relevance: `Shares ${commonTags.length} tag(s)`,
        weight: 0.4,
      }),
    );
  }

  // Rule 3: Knowledge graph links (score: 8)
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

          evidence.push(
            createEvidence({
              sourceId: linkedDoc.id,
              sourceType: "document",
              relevance: "Directly linked in knowledge graph",
              weight: 0.8,
            }),
          );
        }
      }
    }
  }

  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);
  const topRecommendations = recommendations.slice(0, limit);

  const confidence = calculateConfidence({
    dataCompleteness: recommendations.length > 0 ? 1 : 0.1,
    sourceCount: evidence.length,
    recency: 1,
  });

  return {
    ...createInsight({
      id: `rec-doc-${docId}`,
      title: `Recommendations for: ${doc.title}`,
      description: `${topRecommendations.length} related items found`,
      confidence,
      evidence: evidence.slice(0, 5),
      data: {
        targetId: docId,
        targetType: "document",
        recommendations: topRecommendations,
      },
    }),
    category: "recommendation",
  };
}

// ── Entity Recommendations ────────────────────────────────

function getEntityRecommendations(
  entityId: string,
  limit: number,
): RecommendationInsight {
  const entities = getEntities();
  const entity = entities.find((e) => e.id === entityId);
  if (!entity) {
    return {
      ...createInsight({
        id: `rec-entity-${entityId}-not-found`,
        title: "Entity Not Found",
        description: `No entity found with ID "${entityId}"`,
        confidence: 1,
        evidence: [],
        data: { targetId: entityId, targetType: "entity", recommendations: [] },
      }),
      category: "recommendation",
    };
  }

  const recommendations: Recommendation[] = [];
  const seen = new Set<string>([entityId]);
  const evidence: ReturnType<typeof createEvidence>[] = [];

  // Rule 1: Same type (score: 5)
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

    evidence.push(
      createEvidence({
        sourceId: e.id,
        sourceType: "entity",
        relevance: `Shares type "${e.type}"`,
        weight: 0.5,
      }),
    );
  }

  // Rule 2: Shared documents (score: 4 + doc count)
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

    evidence.push(
      createEvidence({
        sourceId: e.id,
        sourceType: "entity",
        relevance: `Co-mentioned in ${commonDocs.length} documents`,
        weight: 0.6,
      }),
    );
  }

  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);
  const topRecommendations = recommendations.slice(0, limit);

  const confidence = calculateConfidence({
    dataCompleteness: recommendations.length > 0 ? 1 : 0.1,
    sourceCount: evidence.length,
    recency: 1,
  });

  return {
    ...createInsight({
      id: `rec-entity-${entityId}`,
      title: `Recommendations for: ${entity.name}`,
      description: `${topRecommendations.length} related entities found`,
      confidence,
      evidence: evidence.slice(0, 5),
      data: {
        targetId: entityId,
        targetType: "entity",
        recommendations: topRecommendations,
      },
    }),
    category: "recommendation",
  };
}

// ── Mission Recommendations ───────────────────────────────

function getMissionRecommendations(
  missionId: string,
  limit: number,
): RecommendationInsight {
  const kg = getKnowledgeGraph();
  const mission = kg.find((n) => n.id === missionId);
  if (!mission) {
    return {
      ...createInsight({
        id: `rec-mission-${missionId}-not-found`,
        title: "Mission Not Found",
        description: `No mission found with ID "${missionId}"`,
        confidence: 1,
        evidence: [],
        data: { targetId: missionId, targetType: "mission", recommendations: [] },
      }),
      category: "recommendation",
    };
  }

  const recommendations: Recommendation[] = [];
  const seen = new Set<string>([missionId]);
  const evidence: ReturnType<typeof createEvidence>[] = [];

  // Rule 1: Direct links (score: 10)
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

        evidence.push(
          createEvidence({
            sourceId: linkedNode.id,
            sourceType: "mission",
            relevance: "Direct knowledge graph link",
            weight: 1,
          }),
        );
      }
    }
  }

  // Rule 2: Same type (score: 5)
  const sameType = kg.filter(
    (n) => n.id !== missionId && n.type === mission.type && !seen.has(n.id),
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

    evidence.push(
      createEvidence({
        sourceId: n.id,
        sourceType: "mission",
        relevance: `Shares type "${n.type}"`,
        weight: 0.5,
      }),
    );
  }

  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);
  const topRecommendations = recommendations.slice(0, limit);

  const confidence = calculateConfidence({
    dataCompleteness: recommendations.length > 0 ? 1 : 0.1,
    sourceCount: evidence.length,
    recency: 1,
  });

  return {
    ...createInsight({
      id: `rec-mission-${missionId}`,
      title: `Recommendations for: ${mission.title}`,
      description: `${topRecommendations.length} related missions found`,
      confidence,
      evidence: evidence.slice(0, 5),
      data: {
        targetId: missionId,
        targetType: "mission",
        recommendations: topRecommendations,
      },
    }),
    category: "recommendation",
  };
}

// ── Main Recommendation Function ──────────────────────────

export function getRecommendations(
  id: string,
  type: "document" | "entity" | "mission",
  limit: number = 5,
): RecommendationInsight {
  switch (type) {
    case "document":
      return getDocumentRecommendations(id, limit);
    case "entity":
      return getEntityRecommendations(id, limit);
    case "mission":
      return getMissionRecommendations(id, limit);
    default:
      return {
        ...createInsight({
          id: `rec-unknown-${id}`,
          title: "Unknown Type",
          description: `Unknown recommendation type: ${type}`,
          confidence: 0,
          evidence: [],
          data: { targetId: id, targetType: type, recommendations: [] },
        }),
        category: "recommendation",
      };
  }
}

// ── Related Content (Simple) ──────────────────────────────

export function getRelatedDocuments(docId: string): string[] {
  const docs = getDocuments();
  const doc = docs.find((d) => d.id === docId);
  if (!doc) return [];

  const related = new Set<string>();

  for (const d of docs) {
    if (d.id !== docId && d.category === doc.category) {
      related.add(d.id);
    }
  }

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

  for (const e of entities) {
    if (e.id !== entityId && e.type === entity.type) {
      related.add(e.id);
    }
  }

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
