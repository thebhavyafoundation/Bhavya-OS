import {
  DecisionContext,
  LessonLearned,
  InstitutionalPattern,
} from "./models.js";
import {
  getDecisionContexts,
  getLessons,
  getPatterns,
  getSuccessfulPatterns,
} from "./institutional-memory.js";
import {
  getMissions,
  getForestStats,
} from "./forest.js";
import {
  getResolutions,
  getGovernanceStats,
} from "./governance.js";
import {
  getActionItems,
  getActionItemStats,
} from "./action-items.js";

// ── Learning Types ─────────────────────────────────────────

export interface LearningInsight {
  id: string;
  type: "pattern" | "correlation" | "trend" | "anomaly" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  evidenceCount: number;
  sources: string[];
  actionable: boolean;
  recommendation?: string;
  created: string;
}

export interface PatternAnalysis {
  patternId: string;
  name: string;
  frequency: number;
  successRate: number;
  trend: "improving" | "stable" | "declining";
  conditions: string[];
  outcomes: string[];
  confidence: number;
  lastObserved: string;
}

export interface LearningReport {
  id: string;
  period: string;
  generatedAt: string;
  insights: LearningInsight[];
  patterns: PatternAnalysis[];
  recommendations: string[];
  summary: string;
}

// ── Pattern Analysis ───────────────────────────────────────

export function analyzePatterns(): PatternAnalysis[] {
  const patterns = getPatterns();

  return patterns.map((pattern) => {
    // Determine trend based on success rate and frequency
    let trend: "improving" | "stable" | "declining" = "stable";
    if (pattern.successRate >= 0.8 && pattern.frequency >= 3) {
      trend = "improving";
    } else if (pattern.successRate < 0.6 || pattern.frequency < 2) {
      trend = "declining";
    }

    return {
      patternId: pattern.id,
      name: pattern.name,
      frequency: pattern.frequency,
      successRate: pattern.successRate,
      trend,
      conditions: pattern.conditions,
      outcomes: pattern.outcomes,
      confidence: pattern.confidence,
      lastObserved: pattern.updated,
    };
  });
}

// ── Learning Insights ──────────────────────────────────────

export function generateLearningInsights(): LearningInsight[] {
  const insights: LearningInsight[] = [];
  const lessons = getLessons();
  const patterns = getPatterns();
  const decisions = getDecisionContexts();

  // Pattern-based insights
  const successfulPatterns = patterns.filter((p) => p.successRate >= 0.7);
  if (successfulPatterns.length > 0) {
    insights.push({
      id: "insight-successful-patterns",
      type: "pattern",
      title: `${successfulPatterns.length} successful patterns identified`,
      description: `Analysis of institutional history reveals ${successfulPatterns.length} patterns with success rates above 70%.`,
      confidence: 0.85,
      evidenceCount: successfulPatterns.reduce((sum, p) => sum + p.sampleSize, 0),
      sources: successfulPatterns.map((p) => p.id),
      actionable: true,
      recommendation: "Consider applying these patterns to current and future operations.",
      created: new Date().toISOString(),
    });
  }

  // Lesson-based insights
  const successLessons = lessons.filter((l) => l.category === "success");
  const failureLessons = lessons.filter((l) => l.category === "failure");

  if (successLessons.length > failureLessons.length) {
    insights.push({
      id: "insight-success-bias",
      type: "trend",
      title: "More successes than failures documented",
      description: `Institutional learning shows ${successLessons.length} successes vs ${failureLessons.length} failures, indicating positive operational trajectory.`,
      confidence: 0.75,
      evidenceCount: lessons.length,
      sources: lessons.map((l) => l.id),
      actionable: false,
      created: new Date().toISOString(),
    });
  }

  // Decision context insights
  const decisionsWithFullContext = decisions.filter(
    (d) => d.rationale && d.alternativesConsidered.length > 0
  );

  if (decisionsWithFullContext.length > decisions.length * 0.5) {
    insights.push({
      id: "insight-documentation-quality",
      type: "pattern",
      title: "Strong decision documentation",
      description: `${decisionsWithFullContext.length} of ${decisions.length} decisions have full context documented, enabling better institutional learning.`,
      confidence: 0.9,
      evidenceCount: decisionsWithFullContext.length,
      sources: decisionsWithFullContext.map((d) => d.id),
      actionable: false,
      created: new Date().toISOString(),
    });
  }

  // High-confidence recommendations
  const highConfidenceLessons = lessons.filter((l) => l.confidence >= 0.8);
  if (highConfidenceLessons.length > 0) {
    insights.push({
      id: "insight-high-confidence",
      type: "recommendation",
      title: `${highConfidenceLessons.length} high-confidence lessons available`,
      description: `${highConfidenceLessons.length} lessons with confidence scores above 80% are ready to inform operational decisions.`,
      confidence: 0.95,
      evidenceCount: highConfidenceLessons.length,
      sources: highConfidenceLessons.map((l) => l.id),
      actionable: true,
      recommendation: "Integrate high-confidence lessons into operational playbooks.",
      created: new Date().toISOString(),
    });
  }

  return insights;
}

