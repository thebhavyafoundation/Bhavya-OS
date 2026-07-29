import { Insight, createInsight, createEvidence } from "./insight";

export interface DecisionSupport {
  dataQualityAlerts: Insight<DataQualityAlert>[];
  missionHealthScores: Insight<MissionHealthScore>[];
  knowledgeGaps: Insight<KnowledgeGap>[];
  workQueue: Insight<WorkItem>[];
}

export interface DataQualityAlert {
  type: "missing_content" | "missing_relationship" | "outdated_assessment" | "low_coverage";
  severity: "high" | "medium" | "low";
  affectedItems: string[];
  recommendation: string;
}

export interface MissionHealthScore {
  missionId: string;
  missionName: string;
  missionType: "forest" | "heritage" | "research";
  score: number;
  factors: {
    name: string;
    score: number;
    weight: number;
  }[];
  status: "healthy" | "needs_attention" | "critical";
}

export interface KnowledgeGap {
  area: string;
  description: string;
  connectedEntities: number;
  missingConnections: string[];
  priority: "high" | "medium" | "low";
}

export interface WorkItem {
  type: "impact_report" | "field_evidence" | "assessment" | "skill_match";
  title: string;
  description: string;
  assignee?: string;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  source: string;
}
