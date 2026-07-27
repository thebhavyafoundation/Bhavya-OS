/**
 * Research Engine
 *
 * Researches topics, gathers information, synthesizes findings,
 * and provides evidence-based recommendations.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ResearchStatus = "pending" | "in-progress" | "completed" | "failed";

export type SourceType =
  "document" | "web" | "api" | "database" | "expert" | "analysis";

export type EvidenceStrength = "strong" | "moderate" | "weak" | "anecdotal";

export interface Research {
  id: string;
  topic: string;
  question: string;
  status: ResearchStatus;
  findings: Finding[];
  sources: Source[];
  synthesis: string;
  recommendations: Recommendation[];
  confidence: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Finding {
  id: string;
  statement: string;
  evidence: Evidence[];
  strength: EvidenceStrength;
  sources: string[];
  notes: string;
}

export interface Evidence {
  id: string;
  type: string;
  content: string;
  credibility: number;
  relevance: number;
}

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  url?: string;
  author?: string;
  publishedAt?: Date;
  credibility: number;
  relevance: number;
  notes: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  rationale: string;
  confidence: number;
  supportingFindings: string[];
  risks: string[];
  alternatives: string[];
}

export interface ResearchMetrics {
  totalResearch: number;
  byStatus: Record<ResearchStatus, number>;
  avgConfidence: number;
  avgSourcesPerResearch: number;
  avgFindingsPerResearch: number;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class ResearchEngine {
  private research: Map<string, Research> = new Map();

  /**
   * Create a new research project
   */
  async create(
    research: Omit<Research, "id" | "createdAt" | "updatedAt">,
  ): Promise<Research> {
    const id = this.generateId();
    const now = new Date();

    const newResearch: Research = {
      ...research,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.research.set(id, newResearch);
    return newResearch;
  }

  /**
   * Get a research by ID
   */
  async get(id: string): Promise<Research | null> {
    return this.research.get(id) || null;
  }

  /**
   * Update a research
   */
  async update(
    id: string,
    updates: Partial<Omit<Research, "id" | "createdAt">>,
  ): Promise<Research | null> {
    const research = this.research.get(id);
    if (!research) return null;

    const updatedResearch: Research = {
      ...research,
      ...updates,
      updatedAt: new Date(),
    };

    this.research.set(id, updatedResearch);
    return updatedResearch;
  }

  /**
   * Add a finding
   */
  async addFinding(
    researchId: string,
    finding: Omit<Finding, "id">,
  ): Promise<Finding | null> {
    const research = this.research.get(researchId);
    if (!research) return null;

    const newFinding: Finding = {
      ...finding,
      id: this.generateId(),
    };

    research.findings.push(newFinding);
    research.updatedAt = new Date();

    return newFinding;
  }

  /**
   * Add a source
   */
  async addSource(
    researchId: string,
    source: Omit<Source, "id">,
  ): Promise<Source | null> {
    const research = this.research.get(researchId);
    if (!research) return null;

    const newSource: Source = {
      ...source,
      id: this.generateId(),
    };

    research.sources.push(newSource);
    research.updatedAt = new Date();

    return newSource;
  }

  /**
   * Add a recommendation
   */
  async addRecommendation(
    researchId: string,
    recommendation: Omit<Recommendation, "id">,
  ): Promise<Recommendation | null> {
    const research = this.research.get(researchId);
    if (!research) return null;

    const newRecommendation: Recommendation = {
      ...recommendation,
      id: this.generateId(),
    };

    research.recommendations.push(newRecommendation);
    research.updatedAt = new Date();

    return newRecommendation;
  }

  /**
   * Complete research
   */
  async complete(id: string, synthesis: string): Promise<Research | null> {
    const research = this.research.get(id);
    if (!research) return null;

    research.synthesis = synthesis;
    research.status = "completed";
    research.completedAt = new Date();
    research.updatedAt = new Date();

    // Calculate confidence
    research.confidence = this.calculateConfidence(research);

    return research;
  }

  /**
   * Search research
   */
  async search(query: {
    topic?: string;
    status?: ResearchStatus;
  }): Promise<Research[]> {
    let results = Array.from(this.research.values());

    if (query.topic) {
      const searchTopic = query.topic.toLowerCase();
      results = results.filter(
        (r) =>
          r.topic.toLowerCase().includes(searchTopic) ||
          r.question.toLowerCase().includes(searchTopic),
      );
    }

    if (query.status) {
      results = results.filter((r) => r.status === query.status);
    }

    return results;
  }

  /**
   * Get research metrics
   */
  async getMetrics(): Promise<ResearchMetrics> {
    const researchArray = Array.from(this.research.values());

    const byStatus: Record<ResearchStatus, number> = {
      pending: 0,
      "in-progress": 0,
      completed: 0,
      failed: 0,
    };

    let totalConfidence = 0;
    let totalSources = 0;
    let totalFindings = 0;

    for (const research of researchArray) {
      byStatus[research.status]++;
      totalConfidence += research.confidence;
      totalSources += research.sources.length;
      totalFindings += research.findings.length;
    }

    return {
      totalResearch: researchArray.length,
      byStatus,
      avgConfidence:
        researchArray.length > 0 ? totalConfidence / researchArray.length : 0,
      avgSourcesPerResearch:
        researchArray.length > 0 ? totalSources / researchArray.length : 0,
      avgFindingsPerResearch:
        researchArray.length > 0 ? totalFindings / researchArray.length : 0,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private calculateConfidence(research: Research): number {
    if (research.findings.length === 0) return 0;

    // Factor 1: Number of findings
    const findingScore = Math.min(1, research.findings.length / 10);

    // Factor 2: Strength of evidence
    const strengthScores: Record<EvidenceStrength, number> = {
      strong: 1.0,
      moderate: 0.7,
      weak: 0.4,
      anecdotal: 0.2,
    };

    let avgStrength = 0;
    for (const finding of research.findings) {
      avgStrength += strengthScores[finding.strength];
    }
    avgStrength /= research.findings.length;

    // Factor 3: Source credibility
    const avgCredibility =
      research.sources.length > 0
        ? research.sources.reduce((sum, s) => sum + s.credibility, 0) /
          research.sources.length
        : 0;

    // Factor 4: Source count
    const sourceScore = Math.min(1, research.sources.length / 5);

    // Weighted average
    return (
      findingScore * 0.3 +
      avgStrength * 0.3 +
      avgCredibility * 0.2 +
      sourceScore * 0.2
    );
  }
}

export default ResearchEngine;
