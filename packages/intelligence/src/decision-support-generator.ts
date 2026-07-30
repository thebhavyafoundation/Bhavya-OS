import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getMissions,
  getHeritageMissions,
  getProjects,
  getVolunteers,
} from "@bhavya/content-core";
import {
  DecisionSupport,
  DataQualityAlert,
  MissionHealthScore,
  KnowledgeGap,
  WorkItem,
} from "./decision-support";
import { createInsight, createEvidence } from "./insight";

export function generateDecisionSupport(): DecisionSupport {
  return {
    dataQualityAlerts: generateDataQualityAlerts(),
    missionHealthScores: generateMissionHealthScores(),
    knowledgeGaps: generateKnowledgeGaps(),
    workQueue: generateWorkQueue(),
  };
}

function generateDataQualityAlerts() {
  const alerts: DataQualityAlert[] = [];
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();

  // Check for documents without content
  const docsWithoutContent = docs.filter((d) => !d.content || d.content.trim().length === 0);
  if (docsWithoutContent.length > 0) {
    alerts.push({
      type: "missing_content",
      severity: "high",
      affectedItems: docsWithoutContent.map((d) => d.id),
      recommendation: `${docsWithoutContent.length} documents have no content. Add content to improve knowledge base quality.`,
    });
  }

  // Check for entities without relationships
  const entitiesWithoutRelationships = entities.filter(
    (e) => !kg.find((n) => n.id === e.id)?.links?.length
  );
  if (entitiesWithoutRelationships.length > 0) {
    alerts.push({
      type: "missing_relationship",
      severity: "medium",
      affectedItems: entitiesWithoutRelationships.map((e) => e.id),
      recommendation: `${entitiesWithoutRelationships.length} entities have no relationships. Add connections to improve knowledge graph.`,
    });
  }

  // Check for low coverage areas
  const docsByCategory: Record<string, { total: number; published: number }> = {};
  for (const doc of docs) {
    if (!docsByCategory[doc.category]) {
      docsByCategory[doc.category] = { total: 0, published: 0 };
    }
    docsByCategory[doc.category].total++;
    if (doc.status === "published") {
      docsByCategory[doc.category].published++;
    }
  }

  for (const [category, stats] of Object.entries(docsByCategory)) {
    const coverage = stats.total > 0 ? stats.published / stats.total : 0;
    if (coverage < 0.7) {
      alerts.push({
        type: "low_coverage",
        severity: "medium",
        affectedItems: [category],
        recommendation: `Category "${category}" has ${Math.round(coverage * 100)}% publication rate. Review and publish pending documents.`,
      });
    }
  }

  return alerts.map((alert, i) =>
    createInsight({
      id: `quality-alert-${i}`,
      title: `Data Quality: ${alert.type.replace(/_/g, " ")}`,
      description: alert.recommendation,
      confidence: alert.severity === "high" ? 0.9 : alert.severity === "medium" ? 0.7 : 0.5,
      evidence: [createEvidence({ sourceId: "data-quality-check", sourceType: "document", relevance: "Automated data quality analysis" })],
      data: alert,
    })
  );
}

function generateMissionHealthScores() {
  const scores: MissionHealthScore[] = [];
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();

  // Forest missions
  const forestMissions = getMissions();
  for (const mission of forestMissions) {
    const missionDocs = docs.filter((d) => d.mission === mission.id);
    const missionEntities = entities.filter((e) => e.type === "species" || e.type === "location");

    const factors = [
      {
        name: "Documentation",
        score: Math.min(missionDocs.length / 5, 1),
        weight: 0.3,
      },
      {
        name: "Entity Coverage",
        score: Math.min(missionEntities.length / 10, 1),
        weight: 0.3,
      },
      {
        name: "Graph Connectivity",
        score: kg.length > 0 ? Math.min(kg.reduce((sum, n) => sum + (n.links?.length || 0), 0) / kg.length / 2, 1) : 0,
        weight: 0.4,
      },
    ];

    const score = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

    scores.push({
      missionId: mission.id,
      missionName: mission.name,
      missionType: "forest",
      score: Math.round(score * 100),
      factors,
      status: score >= 0.7 ? "healthy" : score >= 0.4 ? "needs_attention" : "critical",
    });
  }

  // Heritage missions
  const heritageMissions = getHeritageMissions();
  for (const mission of heritageMissions) {
    const missionDocs = docs.filter((d) => d.mission === mission.id);

    const factors = [
      {
        name: "Documentation",
        score: Math.min(missionDocs.length / 3, 1),
        weight: 0.4,
      },
      {
        name: "Assessment Coverage",
        score: 0.5, // Placeholder
        weight: 0.6,
      },
    ];

    const score = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

    scores.push({
      missionId: mission.id,
      missionName: mission.name,
      missionType: "heritage",
      score: Math.round(score * 100),
      factors,
      status: score >= 0.7 ? "healthy" : score >= 0.4 ? "needs_attention" : "critical",
    });
  }

  return scores.map((score) =>
    createInsight({
      id: `health-${score.missionId}`,
      title: `Mission Health: ${score.missionName}`,
      description: `${score.missionName} is ${score.status} with a score of ${score.score}/100.`,
      confidence: score.score / 100,
      evidence: [createEvidence({ sourceId: "health-scoring", sourceType: "mission", relevance: "Mission health analysis" })],
      data: score,
    })
  );
}

