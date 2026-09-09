// ─── Daily Intelligence Loop — Domain Model ────────────────────────────────
// Types for the daily intelligence cycle: discovery → extraction → evaluation → briefing

// ─── Run Tracking ──────────────────────────────────────────────────────────

export type DailyRunStatus = "running" | "completed" | "failed" | "partial";

export interface DailyRun {
  id: string;
  run_date: string;
  status: DailyRunStatus;
  started_at: string;
  completed_at: string | null;
  candidate_count: number;
  inspected_count: number;
  findings_count: number;
  errors_count: number;
  skipped_count: number;
  api_calls: number;
  duration_ms: number | null;
  config: string;
  error_log: string;
  metadata: string;
}

export interface DailyRunConfig {
  max_candidates: number;
  max_inspections: number;
  max_api_requests: number;
  max_readme_size: number;
  categories: string[];
  min_stars: number;
  languages: string[];
}

export const DEFAULT_DAILY_RUN_CONFIG: DailyRunConfig = {
  max_candidates: 100,
  max_inspections: 30,
  max_api_requests: 200,
  max_readme_size: 50000,
  categories: [
    "ai",
    "developer-tools",
    "infrastructure",
    "web-experience",
    "education",
  ],
  min_stars: 10,
  languages: [],
};

// ─── Discovery ─────────────────────────────────────────────────────────────

export interface DiscoveryCandidate {
  id: string;
  run_id: string;
  repository_id: string | null;
  full_name: string;
  owner: string;
  name: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  license: string | null;
  created_at_repo: string;
  updated_at: string;
  pushed_at: string;
  archived: number;
  open_issues: number;
  discovery_source: string;
  discovery_query: string | null;
  discovery_signal: string;
  rank_score: number;
  rank_explanation: string;
  filtered: number;
  filter_reason: string | null;
  inspected: number;
}

export type DiscoverySignal =
  | "star_momentum"
  | "recent_releases"
  | "community_activity"
  | "documentation_quality"
  | "topic_relevance"
  | "language_ecosystem"
  | "trending";

export interface DiscoveryCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  search_queries: string[];
  languages: string[];
  topics: string[];
  min_stars: number;
  active: boolean;
  priority: number;
}

// ─── Observation ───────────────────────────────────────────────────────────

export type ChangeSignificance =
  "none" | "minor" | "moderate" | "major" | "critical";

export interface DailyObservation {
  id: string;
  run_id: string;
  repository_id: string;
  observation_date: string;
  stars: number;
  forks: number;
  open_issues: number;
  latest_release: string | null;
  latest_commit: string | null;
  description: string;
  topics: string[];
  language: string | null;
  license: string | null;
  health_score: number | null;
  technology_score: number | null;
  bhavya_score: number | null;
  recommendation_type: string | null;
  changes_detected: string[];
  change_significance: ChangeSignificance;
  previous_observation_id: string | null;
  metadata: string;
}

// ─── Intelligence Findings ─────────────────────────────────────────────────

export type FindingType =
  | "engineering_practice"
  | "architecture_lesson"
  | "ai_technique"
  | "design_principle"
  | "visual_insight"
  | "learning_lesson"
  | "experiment_idea"
  | "security_concern"
  | "license_concern"
  | "quality_observation";

export type FindingCategory =
  | "engineering"
  | "architecture"
  | "ai"
  | "design"
  | "education"
  | "security"
  | "license"
  | "quality"
  | "community";

export type ConfidenceLevel = "low" | "medium" | "high";
export type VerificationState =
  "observed" | "inferred" | "recommended" | "experimental";
export type QualityLevel = "low" | "medium" | "high" | "exceptional";
export type RelevanceLevel = "low" | "medium" | "high";

export interface IntelligenceFinding {
  id: string;
  run_id: string;
  repository_id: string | null;
  finding_type: FindingType;
  category: FindingCategory;
  title: string;
  description: string;
  evidence: string[];
  source_files: string[];
  confidence: ConfidenceLevel;
  confidence_score: number;
  verification_state: VerificationState;
  quality: QualityLevel;
  relevance_to_bhavya: RelevanceLevel;
  applicability: string[];
  tradeoffs: string[];
  tags: string[];
  metadata: string;
  created_at: string;
}

// ─── Experiment Candidates ─────────────────────────────────────────────────

export type ExperimentDifficulty =
  "beginner" | "intermediate" | "advanced" | "expert";
export type ExperimentRisk = "low" | "medium" | "high";
export type ExperimentStatus =
  "proposed" | "approved" | "running" | "completed" | "rejected";

