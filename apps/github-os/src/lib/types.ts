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

// Slice 4 — Engineering Co-Founder

export interface EngineeringReview {
  id: string;
  repository_id: string;
  review_type: string;
  overall_score: number;
  architecture_score: number;
  code_organization_score: number;
  documentation_score: number;
  testing_score: number;
  automation_score: number;
  maintainability_score: number;
  extensibility_score: number;
  developer_experience_score: number;
  educational_value_score: number;
  future_risk_score: number;
  strengths: string;
  weaknesses: string;
  missing_patterns: string;
  recommendations: string;
  verdict: string;
  created_at: string;
}

export interface TechnicalDebt {
  id: string;
  repository_id: string;
  category: string;
  title: string;
  description: string;
  severity: string;
  business_impact: string;
  engineering_impact: string;
  estimated_effort: string;
  suggested_solution: string;
  related_knowledge_packages: string;
  related_adrs: string;
  status: string;
  created_at: string;
}

export interface ArchitectureAdvisor {
  id: string;
  repository_id: string;
  comparison_repo: string;
  missing_layers: string;
  architectural_drift: string;
  duplicated_concepts: string;
  improvement_recommendations: string;
  migration_effort: string;
  tradeoffs: string;
  created_at: string;
}

export interface ImplementationPlan {
  id: string;
  repository_id: string;
  plan_type: string;
  title: string;
  roadmap: string;
  epics: string;
  milestones: string;
  phases: string;
  dependencies: string;
  suggested_order: string;
  risk_analysis: string;
  learning_prerequisites: string;
  status: string;
  created_at: string;
}

export interface BuildBlueprint {
  id: string;
  repository_id: string;
  blueprint_type: string;
  title: string;
  overview: string;
  folder_structure: string;
  tech_stack: string;
  implementation_roadmap: string;
  key_decisions: string;
  pitfalls: string;
  testing_strategy: string;
  deployment_guide: string;
  estimated_effort: string;
  created_at: string;
}

export interface RepositoryFitness {
  id: string;
  repository_id: string;
  engineering_quality: number;
  educational_quality: number;
  architecture_quality: number;
  maintainability: number;
  extensibility: number;
  reusability: number;
  innovation: number;
  community: number;
  bhavya_score: number;
  explanations: string;
  calculated_at: string;
}

export interface StudentMode {
  id: string;
  repository_id: string;
  study_guide: string;
  learning_roadmap: string;
  prerequisites: string;
  exercises: string;
  mini_projects: string;
  capstone_projects: string;
  interview_questions: string;
  discussion_questions: string;
  reflection_notes: string;
  engineering_challenges: string;
  difficulty_score: number;
  created_at: string;
}

export interface EliteEngineeringLibrary {
  id: string;
  category: string;
  title: string;
  description: string;
  repository_id: string;
  tags: string;
  quality_score: number;
  created_at: string;
}

export type ReviewType =
  "comprehensive" | "quick" | "architecture" | "security";
export type DebtCategory =
  | "documentation"
  | "testing"
  | "infrastructure"
  | "code-quality"
  | "dependency"
  | "architecture";
export type DebtSeverity = "low" | "medium" | "high" | "critical";
export type DebtStatus = "open" | "in-progress" | "resolved" | "accepted";
export type BlueprintType = "from-scratch" | "from-repository" | "from-pattern";
export type PlanType = "improvement" | "migration" | "greenfield" | "refactor";
export type EliteCategory =
  | "architecture"
  | "testing"
  | "documentation"
  | "folder-structures"
  | "design-systems"
  | "ai-agents"
  | "devops"
  | "performance"
  | "security";
