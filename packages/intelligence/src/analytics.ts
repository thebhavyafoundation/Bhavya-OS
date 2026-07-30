// ── Cross-Mission Analytics ───────────────────────────────
// Provides analytics across all mission domains.
// Distinguishes operational metrics from knowledge metrics.

import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getMissions,
  getSites,
  getPlantings,
  getVolunteers,
  getAssignments,
  getProjects,
  getHeritageMissions,
  getHeritageAssets,
} from "@bhavya/content-core";

import {
  AnalyticsInsight,
  Metric,
  createInsight,
  createEvidence,
} from "./insight";

// ── Operational Metrics ───────────────────────────────────
// Metrics about active work and operations

export function getOperationalMetrics(): AnalyticsInsight {
  const metrics: Metric[] = [
    {
      name: "Active Missions",
      value: getMissions().length + getHeritageMissions().length,
      unit: "missions",
    },
    {
      name: "Restoration Sites",
      value: getSites().length,
      unit: "sites",
    },
    {
      name: "Trees Planted",
      value: getPlantings().length,
      unit: "plantings",
    },
    {
      name: "Research Projects",
      value: getProjects().length,
      unit: "projects",
    },
    {
      name: "Volunteers",
      value: getVolunteers().length,
      unit: "people",
    },
    {
      name: "Volunteer Assignments",
      value: getAssignments().length,
      unit: "assignments",
    },
    {
      name: "Heritage Assets",
      value: getHeritageAssets().length,
      unit: "assets",
    },
  ];

  const totalActivity = metrics.reduce((sum, m) => sum + m.value, 0);

  return {
    ...createInsight({
      id: `operational-metrics-${Date.now()}`,
      title: "Operational Overview",
      description: `${totalActivity} total operational activities across all missions`,
      confidence: 1,
      evidence: [
        createEvidence({
          sourceId: "content-core",
          sourceType: "document",
          relevance: "Aggregated from all mission domains",
        }),
      ],
      data: {
        type: "operational",
        metrics,
        summary: `${getMissions().length} Forest missions, ${getHeritageMissions().length} Heritage missions, ${getProjects().length} Research projects, ${getVolunteers().length} Volunteers`,
      },
    }),
    category: "analytics",
  };
}

// ── Knowledge Metrics ─────────────────────────────────────
// Metrics about the knowledge base and its health

export function getKnowledgeMetrics(): AnalyticsInsight {
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();

  // Document metrics
  const publishedDocs = docs.filter((d) => d.status === "published").length;
  const draftDocs = docs.filter((d) => d.status === "draft").length;

  // Entity metrics
  const entitiesWithDocs = entities.filter(
    (e) => e.documentIds.length > 0,
  ).length;
  const entityCoverage =
    entities.length > 0
      ? Math.round((entitiesWithDocs / entities.length) * 100)
      : 0;

  // Relationship metrics
  const totalEdges = kg.reduce((sum, n) => sum + (n.links?.length || 0), 0);
  const avgConnections =
    kg.length > 0 ? (totalEdges / kg.length) * 2 : 0;

  // Cross-domain connections
  const crossDomainEdges = kg.filter((n) => {
    if (!n.links) return false;
    return n.links.some((linkId) => {
      const linked = kg.find((l) => l.id === linkId);
      return linked && linked.type !== n.type;
    });
  }).length;

  const metrics: Metric[] = [
    {
      name: "Total Documents",
      value: docs.length,
      unit: "documents",
    },
    {
      name: "Published Documents",
      value: publishedDocs,
      unit: "documents",
    },
    {
      name: "Draft Documents",
      value: draftDocs,
      unit: "documents",
    },
    {
      name: "Document Coverage",
      value:
        docs.length > 0
          ? Math.round((publishedDocs / docs.length) * 100)
          : 0,
      unit: "%",
    },
    {
      name: "Total Entities",
      value: entities.length,
      unit: "entities",
    },
    {
      name: "Entities with Documents",
      value: entitiesWithDocs,
      unit: "entities",
    },
    {
      name: "Entity Coverage",
      value: entityCoverage,
      unit: "%",
    },
    {
      name: "Knowledge Graph Nodes",
      value: kg.length,
      unit: "nodes",
    },
    {
      name: "Relationship Edges",
      value: totalEdges,
      unit: "edges",
    },
    {
      name: "Average Connections",
      value: avgConnections,
      unit: "per node",
    },
    {
      name: "Cross-Domain Connections",
      value: crossDomainEdges,
      unit: "connections",
    },
  ];

  return {
    ...createInsight({
      id: `knowledge-metrics-${Date.now()}`,
      title: "Knowledge Base Health",
      description: `${docs.length} documents, ${entities.length} entities, ${kg.length} knowledge graph nodes`,
      confidence: 1,
      evidence: [
        createEvidence({
          sourceId: "content-core",
          sourceType: "document",
          relevance: "Aggregated from knowledge base",
        }),
      ],
      data: {
        type: "knowledge",
        metrics,
        summary: `${publishedDocs} published docs, ${entityCoverage}% entity coverage, ${crossDomainEdges} cross-domain connections`,
      },
    }),
    category: "analytics",
  };
}

// ── Combined Analytics ────────────────────────────────────

export function getPlatformAnalytics(): AnalyticsInsight[] {
  return [getOperationalMetrics(), getKnowledgeMetrics()];
}

// ── Domain Coverage ───────────────────────────────────────

export function getDomainCoverage(): AnalyticsInsight {
  const docs = getDocuments();

  const domains = [
    { name: "Governance", filter: (d: { category: string }) => d.category === "governance" },
    { name: "Policy", filter: (d: { category: string }) => d.category === "policy" },
    { name: "Standards", filter: (d: { category: string }) => d.category === "standard" },
    { name: "RFCs", filter: (d: { category: string }) => d.category === "rfc" },
    { name: "ADRs", filter: (d: { category: string }) => d.category === "adr" },
    { name: "Releases", filter: (d: { category: string }) => d.category === "release" },
    { name: "Content", filter: (d: { category: string }) => d.category === "content" },
  ];

  const metrics: Metric[] = domains.map(({ name, filter }) => {
    const domainDocs = docs.filter(filter);
    const published = domainDocs.filter((d) => d.status === "published").length;
    const coverage =
      domainDocs.length > 0
        ? Math.round((published / domainDocs.length) * 100)
        : 0;

    return {
      name,
      value: coverage,
      unit: "%",
      trend: coverage >= 80 ? "up" : coverage >= 50 ? "stable" : "down",
    };
  });

  return {
    ...createInsight({
      id: `domain-coverage-${Date.now()}`,
      title: "Domain Coverage",
      description: `Coverage across ${domains.length} content domains`,
      confidence: 1,
      evidence: [
        createEvidence({
          sourceId: "content-core",
          sourceType: "document",
          relevance: "Domain coverage analysis",
        }),
      ],
      data: {
        type: "knowledge",
        metrics,
        summary: `Average coverage: ${Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length)}%`,
      },
    }),
    category: "analytics",
  };
}
