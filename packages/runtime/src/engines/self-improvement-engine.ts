/**
 * Self Improvement Engine
 *
 * Learns from mistakes, improves processes, and tracks performance
 * over time for Bhavya OS.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImprovementStatus =
  "identified" | "planned" | "in-progress" | "completed" | "verified";

export type ImprovementType =
  "process" | "knowledge" | "skill" | "tool" | "workflow" | "decision";

export type MetricDirection = "up" | "down" | "stable";

export interface Improvement {
  id: string;
  type: ImprovementType;
  title: string;
  description: string;
  status: ImprovementStatus;
  trigger: ImprovementTrigger;
  actions: ImprovementAction[];
  metrics: ImprovementMetric[];
  outcome?: ImprovementOutcome;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface ImprovementTrigger {
  type: "error" | "inefficiency" | "feedback" | "audit" | "metric";
  description: string;
  source: string;
  severity: "critical" | "high" | "medium" | "low";
}

export interface ImprovementAction {
  id: string;
  description: string;
  assignee: string;
  deadline: Date;
  status: "pending" | "in-progress" | "completed";
  outcome?: string;
}

export interface ImprovementMetric {
  id: string;
  name: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
  direction: MetricDirection;
}

export interface ImprovementOutcome {
  success: boolean;
  metricsImproved: string[];
  metricsDegraded: string[];
  lessonsLearned: string[];
  nextSteps: string[];
}

export interface PerformanceSnapshot {
  id: string;
  timestamp: Date;
  metrics: Record<string, number>;
  score: number;
}

export interface SelfImprovementMetrics {
  totalImprovements: number;
  byType: Record<ImprovementType, number>;
  byStatus: Record<ImprovementStatus, number>;
  successRate: number;
  avgCompletionTime: number;
  totalMetricsTracked: number;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class SelfImprovementEngine {
  private improvements: Map<string, Improvement> = new Map();
  private snapshots: PerformanceSnapshot[] = [];

  /**
   * Create a new improvement
   */
  async create(
    improvement: Omit<Improvement, "id" | "createdAt" | "updatedAt">,
  ): Promise<Improvement> {
    const id = this.generateId();
    const now = new Date();

    const newImprovement: Improvement = {
      ...improvement,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.improvements.set(id, newImprovement);
    return newImprovement;
  }

  /**
   * Get an improvement by ID
   */
  async get(id: string): Promise<Improvement | null> {
    return this.improvements.get(id) || null;
  }

  /**
   * Update an improvement
   */
  async update(
    id: string,
    updates: Partial<Omit<Improvement, "id" | "createdAt">>,
  ): Promise<Improvement | null> {
    const improvement = this.improvements.get(id);
    if (!improvement) return null;

    const updatedImprovement: Improvement = {
      ...improvement,
      ...updates,
      updatedAt: new Date(),
    };

    this.improvements.set(id, updatedImprovement);
    return updatedImprovement;
  }

  /**
   * Add an action to an improvement
   */
  async addAction(
    improvementId: string,
    action: Omit<ImprovementAction, "id">,
  ): Promise<ImprovementAction | null> {
    const improvement = this.improvements.get(improvementId);
    if (!improvement) return null;

    const newAction: ImprovementAction = {
      ...action,
      id: this.generateId(),
    };

    improvement.actions.push(newAction);
    improvement.updatedAt = new Date();

    return newAction;
  }

  /**
   * Record a performance snapshot
   */
  async recordSnapshot(
    metrics: Record<string, number>,
  ): Promise<PerformanceSnapshot> {
    const snapshot: PerformanceSnapshot = {
      id: this.generateId(),
      timestamp: new Date(),
      metrics,
      score: this.calculateScore(metrics),
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  /**
   * Get performance trend
   */
  async getTrend(
    metricName: string,
    period: number = 30,
  ): Promise<{ direction: MetricDirection; change: number; data: number[] }> {
    const cutoff = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    const recentSnapshots = this.snapshots
      .filter((s) => s.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (recentSnapshots.length < 2) {
      return { direction: "stable", change: 0, data: [] };
    }

    const data = recentSnapshots.map((s) => s.metrics[metricName] || 0);
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const change = avgSecond - avgFirst;
    const direction: MetricDirection =
      change > 0.05 ? "up" : change < -0.05 ? "down" : "stable";

    return { direction, change, data };
  }

  /**
   * Identify areas for improvement
   */
  async identifyAreas(): Promise<
    { area: string; score: number; suggestion: string }[]
  > {
    const areas: { area: string; score: number; suggestion: string }[] = [];

    // Analyze recent snapshots
    if (this.snapshots.length >= 2) {
      const latest = this.snapshots[this.snapshots.length - 1];
      const previous = this.snapshots[this.snapshots.length - 2];

      for (const [metric, value] of Object.entries(latest.metrics)) {
        const prevValue = previous.metrics[metric] || 0;
        const change = value - prevValue;

        if (change < -0.1) {
          areas.push({
            area: metric,
            score: value,
            suggestion: `Metric ${metric} has decreased by ${Math.abs(change).toFixed(2)}. Consider investigating.`,
          });
        }
      }
    }

    // Analyze improvements
    const pendingImprovements = Array.from(this.improvements.values()).filter(
      (i) => i.status === "in-progress",
    );

    for (const improvement of pendingImprovements) {
      if (
        improvement.actions.some(
          (a) => a.status === "pending" && a.deadline < new Date(),
        )
      ) {
        areas.push({
          area: improvement.title,
          score: 0.5,
          suggestion: `Improvement "${improvement.title}" has overdue actions.`,
        });
      }
    }

    return areas;
  }

  /**
   * Complete an improvement
   */
  async complete(
    id: string,
    outcome: ImprovementOutcome,
  ): Promise<Improvement | null> {
    const improvement = this.improvements.get(id);
    if (!improvement) return null;

    improvement.status = "completed";
    improvement.outcome = outcome;
    improvement.completedAt = new Date();
    improvement.updatedAt = new Date();

    return improvement;
  }

  /**
   * Get self improvement metrics
   */
  async getMetrics(): Promise<SelfImprovementMetrics> {
    const improvements = Array.from(this.improvements.values());

    const byType: Record<ImprovementType, number> = {
      process: 0,
      knowledge: 0,
      skill: 0,
      tool: 0,
      workflow: 0,
      decision: 0,
    };

    const byStatus: Record<ImprovementStatus, number> = {
      identified: 0,
      planned: 0,
      "in-progress": 0,
      completed: 0,
      verified: 0,
    };

    let totalCompletionTime = 0;
    let completedCount = 0;
    let successCount = 0;

    for (const improvement of improvements) {
      byType[improvement.type]++;
      byStatus[improvement.status]++;

      if (improvement.completedAt) {
        totalCompletionTime +=
          improvement.completedAt.getTime() - improvement.createdAt.getTime();
        completedCount++;
      }

      if (improvement.outcome?.success) {
        successCount++;
      }
    }

    let totalMetricsTracked = 0;
    for (const improvement of improvements) {
      totalMetricsTracked += improvement.metrics.length;
    }

    return {
      totalImprovements: improvements.length,
      byType,
      byStatus,
      successRate: completedCount > 0 ? successCount / completedCount : 0,
      avgCompletionTime:
        completedCount > 0 ? totalCompletionTime / completedCount : 0,
      totalMetricsTracked,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `imp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private calculateScore(metrics: Record<string, number>): number {
    const values = Object.values(metrics);
    if (values.length === 0) return 0;

    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }
}

export default SelfImprovementEngine;
