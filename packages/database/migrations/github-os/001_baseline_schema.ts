import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "001_baseline_schema",
  name: "Baseline schema — 26 tables for repository intelligence",
  up: `
-- Core repository table (hub)
CREATE TABLE IF NOT EXISTS repositories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  license TEXT,
  topics TEXT DEFAULT '[]',
  health_score REAL DEFAULT 0,
  technology_score REAL DEFAULT 0,
  bhavya_score REAL DEFAULT 0,
  engineering_maturity TEXT DEFAULT 'emerging',
  architecture_summary TEXT,
  folder_structure TEXT,
  readme_content TEXT,
  readme_summary TEXT,
  tech_stack TEXT DEFAULT '{}',
  patterns TEXT DEFAULT '[]',
  dependencies TEXT DEFAULT '[]',
  maintainers TEXT DEFAULT '[]',
  latest_release TEXT,
  latest_commit TEXT,
  why_bhavya_cares TEXT,
  learning_difficulty TEXT DEFAULT 'intermediate',
  learning_prerequisites TEXT DEFAULT '[]',
  learning_reading_order TEXT,
  mcp_recommendations TEXT DEFAULT '[]',
  cli_recommendations TEXT DEFAULT '[]',
  recommendation_type TEXT DEFAULT 'monitor',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge packages
CREATE TABLE IF NOT EXISTS knowledge_packages (
  id TEXT PRIMARY KEY,
  repository_id TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',
  tags TEXT DEFAULT '[]',
  quality_score REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Activity events
CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Technology radar
CREATE TABLE IF NOT EXISTS technology_radar (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  ring TEXT NOT NULL DEFAULT 'assess',
  description TEXT,
  score REAL DEFAULT 0,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Engineering patterns
CREATE TABLE IF NOT EXISTS engineering_patterns (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  pattern_name TEXT NOT NULL,
  confidence REAL DEFAULT 0,
  evidence TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Architecture decision records
CREATE TABLE IF NOT EXISTS adrs (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'proposed',
  context TEXT,
  decision TEXT,
  consequences TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Repository comparisons
CREATE TABLE IF NOT EXISTS repository_comparisons (
  id TEXT PRIMARY KEY,
  repo_a_id TEXT NOT NULL,
  repo_b_id TEXT NOT NULL,
  comparison TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repo_a_id) REFERENCES repositories(id),
  FOREIGN KEY (repo_b_id) REFERENCES repositories(id)
);

-- Pattern library
CREATE TABLE IF NOT EXISTS pattern_library (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  explanation TEXT NOT NULL,
  use_cases TEXT DEFAULT '[]',
  related_patterns TEXT DEFAULT '[]',
  educational_value TEXT,
  bhavya_recommendation TEXT,
  learning_mode TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Repository timelines
CREATE TABLE IF NOT EXISTS repository_timelines (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata TEXT DEFAULT '{}',
  event_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Engineering health
CREATE TABLE IF NOT EXISTS engineering_health (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  overall_score REAL DEFAULT 0,
  documentation_score REAL DEFAULT 0,
  test_coverage_score REAL DEFAULT 0,
  dependency_freshness_score REAL DEFAULT 0,
  release_cadence_score REAL DEFAULT 0,
  architecture_consistency_score REAL DEFAULT 0,
  knowledge_coverage_score REAL DEFAULT 0,
  adr_coverage_score REAL DEFAULT 0,
  educational_completeness_score REAL DEFAULT 0,
  calculation_methodology TEXT,
  recommendations TEXT DEFAULT '[]',
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Learning paths
CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  prerequisites TEXT DEFAULT '[]',
  learning_objectives TEXT DEFAULT '[]',
  reading_order TEXT DEFAULT '[]',
  important_folders TEXT DEFAULT '[]',
  key_files TEXT DEFAULT '[]',
  concepts_demonstrated TEXT DEFAULT '[]',
  suggested_exercises TEXT DEFAULT '[]',
  mini_projects TEXT DEFAULT '[]',
  capstone_ideas TEXT DEFAULT '[]',
  estimated_hours REAL DEFAULT 0,
  difficulty TEXT DEFAULT 'intermediate',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Knowledge graph nodes
CREATE TABLE IF NOT EXISTS knowledge_graph_nodes (
  id TEXT PRIMARY KEY,
  node_type TEXT NOT NULL,
  label TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge graph edges
CREATE TABLE IF NOT EXISTS knowledge_graph_edges (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relationship TEXT NOT NULL,
  weight REAL DEFAULT 1,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Educational exports
CREATE TABLE IF NOT EXISTS educational_exports (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  export_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Institutional memory
CREATE TABLE IF NOT EXISTS institutional_memory (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  evidence TEXT DEFAULT '[]',
  confidence REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Engineering reviews
CREATE TABLE IF NOT EXISTS engineering_reviews (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  review_type TEXT NOT NULL,
  overall_score REAL DEFAULT 0,
  architecture_score REAL DEFAULT 0,
  code_organization_score REAL DEFAULT 0,
  documentation_score REAL DEFAULT 0,
  testing_score REAL DEFAULT 0,
  automation_score REAL DEFAULT 0,
  maintainability_score REAL DEFAULT 0,
  extensibility_score REAL DEFAULT 0,
  developer_experience_score REAL DEFAULT 0,
  educational_value_score REAL DEFAULT 0,
  future_risk_score REAL DEFAULT 0,
  strengths TEXT DEFAULT '[]',
  weaknesses TEXT DEFAULT '[]',
  missing_patterns TEXT DEFAULT '[]',
  recommendations TEXT DEFAULT '[]',
  verdict TEXT,
  reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Technical debt
CREATE TABLE IF NOT EXISTS technical_debt (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  business_impact TEXT,
  engineering_impact TEXT,
  estimated_effort TEXT,
  suggested_solution TEXT,
  related_knowledge_packages TEXT DEFAULT '[]',
  related_adrs TEXT DEFAULT '[]',
  status TEXT DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Architecture advisor
CREATE TABLE IF NOT EXISTS architecture_advisor (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  comparison_repo TEXT,
  missing_layers TEXT DEFAULT '[]',
  architectural_drift TEXT DEFAULT '[]',
  duplicated_concepts TEXT DEFAULT '[]',
  improvement_recommendations TEXT DEFAULT '[]',
  migration_effort TEXT,
  tradeoffs TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Implementation plans
CREATE TABLE IF NOT EXISTS implementation_plans (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  title TEXT NOT NULL,
  roadmap TEXT DEFAULT '[]',
  epics TEXT DEFAULT '[]',
  milestones TEXT DEFAULT '[]',
  phases TEXT DEFAULT '[]',
  dependencies TEXT DEFAULT '[]',
  suggested_order TEXT DEFAULT '[]',
  risk_analysis TEXT,
  learning_prerequisites TEXT DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Build blueprints
CREATE TABLE IF NOT EXISTS build_blueprints (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  blueprint_type TEXT NOT NULL,
  title TEXT NOT NULL,
  project_blueprint TEXT,
  folder_structure TEXT DEFAULT '{}',
  package_layout TEXT DEFAULT '{}',
  domain_model TEXT DEFAULT '{}',
  adr_checklist TEXT DEFAULT '[]',
  testing_plan TEXT,
  deployment_plan TEXT,
  documentation_plan TEXT,
  referenced_repos TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Repository fitness
CREATE TABLE IF NOT EXISTS repository_fitness (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  engineering_quality REAL DEFAULT 0,
  educational_quality REAL DEFAULT 0,
  architecture_quality REAL DEFAULT 0,
  maintainability REAL DEFAULT 0,
  extensibility REAL DEFAULT 0,
  reusability REAL DEFAULT 0,
  innovation REAL DEFAULT 0,
  community REAL DEFAULT 0,
  bhavya_score REAL DEFAULT 0,
  explanations TEXT DEFAULT '{}',
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Student mode
CREATE TABLE IF NOT EXISTS student_mode (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL,
  study_guide TEXT,
  learning_roadmap TEXT DEFAULT '[]',
  prerequisites TEXT DEFAULT '[]',
  exercises TEXT DEFAULT '[]',
  mini_projects TEXT DEFAULT '[]',
  capstone_projects TEXT DEFAULT '[]',
  interview_questions TEXT DEFAULT '[]',
  discussion_questions TEXT DEFAULT '[]',
  reflection_notes TEXT DEFAULT '[]',
  engineering_challenges TEXT DEFAULT '[]',
  difficulty_score REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Elite engineering library
CREATE TABLE IF NOT EXISTS elite_engineering_library (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  repository_id TEXT,
  tags TEXT DEFAULT '[]',
  quality_score REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Website intelligence
CREATE TABLE IF NOT EXISTS website_intelligence (
  id TEXT PRIMARY KEY,
  source_url TEXT NOT NULL,
  repository_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  framework TEXT,
  runtime TEXT,
  design_system TEXT,
  component_system TEXT,
  layout_system TEXT,
  navigation_architecture TEXT,
  typography TEXT,
  color_system TEXT,
  spacing_system TEXT,
  motion_system TEXT,
  interaction_patterns TEXT DEFAULT '[]',
  responsive_patterns TEXT DEFAULT '[]',
  accessibility_characteristics TEXT DEFAULT '{}',
  performance_observations TEXT DEFAULT '{}',
  seo_observations TEXT DEFAULT '{}',
  screenshots TEXT DEFAULT '[]',
  extracted_pattern_ids TEXT DEFAULT '[]',
  bhavya_relevance_score REAL DEFAULT 0,
  quality_score REAL DEFAULT 0,
  provenance TEXT DEFAULT '{}',
  analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);

-- Design intelligence
CREATE TABLE IF NOT EXISTS design_intelligence (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  typography TEXT DEFAULT '{}',
  color TEXT DEFAULT '{}',
  spacing TEXT DEFAULT '{}',
  imagery TEXT DEFAULT '{}',
  surfaces TEXT DEFAULT '{}',
  grid TEXT DEFAULT '{}',
  container TEXT DEFAULT '{}',
  section_structure TEXT DEFAULT '{}',
  responsive_behavior TEXT DEFAULT '{}',
  primary_nav TEXT DEFAULT '{}',
  secondary_nav TEXT DEFAULT '{}',
  contextual_nav TEXT DEFAULT '{}',
  command_nav TEXT DEFAULT '{}',
  hover TEXT DEFAULT '{}',
  focus TEXT DEFAULT '{}',
  scroll TEXT DEFAULT '{}',
  transitions TEXT DEFAULT '{}',
  motion_library TEXT,
  motion_techniques TEXT DEFAULT '[]',
  motion_intensity TEXT,
  semantics TEXT DEFAULT '{}',
  keyboard TEXT DEFAULT '{}',
  contrast TEXT DEFAULT '{}',
  reduced_motion TEXT DEFAULT '{}',
  image_strategy TEXT,
  loading TEXT,
  javascript TEXT,
  rendering TEXT,
  extracted_pattern_ids TEXT DEFAULT '[]',
  bhavya_relevance TEXT,
  recommended_use TEXT,
  risks TEXT DEFAULT '[]',
  adaptation_notes TEXT,
  analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Design genome
CREATE TABLE IF NOT EXISTS design_genome (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  pattern_name TEXT NOT NULL,
  frequency INTEGER DEFAULT 0,
  avg_quality_score REAL DEFAULT 0,
  avg_bhavya_relevance REAL DEFAULT 0,
  source_ids TEXT DEFAULT '[]',
  mission_relevance TEXT DEFAULT '{}',
  accessibility_rating TEXT DEFAULT 'unknown',
  performance_rating TEXT DEFAULT 'unknown',
  mobile_rating TEXT DEFAULT 'unknown',
  institutional_fit TEXT DEFAULT 'unknown',
  recommended_for TEXT DEFAULT '[]',
  evidence TEXT,
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Design scores
CREATE TABLE IF NOT EXISTS design_scores (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  institutional_relevance REAL DEFAULT 0,
  ux_quality REAL DEFAULT 0,
  accessibility REAL DEFAULT 0,
  performance REAL DEFAULT 0,
  visual_quality REAL DEFAULT 0,
  reusability REAL DEFAULT 0,
  technical_quality REAL DEFAULT 0,
  innovation REAL DEFAULT 0,
  maintainability REAL DEFAULT 0,
  bhavya_brand_compatibility REAL DEFAULT 0,
  overall_score REAL DEFAULT 0,
  explanation TEXT DEFAULT '{}',
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Constitutional validations
CREATE TABLE IF NOT EXISTS constitutional_validations (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  brand_alignment REAL DEFAULT 0,
  mission_alignment REAL DEFAULT 0,
  tone_compliance REAL DEFAULT 0,
  anti_pattern_score REAL DEFAULT 0,
  accessibility_compliance REAL DEFAULT 0,
  evidence_quality REAL DEFAULT 0,
  overall_constitutional_score REAL DEFAULT 0,
  violations TEXT DEFAULT '[]',
  recommendations TEXT DEFAULT '[]',
  anti_patterns_detected TEXT DEFAULT '[]',
  mission_relevance TEXT DEFAULT '{}',
  validated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_events(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_repo ON knowledge_packages(repository_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_packages(category);
CREATE INDEX IF NOT EXISTS idx_radar_category ON technology_radar(category);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON recommendations(status);
CREATE INDEX IF NOT EXISTS idx_patterns_repo ON engineering_patterns(repository_id);
CREATE INDEX IF NOT EXISTS idx_adrs_repo ON adrs(repository_id);
CREATE INDEX IF NOT EXISTS idx_pattern_library_category ON pattern_library(category);
CREATE INDEX IF NOT EXISTS idx_timeline_repo ON repository_timelines(repository_id);
CREATE INDEX IF NOT EXISTS idx_health_repo ON engineering_health(repository_id);
CREATE INDEX IF NOT EXISTS idx_learning_repo ON learning_paths(repository_id);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON knowledge_graph_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON knowledge_graph_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON knowledge_graph_edges(target_id);
CREATE INDEX IF NOT EXISTS idx_educational_repo ON educational_exports(repository_id);
CREATE INDEX IF NOT EXISTS idx_memory_repo ON institutional_memory(repository_id);
CREATE INDEX IF NOT EXISTS idx_reviews_repo ON engineering_reviews(repository_id);
CREATE INDEX IF NOT EXISTS idx_debt_repo ON technical_debt(repository_id);
CREATE INDEX IF NOT EXISTS idx_debt_category ON technical_debt(category);
CREATE INDEX IF NOT EXISTS idx_advisor_repo ON architecture_advisor(repository_id);
CREATE INDEX IF NOT EXISTS idx_plans_repo ON implementation_plans(repository_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_repo ON build_blueprints(repository_id);
CREATE INDEX IF NOT EXISTS idx_fitness_repo ON repository_fitness(repository_id);
CREATE INDEX IF NOT EXISTS idx_student_repo ON student_mode(repository_id);
CREATE INDEX IF NOT EXISTS idx_elite_category ON elite_engineering_library(category);
CREATE INDEX IF NOT EXISTS idx_website_intelligence_url ON website_intelligence(source_url);
CREATE INDEX IF NOT EXISTS idx_website_intelligence_repo ON website_intelligence(repository_id);
CREATE INDEX IF NOT EXISTS idx_website_intelligence_relevance ON website_intelligence(bhavya_relevance_score);
CREATE INDEX IF NOT EXISTS idx_design_intelligence_source ON design_intelligence(source_id, source_type);
CREATE INDEX IF NOT EXISTS idx_design_genome_category ON design_genome(category);
CREATE INDEX IF NOT EXISTS idx_design_genome_relevance ON design_genome(avg_bhavya_relevance);
CREATE INDEX IF NOT EXISTS idx_design_scores_source ON design_scores(source_id, source_type);
CREATE INDEX IF NOT EXISTS idx_design_scores_overall ON design_scores(overall_score);
CREATE INDEX IF NOT EXISTS idx_constitutional_source ON constitutional_validations(source_id, source_type);
CREATE INDEX IF NOT EXISTS idx_constitutional_score ON constitutional_validations(overall_constitutional_score);
  `,
  down: `
DROP TABLE IF EXISTS constitutional_validations;
DROP TABLE IF EXISTS design_scores;
DROP TABLE IF EXISTS design_genome;
DROP TABLE IF EXISTS design_intelligence;
DROP TABLE IF EXISTS website_intelligence;
DROP TABLE IF EXISTS elite_engineering_library;
DROP TABLE IF EXISTS student_mode;
DROP TABLE IF EXISTS repository_fitness;
DROP TABLE IF EXISTS build_blueprints;
DROP TABLE IF EXISTS implementation_plans;
DROP TABLE IF EXISTS architecture_advisor;
DROP TABLE IF EXISTS technical_debt;
DROP TABLE IF EXISTS engineering_reviews;
DROP TABLE IF EXISTS institutional_memory;
DROP TABLE IF EXISTS educational_exports;
DROP TABLE IF EXISTS knowledge_graph_edges;
DROP TABLE IF EXISTS knowledge_graph_nodes;
DROP TABLE IF EXISTS learning_paths;
DROP TABLE IF EXISTS engineering_health;
DROP TABLE IF EXISTS repository_timelines;
DROP TABLE IF EXISTS pattern_library;
DROP TABLE IF EXISTS repository_comparisons;
DROP TABLE IF EXISTS adrs;
DROP TABLE IF EXISTS engineering_patterns;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS technology_radar;
DROP TABLE IF EXISTS activity_events;
DROP TABLE IF EXISTS knowledge_packages;
DROP TABLE IF EXISTS repositories;
  `,
};
