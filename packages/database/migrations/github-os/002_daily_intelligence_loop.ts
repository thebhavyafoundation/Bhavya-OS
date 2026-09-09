import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "002_daily_intelligence_loop",
  name: "Daily Intelligence Loop — run tracking, observations, findings, candidates",
  up: `
-- Daily intelligence runs
CREATE TABLE IF NOT EXISTS daily_runs (
  id TEXT PRIMARY KEY,
  run_date TEXT NOT NULL,
  status TEXT DEFAULT 'running',
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  candidate_count INTEGER DEFAULT 0,
  inspected_count INTEGER DEFAULT 0,
  findings_count INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  duration_ms INTEGER,
  config TEXT DEFAULT '{}',
  error_log TEXT DEFAULT '[]',
  metadata TEXT DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_daily_runs_date ON daily_runs(run_date);
CREATE INDEX IF NOT EXISTS idx_daily_runs_status ON daily_runs(status);

-- Discovery candidates (raw discovery results)
CREATE TABLE IF NOT EXISTS discovery_candidates (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  repository_id TEXT,
  full_name TEXT NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  topics TEXT DEFAULT '[]',
  license TEXT,
  created_at_repo TEXT,
  updated_at TEXT,
  pushed_at TEXT,
  archived INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  discovery_source TEXT NOT NULL,
  discovery_query TEXT,
  discovery_signal TEXT DEFAULT '{}',
  rank_score REAL DEFAULT 0,
  rank_explanation TEXT DEFAULT '{}',
  filtered INTEGER DEFAULT 0,
  filter_reason TEXT,
  inspected INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE INDEX IF NOT EXISTS idx_candidates_run ON discovery_candidates(run_id);
CREATE INDEX IF NOT EXISTS idx_candidates_full_name ON discovery_candidates(full_name);
CREATE INDEX IF NOT EXISTS idx_candidates_rank ON discovery_candidates(rank_score);
CREATE INDEX IF NOT EXISTS idx_candidates_filtered ON discovery_candidates(filtered);

-- Daily observations (per-repo per-day snapshots)
CREATE TABLE IF NOT EXISTS daily_observations (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  repository_id TEXT NOT NULL,
  observation_date TEXT NOT NULL,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  latest_release TEXT,
  latest_commit TEXT,
  description TEXT,
  topics TEXT DEFAULT '[]',
  language TEXT,
  license TEXT,
  health_score REAL,
  technology_score REAL,
  bhavya_score REAL,
  recommendation_type TEXT,
  changes_detected TEXT DEFAULT '[]',
  change_significance TEXT DEFAULT 'none',
  previous_observation_id TEXT,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE INDEX IF NOT EXISTS idx_observations_run ON daily_observations(run_id);
CREATE INDEX IF NOT EXISTS idx_observations_repo ON daily_observations(repository_id);
CREATE INDEX IF NOT EXISTS idx_observations_date ON daily_observations(observation_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_observations_repo_date ON daily_observations(repository_id, observation_date);

-- Intelligence findings (extracted knowledge objects)
CREATE TABLE IF NOT EXISTS intelligence_findings (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  repository_id TEXT,
  finding_type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence TEXT DEFAULT '[]',
  source_files TEXT DEFAULT '[]',
  confidence TEXT DEFAULT 'low',
  confidence_score REAL DEFAULT 0,
  verification_state TEXT DEFAULT 'observed',
  quality TEXT DEFAULT 'low',
  relevance_to_bhavya TEXT DEFAULT 'low',
  applicability TEXT DEFAULT '[]',
  tradeoffs TEXT DEFAULT '[]',
  tags TEXT DEFAULT '[]',
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE INDEX IF NOT EXISTS idx_findings_run ON intelligence_findings(run_id);
CREATE INDEX IF NOT EXISTS idx_findings_repo ON intelligence_findings(repository_id);
CREATE INDEX IF NOT EXISTS idx_findings_type ON intelligence_findings(finding_type);
CREATE INDEX IF NOT EXISTS idx_findings_category ON intelligence_findings(category);
CREATE INDEX IF NOT EXISTS idx_findings_quality ON intelligence_findings(quality);
CREATE INDEX IF NOT EXISTS idx_findings_confidence ON intelligence_findings(confidence);

-- Experiment candidates
CREATE TABLE IF NOT EXISTS experiment_candidates (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  repository_id TEXT,
  finding_id TEXT,
  question TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  technique TEXT NOT NULL,
  source_evidence TEXT DEFAULT '[]',
  implementation_scope TEXT,
  measurements TEXT DEFAULT '[]',
  expected_learning TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  risk TEXT DEFAULT 'low',
  relevance_to_bhavya TEXT DEFAULT 'low',
  status TEXT DEFAULT 'proposed',
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id),
  FOREIGN KEY (finding_id) REFERENCES intelligence_findings(id)
);
CREATE INDEX IF NOT EXISTS idx_experiments_run ON experiment_candidates(run_id);

-- Daily briefings (generated daily summaries)
CREATE TABLE IF NOT EXISTS daily_briefings (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  run_date TEXT NOT NULL,
  top_discoveries TEXT DEFAULT '[]',
  engineering_practices TEXT DEFAULT '[]',
  ai_techniques TEXT DEFAULT '[]',
  architecture_lessons TEXT DEFAULT '[]',
  design_inspiration TEXT DEFAULT '[]',
  learning_lessons TEXT DEFAULT '[]',
  experiments TEXT DEFAULT '[]',
  radar_changes TEXT DEFAULT '[]',
  warnings TEXT DEFAULT '[]',
  summary TEXT,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_briefings_date ON daily_briefings(run_date);

-- Discovery categories (configurable taxonomy)
CREATE TABLE IF NOT EXISTS discovery_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  search_queries TEXT DEFAULT '[]',
  languages TEXT DEFAULT '[]',
  topics TEXT DEFAULT '[]',
  min_stars INTEGER DEFAULT 10,
  active INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 0,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON discovery_categories(slug);
  `,
  down: `
DROP TABLE IF EXISTS daily_briefings;
DROP TABLE IF EXISTS experiment_candidates;
DROP TABLE IF EXISTS intelligence_findings;
DROP TABLE IF EXISTS daily_observations;
DROP TABLE IF EXISTS discovery_candidates;
DROP TABLE IF EXISTS daily_runs;
DROP TABLE IF EXISTS discovery_categories;
  `,
};
