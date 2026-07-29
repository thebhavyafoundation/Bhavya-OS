import {
  getBoardMeetings,
  getResolutions,
  getPolicies,
  getGovernanceStats,
} from "./governance";
import {
  getActionItems,
  getActionItemStats,
} from "./action-items";
import {
  getMissions,
  getForestStats,
} from "./forest";
import {
  getHeritageMissions,
  getHeritageStats,
} from "./heritage";
import {
  getProjects,
  getResearchStats,
} from "./research";
import {
  getVolunteers,
  getVolunteerStats,
} from "./volunteer";
import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
} from "./index";
import {
  getEvidence,
} from "./traceability";

// ── Cross-Domain Report Types ──────────────────────────────

export interface InstitutionalReport {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  executiveSummary: string;
  sections: ReportSection[];
  overallScore: number;
  recommendations: string[];
}

export interface ReportSection {
  domain: string;
  title: string;
  summary: string;
  metrics: ReportMetric[];
  highlights: string[];
  concerns: string[];
  evidenceCount: number;
}

export interface ReportMetric {
  name: string;
  value: number | string;
  unit: string;
  trend?: "up" | "down" | "stable";
}

// ── Cross-Domain Report Generation ─────────────────────────

export function generateInstitutionalReport(period?: string): InstitutionalReport {
  const now = new Date();
  const reportPeriod = period || `${now.getFullYear()} Annual Report`;

  const sections: ReportSection[] = [
    generateGovernanceSection(),
    generateForestSection(),
    generateHeritageSection(),
    generateResearchSection(),
    generateVolunteerSection(),
    generateKnowledgeSection(),
  ];

  // Calculate overall score
  const overallScore = Math.round(
    sections.reduce((sum, s) => sum + (s.metrics.find((m) => m.name === "Health Score")?.value as number || 80), 0) / sections.length
  );

  // Generate executive summary
  const executiveSummary = generateExecutiveSummary(sections, overallScore);

  // Generate recommendations
  const recommendations = generateCrossDomainRecommendations(sections);

  return {
    id: `institutional-report-${Date.now()}`,
    title: `Bhavya Foundation - ${reportPeriod}`,
    period: reportPeriod,
    generatedAt: now.toISOString(),
    executiveSummary,
    sections,
    overallScore,
    recommendations,
  };
}

function generateGovernanceSection(): ReportSection {
  const stats = getGovernanceStats();
  const actionStats = getActionItemStats();
  const evidence = getEvidence();

  const healthScore = Math.min(100,
    (stats.totalMeetings > 0 ? 25 : 0) +
    (stats.totalResolutions > 0 ? 25 : 0) +
    (actionStats.completionRate * 0.25) +
    (evidence.length > 0 ? 25 : 0)
  );

  return {
    domain: "governance",
    title: "Governance & Oversight",
    summary: `${stats.totalMeetings} board meetings, ${stats.totalResolutions} resolutions, ${actionStats.total} action items.`,
    metrics: [
      { name: "Board Meetings", value: stats.totalMeetings, unit: "" },
      { name: "Resolutions", value: stats.totalResolutions, unit: "" },
      { name: "Action Items", value: actionStats.total, unit: "" },
      { name: "Completion Rate", value: actionStats.completionRate, unit: "%" },
      { name: "Health Score", value: healthScore, unit: "/100" },
    ],
    highlights: [
      `${actionStats.completionRate}% action completion rate`,
      `${stats.totalPolicies} policies active`,
    ],
    concerns: actionStats.overdue > 0 ? [`${actionStats.overdue} overdue action items`] : [],
    evidenceCount: evidence.length,
  };
}

function generateForestSection(): ReportSection {
  const stats = getForestStats();
  const missions = getMissions();
  const evidence = getEvidence();

  const healthScore = Math.min(100,
    (stats.totalMissions > 0 ? 30 : 0) +
    (stats.totalPlantings > 0 ? 30 : 0) +
    (stats.averageSurvivalRate * 0.2) +
    (stats.totalImpactReports > 0 ? 20 : 0)
  );

  return {
    domain: "forest",
    title: "Forest Restoration",
    summary: `${stats.totalMissions} missions, ${stats.totalPlanted.toLocaleString()} trees planted, ${stats.averageSurvivalRate}% survival rate.`,
    metrics: [
      { name: "Active Missions", value: stats.totalMissions, unit: "" },
      { name: "Trees Planted", value: stats.totalPlanted, unit: "" },
      { name: "Survival Rate", value: stats.averageSurvivalRate, unit: "%" },
      { name: "Area Restored", value: stats.totalAreaRestored, unit: " hectares" },
      { name: "Health Score", value: healthScore, unit: "/100" },
    ],
    highlights: [
      `${stats.totalPlanted.toLocaleString()} trees planted across ${stats.totalMissions} missions`,
      `${stats.totalAreaRestored} hectares of forest restored`,
    ],
    concerns: stats.averageSurvivalRate < 70 ? [`Survival rate ${stats.averageSurvivalRate}% below target`] : [],
    evidenceCount: evidence.filter((e) => e.type === "photo" || e.type === "report").length,
  };
}

