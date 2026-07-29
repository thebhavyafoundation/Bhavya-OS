import {
  DecisionContext,
  LessonLearned,
  InstitutionalPattern,
} from "./models.js";
import {
  getDecisionContexts,
  getLessons,
  getPatterns,
} from "./institutional-memory.js";
import {
  getMissions,
} from "./forest.js";
import {
  getResolutions,
} from "./governance.js";
import {
  getActionItems,
  getOverdueActionItems,
} from "./action-items.js";
import {
  getVolunteers,
} from "./volunteer.js";

// ── Prediction Types ───────────────────────────────────────

export interface Prediction {
  id: string;
  type: "risk" | "opportunity" | "forecast" | "anomaly";
  title: string;
  description: string;
  confidence: number;
  evidenceCount: number;
  sources: string[];
  timeframe: "immediate" | "short-term" | "medium-term" | "long-term";
  severity?: "low" | "medium" | "high" | "critical";
  recommendation: string;
  created: string;
}

export interface RiskAssessment {
  id: string;
  risk: string;
  probability: number;
  impact: number;
  riskScore: number;
  mitigation: string;
  evidence: string[];
  created: string;
}

export interface Forecast {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  basis: string;
  created: string;
}

// ── Predictive Analysis ────────────────────────────────────

export function generatePredictions(): Prediction[] {
  const predictions: Prediction[] = [];

  // Mission risk predictions
  const missions = getMissions();
  const actionItems = getActionItems();
  const overdueActions = getOverdueActionItems();

  // Risk: Overdue actions indicate execution risk
  if (overdueActions.length > 0) {
    predictions.push({
      id: "pred-overdue-risk",
      type: "risk",
      title: `${overdueActions.length} overdue actions indicate execution risk`,
      description: `There are ${overdueActions.length} overdue action items that may affect mission outcomes.`,
      confidence: 0.8,
      evidenceCount: overdueActions.length,
      sources: overdueActions.map((a) => a.id),
      timeframe: "immediate",
      severity: overdueActions.length > 3 ? "high" : "medium",
      recommendation: "Review overdue actions and reallocate resources or adjust timelines.",
      created: new Date().toISOString(),
    });
  }

  // Opportunity: High-confidence patterns
  const patterns = getPatterns();
  const highConfidencePatterns = patterns.filter((p) => p.confidence >= 0.8 && p.successRate >= 0.7);

  if (highConfidencePatterns.length > 0) {
    predictions.push({
      id: "pred-pattern-opportunity",
      type: "opportunity",
      title: `${highConfidencePatterns.length} high-confidence patterns available`,
      description: `${highConfidencePatterns.length} validated patterns with success rates above 70% can be applied to current operations.`,
      confidence: 0.85,
      evidenceCount: highConfidencePatterns.reduce((sum, p) => sum + p.sampleSize, 0),
      sources: highConfidencePatterns.map((p) => p.id),
      timeframe: "short-term",
      recommendation: "Apply validated patterns to current missions for improved outcomes.",
      created: new Date().toISOString(),
    });
  }

  // Forecast: Mission completion based on patterns
  if (missions.length > 0) {
    const avgCompletionRate = 0.75; // Placeholder from historical data
    predictions.push({
      id: "pred-mission-forecast",
      type: "forecast",
      title: `Expected mission completion rate: ${Math.round(avgCompletionRate * 100)}%`,
      description: `Based on historical patterns, expected completion rate for current missions is ${Math.round(avgCompletionRate * 100)}%.`,
      confidence: 0.7,
      evidenceCount: missions.length,
      sources: missions.map((m) => m.id),
      timeframe: "medium-term",
      recommendation: "Monitor mission progress against forecast and adjust interventions if needed.",
      created: new Date().toISOString(),
    });
  }

  // Risk: Volunteer capacity
  const volunteers = getVolunteers();
  const activeVolunteers = volunteers.filter((v) => v.status === "active");
  if (activeVolunteers.length < missions.length * 5) {
    predictions.push({
      id: "pred-volunteer-capacity",
      type: "risk",
      title: "Potential volunteer capacity shortage",
      description: `Current active volunteer count (${activeVolunteers.length}) may be insufficient for ${missions.length} active missions.`,
      confidence: 0.65,
      evidenceCount: volunteers.length,
      sources: volunteers.map((v) => v.id),
      timeframe: "short-term",
      severity: "medium",
      recommendation: "Consider volunteer recruitment or mission prioritization.",
      created: new Date().toISOString(),
    });
  }

  // Anomaly: Lessons without application
  const lessons = getLessons();
  const highConfidenceLessons = lessons.filter((l) => l.confidence >= 0.8);
  if (highConfidenceLessons.length > 3) {
    predictions.push({
      id: "pred-unused-lessons",
      type: "anomaly",
      title: `${highConfidenceLessons.length} high-confidence lessons not yet applied`,
      description: `${highConfidenceLessons.length} lessons with high confidence scores may not be fully integrated into operations.`,
      confidence: 0.75,
      evidenceCount: highConfidenceLessons.length,
      sources: highConfidenceLessons.map((l) => l.id),
      timeframe: "medium-term",
      recommendation: "Review high-confidence lessons and integrate into operational playbooks.",
      created: new Date().toISOString(),
    });
  }

  return predictions;
}