// ── Learning Report ────────────────────────────────────────

export function generateLearningReport(period?: string): LearningReport {
  const now = new Date();
  const reportPeriod = period || `${now.getFullYear()} Learning Report`;

  const insights = generateLearningInsights();
  const patterns = analyzePatterns();
  const lessons = getLessons();
  const successfulPatterns = patterns.filter((p) => p.successRate >= 0.7);

  // Generate recommendations
  const recommendations: string[] = [];

  if (successfulPatterns.length > 0) {
    recommendations.push(`Apply ${successfulPatterns.length} successful patterns to current operations.`);
  }

  const decliningPatterns = patterns.filter((p) => p.trend === "declining");
  if (decliningPatterns.length > 0) {
    recommendations.push(`Review ${decliningPatterns.length} declining patterns for improvement opportunities.`);
  }

  const highConfidenceLessons = lessons.filter((l) => l.confidence >= 0.8);
  if (highConfidenceLessons.length > 0) {
    recommendations.push(`Integrate ${highConfidenceLessons.length} high-confidence lessons into operational playbooks.`);
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue collecting institutional experience to build learning foundation.");
  }

  // Generate summary
  const summary = `
# Learning Report - ${reportPeriod}

## Key Insights
${insights.map((i) => `- **${i.title}**: ${i.description}`).join("\n")}

## Patterns Analyzed
- **Total Patterns**: ${patterns.length}
- **Successful Patterns**: ${successfulPatterns.length}
- **Declining Patterns**: ${decliningPatterns.length}

## Lessons Collected
- **Total Lessons**: ${lessons.length}
- **High Confidence**: ${highConfidenceLessons.length}

## Recommendations
${recommendations.map((r) => `- ${r}`).join("\n")}
  `.trim();

  return {
    id: `learning-report-${Date.now()}`,
    period: reportPeriod,
    generatedAt: now.toISOString(),
    insights,
    patterns,
    recommendations,
    summary,
  };
}

// ── Learning Queries ───────────────────────────────────────

export function getLessonsByDomain(): Record<string, LessonLearned[]> {
  const lessons = getLessons();
  const byDomain: Record<string, LessonLearned[]> = {};

  for (const lesson of lessons) {
    const domain = lesson.sourceType;
    if (!byDomain[domain]) {
      byDomain[domain] = [];
    }
    byDomain[domain].push(lesson);
  }

  return byDomain;
}

export function getPatternSuccessByType(): Record<string, number> {
  const patterns = getPatterns();
  const successByType: Record<string, number> = {};

  for (const pattern of patterns) {
    if (!successByType[pattern.patternType]) {
      successByType[pattern.patternType] = 0;
    }
    successByType[pattern.patternType] += pattern.successRate;
  }

  // Average success rate per type
  for (const type in successByType) {
    const count = patterns.filter((p) => p.patternType === type).length;
    successByType[type] = Math.round((successByType[type] / count) * 100) / 100;
  }

  return successByType;
}

export function getLearningVelocity(): {
  lessonsPerMonth: number;
  patternsPerMonth: number;
  avgConfidence: number;
} {
  const lessons = getLessons();
  const patterns = getPatterns();

  // Calculate lessons per month (last 12 months)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const recentLessons = lessons.filter(
    (l) => new Date(l.created) >= oneYearAgo
  );
  const recentPatterns = patterns.filter(
    (p) => new Date(p.created) >= oneYearAgo
  );

  const lessonsPerMonth = Math.round((recentLessons.length / 12) * 10) / 10;
  const patternsPerMonth = Math.round((recentPatterns.length / 12) * 10) / 10;

  const allConfidence = [...lessons.map((l) => l.confidence), ...patterns.map((p) => p.confidence)];
  const avgConfidence = allConfidence.length > 0
    ? Math.round((allConfidence.reduce((sum, c) => sum + c, 0) / allConfidence.length) * 100) / 100
    : 0;

  return {
    lessonsPerMonth,
    patternsPerMonth,
    avgConfidence,
  };
}