function generateHeritageSection(): ReportSection {
  const stats = getHeritageStats();
  const missions = getHeritageMissions();
  const evidence = getEvidence();

  const healthScore = Math.min(100,
    (stats.totalMissions > 0 ? 30 : 0) +
    (stats.totalAssets > 0 ? 30 : 0) +
    (stats.totalAssessments > 0 ? 20 : 0) +
    (stats.totalConservationPlans > 0 ? 20 : 0)
  );

  return {
    domain: "heritage",
    title: "Heritage Preservation",
    summary: `${stats.totalMissions} missions, ${stats.totalAssets} assets documented, ${stats.totalAssessments} assessments completed.`,
    metrics: [
      { name: "Active Missions", value: stats.totalMissions, unit: "" },
      { name: "Heritage Assets", value: stats.totalAssets, unit: "" },
      { name: "Assessments", value: stats.totalAssessments, unit: "" },
      { name: "Conservation Plans", value: stats.totalConservationPlans, unit: "" },
      { name: "Health Score", value: healthScore, unit: "/100" },
    ],
    highlights: [
      `${stats.totalAssets} heritage assets documented`,
      `${stats.totalConservationPlans} conservation plans in place`,
    ],
    concerns: [],
    evidenceCount: evidence.filter((e) => e.type === "certificate").length,
  };
}

function generateResearchSection(): ReportSection {
  const stats = getResearchStats();
  const projects = getProjects();
  const evidence = getEvidence();

  const healthScore = Math.min(100,
    (stats.totalProjects > 0 ? 30 : 0) +
    (stats.totalSources > 0 ? 30 : 0) +
    (stats.totalEvidence > 0 ? 20 : 0) +
    (stats.completedProjects > 0 ? 20 : 0)
  );

  return {
    domain: "research",
    title: "Research & Knowledge",
    summary: `${stats.totalProjects} projects, ${stats.totalSources} sources, ${stats.totalEvidence} evidence items.`,
    metrics: [
      { name: "Active Projects", value: stats.totalProjects, unit: "" },
      { name: "Sources Collected", value: stats.totalSources, unit: "" },
      { name: "Evidence Items", value: stats.totalEvidence, unit: "" },
      { name: "Completed Projects", value: stats.completedProjects, unit: "" },
      { name: "Health Score", value: healthScore, unit: "/100" },
    ],
    highlights: [
      `${stats.totalSources} research sources collected`,
      `${stats.completedProjects} projects completed`,
    ],
    concerns: stats.activeProjects > stats.completedProjects ? ["More active than completed projects"] : [],
    evidenceCount: evidence.filter((e) => e.type === "document").length,
  };
}

function generateVolunteerSection(): ReportSection {
  const stats = getVolunteerStats();
  const volunteers = getVolunteers();
  const evidence = getEvidence();

  const healthScore = Math.min(100,
    (stats.totalVolunteers > 0 ? 25 : 0) +
    (stats.activeVolunteers > 0 ? 25 : 0) +
    (stats.totalAssignments > 0 ? 25 : 0) +
    (stats.totalRecognitions > 0 ? 25 : 0)
  );

  return {
    domain: "volunteer",
    title: "Volunteer Engagement",
    summary: `${stats.totalVolunteers} volunteers, ${stats.activeVolunteers} active, ${stats.totalAssignments} assignments completed.`,
    metrics: [
      { name: "Total Volunteers", value: stats.totalVolunteers, unit: "" },
      { name: "Active Volunteers", value: stats.activeVolunteers, unit: "" },
      { name: "Assignments", value: stats.totalAssignments, unit: "" },
      { name: "Recognitions", value: stats.totalRecognitions, unit: "" },
      { name: "Health Score", value: healthScore, unit: "/100" },
    ],
    highlights: [
      `${stats.activeVolunteers} active volunteers`,
      `${stats.totalRecognitions} volunteer recognitions`,
    ],
    concerns: stats.activeVolunteers < stats.totalVolunteers * 0.5 ? ["Less than 50% volunteer activity"] : [],
    evidenceCount: evidence.filter((e) => e.type === "testimonial").length,
  };
}

