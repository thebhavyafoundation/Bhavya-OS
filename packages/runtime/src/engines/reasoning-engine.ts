/**
 * Reasoning Engine
 *
 * Logical reasoning, inference, problem-solving, and decision analysis
 * for Bhavya OS.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReasoningType =
  "deductive" | "inductive" | "abductive" | "analogical" | "causal";

export type ReasoningStatus =
  "pending" | "in-progress" | "completed" | "failed";

export type PremiseType =
  "fact" | "assumption" | "observation" | "definition" | "rule";

export interface Reasoning {
  id: string;
  type: ReasoningType;
  question: string;
  status: ReasoningStatus;
  premises: Premise[];
  conclusions: Conclusion[];
  steps: ReasoningStep[];
  confidence: number;
  alternatives: Alternative[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Premise {
  id: string;
  type: PremiseType;
  statement: string;
  confidence: number;
  sources: string[];
}

export interface Conclusion {
  id: string;
  statement: string;
  confidence: number;
  supportingPremises: string[];
  reasoning: string;
}

export interface ReasoningStep {
  id: string;
  description: string;
  input: string[];
  output: string;
  rule: string;
  confidence: number;
}

export interface Alternative {
  id: string;
  conclusion: string;
  confidence: number;
  reasons: string[];
}

export interface LogicRule {
  id: string;
  name: string;
  description: string;
  pattern: string;
  action: string;
}

export interface ReasoningMetrics {
  totalReasoning: number;
  byType: Record<ReasoningType, number>;
  byStatus: Record<ReasoningStatus, number>;
  avgConfidence: number;
  avgStepsPerReasoning: number;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class ReasoningEngine {
  private reasoning: Map<string, Reasoning> = new Map();
  private rules: Map<string, LogicRule> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Create a new reasoning session
   */
  async create(
    reasoning: Omit<Reasoning, "id" | "createdAt" | "updatedAt">,
  ): Promise<Reasoning> {
    const id = this.generateId();
    const now = new Date();

    const newReasoning: Reasoning = {
      ...reasoning,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.reasoning.set(id, newReasoning);
    return newReasoning;
  }

  /**
   * Get a reasoning by ID
   */
  async get(id: string): Promise<Reasoning | null> {
    return this.reasoning.get(id) || null;
  }

  /**
   * Update a reasoning
   */
  async update(
    id: string,
    updates: Partial<Omit<Reasoning, "id" | "createdAt">>,
  ): Promise<Reasoning | null> {
    const reasoning = this.reasoning.get(id);
    if (!reasoning) return null;

    const updatedReasoning: Reasoning = {
      ...reasoning,
      ...updates,
      updatedAt: new Date(),
    };

    this.reasoning.set(id, updatedReasoning);
    return updatedReasoning;
  }

  /**
   * Add a premise
   */
  async addPremise(
    reasoningId: string,
    premise: Omit<Premise, "id">,
  ): Promise<Premise | null> {
    const reasoning = this.reasoning.get(reasoningId);
    if (!reasoning) return null;

    const newPremise: Premise = {
      ...premise,
      id: this.generateId(),
    };

    reasoning.premises.push(newPremise);
    reasoning.updatedAt = new Date();

    return newPremise;
  }

  /**
   * Add a conclusion
   */
  async addConclusion(
    reasoningId: string,
    conclusion: Omit<Conclusion, "id">,
  ): Promise<Conclusion | null> {
    const reasoning = this.reasoning.get(reasoningId);
    if (!reasoning) return null;

    const newConclusion: Conclusion = {
      ...conclusion,
      id: this.generateId(),
    };

    reasoning.conclusions.push(newConclusion);
    reasoning.updatedAt = new Date();

    return newConclusion;
  }

  /**
   * Add a reasoning step
   */
  async addStep(
    reasoningId: string,
    step: Omit<ReasoningStep, "id">,
  ): Promise<ReasoningStep | null> {
    const reasoning = this.reasoning.get(reasoningId);
    if (!reasoning) return null;

    const newStep: ReasoningStep = {
      ...step,
      id: this.generateId(),
    };

    reasoning.steps.push(newStep);
    reasoning.updatedAt = new Date();

    return newStep;
  }

  /**
   * Perform deductive reasoning
   */
  async deduce(reasoningId: string): Promise<Conclusion | null> {
    const reasoning = this.reasoning.get(reasoningId);
    if (!reasoning) return null;

    // Get applicable rules
    const applicableRules = this.getApplicableRules(reasoning);

    // Apply rules to premises
    for (const rule of applicableRules) {
      const conclusion = this.applyRule(rule, reasoning);
      if (conclusion) {
        await this.addConclusion(reasoningId, conclusion);
        return conclusion;
      }
    }

    return null;
  }

  /**
   * Perform inductive reasoning
   */
  async induce(reasoningId: string): Promise<Conclusion | null> {
    const reasoning = this.reasoning.get(reasoningId);
    if (!reasoning) return null;

    // Find patterns in premises
    const patterns = this.findPatterns(reasoning.premises);

    if (patterns.length > 0) {
      const conclusion: Omit<Conclusion, "id"> = {
        statement: `Based on ${reasoning.premises.length} observations, pattern suggests: ${patterns[0]}`,
        confidence: 0.7,
        supportingPremises: reasoning.premises.map((p) => p.id),
        reasoning: "Inductive generalization from observed patterns",
      };

      const result = await this.addConclusion(reasoningId, conclusion);
      return result;
    }

    return null;
  }

  /**
   * Perform abductive reasoning
   */
  async abduce(reasoningId: string): Promise<Conclusion | null> {
    const reasoning = this.reasoning.get(reasoningId);
    if (!reasoning) return null;

    // Find best explanation for observations
    const explanations = this.generateExplanations(reasoning.premises);

    if (explanations.length > 0) {
      const bestExplanation = explanations[0];

      const conclusion: Omit<Conclusion, "id"> = {
        statement: bestExplanation,
        confidence: 0.6,
        supportingPremises: reasoning.premises.map((p) => p.id),
        reasoning: "Abductive inference to best explanation",
      };

      const result = await this.addConclusion(reasoningId, conclusion);
      return result;
    }

    return null;
  }

  /**
   * Complete reasoning
   */
  async complete(id: string): Promise<Reasoning | null> {
    const reasoning = this.reasoning.get(id);
    if (!reasoning) return null;

    reasoning.status = "completed";
    reasoning.completedAt = new Date();
    reasoning.updatedAt = new Date();

    // Calculate confidence
    reasoning.confidence = this.calculateConfidence(reasoning);

    // Generate alternatives
    reasoning.alternatives = this.generateAlternatives(reasoning);

    return reasoning;
  }

  /**
   * Add a logic rule
   */
  async addRule(rule: Omit<LogicRule, "id">): Promise<LogicRule> {
    const newRule: LogicRule = {
      ...rule,
      id: this.generateId(),
    };

    this.rules.set(newRule.id, newRule);
    return newRule;
  }

  /**
   * Get reasoning metrics
   */
  async getMetrics(): Promise<ReasoningMetrics> {
    const reasoningArray = Array.from(this.reasoning.values());

    const byType: Record<ReasoningType, number> = {
      deductive: 0,
      inductive: 0,
      abductive: 0,
      analogical: 0,
      causal: 0,
    };

    const byStatus: Record<ReasoningStatus, number> = {
      pending: 0,
      "in-progress": 0,
      completed: 0,
      failed: 0,
    };

    let totalConfidence = 0;
    let totalSteps = 0;

    for (const reasoning of reasoningArray) {
      byType[reasoning.type]++;
      byStatus[reasoning.status]++;
      totalConfidence += reasoning.confidence;
      totalSteps += reasoning.steps.length;
    }

    return {
      totalReasoning: reasoningArray.length,
      byType,
      byStatus,
      avgConfidence:
        reasoningArray.length > 0 ? totalConfidence / reasoningArray.length : 0,
      avgStepsPerReasoning:
        reasoningArray.length > 0 ? totalSteps / reasoningArray.length : 0,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `reason_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private initializeDefaultRules(): void {
    // Add some default logic rules
    const defaultRules: Omit<LogicRule, "id">[] = [
      {
        name: "Modus Ponens",
        description: "If P implies Q, and P is true, then Q is true",
        pattern: "P -> Q, P",
        action: "Q",
      },
      {
        name: "Modus Tollens",
        description: "If P implies Q, and Q is false, then P is false",
        pattern: "P -> Q, !Q",
        action: "!P",
      },
      {
        name: "Hypothetical Syllogism",
        description: "If P implies Q, and Q implies R, then P implies R",
        pattern: "P -> Q, Q -> R",
        action: "P -> R",
      },
    ];

    for (const rule of defaultRules) {
      this.addRule(rule);
    }
  }

  private getApplicableRules(reasoning: Reasoning): LogicRule[] {
    // Simple pattern matching - would use more sophisticated matching in production
    return Array.from(this.rules.values());
  }

  private applyRule(
    rule: LogicRule,
    _reasoning: Reasoning,
  ): Omit<Conclusion, "id"> | null {
    // Simple rule application - would use proper logic engine in production
    const premiseStatements = reasoning.premises.map((p) => p.statement);
    const combined = premiseStatements.join(", ");

    if (combined.includes(rule.pattern)) {
      return {
        statement: `By ${rule.name}: ${rule.action}`,
        confidence: 0.8,
        supportingPremises: reasoning.premises.map((p) => p.id),
        reasoning: `Applied ${rule.name}: ${rule.description}`,
      };
    }

    return null;
  }

  private findPatterns(premises: Premise[]): string[] {
    // Simple pattern finding - would use ML in production
    const patterns: string[] = [];

    // Check for common terms
    const terms = premises.flatMap((p) => p.statement.split(" "));
    const termCounts = new Map<string, number>();

    for (const term of terms) {
      termCounts.set(term, (termCounts.get(term) || 0) + 1);
    }

    for (const [term, count] of termCounts) {
      if (count >= 3 && term.length > 3) {
        patterns.push(`Common theme: ${term}`);
      }
    }

    return patterns;
  }

  private generateExplanations(premises: Premise[]): string[] {
    // Simple explanation generation - would use more sophisticated methods in production
    const explanations: string[] = [];

    if (premises.length > 0) {
      explanations.push(
        `Based on ${premises.length} premises, the most likely explanation is the conjunction of all observed facts`,
      );
    }

    return explanations;
  }

  private calculateConfidence(reasoning: Reasoning): number {
    if (reasoning.conclusions.length === 0) return 0;

    // Average confidence of conclusions
    const avgConclusionConfidence =
      reasoning.conclusions.reduce((sum, c) => sum + c.confidence, 0) /
      reasoning.conclusions.length;

    // Factor in premise confidence
    const avgPremiseConfidence =
      reasoning.premises.length > 0
        ? reasoning.premises.reduce((sum, p) => sum + p.confidence, 0) /
          reasoning.premises.length
        : 0.5;

    // Factor in number of steps
    const stepScore = Math.min(1, reasoning.steps.length / 5);

    return (
      avgConclusionConfidence * 0.5 +
      avgPremiseConfidence * 0.3 +
      stepScore * 0.2
    );
  }

  private generateAlternatives(reasoning: Reasoning): Alternative[] {
    const alternatives: Alternative[] = [];

    // Generate alternative conclusions
    if (reasoning.conclusions.length > 0) {
      const primaryConclusion = reasoning.conclusions[0];

      alternatives.push({
        id: this.generateId(),
        conclusion: `Opposite of: ${primaryConclusion.statement}`,
        confidence: 1 - primaryConclusion.confidence,
        reasons: ["Negation of primary conclusion"],
      });

      alternatives.push({
        id: this.generateId(),
        conclusion: `Uncertain about: ${primaryConclusion.statement}`,
        confidence: 0.5,
        reasons: ["Insufficient evidence"],
      });
    }

    return alternatives;
  }
}

export default ReasoningEngine;
