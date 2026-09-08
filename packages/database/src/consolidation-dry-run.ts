/**
 * Phase 2E — Consolidation Dry Run
 *
 * Creates 4 individual databases + 1 consolidated database.
 * Verifies all 52 tables coexist without conflict.
 *
 * Usage: npx tsx packages/database/src/consolidation-dry-run.ts
 *
 * This script:
 * - Creates test databases in packages/database/test/consolidation/
 * - Does NOT touch any production database files
 * - Produces a verification report
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Configuration ───────────────────────────────────────────────────────────

const TEST_DIR = join(__dirname, "..", "test", "consolidation");
const DOMAINS = ["ai-institute", "github-os", "social-os", "ioc"] as const;
type Domain = (typeof DOMAINS)[number];

// ─── Migration Definitions (inlined from migration files) ────────────────────
// We inline the SQL to avoid require() issues with .ts files at runtime.

const MIGRATIONS: Record<
  Domain,
  { id: string; name: string; up: string; down: string }
> = {
  "ai-institute": {
    id: "001_baseline_schema",
    name: "Baseline schema — users, sessions, student_profiles, audit_events",
    up: `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  provider TEXT NOT NULL DEFAULT 'email',
  interests TEXT NOT NULL DEFAULT '[]',
  onboarding_complete INTEGER NOT NULL DEFAULT 0,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS student_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  interests TEXT NOT NULL DEFAULT '[]',
  current_course TEXT NOT NULL DEFAULT 'ai-foundations',
  current_lesson_index INTEGER NOT NULL DEFAULT 0,
  lessons_completed TEXT NOT NULL DEFAULT '[]',
  assessment_score INTEGER NOT NULL DEFAULT 0,
  assessment_completed INTEGER NOT NULL DEFAULT 0,
  lab_tasks_completed TEXT NOT NULL DEFAULT '[]',
  lab_score INTEGER NOT NULL DEFAULT 0,
  knowledge_check_answers TEXT NOT NULL DEFAULT '{}',
  knowledge_check_score INTEGER NOT NULL DEFAULT 0,
  project_submitted INTEGER NOT NULL DEFAULT 0,
  project_score INTEGER NOT NULL DEFAULT 0,
  badge_earned INTEGER NOT NULL DEFAULT 0,
  reflection_entries TEXT NOT NULL DEFAULT '[]',
  streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT NOT NULL DEFAULT '',
  onboarding_complete INTEGER NOT NULL DEFAULT 0,
  enrolled_courses TEXT NOT NULL DEFAULT '[]',
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user ON student_profiles(user_id);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  actor_email TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  resource TEXT NOT NULL DEFAULT '',
  resource_id TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT 'success',
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);
    `,
    down: `
DROP TABLE IF EXISTS audit_events;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
    `,
  },
  "github-os": {
    id: "001_baseline_schema",
    name: "Baseline schema — 26 tables for repository intelligence",
    up: `
CREATE TABLE IF NOT EXISTS repositories (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL, description TEXT,
  language TEXT, stars INTEGER DEFAULT 0, forks INTEGER DEFAULT 0, license TEXT,
  topics TEXT DEFAULT '[]', health_score REAL DEFAULT 0, technology_score REAL DEFAULT 0,
  bhavya_score REAL DEFAULT 0, engineering_maturity TEXT DEFAULT 'emerging',
  architecture_summary TEXT, folder_structure TEXT, readme_content TEXT, readme_summary TEXT,
  tech_stack TEXT DEFAULT '{}', patterns TEXT DEFAULT '[]', dependencies TEXT DEFAULT '[]',
  maintainers TEXT DEFAULT '[]', latest_release TEXT, latest_commit TEXT,
  why_bhavya_cares TEXT, learning_difficulty TEXT DEFAULT 'intermediate',
  learning_prerequisites TEXT DEFAULT '[]', learning_reading_order TEXT,
  mcp_recommendations TEXT DEFAULT '[]', cli_recommendations TEXT DEFAULT '[]',
  recommendation_type TEXT DEFAULT 'monitor',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS knowledge_packages (
  id TEXT PRIMARY KEY, repository_id TEXT, category TEXT NOT NULL, title TEXT NOT NULL,
  content TEXT NOT NULL, metadata TEXT DEFAULT '{}', tags TEXT DEFAULT '[]',
  quality_score REAL DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY, type TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
  title TEXT NOT NULL, description TEXT, metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS technology_radar (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
  ring TEXT NOT NULL DEFAULT 'assess', description TEXT, score REAL DEFAULT 0,
  metadata TEXT DEFAULT '{}', created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY, type TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', status TEXT DEFAULT 'pending', metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS engineering_patterns (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, pattern_name TEXT NOT NULL,
  confidence REAL DEFAULT 0, evidence TEXT, description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS adrs (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, number INTEGER NOT NULL,
  title TEXT NOT NULL, status TEXT DEFAULT 'proposed', context TEXT, decision TEXT,
  consequences TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS repository_comparisons (
  id TEXT PRIMARY KEY, repo_a_id TEXT NOT NULL, repo_b_id TEXT NOT NULL,
  comparison TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repo_a_id) REFERENCES repositories(id),
  FOREIGN KEY (repo_b_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS pattern_library (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL, category TEXT NOT NULL,
  explanation TEXT NOT NULL, use_cases TEXT DEFAULT '[]', related_patterns TEXT DEFAULT '[]',
  educational_value TEXT, bhavya_recommendation TEXT, learning_mode TEXT,
  difficulty TEXT DEFAULT 'intermediate', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS repository_timelines (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, event_type TEXT NOT NULL,
  title TEXT NOT NULL, description TEXT, metadata TEXT DEFAULT '{}',
  event_date DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS engineering_health (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, overall_score REAL DEFAULT 0,
  documentation_score REAL DEFAULT 0, test_coverage_score REAL DEFAULT 0,
  dependency_freshness_score REAL DEFAULT 0, release_cadence_score REAL DEFAULT 0,
  architecture_consistency_score REAL DEFAULT 0, knowledge_coverage_score REAL DEFAULT 0,
  adr_coverage_score REAL DEFAULT 0, educational_completeness_score REAL DEFAULT 0,
  calculation_methodology TEXT, recommendations TEXT DEFAULT '[]',
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, prerequisites TEXT DEFAULT '[]',
  learning_objectives TEXT DEFAULT '[]', reading_order TEXT DEFAULT '[]',
  important_folders TEXT DEFAULT '[]', key_files TEXT DEFAULT '[]',
  concepts_demonstrated TEXT DEFAULT '[]', suggested_exercises TEXT DEFAULT '[]',
  mini_projects TEXT DEFAULT '[]', capstone_ideas TEXT DEFAULT '[]',
  estimated_hours REAL DEFAULT 0, difficulty TEXT DEFAULT 'intermediate',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS knowledge_graph_nodes (
  id TEXT PRIMARY KEY, node_type TEXT NOT NULL, label TEXT NOT NULL,
  metadata TEXT DEFAULT '{}', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS knowledge_graph_edges (
  id TEXT PRIMARY KEY, source_id TEXT NOT NULL, target_id TEXT NOT NULL,
  relationship TEXT NOT NULL, weight REAL DEFAULT 1, metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS educational_exports (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, export_type TEXT NOT NULL,
  title TEXT NOT NULL, content TEXT NOT NULL, metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS institutional_memory (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, question TEXT NOT NULL,
  answer TEXT NOT NULL, evidence TEXT DEFAULT '[]', confidence REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS engineering_reviews (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, review_type TEXT NOT NULL,
  overall_score REAL DEFAULT 0, architecture_score REAL DEFAULT 0,
  code_organization_score REAL DEFAULT 0, documentation_score REAL DEFAULT 0,
  testing_score REAL DEFAULT 0, automation_score REAL DEFAULT 0,
  maintainability_score REAL DEFAULT 0, extensibility REAL DEFAULT 0,
  developer_experience_score REAL DEFAULT 0, educational_value_score REAL DEFAULT 0,
  future_risk_score REAL DEFAULT 0, strengths TEXT DEFAULT '[]',
  weaknesses TEXT DEFAULT '[]', missing_patterns TEXT DEFAULT '[]',
  recommendations TEXT DEFAULT '[]', verdict TEXT,
  reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS technical_debt (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, category TEXT NOT NULL,
  title TEXT NOT NULL, description TEXT NOT NULL, severity TEXT DEFAULT 'medium',
  business_impact TEXT, engineering_impact TEXT, estimated_effort TEXT,
  suggested_solution TEXT, related_knowledge_packages TEXT DEFAULT '[]',
  related_adrs TEXT DEFAULT '[]', status TEXT DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS architecture_advisor (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, comparison_repo TEXT,
  missing_layers TEXT DEFAULT '[]', architectural_drift TEXT DEFAULT '[]',
  duplicated_concepts TEXT DEFAULT '[]', improvement_recommendations TEXT DEFAULT '[]',
  migration_effort TEXT, tradeoffs TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS implementation_plans (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, plan_type TEXT NOT NULL,
  title TEXT NOT NULL, roadmap TEXT DEFAULT '[]', epics TEXT DEFAULT '[]',
  milestones TEXT DEFAULT '[]', phases TEXT DEFAULT '[]', dependencies TEXT DEFAULT '[]',
  suggested_order TEXT DEFAULT '[]', risk_analysis TEXT,
  learning_prerequisites TEXT DEFAULT '[]', status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS build_blueprints (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, blueprint_type TEXT NOT NULL,
  title TEXT NOT NULL, project_blueprint TEXT, folder_structure TEXT DEFAULT '{}',
  package_layout TEXT DEFAULT '{}', domain_model TEXT DEFAULT '{}',
  adr_checklist TEXT DEFAULT '[]', testing_plan TEXT, deployment_plan TEXT,
  documentation_plan TEXT, referenced_repos TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS repository_fitness (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, engineering_quality REAL DEFAULT 0,
  educational_quality REAL DEFAULT 0, architecture_quality REAL DEFAULT 0,
  maintainability REAL DEFAULT 0, extensibility REAL DEFAULT 0,
  reusability REAL DEFAULT 0, innovation REAL DEFAULT 0, community REAL DEFAULT 0,
  bhavya_score REAL DEFAULT 0, explanations TEXT DEFAULT '{}',
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS student_mode (
  id TEXT PRIMARY KEY, repository_id TEXT NOT NULL, study_guide TEXT,
  learning_roadmap TEXT DEFAULT '[]', prerequisites TEXT DEFAULT '[]',
  exercises TEXT DEFAULT '[]', mini_projects TEXT DEFAULT '[]',
  capstone_projects TEXT DEFAULT '[]', interview_questions TEXT DEFAULT '[]',
  discussion_questions TEXT DEFAULT '[]', reflection_notes TEXT DEFAULT '[]',
  engineering_challenges TEXT DEFAULT '[]', difficulty_score REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS elite_engineering_library (
  id TEXT PRIMARY KEY, category TEXT NOT NULL, title TEXT NOT NULL,
  description TEXT NOT NULL, repository_id TEXT, tags TEXT DEFAULT '[]',
  quality_score REAL DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS website_intelligence (
  id TEXT PRIMARY KEY, source_url TEXT NOT NULL, repository_id TEXT, name TEXT NOT NULL,
  description TEXT, framework TEXT, runtime TEXT, design_system TEXT,
  component_system TEXT, layout_system TEXT, navigation_architecture TEXT,
  typography TEXT, color_system TEXT, spacing_system TEXT, motion_system TEXT,
  interaction_patterns TEXT DEFAULT '[]', responsive_patterns TEXT DEFAULT '[]',
  accessibility_characteristics TEXT DEFAULT '{}', performance_observations TEXT DEFAULT '{}',
  seo_observations TEXT DEFAULT '{}', screenshots TEXT DEFAULT '[]',
  extracted_pattern_ids TEXT DEFAULT '[]', bhavya_relevance_score REAL DEFAULT 0,
  quality_score REAL DEFAULT 0, provenance TEXT DEFAULT '{}',
  analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE TABLE IF NOT EXISTS design_intelligence (
  id TEXT PRIMARY KEY, source_id TEXT NOT NULL, source_type TEXT NOT NULL,
  typography TEXT DEFAULT '{}', color TEXT DEFAULT '{}', spacing TEXT DEFAULT '{}',
  imagery TEXT DEFAULT '{}', surfaces TEXT DEFAULT '{}', grid TEXT DEFAULT '{}',
  container TEXT DEFAULT '{}', section_structure TEXT DEFAULT '{}',
  responsive_behavior TEXT DEFAULT '{}', primary_nav TEXT DEFAULT '{}',
  secondary_nav TEXT DEFAULT '{}', contextual_nav TEXT DEFAULT '{}',
  command_nav TEXT DEFAULT '{}', hover TEXT DEFAULT '{}', focus TEXT DEFAULT '{}',
  scroll TEXT DEFAULT '{}', transitions TEXT DEFAULT '{}', motion_library TEXT,
  motion_techniques TEXT DEFAULT '[]', motion_intensity TEXT, semantics TEXT DEFAULT '{}',
  keyboard TEXT DEFAULT '{}', contrast TEXT DEFAULT '{}',
  reduced_motion TEXT DEFAULT '{}', image_strategy TEXT, loading TEXT,
  javascript TEXT, rendering TEXT, extracted_pattern_ids TEXT DEFAULT '[]',
  bhavya_relevance TEXT, recommended_use TEXT, risks TEXT DEFAULT '[]',
  adaptation_notes TEXT, analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS design_genome (
  id TEXT PRIMARY KEY, category TEXT NOT NULL, pattern_name TEXT NOT NULL,
  frequency INTEGER DEFAULT 0, avg_quality_score REAL DEFAULT 0,
  avg_bhavya_relevance REAL DEFAULT 0, source_ids TEXT DEFAULT '[]',
  mission_relevance TEXT DEFAULT '{}', accessibility_rating TEXT DEFAULT 'unknown',
  performance_rating TEXT DEFAULT 'unknown', mobile_rating TEXT DEFAULT 'unknown',
  institutional_fit TEXT DEFAULT 'unknown', recommended_for TEXT DEFAULT '[]',
  evidence TEXT, calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS design_scores (
  id TEXT PRIMARY KEY, source_id TEXT NOT NULL, source_type TEXT NOT NULL,
  institutional_relevance REAL DEFAULT 0, ux_quality REAL DEFAULT 0,
  accessibility REAL DEFAULT 0, performance REAL DEFAULT 0,
  visual_quality REAL DEFAULT 0, reusability REAL DEFAULT 0,
  technical_quality REAL DEFAULT 0, innovation REAL DEFAULT 0,
  maintainability REAL DEFAULT 0, bhavya_brand_compatibility REAL DEFAULT 0,
  overall_score REAL DEFAULT 0, explanation TEXT DEFAULT '{}',
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS constitutional_validations (
  id TEXT PRIMARY KEY, source_id TEXT NOT NULL, source_type TEXT NOT NULL,
  brand_alignment REAL DEFAULT 0, mission_alignment REAL DEFAULT 0,
  tone_compliance REAL DEFAULT 0, anti_pattern_score REAL DEFAULT 0,
  accessibility_compliance REAL DEFAULT 0, evidence_quality REAL DEFAULT 0,
  overall_constitutional_score REAL DEFAULT 0, violations TEXT DEFAULT '[]',
  recommendations TEXT DEFAULT '[]', anti_patterns_detected TEXT DEFAULT '[]',
  mission_relevance TEXT DEFAULT '{}', validated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
    down: "",
  },
  "social-os": {
    id: "001_baseline_schema",
    name: "Baseline schema — 11 tables for communication operations",
    up: `
CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL,
  platform_content TEXT DEFAULT '{}', status TEXT NOT NULL DEFAULT 'draft',
  priority TEXT NOT NULL DEFAULT 'normal', source_type TEXT NOT NULL DEFAULT 'blog',
  source_knowledge_package_id TEXT, source_version TEXT, source_review_status TEXT,
  source_constitution_citation TEXT, campaign_id TEXT, scheduled_at TEXT,
  published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'system', version INTEGER NOT NULL DEFAULT 1,
  tags TEXT DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS approval_records (
  id TEXT PRIMARY KEY, publication_id TEXT NOT NULL,
  requested_by TEXT NOT NULL DEFAULT 'system', requested_at TEXT NOT NULL,
  reviewed_by TEXT, reviewed_at TEXT, status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT, FOREIGN KEY (publication_id) REFERENCES publications(id)
);
CREATE TABLE IF NOT EXISTS platform_content (
  id TEXT PRIMARY KEY, publication_id TEXT NOT NULL, platform TEXT NOT NULL,
  text TEXT NOT NULL, media TEXT DEFAULT '[]', hashtags TEXT DEFAULT '[]',
  mentions TEXT DEFAULT '[]', character_count INTEGER NOT NULL DEFAULT 0,
  is_within_limits INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id TEXT PRIMARY KEY, publication_id TEXT NOT NULL, collected_at TEXT NOT NULL,
  metrics TEXT DEFAULT '{}', FOREIGN KEY (publication_id) REFERENCES publications(id)
);
CREATE TABLE IF NOT EXISTS platforms (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, integration_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 0, constraints TEXT DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY, type TEXT NOT NULL, payload TEXT NOT NULL,
  created_at TEXT NOT NULL, processed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'ongoing', status TEXT NOT NULL DEFAULT 'planning',
  knowledge_package_id TEXT, channels TEXT DEFAULT '[]', start_date TEXT,
  end_date TEXT, objectives TEXT DEFAULT '[]', audience TEXT DEFAULT '[]',
  assets TEXT DEFAULT '[]', publications TEXT DEFAULT '[]', approvals TEXT DEFAULT '[]',
  metrics TEXT DEFAULT '{}', retrospective TEXT, created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS editorial_calendar (
  id TEXT PRIMARY KEY, campaign_id TEXT, type TEXT NOT NULL, title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '', platforms TEXT DEFAULT '[]',
  scheduled_date TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft',
  publication_id TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
CREATE TABLE IF NOT EXISTS community_feedback (
  id TEXT PRIMARY KEY, source TEXT NOT NULL,
  classification TEXT NOT NULL DEFAULT 'general', content TEXT NOT NULL,
  author TEXT, url TEXT, sentiment REAL DEFAULT 0.5,
  knowledge_package_id TEXT, campaign_id TEXT, processed_at TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS brand_reviews (
  id TEXT PRIMARY KEY, publication_id TEXT NOT NULL, reviewed_at TEXT NOT NULL,
  passed INTEGER NOT NULL DEFAULT 0, brand_name_correct INTEGER NOT NULL DEFAULT 0,
  tagline_present INTEGER NOT NULL DEFAULT 0,
  color_palette_consistent INTEGER NOT NULL DEFAULT 0,
  tone_consistent INTEGER NOT NULL DEFAULT 0, issues TEXT DEFAULT '[]',
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);
CREATE TABLE IF NOT EXISTS institution_metrics (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0, unit TEXT NOT NULL DEFAULT '',
  trend TEXT NOT NULL DEFAULT 'stable', change_percent REAL NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT '', collected_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS communication_strategies (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  channels TEXT DEFAULT '[]', frequency TEXT NOT NULL DEFAULT '',
  audience TEXT DEFAULT '[]', objectives TEXT DEFAULT '[]', kpis TEXT DEFAULT '[]',
  active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS publishing_windows (
  id TEXT PRIMARY KEY, day_of_week INTEGER NOT NULL, start_time TEXT NOT NULL,
  end_time TEXT NOT NULL, platforms TEXT DEFAULT '[]',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata'
);
    `,
    down: "",
  },
  ioc: {
    id: "001_baseline_schema",
    name: "Baseline schema — 11 tables for OKR/risk/compliance",
    up: `
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, mission TEXT NOT NULL,
  vision TEXT NOT NULL, departments TEXT DEFAULT '[]', created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY, statement TEXT NOT NULL, pillars TEXT DEFAULT '[]',
  active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS objectives (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  department TEXT, quarter TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'not_started',
  progress REAL NOT NULL DEFAULT 0, key_results TEXT DEFAULT '[]',
  initiatives TEXT DEFAULT '[]', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'upcoming',
  related_objective_id TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS risks (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'medium', status TEXT NOT NULL DEFAULT 'open',
  category TEXT NOT NULL DEFAULT '', mitigation TEXT, owner TEXT,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  context TEXT NOT NULL DEFAULT '', options TEXT DEFAULT '[]',
  selected_option TEXT, rationale TEXT, decided_by TEXT, decided_at TEXT,
  status TEXT NOT NULL DEFAULT 'proposed', created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS action_items (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  assignee TEXT, due_date TEXT, priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending', related_objective_id TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id TEXT PRIMARY KEY, week_start TEXT NOT NULL, week_end TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT 'weekly', summary TEXT DEFAULT '{}',
  metrics TEXT DEFAULT '[]', risks TEXT DEFAULT '[]', action_items TEXT DEFAULT '[]',
  next_week_plan TEXT DEFAULT '[]', status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, message TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'info', status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL, acknowledged_by TEXT, acknowledged_at TEXT,
  resolved_at TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS institution_events (
  id TEXT PRIMARY KEY, type TEXT NOT NULL, source TEXT NOT NULL,
  payload TEXT DEFAULT '{}', created_at TEXT NOT NULL,
  aggregated INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS institution_kpis (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0, unit TEXT NOT NULL DEFAULT '', target REAL,
  trend TEXT NOT NULL DEFAULT 'stable', change_percent REAL NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT '', source TEXT NOT NULL, collected_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS system_health (
  system TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT 'unknown',
  last_checked TEXT NOT NULL, api_available INTEGER NOT NULL DEFAULT 0,
  dashboard_available INTEGER NOT NULL DEFAULT 0, metrics_available INTEGER NOT NULL DEFAULT 0,
  events_produced INTEGER NOT NULL DEFAULT 0, events_consumed INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);
    `,
    down: "",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeChecksum(sql: string): string {
  return createHash("sha256").update(sql).digest("hex").slice(0, 16);
}

function ensureTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function getTables(db: Database.Database, excludeInternal = true): string[] {
  const rows = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    .all() as { name: string }[];
  const names = rows.map((r) => r.name);
  return excludeInternal ? names.filter((n) => !n.startsWith("_")) : names;
}

function getIndexes(db: Database.Database): string[] {
  const rows = db
    .prepare("SELECT name FROM sqlite_master WHERE type='index' ORDER BY name")
    .all() as { name: string }[];
  return rows.map((r) => r.name);
}

// ─── Main ────────────────────────────────────────────────────────────────────

interface DryRunResult {
  success: boolean;
  individualDbs: { domain: string; tables: string[]; indexes: string[] }[];
  consolidatedDb: { tables: string[]; indexes: string[]; migrations: string[] };
  errors: string[];
  warnings: string[];
}

export async function runDryRun(): Promise<DryRunResult> {
  const result: DryRunResult = {
    success: true,
    individualDbs: [],
    consolidatedDb: { tables: [], indexes: [], migrations: [] },
    errors: [],
    warnings: [],
  };

  // Step 1: Clean and create test directory
  console.log(
    "\n═══════════════════════════════════════════════════════════════",
  );
  console.log("  Phase 2E — Database Consolidation Dry Run");
  console.log(
    "═══════════════════════════════════════════════════════════════\n",
  );

  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
  mkdirSync(TEST_DIR, { recursive: true });
  console.log(`[1/5] Test directory created: ${TEST_DIR}\n`);

  // Step 2: Create individual databases
  console.log("[2/5] Creating individual databases...\n");
  for (const domain of DOMAINS) {
    const dbPath = join(TEST_DIR, `${domain}.db`);
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    ensureTable(db);

    const migration = MIGRATIONS[domain];
    db.exec(migration.up);
    const checksum = computeChecksum(migration.up + migration.down);
    db.prepare(
      "INSERT INTO _migrations (id, name, checksum) VALUES (?, ?, ?)",
    ).run(migration.id, migration.name, checksum);

    const tables = getTables(db);
    const indexes = getIndexes(db);
    result.individualDbs.push({ domain, tables, indexes });

    console.log(
      `  ✓ ${domain}: ${tables.length} tables, ${indexes.length} indexes`,
    );
    for (const t of tables) {
      console.log(`    - ${t}`);
    }
    console.log();

    db.close();
  }

  // Step 3: Create consolidated database
  console.log("[3/5] Creating consolidated database...\n");
  const consolidatedPath = join(TEST_DIR, "bhavya.db");
  const consolidated = new Database(consolidatedPath);
  consolidated.pragma("journal_mode = WAL");
  consolidated.pragma("foreign_keys = ON");

  ensureTable(consolidated);

  for (const domain of DOMAINS) {
    const migration = MIGRATIONS[domain];
    try {
      consolidated.exec(migration.up);
      const checksum = computeChecksum(migration.up + migration.down);
      consolidated
        .prepare(
          "INSERT INTO _migrations (id, name, checksum) VALUES (?, ?, ?)",
        )
        .run(`${domain}/${migration.id}`, migration.name, checksum);
      console.log(`  ✓ Applied ${domain} schema`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      result.errors.push(`Failed to apply ${domain}: ${msg}`);
      console.log(`  ✗ FAILED ${domain}: ${msg}`);
    }
  }

  result.consolidatedDb.tables = getTables(consolidated);
  result.consolidatedDb.indexes = getIndexes(consolidated);
  const migrationRows = consolidated
    .prepare("SELECT id FROM _migrations ORDER BY applied_at")
    .all() as { id: string }[];
  result.consolidatedDb.migrations = migrationRows.map((r) => r.id);

  consolidated.close();
  console.log();

  // Step 4: Verify
  console.log("[4/5] Verification...\n");

  const totalIndividualTables = result.individualDbs.reduce(
    (sum, d) => sum + d.tables.length,
    0,
  );
  const consolidatedTables = result.consolidatedDb.tables.length;

  console.log(`  Individual total: ${totalIndividualTables} tables`);
  console.log(`  Consolidated:     ${consolidatedTables} tables`);

  if (consolidatedTables === totalIndividualTables) {
    console.log("  ✓ Table count MATCHES\n");
  } else {
    result.errors.push(
      `Table count mismatch: expected ${totalIndividualTables}, got ${consolidatedTables}`,
    );
    console.log("  ✗ Table count MISMATCH\n");
  }

  // Check for duplicates
  const allTableNames = result.individualDbs.flatMap((d) => d.tables);
  const uniqueTableNames = new Set(allTableNames);
  if (uniqueTableNames.size !== allTableNames.length) {
    const duplicates = allTableNames.filter(
      (t, i) => allTableNames.indexOf(t) !== i,
    );
    result.warnings.push(
      `Duplicate table names found: ${[...new Set(duplicates)].join(", ")}`,
    );
    console.log(
      `  ⚠ Duplicate table names: ${[...new Set(duplicates)].join(", ")}\n`,
    );
  } else {
    console.log("  ✓ No duplicate table names\n");
  }

  // Verify migration count
  if (result.consolidatedDb.migrations.length === 4) {
    console.log("  ✓ All 4 domain migrations recorded\n");
  } else {
    result.errors.push(
      `Expected 4 migrations, got ${result.consolidatedDb.migrations.length}`,
    );
    console.log(
      `  ✗ Expected 4 migrations, got ${result.consolidatedDb.migrations.length}\n`,
    );
  }

  // Step 5: Summary
  console.log("[5/5] Summary\n");
  console.log("  Consolidated database schema:");
  for (const table of result.consolidatedDb.tables) {
    console.log(`    ${table}`);
  }
  console.log();
  console.log(`  Total indexes: ${result.consolidatedDb.indexes.length}`);
  console.log(`  Total migrations: ${result.consolidatedDb.migrations.length}`);
  console.log();

  if (result.errors.length === 0) {
    console.log(
      "  ═══════════════════════════════════════════════════════════",
    );
    console.log("  DRY RUN PASSED — Consolidation is safe to proceed");
    console.log(
      "  ═══════════════════════════════════════════════════════════\n",
    );
  } else {
    result.success = false;
    console.log(
      "  ═══════════════════════════════════════════════════════════",
    );
    console.log("  DRY RUN FAILED — Fix errors before proceeding");
    console.log(
      "  ═══════════════════════════════════════════════════════════\n",
    );
    for (const err of result.errors) {
      console.log(`  ERROR: ${err}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log("\n  Warnings:");
    for (const warn of result.warnings) {
      console.log(`    ⚠ ${warn}`);
    }
  }

  return result;
}

// Run if executed directly
runDryRun().then((result) => {
  // Write report
  const report = [
    "# Phase 2E — Dry Run Report",
    "",
    `**Date:** ${new Date().toISOString()}`,
    `**Result:** ${result.success ? "PASSED" : "FAILED"}`,
    "",
    "## Individual Databases",
    "",
    ...result.individualDbs.map(
      (d) =>
        `- **${d.domain}:** ${d.tables.length} tables, ${d.indexes.length} indexes`,
    ),
    "",
    "## Consolidated Database",
    "",
    `- **Tables:** ${result.consolidatedDb.tables.length}`,
    `- **Indexes:** ${result.consolidatedDb.indexes.length}`,
    `- **Migrations:** ${result.consolidatedDb.migrations.length}`,
    "",
    "## Tables",
    "",
    ...result.consolidatedDb.tables.map((t) => `- ${t}`),
    "",
    "## Errors",
    "",
    ...(result.errors.length > 0
      ? result.errors.map((e) => `- ❌ ${e}`)
      : ["- None"]),
    "",
    "## Warnings",
    "",
    ...(result.warnings.length > 0
      ? result.warnings.map((w) => `- ⚠ ${w}`)
      : ["- None"]),
    "",
  ].join("\n");

  writeFileSync(
    join(__dirname, "..", "..", "..", ".ai", "PHASE_2E_DRY_RUN_REPORT.md"),
    report,
  );
  console.log("Report written to .ai/PHASE_2E_DRY_RUN_REPORT.md");

  process.exit(result.success ? 0 : 1);
});
