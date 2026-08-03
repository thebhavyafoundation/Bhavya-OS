export interface Repository {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  license: string | null;
  topics: string;
  health_score: number;
  technology_score: number;
  bhavya_score: number;
  engineering_maturity: string;
  architecture_summary: string | null;
  folder_structure: string | null;
  readme_content: string | null;
  readme_summary: string | null;
  tech_stack: string;
  patterns: string;
  dependencies: string;
  maintainers: string;
  latest_release: string | null;
  latest_commit: string | null;
  why_bhavya_cares: string | null;
  learning_difficulty: string;
  learning_prerequisites: string;
  learning_reading_order: string | null;
  mcp_recommendations: string;
  cli_recommendations: string;
  recommendation_type: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgePackage {
  id: string;
  repository_id: string | null;
  category: string;
  title: string;
  content: string;
  metadata: string;
  tags: string;
  quality_score: number;
  created_at: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string | null;
  metadata: string;
  created_at: string;
}

export interface TechnologyRadar {
  id: string;
  name: string;
  category: string;
  ring: string;
  description: string | null;
  score: number;
  metadata: string;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  metadata: string;
  created_at: string;
}

export interface EngineeringPattern {
  id: string;
  repository_id: string;
  pattern_name: string;
  confidence: number;
  evidence: string | null;
  description: string | null;
  created_at: string;
}

export interface ADR {
  id: string;
  repository_id: string;
  number: number;
  title: string;
  status: string;
  context: string | null;
  decision: string | null;
  consequences: string | null;
  created_at: string;
}

export interface PatternLibraryEntry {
  id: string;
  name: string;
  slug: string;
  category: string;
  explanation: string;
  use_cases: string;
  related_patterns: string;
  educational_value: string | null;
  bhavya_recommendation: string | null;
  learning_mode: string | null;
  difficulty: string;
  created_at: string;
}

export interface RepositoryTimeline {
  id: string;
  repository_id: string;
  event_type: string;
  title: string;
  description: string | null;
  metadata: string;
  event_date: string;
  created_at: string;
}

export interface EngineeringHealth {
  id: string;
  repository_id: string;
  overall_score: number;
  documentation_score: number;
  test_coverage_score: number;
  dependency_freshness_score: number;
  release_cadence_score: number;
  architecture_consistency_score: number;
  knowledge_coverage_score: number;
  adr_coverage_score: number;
  educational_completeness_score: number;
  calculation_methodology: string | null;
  recommendations: string;
  calculated_at: string;
}

export interface LearningPath {
  id: string;
  repository_id: string;
  prerequisites: string;
  learning_objectives: string;
  reading_order: string;
  important_folders: string;
  key_files: string;
  concepts_demonstrated: string;
  suggested_exercises: string;
  mini_projects: string;
  capstone_ideas: string;
  estimated_hours: number;
  difficulty: string;
  created_at: string;
}

export interface KnowledgeGraphNode {
  id: string;
  node_type: string;
  label: string;
  metadata: string;
  created_at: string;
}

export interface KnowledgeGraphEdge {
  id: string;
  source_id: string;
  target_id: string;
  relationship: string;
  weight: number;
  metadata: string;
  created_at: string;
}

export interface EducationalExport {
  id: string;
  repository_id: string;
  export_type: string;
  title: string;
  content: string;
  metadata: string;
  created_at: string;
}

export interface InstitutionalMemory {
  id: string;
  repository_id: string;
  question: string;
  answer: string;
  evidence: string;
  confidence: number;
  created_at: string;
}

export type RingType = "adopt" | "trial" | "assess" | "hold";
export type Priority = "low" | "medium" | "high" | "critical";
export type RecommendationStatus =
  "pending" | "accepted" | "rejected" | "deferred";
export type EngineeringMaturity =
  "emerging" | "developing" | "mature" | "exemplary";
export type LearningDifficulty =
  "beginner" | "intermediate" | "advanced" | "expert";
export type RecommendationType =
  "adopt" | "study" | "reference" | "monitor" | "archive";
