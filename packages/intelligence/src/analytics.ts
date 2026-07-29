// ── Cross-Mission Analytics ───────────────────────────────
// Provides analytics across all mission domains.
// Answers institutional questions about progress, coverage, and impact.

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

// ── Types ─────────────────────────────────────────────────

export interface MissionSummary {
  mission: string;
  documents: number;
  entities: number;
  activities: number;
  status: "active" | "growing" | "stable";
}

export interface ActivityTimeline {
  period: string;
  documents: number;
  entities: number;
  missions: number;
}

export interface DomainCoverage {
  domain: string;
  total: number;
  published: number;
  draft: number;
  coverage: number;
}

export interface PlatformOverview {
  totalDocuments: number;
  totalEntities: number;
  totalMissions: number;
  totalRelationships: number;
  documentsByCategory: Record<string, number>;
  entitiesByType: Record<string, number>;
  missionSummaries: MissionSummary[];
}

// ── Analytics Functions ───────────────────────────────────

export function getPlatformOverview(): PlatformOverview {
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();

  // Documents by category
  const documentsByCategory: Record<string, number> = {};
  for (const doc of docs) {
    documentsByCategory[doc.category] =
      (documentsByCategory[doc.category] || 0) + 1;
  }

  // Entities by type
  const entitiesByType: Record<string, number> = {};
  for (const entity of entities) {
    entitiesByType[entity.type] = (entitiesByType[entity.type] || 0) + 1;
  }

  // Mission summaries
  const missionSummaries: MissionSummary[] = [
    {
      mission: "Forest",
      documents: docs.filter(
        (d) => d.category === "content" && d.id.includes("nature"),
      ).length,
      entities: entities.filter((e) => e.type === "species").length,
      activities: getMissions().length + getSites().length,
      status: "active",
    },
    {
      mission: "Heritage",
      documents: docs.filter(
        (d) => d.category === "content" && d.id.includes("heritage"),
      ).length,
      entities: entities.filter((e) => e.id.includes("heritage")).length,
      activities:
        getHeritageMissions().length + getHeritageAssets().length,
      status: "active",
    },
    {
      mission: "Research",
      documents: docs.filter((d) => d.category === "rfc").length,
      entities: entities.filter((e) => e.type === "technology").length,
      activities: getProjects().length,
      status: "growing",
    },
    {
      mission: "Volunteer",
      documents: docs.filter(
        (d) => d.category === "content" && d.id.includes("community"),
      ).length,
      entities: entities.filter((e) => e.type === "person").length,
      activities: getVolunteers().length + getAssignments().length,
      status: "growing",
    },
  ];

  return {
    totalDocuments: docs.length,
    totalEntities: entities.length,
    totalMissions: kg.length,
    totalRelationships: kg.reduce((sum, n) => sum + (n.links?.length || 0), 0),
    documentsByCategory,
    entitiesByType,
    missionSummaries,
  };
}

export function getDomainCoverage(): DomainCoverage[] {
  const docs = getDocuments();

  const domains = [
    { domain: "Governance", filter: (d: { category: string }) => d.category === "governance" },
    { domain: "Policy", filter: (d: { category: string }) => d.category === "policy" },
    { domain: "Standards", filter: (d: { category: string }) => d.category === "standard" },
    { domain: "RFCs", filter: (d: { category: string }) => d.category === "rfc" },
    { domain: "ADRs", filter: (d: { category: string }) => d.category === "adr" },
    { domain: "Releases", filter: (d: { category: string }) => d.category === "release" },
    { domain: "Content", filter: (d: { category: string }) => d.category === "content" },
  ];

  return domains.map(({ domain, filter }) => {
    const domainDocs = docs.filter(filter);
    const published = domainDocs.filter((d) => d.status === "published").length;
    const draft = domainDocs.filter((d) => d.status === "draft").length;

    return {
      domain,
      total: domainDocs.length,
      published,
      draft,
      coverage:
        domainDocs.length > 0
          ? Math.round((published / domainDocs.length) * 100)
          : 0,
    };
  });
}

export function getMissionActivity(): {
  forest: number;
  heritage: number;
  research: number;
  volunteer: number;
} {
  return {
    forest:
      getMissions().length +
      getSites().length +
      getPlantings().length,
    heritage:
      getHeritageMissions().length + getHeritageAssets().length,
    research: getProjects().length,
    volunteer: getVolunteers().length + getAssignments().length,
  };
}

export function getEntityTypeDistribution(): Record<string, number> {
  const entities = getEntities();
  const distribution: Record<string, number> = {};

  for (const entity of entities) {
    distribution[entity.type] = (distribution[entity.type] || 0) + 1;
  }

  return distribution;
}

export function getDocumentStatusDistribution(): Record<string, number> {
  const docs = getDocuments();
  const distribution: Record<string, number> = {};

  for (const doc of docs) {
    distribution[doc.status] = (distribution[doc.status] || 0) + 1;
  }

  return distribution;
}

export function getKnowledgeGraphStats(): {
  totalNodes: number;
  totalEdges: number;
  averageConnections: number;
  nodesByType: Record<string, number>;
} {
  const kg = getKnowledgeGraph();
  const nodesByType: Record<string, number> = {};

  for (const node of kg) {
    nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
  }

  const totalEdges = kg.reduce((sum, n) => sum + (n.links?.length || 0), 0);
  const averageConnections =
    kg.length > 0 ? (totalEdges / kg.length) * 2 : 0;

  return {
    totalNodes: kg.length,
    totalEdges,
    averageConnections: Math.round(averageConnections * 100) / 100,
    nodesByType,
  };
}