function generateKnowledgeSection(): ReportSection {
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();

  const totalEdges = kg.reduce((sum, n) => sum + (n.links?.length || 0), 0);
  const publishedDocs = docs.filter((d) => d.status === "published").length;

  const healthScore = Math.min(100,
    (docs.length > 0 ? 25 : 0) +
    (entities.length > 0 ? 25 : 0) +
    (kg.length > 0 ? 25 : 0) +
    (publishedDocs / docs.length > 0.8 ? 25 : 0)
  );

  return {
    domain: "knowledge",
    title: "Institutional Knowledge",
    summary: `${docs.length} documents, ${entities.length} entities, ${kg.length} knowledge nodes.`,
    metrics: [
      { name: "Documents", value: docs.length, unit: "" },
      { name: "Published", value: publishedDocs, unit: "" },
      { name: "Entities", value: entities.length, unit: "" },
      { name: "Knowledge Nodes", value: kg.length, unit: "" },
      { name: "Relationships", value: totalEdges, unit: "" },
      { name: "Health Score", value: healthScore, unit: "/100" },
    ],
    highlights: [
      `${publishedDocs} documents published (${Math.round((publishedDocs / docs.length) * 100)}%)`,
      `${totalEdges} relationships in knowledge graph`,
    ],
    concerns: publishedDocs / docs.length < 0.8 ? ["Less than 80% publication rate"] : [],
    evidenceCount: docs.length,
  };
}

function generateExecutiveSummary(sections: ReportSection[], overallScore: number): string {
  const totalEvidence = sections.reduce((sum, s) => sum + s.evidenceCount, 0);
  const totalMetrics = sections.reduce((sum, s) => sum + s.metrics.length, 0);

  return `
# Executive Summary

## Overall Institutional Health: ${overallScore}/100

The Bhavya Foundation continues to operate across ${sections.length} core domains:

${sections.map((s) => `- **${s.title}**: ${s.summary}`).join("\n")}

## Key Metrics
- **Total Evidence Items**: ${totalEvidence}
- **Domains Assessed**: ${sections.length}
- **Metrics Tracked**: ${totalMetrics}

## Cross-Domain Observations
${sections.filter((s) => s.concerns.length > 0).map((s) => `- **${s.title}**: ${s.concerns.join(", ")}`).join("\n") || "No significant concerns across domains."}
  `.trim();
}

function generateCrossDomainRecommendations(sections: ReportSection[]): string[] {
  const recommendations: string[] = [];

  // Check for domains with low health scores
  const lowHealthDomains = sections.filter((s) => {
    const healthMetric = s.metrics.find((m) => m.name === "Health Score");
    return healthMetric && (healthMetric.value as number) < 70;
  });

  if (lowHealthDomains.length > 0) {
    recommendations.push(`Focus improvement efforts on: ${lowHealthDomains.map((s) => s.domain).join(", ")}`);
  }

  // Check for cross-domain evidence gaps
  const totalEvidence = sections.reduce((sum, s) => sum + s.evidenceCount, 0);
  if (totalEvidence < sections.length * 5) {
    recommendations.push("Increase evidence collection across all domains for better traceability.");
  }

  // Check for governance alignment
  const governanceSection = sections.find((s) => s.domain === "governance");
  if (governanceSection) {
    const completionRate = governanceSection.metrics.find((m) => m.name === "Completion Rate")?.value;
    if (completionRate && (completionRate as number) < 80) {
      recommendations.push("Improve governance action completion to ensure better institutional oversight.");
    }
  }

  if (recommendations.length === 0) {
    recommendations.push("All domains are performing well. Continue current practices.");
  }

  return recommendations;
}

// ── Report Queries ─────────────────────────────────────────

export function getInstitutionalReports(): InstitutionalReport[] {
  // In production, this would load from file system
  return [];
}

export function generateAnnualReport(year: number): InstitutionalReport {
  return generateInstitutionalReport(`${year} Annual Report`);
}

export function generateQuarterlyReport(year: number, quarter: number): InstitutionalReport {
  return generateInstitutionalReport(`Q${quarter} ${year} Report`);
}
