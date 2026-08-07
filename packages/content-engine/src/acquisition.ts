export interface KnowledgeSource {
  id: string;
  type:
    | "paper"
    | "repository"
    | "course"
    | "tutorial"
    | "benchmark"
    | "dataset"
    | "blog"
    | "video"
    | "documentation";
  title: string;
  url: string;
  description: string;
  metadata: SourceMetadata;
  scores: QualityScores;
  status: "discovered" | "reviewed" | "approved" | "rejected" | "integrated";
  reviewedBy?: string;
  reviewedAt?: Date;
  integratedAt?: Date;
}

export interface SourceMetadata {
  authors?: string[];
  year?: number;
  venue?: string;
  stars?: number;
  forks?: number;
  language?: string;
  license?: string;
  lastUpdated?: Date;
  tags?: string[];
}

export interface QualityScores {
  quality: number;
  educational: number;
  research: number;
  production: number;
  recency: number;
  overall: number;
}

export interface KnowledgeAcquisitionConfig {
  sources: SourceConfig[];
  filters: FilterConfig[];
  scoring: ScoringConfig;
  review: ReviewConfig;
}

export interface SourceConfig {
  type: string;
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
  keywords: string[];
  minQuality: number;
}

export interface FilterConfig {
  field: string;
  operator: "equals" | "contains" | "gt" | "lt" | "between";
  value: string | number | boolean;
}

export interface ScoringConfig {
  weights: {
    quality: number;
    educational: number;
    research: number;
    production: number;
    recency: number;
  };
  thresholds: {
    autoApprove: number;
    requireReview: number;
    reject: number;
  };
}

export interface ReviewConfig {
  requiredReviewers: number;
  autoApproveThreshold: number;
  requireManualReview: boolean;
}

export class KnowledgeAcquisitionEngine {
  private sources: Map<string, KnowledgeSource> = new Map();
  private config: KnowledgeAcquisitionConfig;

  constructor(config: KnowledgeAcquisitionConfig) {
    this.config = config;
  }

  async discoverSource(
    type: string,
    title: string,
    url: string,
    description: string,
    metadata: SourceMetadata,
  ): Promise<KnowledgeSource> {
    const id = `ks-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const scores = this.calculateScores(metadata);

    const source: KnowledgeSource = {
      id,
      type: type as KnowledgeSource["type"],
      title,
      url,
      description,
      metadata,
      scores,
      status: "discovered",
    };

    this.sources.set(id, source);
    return source;
  }

  async reviewSource(
    id: string,
    reviewer: string,
    approved: boolean,
    _notes?: string,
  ): Promise<KnowledgeSource> {
    const source = this.sources.get(id);
    if (!source) throw new Error(`Source ${id} not found`);

    source.status = approved ? "approved" : "rejected";
    source.reviewedBy = reviewer;
    source.reviewedAt = new Date();

    return source;
  }

  async integrateSource(id: string): Promise<KnowledgeSource> {
    const source = this.sources.get(id);
    if (!source) throw new Error(`Source ${id} not found`);

    if (source.status !== "approved") {
      throw new Error(`Source ${id} is not approved`);
    }

    source.status = "integrated";
    source.integratedAt = new Date();

    return source;
  }

  async getSource(id: string): Promise<KnowledgeSource | undefined> {
    return this.sources.get(id);
  }

  async listSources(filters?: {
    type?: string;
    status?: string;
    minScore?: number;
  }): Promise<KnowledgeSource[]> {
    let sources = Array.from(this.sources.values());

    if (filters) {
      if (filters.type) {
        sources = sources.filter((s) => s.type === filters.type);
      }
      if (filters.status) {
        sources = sources.filter((s) => s.status === filters.status);
      }
      if (filters.minScore) {
        sources = sources.filter((s) => s.scores.overall >= filters.minScore);
      }
    }

    return sources;
  }

  async searchSources(query: string): Promise<KnowledgeSource[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.sources.values()).filter((source) => {
      return (
        source.title.toLowerCase().includes(lowerQuery) ||
        source.description.toLowerCase().includes(lowerQuery) ||
        source.metadata.tags?.some((tag) =>
          tag.toLowerCase().includes(lowerQuery),
        )
      );
    });
  }

  async getSourcesForTopic(topic: string): Promise<KnowledgeSource[]> {
    const lowerTopic = topic.toLowerCase();
    return Array.from(this.sources.values()).filter((source) => {
      return (
        source.title.toLowerCase().includes(lowerTopic) ||
        source.description.toLowerCase().includes(lowerTopic) ||
        source.metadata.tags?.some((tag) =>
          tag.toLowerCase().includes(lowerTopic),
        )
      );
    });
  }

  async getTopSources(limit: number = 10): Promise<KnowledgeSource[]> {
    return Array.from(this.sources.values())
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .slice(0, limit);
  }

  private calculateScores(metadata: SourceMetadata): QualityScores {
    let quality = 70;
    const educational = 70;
    const research = 70;
    const production = 70;
    let recency = 70;

    if (metadata.stars && metadata.stars > 1000) quality += 10;
    if (metadata.stars && metadata.stars > 10000) quality += 10;
    if (metadata.forks && metadata.forks > 100) quality += 5;

    if (metadata.license === "MIT" || metadata.license === "Apache-2.0") {
      quality += 5;
    }

    if (metadata.year) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - metadata.year;
      if (age <= 1) recency += 20;
      else if (age <= 2) recency += 10;
      else if (age > 5) recency -= 20;
    }

    const overall = Math.round(
      quality * this.config.scoring.weights.quality +
        educational * this.config.scoring.weights.educational +
        research * this.config.scoring.weights.research +
        production * this.config.scoring.weights.production +
        recency * this.config.scoring.weights.recency,
    );

    return {
      quality: Math.min(quality, 100),
      educational: Math.min(educational, 100),
      research: Math.min(research, 100),
      production: Math.min(production, 100),
      recency: Math.min(recency, 100),
      overall: Math.min(overall, 100),
    };
  }
}

export const defaultConfig: KnowledgeAcquisitionConfig = {
  sources: [
    {
      type: "paper",
      enabled: true,
      frequency: "daily",
      keywords: ["transformer", "LLM", "agent", "reinforcement learning"],
      minQuality: 60,
    },
    {
      type: "repository",
      enabled: true,
      frequency: "daily",
      keywords: ["llm", "transformer", "agent", "mlops"],
      minQuality: 70,
    },
    {
      type: "course",
      enabled: true,
      frequency: "weekly",
      keywords: ["machine learning", "deep learning", "AI"],
      minQuality: 60,
    },
    {
      type: "tutorial",
      enabled: true,
      frequency: "weekly",
      keywords: ["pytorch", "tensorflow", "huggingface"],
      minQuality: 50,
    },
    {
      type: "benchmark",
      enabled: true,
      frequency: "weekly",
      keywords: ["MMLU", "HumanEval", "GSM8K"],
      minQuality: 80,
    },
    {
      type: "dataset",
      enabled: true,
      frequency: "weekly",
      keywords: ["training", "evaluation", "fine-tuning"],
      minQuality: 70,
    },
  ],
  filters: [],
  scoring: {
    weights: {
      quality: 0.25,
      educational: 0.25,
      research: 0.2,
      production: 0.15,
      recency: 0.15,
    },
    thresholds: {
      autoApprove: 85,
      requireReview: 60,
      reject: 40,
    },
  },
  review: {
    requiredReviewers: 2,
    autoApproveThreshold: 85,
    requireManualReview: true,
  },
};

export const knowledgeAcquisition = new KnowledgeAcquisitionEngine(
  defaultConfig,
);
