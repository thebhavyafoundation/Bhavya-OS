import {
  BoardMeeting,
  Resolution,
  ActionItem,
  Policy,
  Evidence,
} from "./models.js";
import {
  getBoardMeetings,
  getBoardMeetingById,
  getResolutions,
  getResolutionsByMeeting,
} from "./governance.js";
import {
  getActionItems,
  getActionItemsBySource,
} from "./action-items.js";
import {
  getMissions,
  getProjects,
  getPolicies,
} from "./index.js";
import {
  getEvidence,
  getEvidenceByActionItem,
} from "./traceability.js";

// ── Impact Report Types ────────────────────────────────────

export interface ImpactReport {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  summary: ImpactSummary;
  governanceImpact: GovernanceImpact;
  operationalImpact: OperationalImpact;
  knowledgeImpact: KnowledgeImpact;
  recommendations: string[];
}

export interface ImpactSummary {
  totalMeetings: number;
  totalResolutions: number;
  totalActionItems: number;
  completionRate: number;
  evidenceCount: number;
  overallScore: number;
}

export interface GovernanceImpact {
  decisionsMade: number;
  implementationRate: number;
  avgTimeToImplement: number;
  policyUpdates: number;
  complianceRate: number;
}

export interface OperationalImpact {
  missionsAffected: number;
  projectsAffected: number;
  volunteersInvolved: number;
  actionsCompleted: number;
  evidenceCollected: number;
}

export interface KnowledgeImpact {
  newDocuments: number;
  newEntities: number;
  newRelationships: number;
  graphGrowth: number;
}

// ── Impact Report Generation ───────────────────────────────

export function generateImpactReport(period?: string): ImpactReport {
  const now = new Date();
  const reportPeriod = period || `${now.getFullYear()}-Q${Math.ceil((now.getMonth() + 1) / 3)}`;

  const meetings = getBoardMeetings();
  const resolutions = getResolutions();
  const actionItems = getActionItems();
  const evidence = getEvidence();
  const missions = getMissions();
  const projects = getProjects();

  // Calculate completion rate
  const completedActions = actionItems.filter((a) => a.status === "completed");
  const completionRate = actionItems.length > 0
    ? Math.round((completedActions.length / actionItems.length) * 100)
    : 100;

  // Calculate implementation rate
  const approvedResolutions = resolutions.filter((r) => r.status === "approved" || r.status === "implemented");
  const implementedResolutions = resolutions.filter((r) => r.status === "implemented");
  const implementationRate = approvedResolutions.length > 0
    ? Math.round((implementedResolutions.length / approvedResolutions.length) * 100)
    : 100;

  // Calculate average time to implement
  let avgTimeToImplement = 0;
  if (implementedResolutions.length > 0) {
    const totalTime = implementedResolutions.reduce((sum, r) => {
      const created = new Date(r.created).getTime();
      const implemented = new Date(r.implementedDate || r.updated).getTime();
      return sum + (implemented - created);
    }, 0);
    avgTimeToImplement = Math.round(totalTime / implementedResolutions.length / (1000 * 60 * 60 * 24));
  }

  // Count affected domains
  const missionsAffected = new Set(actionItems.filter((a) => a.missionId).map((a) => a.missionId)).size;
  const projectsAffected = new Set(actionItems.filter((a) => a.projectId).map((a) => a.projectId)).size;

  // Count evidence
  const evidenceCount = evidence.length;
  const verifiedEvidence = evidence.filter((e) => e.verifiedAt).length;

  // Generate recommendations
  const recommendations = generateRecommendations(
    completionRate,
    implementationRate,
    evidenceCount,
    actionItems.length
  );

  // Calculate overall score
  const overallScore = Math.round(
    (completionRate * 0.3 + implementationRate * 0.3 + (evidenceCount > 0 ? 80 : 50) * 0.2 + 80 * 0.2)
  );

  return {
    id: `report-${Date.now()}`,
    title: `Impact Report - ${reportPeriod}`,
    period: reportPeriod,
    generatedAt: now.toISOString(),
    summary: {
      totalMeetings: meetings.length,
      totalResolutions: resolutions.length,
      totalActionItems: actionItems.length,
      completionRate,
      evidenceCount,
      overallScore,
    },
    governanceImpact: {
      decisionsMade: resolutions.length,
      implementationRate,
      avgTimeToImplement,
      policyUpdates: getPolicies().length,
      complianceRate: 95, // Placeholder
    },
    operationalImpact: {
      missionsAffected,
      projectsAffected,
      volunteersInvolved: 0, // Would come from volunteer module
      actionsCompleted: completedActions.length,
      evidenceCollected: evidenceCount,
    },
    knowledgeImpact: {
      newDocuments: 0, // Would come from content-core stats
      newEntities: 0,
      newRelationships: 0,
      graphGrowth: 0,
    },
    recommendations,
  };
}