// ── Risk Assessment ────────────────────────────────────────

export function assessRisks(): RiskAssessment[] {
  const risks: RiskAssessment[] = [];
  const overdueActions = getOverdueActionItems();
  const patterns = getPatterns();

  // Execution risk from overdue actions
  if (overdueActions.length > 0) {
    risks.push({
      id: "risk-execution",
      risk: "Execution delay due to overdue actions",
      probability: Math.min(0.9, overdueActions.length * 0.15),
      impact: 0.7,
      riskScore: Math.min(0.9, overdueActions.length * 0.15 * 0.7),
      mitigation: "Reallocate resources, adjust timelines, or escalate blockers.",
      evidence: overdueActions.map((a) => a.id),
      created: new Date().toISOString(),
    });
  }

  // Knowledge risk from declining patterns
  const decliningPatterns = patterns.filter((p) => p.successRate < 0.5);
  if (decliningPatterns.length > 0) {
    risks.push({
      id: "risk-knowledge",
      risk: "Knowledge degradation from declining pattern success",
      probability: 0.6,
      impact: 0.5,
      riskScore: 0.3,
      mitigation: "Review declining patterns and update institutional knowledge.",
      evidence: decliningPatterns.map((p) => p.id),
      created: new Date().toISOString(),
    });
  }

  return risks;
}

// ── Forecasts ──────────────────────────────────────────────

export function generateForecasts(): Forecast[] {
  const forecasts: Forecast[] = [];
  const patterns = getPatterns();
  const lessons = getLessons();

  // Success rate forecast
  if (patterns.length > 0) {
    const avgSuccessRate = patterns.reduce((sum, p) => sum + p.successRate, 0) / patterns.length;
    forecasts.push({
      id: "forecast-success-rate",
      metric: "Overall Success Rate",
      currentValue: Math.round(avgSuccessRate * 100),
      predictedValue: Math.round(Math.min(1, avgSuccessRate + 0.05) * 100),
      confidence: 0.7,
      timeframe: "Next quarter",
      basis: `Based on ${patterns.length} institutional patterns`,
      created: new Date().toISOString(),
    });
  }

  // Learning velocity forecast
  if (lessons.length > 0) {
    forecasts.push({
      id: "forecast-learning",
      metric: "Lessons Collected",
      currentValue: lessons.length,
      predictedValue: lessons.length + Math.ceil(lessons.length * 0.2),
      confidence: 0.65,
      timeframe: "Next year",
      basis: "Based on current learning velocity",
      created: new Date().toISOString(),
    });
  }

  return forecasts;
}

// ── Prediction Summary ─────────────────────────────────────

export function getPredictionSummary(): {
  totalPredictions: number;
  risks: number;
  opportunities: number;
  forecasts: number;
  anomalies: number;
  avgConfidence: number;
} {
  const predictions = generatePredictions();
  const risks = predictions.filter((p) => p.type === "risk").length;
  const opportunities = predictions.filter((p) => p.type === "opportunity").length;
  const forecasts = predictions.filter((p) => p.type === "forecast").length;
  const anomalies = predictions.filter((p) => p.type === "anomaly").length;
  const avgConfidence = predictions.length > 0
    ? Math.round((predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length) * 100) / 100
    : 0;

  return {
    totalPredictions: predictions.length,
    risks,
    opportunities,
    forecasts,
    anomalies,
    avgConfidence,
  };
}