function generateKnowledgeGaps() {
  const gaps: KnowledgeGap[] = [];
  const entities = getEntities();
  const kg = getKnowledgeGraph();

  // Find entities with few connections
  const weaklyConnected = kg.filter((n) => (n.links?.length || 0) < 2);
  if (weaklyConnected.length > 0) {
    gaps.push({
      area: "Weakly Connected Entities",
      description: `${weaklyConnected.length} entities have fewer than 2 connections.`,
      connectedEntities: weaklyConnected.length,
      missingConnections: weaklyConnected.map((n) => n.id),
      priority: "medium",
    });
  }

  // Find potential missing relationships
  const entityTypes = Array.from(new Set(entities.map((e) => e.type)));
  for (let i = 0; i < entityTypes.length; i++) {
    for (let j = i + 1; j < entityTypes.length; j++) {
      const type1 = entityTypes[i];
      const type2 = entityTypes[j];
      const entities1 = entities.filter((e) => e.type === type1);
      const entities2 = entities.filter((e) => e.type === type2);

      // Check if there are relationships between these types
      const hasRelationships = kg.some(
        (n) =>
          entities1.some((e) => e.id === n.id) &&
          n.links?.some((l) => entities2.some((e) => e.id === l))
      );

      if (!hasRelationships && entities1.length > 0 && entities2.length > 0) {
        gaps.push({
          area: `${type1} ↔ ${type2}`,
          description: `No relationships found between ${type1} and ${type2} entities.`,
          connectedEntities: 0,
          missingConnections: [type1, type2],
          priority: "low",
        });
      }
    }
  }

  return gaps.map((gap, i) =>
    createInsight({
      id: `gap-${i}`,
      title: `Knowledge Gap: ${gap.area}`,
      description: gap.description,
      confidence: gap.priority === "high" ? 0.9 : gap.priority === "medium" ? 0.7 : 0.5,
      evidence: [createEvidence({ sourceId: "gap-analysis", sourceType: "entity", relevance: "Knowledge graph analysis" })],
      data: gap,
    })
  );
}

function generateWorkQueue() {
  const workItems: WorkItem[] = [];
  const docs = getDocuments();
  const volunteers = getVolunteers();

  // Find forest missions without impact reports
  const forestMissions = getMissions();
  for (const mission of forestMissions) {
    const hasImpactReport = docs.some(
      (d) => d.mission === mission.id && d.category === "report" && d.title?.toLowerCase().includes("impact")
    );
    if (!hasImpactReport) {
      workItems.push({
        type: "impact_report",
        title: `Impact report needed for ${mission.name}`,
        description: `Forest mission "${mission.name}" lacks an impact report.`,
        priority: "high",
        source: "forest",
      });
    }
  }

  // Find research without field evidence
  const researchDocs = docs.filter((d) => d.category === "research");
  for (const doc of researchDocs) {
    const hasFieldEvidence = docs.some(
      (d) => d.category === "evidence" && d.title?.toLowerCase().includes(doc.title?.toLowerCase() || "")
    );
    if (!hasFieldEvidence) {
      workItems.push({
        type: "field_evidence",
        title: `Field evidence needed for: ${doc.title}`,
        description: `Research document lacks linked field evidence.`,
        priority: "medium",
        source: "research",
      });
    }
  }

  // Find heritage assets without recent assessments
  const heritageMissions = getHeritageMissions();
  for (const mission of heritageMissions) {
    workItems.push({
      type: "assessment",
      title: `Assessment needed for ${mission.name}`,
      description: `Heritage asset "${mission.name}" may need a recent assessment.`,
      priority: "medium",
      source: "heritage",
    });
  }

  // Skill matching for volunteers
  const volunteerSkills = volunteers.map((v) => ({
    id: v.id,
    name: v.name,
    skills: v.skillIds || [],
  }));

  // Simple skill matching (placeholder logic)
  if (volunteerSkills.length > 0) {
    workItems.push({
      type: "skill_match",
      title: "Volunteer skill matching available",
      description: `${volunteerSkills.length} volunteers with recorded skills can be matched to missions.`,
      priority: "low",
      source: "volunteer",
    });
  }

  return workItems.map((item, i) =>
    createInsight({
      id: `work-${i}`,
      title: item.title,
      description: item.description,
      confidence: item.priority === "high" ? 0.9 : item.priority === "medium" ? 0.7 : 0.5,
      evidence: [createEvidence({ sourceId: "work-queue", sourceType: "document", relevance: "Automated work item generation" })],
      data: item,
    })
  );
}