function generateRecommendations(
  completionRate: number,
  implementationRate: number,
  evidenceCount: number,
  totalActions: number
): string[] {
  const recommendations: string[] = [];

  if (completionRate < 70) {
    recommendations.push("Action completion rate is below 70%. Consider reviewing overdue items and reallocating resources.");
  }

  if (implementationRate < 80) {
    recommendations.push("Resolution implementation rate is below 80%. Review blocked resolutions and identify obstacles.");
  }

  if (evidenceCount === 0 && totalActions > 0) {
    recommendations.push("No evidence collected yet. Start documenting completion evidence for audit trails.");
  }

  if (evidenceCount < totalActions * 0.5) {
    recommendations.push("Less than 50% of actions have supporting evidence. Increase evidence collection for better traceability.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Governance metrics are healthy. Continue current practices.");
  }

  return recommendations;
}

// ── Report Queries ─────────────────────────────────────────

export function getImpactReports(): ImpactReport[] {
  // In production, this would load from file system
  return [];
}

export function generateExecutiveSummary(): string {
  const report = generateImpactReport();

  return `
# Executive Summary - ${report.period}

## Governance Health
- **Decisions Made:** ${report.governanceImpact.decisionsMade}
- **Implementation Rate:** ${report.governanceImpact.implementationRate}%
- **Avg Time to Implement:** ${report.governanceImpact.avgTimeToImplement} days

## Operational Impact
- **Missions Affected:** ${report.operationalImpact.missionsAffected}
- **Actions Completed:** ${report.operationalImpact.actionsCompleted}
- **Evidence Collected:** ${report.operationalImpact.evidenceCollected}

## Overall Score: ${report.summary.overallScore}/100

## Recommendations
${report.recommendations.map((r) => `- ${r}`).join("\n")}
  `.trim();
}

// ── Domain-Specific Reports ────────────────────────────────

export function generateForestImpactReport(): {
  missions: number;
  actionsCompleted: number;
  evidenceCount: number;
  outcomes: string[];
} {
  const actionItems = getActionItems().filter((a) => a.missionId);
  const completed = actionItems.filter((a) => a.status === "completed");
  const evidence = evidence.filter((e) =>
    actionItems.some((a) => a.id === e.actionItemId)
  );

  return {
    missions: new Set(actionItems.map((a) => a.missionId)).size,
    actionsCompleted: completed.length,
    evidenceCount: evidence.length,
    outcomes: completed.map((a) => a.title),
  };
}

export function generateGovernanceEffectivenessReport(): {
  meetingFrequency: number;
  resolutionRate: number;
  policyCompliance: number;
  actionCompletion: number;
} {
  const meetings = getBoardMeetings();
  const resolutions = getResolutions();
  const actionItems = getActionItems();

  const approvedResolutions = resolutions.filter((r) => r.status === "approved" || r.status === "implemented");
  const completedActions = actionItems.filter((a) => a.status === "completed");

  return {
    meetingFrequency: meetings.length,
    resolutionRate: resolutions.length > 0
      ? Math.round((approvedResolutions.length / resolutions.length) * 100)
      : 100,
    policyCompliance: 95, // Placeholder
    actionCompletion: actionItems.length > 0
      ? Math.round((completedActions.length / actionItems.length) * 100)
      : 100,
  };
}
