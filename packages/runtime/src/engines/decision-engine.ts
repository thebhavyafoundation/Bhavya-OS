/**
 * Decision Engine
 *
 * Helps make, track, and learn from decisions. Provides structured
 * decision-making frameworks, impact analysis, and decision audit trails.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DecisionStatus =
  | "proposed"
  | "reviewing"
  | "approved"
  | "rejected"
  | "implemented"
  | "reversed"
  | "archived";

export type DecisionImpact = "critical" | "high" | "medium" | "low";

export type DecisionFramework =
  "dac" | "rapid" | "eisenhower" | "pros-cons" | "cost-benefit" | "custom";

export interface Decision {
  id: string;
  title: string;
  description: string;
  status: DecisionStatus;
  framework: DecisionFramework;
  impact: DecisionImpact;
  context: string;
  options: DecisionOption[];
  selectedOption?: string;
  rationale?: string;
  alternatives: string[];
  risks: DecisionRisk[];
  dependencies: string[];
  stakeholders: string[];
  owner: string;
  metadata: Record<string, unknown>;
  timeline: DecisionTimeline;
  createdAt: Date;
  updatedAt: Date;
  implementedAt?: Date;
  reviewedAt?: Date;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  cost: number;
  benefit: number;
  risk: number;
  score?: number;
}

export interface DecisionRisk {
  id: string;
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
  owner: string;
}

export interface DecisionTimeline {
  proposed: Date;
  reviewDeadline: Date;
  decisionDeadline: Date;
  implementationDeadline?: Date;
}

export interface DecisionQuery {
  status?: DecisionStatus[];
  impact?: DecisionImpact[];
  framework?: DecisionFramework[];
  owner?: string;
  stakeholder?: string;
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface DecisionAnalysis {
  decision: Decision;
  score: number;
  confidence: number;
  risks: { total: number; high: number; medium: number; low: number };
  recommendations: string[];
}

export interface DecisionMetrics {
  totalDecisions: number;
  byStatus: Record<DecisionStatus, number>;
  byImpact: Record<DecisionImpact, number>;
  avgImplementationTime: number;
  reversalRate: number;
  onTimeRate: number;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class DecisionEngine {
  private decisions: Map<string, Decision> = new Map();
  private ownerIndex: Map<string, Set<string>> = new Map();
  private stakeholderIndex: Map<string, Set<string>> = new Map();

  /**
   * Create a new decision
   */
  async create(
    decision: Omit<Decision, "id" | "createdAt" | "updatedAt" | "timeline">,
  ): Promise<Decision> {
    const id = this.generateId();
    const now = new Date();

    const newDecision: Decision = {
      ...decision,
      id,
      timeline: {
        proposed: now,
        reviewDeadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        decisionDeadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      },
      createdAt: now,
      updatedAt: now,
    };

    this.decisions.set(id, newDecision);
    this.updateIndexes(newDecision);

    return newDecision;
  }

  /**
   * Get a decision by ID
   */
  async get(id: string): Promise<Decision | null> {
    return this.decisions.get(id) || null;
  }

  /**
   * Update a decision
   */
  async update(
    id: string,
    updates: Partial<Omit<Decision, "id" | "createdAt">>,
  ): Promise<Decision | null> {
    const decision = this.decisions.get(id);
    if (!decision) return null;

    const updatedDecision: Decision = {
      ...decision,
      ...updates,
      updatedAt: new Date(),
    };

    this.decisions.set(id, updatedDecision);
    this.rebuildIndexes();

    return updatedDecision;
  }

  /**
   * Approve a decision
   */
  async approve(
    id: string,
    selectedOptionId: string,
    rationale: string,
  ): Promise<Decision | null> {
    const decision = this.decisions.get(id);
    if (!decision) return null;

    const option = decision.options.find((o) => o.id === selectedOptionId);
    if (!option) return null;

    return this.update(id, {
      status: "approved",
      selectedOption: selectedOptionId,
      rationale,
    });
  }

  /**
   * Reject a decision
   */
  async reject(id: string, reason: string): Promise<Decision | null> {
    return this.update(id, {
      status: "rejected",
      rationale: reason,
    });
  }

  /**
   * Implement a decision
   */
  async implement(id: string): Promise<Decision | null> {
    return this.update(id, {
      status: "implemented",
      implementedAt: new Date(),
    });
  }

  /**
   * Reverse a decision
   */
  async reverse(id: string, reason: string): Promise<Decision | null> {
    return this.update(id, {
      status: "reversed",
      rationale: reason,
    });
  }

  /**
   * Analyze a decision
   */
  async analyze(id: string): Promise<DecisionAnalysis | null> {
    const decision = this.decisions.get(id);
    if (!decision) return null;

    // Calculate score based on options
    let totalScore = 0;
    let optionCount = 0;

    for (const option of decision.options) {
      const score = this.calculateOptionScore(option);
      option.score = score;
      totalScore += score;
      optionCount++;
    }

    // Calculate confidence
    const confidence = this.calculateConfidence(decision);

    // Analyze risks
    const risks = this.analyzeRisks(decision);

    // Generate recommendations
    const recommendations = this.generateRecommendations(decision);

    return {
      decision,
      score: optionCount > 0 ? totalScore / optionCount : 0,
      confidence,
      risks,
      recommendations,
    };
  }

  /**
   * Search decisions
   */
  async search(query: DecisionQuery): Promise<Decision[]> {
    let results = Array.from(this.decisions.values());

    if (query.status && query.status.length > 0) {
      results = results.filter((d) => query.status!.includes(d.status));
    }

    if (query.impact && query.impact.length > 0) {
      results = results.filter((d) => query.impact!.includes(d.impact));
    }

    if (query.framework && query.framework.length > 0) {
      results = results.filter((d) => query.framework!.includes(d.framework));
    }

    if (query.owner) {
      results = results.filter((d) => d.owner === query.owner);
    }

    if (query.stakeholder) {
      results = results.filter((d) =>
        d.stakeholders.includes(query.stakeholder!),
      );
    }

    if (query.dateRange) {
      results = results.filter(
        (d) =>
          d.createdAt >= query.dateRange!.start &&
          d.createdAt <= query.dateRange!.end,
      );
    }

    // Sort by creation date (newest first)
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    return results.slice(offset, offset + limit);
  }

  /**
   * Get decisions by owner
   */
  async getByOwner(owner: string): Promise<Decision[]> {
    const ids = this.ownerIndex.get(owner) || new Set();
    return Array.from(ids)
      .map((id) => this.decisions.get(id))
      .filter((d): d is Decision => d !== undefined);
  }

  /**
   * Get decisions by stakeholder
   */
  async getByStakeholder(stakeholder: string): Promise<Decision[]> {
    const ids = this.stakeholderIndex.get(stakeholder) || new Set();
    return Array.from(ids)
      .map((id) => this.decisions.get(id))
      .filter((d): d is Decision => d !== undefined);
  }

  /**
   * Get overdue decisions
   */
  async getOverdue(): Promise<Decision[]> {
    const now = new Date();
    return Array.from(this.decisions.values())
      .filter((d) => d.status === "proposed" || d.status === "reviewing")
      .filter((d) => d.timeline.decisionDeadline < now);
  }

  /**
   * Get decision metrics
   */
  async getMetrics(): Promise<DecisionMetrics> {
    const decisions = Array.from(this.decisions.values());

    const byStatus = {} as Record<DecisionStatus, number>;
    const byImpact = {} as Record<DecisionImpact, number>;

    for (const status of [
      "proposed",
      "reviewing",
      "approved",
      "rejected",
      "implemented",
      "reversed",
      "archived",
    ] as DecisionStatus[]) {
      byStatus[status] = 0;
    }
    for (const impact of [
      "critical",
      "high",
      "medium",
      "low",
    ] as DecisionImpact[]) {
      byImpact[impact] = 0;
    }

    let totalImplementationTime = 0;
    let implementedCount = 0;
    let reversedCount = 0;
    let onTimeCount = 0;

    for (const decision of decisions) {
      byStatus[decision.status]++;
      byImpact[decision.impact]++;

      if (decision.implementedAt) {
        totalImplementationTime +=
          decision.implementedAt.getTime() - decision.createdAt.getTime();
        implementedCount++;
      }

      if (decision.status === "reversed") {
        reversedCount++;
      }

      if (decision.implementedAt && decision.timeline.implementationDeadline) {
        if (
          decision.implementedAt <= decision.timeline.implementationDeadline
        ) {
          onTimeCount++;
        }
      }
    }

    return {
      totalDecisions: decisions.length,
      byStatus,
      byImpact,
      avgImplementationTime:
        implementedCount > 0 ? totalImplementationTime / implementedCount : 0,
      reversalRate: decisions.length > 0 ? reversedCount / decisions.length : 0,
      onTimeRate: implementedCount > 0 ? onTimeCount / implementedCount : 0,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `dec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private updateIndexes(decision: Decision): void {
    // Owner index
    if (!this.ownerIndex.has(decision.owner)) {
      this.ownerIndex.set(decision.owner, new Set());
    }
    this.ownerIndex.get(decision.owner)!.add(decision.id);

    // Stakeholder index
    for (const stakeholder of decision.stakeholders) {
      if (!this.stakeholderIndex.has(stakeholder)) {
        this.stakeholderIndex.set(stakeholder, new Set());
      }
      this.stakeholderIndex.get(stakeholder)!.add(decision.id);
    }
  }

  private rebuildIndexes(): void {
    this.ownerIndex.clear();
    this.stakeholderIndex.clear();

    for (const decision of this.decisions.values()) {
      this.updateIndexes(decision);
    }
  }

  private calculateOptionScore(option: DecisionOption): number {
    const benefitWeight = 0.4;
    const costWeight = 0.3;
    const riskWeight = 0.3;

    const benefitScore = option.benefit / 10;
    const costScore = 1 - option.cost / 100;
    const riskScore = 1 - option.risk;

    return (
      benefitScore * benefitWeight +
      costScore * costWeight +
      riskScore * riskWeight
    );
  }

  private calculateConfidence(decision: Decision): number {
    let confidence = 0.5; // Base confidence

    // More options = higher confidence
    if (decision.options.length >= 3) confidence += 0.1;
    if (decision.options.length >= 5) confidence += 0.1;

    // Detailed rationale = higher confidence
    if (decision.rationale && decision.rationale.length > 100)
      confidence += 0.1;

    // Risk analysis = higher confidence
    if (decision.risks.length > 0) confidence += 0.1;

    // Stakeholder input = higher confidence
    if (decision.stakeholders.length >= 3) confidence += 0.1;

    return Math.min(1, confidence);
  }

  private analyzeRisks(decision: Decision): {
    total: number;
    high: number;
    medium: number;
    low: number;
  } {
    let high = 0;
    let medium = 0;
    let low = 0;

    for (const risk of decision.risks) {
      const riskScore = risk.probability * risk.impact;
      if (riskScore >= 0.7) high++;
      else if (riskScore >= 0.4) medium++;
      else low++;
    }

    return {
      total: decision.risks.length,
      high,
      medium,
      low,
    };
  }

  private generateRecommendations(decision: Decision): string[] {
    const recommendations: string[] = [];

    if (decision.options.length < 3) {
      recommendations.push(
        "Consider adding more options to improve decision quality",
      );
    }

    if (decision.risks.length === 0) {
      recommendations.push(
        "Add risk analysis to better understand potential issues",
      );
    }

    if (decision.stakeholders.length < 2) {
      recommendations.push(
        "Consider involving more stakeholders for broader perspective",
      );
    }

    if (!decision.rationale || decision.rationale.length < 50) {
      recommendations.push("Document detailed rationale for future reference");
    }

    const now = new Date();
    if (
      decision.timeline.decisionDeadline < now &&
      decision.status === "proposed"
    ) {
      recommendations.push(
        "Decision deadline has passed - escalate or reschedule",
      );
    }

    return recommendations;
  }
}

export default DecisionEngine;