export interface ExperimentCandidate {
  id: string;
  run_id: string;
  repository_id: string | null;
  finding_id: string | null;
  question: string;
  hypothesis: string;
  technique: string;
  source_evidence: string[];
  implementation_scope: string | null;
  measurements: string[];
  expected_learning: string | null;
  difficulty: ExperimentDifficulty;
  risk: ExperimentRisk;
  relevance_to_bhavya: RelevanceLevel;
  status: ExperimentStatus;
  metadata: string;
}

// ─── Daily Briefing ────────────────────────────────────────────────────────

export interface DailyBriefing {
  id: string;
  run_id: string;
  run_date: string;
  top_discoveries: BriefingItem[];
  engineering_practices: BriefingItem[];
  ai_techniques: BriefingItem[];
  architecture_lessons: BriefingItem[];
  design_inspiration: BriefingItem[];
  learning_lessons: BriefingItem[];
  experiments: BriefingItem[];
  radar_changes: BriefingItem[];
  warnings: BriefingItem[];
  summary: string | null;
}

export interface BriefingItem {
  title: string;
  description: string;
  source: string;
  relevance: RelevanceLevel;
  confidence: ConfidenceLevel;
  action: string;
}

// ─── Ranking ───────────────────────────────────────────────────────────────

export interface RankingDimension {
  name: string;
  score: number;
  weight: number;
  explanation: string;
}

export interface RankingResult {
  total_score: number;
  dimensions: RankingDimension[];
  recommendation: string;
}

// ─── Extraction ────────────────────────────────────────────────────────────

export interface EngineeringPractice {
  title: string;
  description: string;
  category: string;
  source_repository: string;
  source_evidence: string[];
  confidence: ConfidenceLevel;
  verification_state: VerificationState;
  bhavya_relevance: RelevanceLevel;
  applicability: string[];
  tradeoffs: string[];
}

export interface ArchitectureLesson {
  problem: string;
  approach: string;
  why_it_works: string;
  tradeoffs: string[];
  evidence: string[];
  bhavya_relevance: RelevanceLevel;
  possible_experiment: string | null;
  source_repository: string;
}

export interface AITechnique {
  name: string;
  description: string;
  category: string;
  source_repository: string;
  source_evidence: string[];
  confidence: ConfidenceLevel;
  bhavya_relevance: RelevanceLevel;
  applicability: string[];
  related_techniques: string[];
}

export interface DesignPrinciple {
  title: string;
  description: string;
  category: string;
  source_repository: string;
  source_evidence: string[];
  confidence: ConfidenceLevel;
  bhavya_relevance: RelevanceLevel;
  example: string | null;
  applicability: string[];
}

export interface VisualInsight {
  title: string;
  description: string;
  source_repository: string;
  source_evidence: string[];
  principle: string;
  bhavya_applicability: string;
  confidence: ConfidenceLevel;
}

export interface LearningLesson {
  title: string;
  concept: string;
  prerequisites: string[];
  explanation: string;
  example: string | null;
  why_it_matters: string;
  source: string;
  evidence: string[];
  difficulty: ExperimentDifficulty;
  bhavya_relevance: RelevanceLevel;
}

// ─── License & Security Gates ──────────────────────────────────────────────

export interface LicenseGate {
  license: string | null;
  license_confidence: ConfidenceLevel;
  license_source: string;
  is_osi_approved: boolean;
  is_copyleft: boolean;
  compatibility_notes: string;
  risk: "none" | "low" | "medium" | "high";
  recommendation: "adopt" | "study" | "monitor" | "reject";
}

export interface SecurityGate {
  credential_files: string[];
  suspicious_patterns: string[];
  dangerous_install_scripts: boolean;
  unusual_executables: boolean;
  dependency_concerns: string[];
  overall_risk: "none" | "low" | "medium" | "high";
  evidence: string[];
  recommendation: "safe" | "caution" | "investigate" | "reject";
}

// ─── Provenance ────────────────────────────────────────────────────────────

export interface Provenance {
  source: string;
  observed_at: string;
  evidence: string[];
  confidence: ConfidenceLevel;
  verification_state: VerificationState;
  adapted_from: string | null;
}

// ─── Trend Detection ───────────────────────────────────────────────────────

export interface Trend {
  name: string;
  description: string;
  category: string;
  direction: "rising" | "stable" | "declining";
  evidence_count: number;
  evidence_repositories: string[];
  first_observed: string;
  last_observed: string;
  strength: "weak" | "moderate" | "strong";
}

// ─── Search ────────────────────────────────────────────────────────────────

export interface IntelligenceSearchQuery {
  repository?: string;
  technology?: string;
  language?: string;
  category?: string;
  pattern?: string;
  practice?: string;
  lesson?: string;
  experiment?: string;
  design?: string;
  topic?: string;
  date_from?: string;
  date_to?: string;
  recommendation?: string;
  finding_type?: FindingType;
  quality_min?: QualityLevel;
  confidence_min?: ConfidenceLevel;
  limit?: number;
  offset?: number;
}
