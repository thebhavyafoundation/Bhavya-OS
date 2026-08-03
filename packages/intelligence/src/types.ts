// ─── Source Types ───────────────────────────────────────────────────────────
// Every external integration uses a provider interface.
// Adding a new source = implementing a provider, not modifying core logic.

export type SourceKind =
  | "github"
  | "mcp_registry"
  | "ai_framework"
  | "ui_inspiration"
  | "education"
  | "research"
  | "website"
  | "social"
  | "blog"
  | "youtube"
  | "product_hunt";

export type SyncFrequency = "hourly" | "daily" | "weekly" | "monthly";

export interface Source {
  id: string;
  name: string;
  kind: SourceKind;
  baseUrl: string;
  syncFrequency: SyncFrequency;
  enabled: boolean;
  lastSyncedAt: string | null;
  config: Record<string, unknown>;
  rateLimit?: number;
  apiKey?: string;
}

export interface SourceProvider {
  readonly kind: SourceKind;
  fetch(opts: FetchOpts): Promise<RawItem[]>;
  normalize(item: RawItem): NormalizedItem;
  canFetch(source: Source): boolean;
}

export interface FetchOpts {
  source: Source;
  since?: string;
  limit?: number;
  query?: string;
}

// ─── Raw & Normalized Items ────────────────────────────────────────────────

export interface RawItem {
  sourceId: string;
  sourceKind: SourceKind;
  externalId: string;
  data: Record<string, unknown>;
  fetchedAt: string;
}

export interface NormalizedItem {
  id: string;
  sourceId: string;
  sourceKind: SourceKind;
  externalId: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  metadata: Record<string, unknown>;
  normalizedAt: string;
}

// ─── Knowledge Package ─────────────────────────────────────────────────────
// Every discovered item becomes a Knowledge Package.

export type KnowledgeCategory =
  | "repository"
  | "framework"
  | "mcp_server"
  | "ai_tool"
  | "education_resource"
  | "research_paper"
  | "website"
  | "ui_pattern"
  | "architecture_pattern"
  | "course"
  | "video"
  | "article"
  | "product"
  | "comparison";

export interface KnowledgePackage {
  id: string;
  sourceId: string;
  sourceKind: SourceKind;
  externalId: string;
  category: KnowledgeCategory;
  title: string;
  description: string;
  url: string;
  tags: string[];
  metadata: Record<string, unknown>;

  // AI Analysis
  analysis: Analysis | null;

  // Recommendations
  recommendation: Recommendation | null;

  // Technology Radar
  radarClassification: RadarClassification | null;

  // Relationships
  relatedIds: string[];
  dependsOnIds: string[];
  usedByIds: string[];

  // Tracking
  createdAt: string;
  updatedAt: string;
  version: number;
}

// ─── Analysis ──────────────────────────────────────────────────────────────

export interface Analysis {
  executiveSummary: string;
  architecture: string;
  technologyStack: string[];
  interestingIdeas: string[];
  reusablePatterns: string[];
  risks: string[];
  alternatives: string[];
  adoptionScore: number; // 0-100
  integrationNotes: string;
  relatedTechnologies: string[];
  suggestedLearningResources: string[];
  futureWatchlist: string[];
  analyzedAt: string;
  model: string;
}

// ─── Recommendations ───────────────────────────────────────────────────────

export type RecommendationLevel =
  | "adopt_immediately"
  | "pilot"
  | "study"
  | "reference"
  | "monitor"
  | "ignore"
  | "archive";

export interface Recommendation {
  level: RecommendationLevel;
  reasoning: string;
  confidence: number; // 0-1
  factors: RecommendationFactor[];
  recommendedAt: string;
}

export interface RecommendationFactor {
  name: string;
  score: number; // 0-10
  weight: number;
  explanation: string;
}

// ─── Technology Radar ──────────────────────────────────────────────────────

export type RadarQuadrant = "adopt" | "trial" | "assess" | "hold";
export type RadarRing = "leading" | "emerging" | "experimental" | "deprecated";

export interface RadarClassification {
  quadrant: RadarQuadrant;
  ring: RadarRing;
  isNew: boolean;
  changedFrom?: RadarQuadrant;
  classifiedAt: string;
}

export interface RadarEntry {
  id: string;
  name: string;
  quadrant: RadarQuadrant;
  ring: RadarRing;
  description: string;
  category: string;
  isNew: boolean;
  changedFrom?: RadarQuadrant;
  url?: string;
}

export interface RadarReport {
  id: string;
  quarter: string;
  year: number;
  entries: RadarEntry[];
  summary: string;
  generatedAt: string;
}

// ─── Comparative Analysis ──────────────────────────────────────────────────

export interface Comparison {
  id: string;
  title: string;
  items: ComparisonItem[];
  criteria: ComparisonCriteria;
  verdict: string;
  recommendation: string;
  generatedAt: string;
}

export interface ComparisonItem {
  name: string;
  url: string;
  scores: Record<string, number>; // criteria -> 0-10
}

export interface ComparisonCriteria {
  architecture: string;
  complexity: string;
  performance: string;
  community: string;
  documentation: string;
  maintenance: string;
  learningCurve: string;
  bhavyaSuitability: string;
}

// ─── Knowledge Graph ───────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  type: KnowledgeCategory;
  label: string;
  metadata: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship:
    | "uses"
    | "related_to"
    | "depends_on"
    | "implements"
    | "extends"
    | "alternatives"
    | "learned_from"
    | "inspired_by";
  weight: number;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ─── Sync State ────────────────────────────────────────────────────────────

export interface SyncState {
  sourceId: string;
  lastSyncAt: string;
  itemCount: number;
  newItems: number;
  updatedItems: number;
  errors: SyncError[];
}

export interface SyncError {
  itemId: string;
  error: string;
  timestamp: string;
}

// ─── Dashboard Types ───────────────────────────────────────────────────────

export interface TrendingItem {
  package: KnowledgePackage;
  trendScore: number;
  trendReason: string;
}

export interface RankingEntry {
  package: KnowledgePackage;
  rank: number;
  score: number;
  category: string;
}

export interface DashboardState {
  trending: TrendingItem[];
  recentlyAdded: KnowledgePackage[];
  radar: RadarEntry[];
  rankings: RankingEntry[];
  recommendations: Recommendation[];
  stats: DashboardStats;
}

export interface DashboardStats {
  totalPackages: number;
  sourcesMonitored: number;
  lastSyncAt: string;
  packagesThisWeek: number;
  categoryBreakdown: Record<KnowledgeCategory, number>;
}
