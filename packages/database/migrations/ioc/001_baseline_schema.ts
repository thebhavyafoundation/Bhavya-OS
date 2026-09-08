import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "001_baseline_schema",
  name: "Baseline schema — 16 tables for OKR/risk/compliance/production",
  up: `
-- Institutions
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  departments TEXT DEFAULT '[]',
  created_at TEXT NOT NULL
);

-- Missions
CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY,
  statement TEXT NOT NULL,
  pillars TEXT DEFAULT '[]',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- Objectives
CREATE TABLE IF NOT EXISTS objectives (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  department TEXT,
  quarter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  progress REAL NOT NULL DEFAULT 0,
  key_results TEXT DEFAULT '[]',
  initiatives TEXT DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  related_objective_id TEXT,
  created_at TEXT NOT NULL
);

-- Risks
CREATE TABLE IF NOT EXISTS risks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  category TEXT NOT NULL DEFAULT '',
  mitigation TEXT,
  owner TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Decisions
CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  context TEXT NOT NULL DEFAULT '',
  options TEXT DEFAULT '[]',
  selected_option TEXT,
  rationale TEXT,
  decided_by TEXT,
  decided_at TEXT,
  status TEXT NOT NULL DEFAULT 'proposed',
  created_at TEXT NOT NULL
);

-- Action items
CREATE TABLE IF NOT EXISTS action_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  assignee TEXT,
  due_date TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  related_objective_id TEXT,
  created_at TEXT NOT NULL
);

-- Weekly reviews
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT 'weekly',
  summary TEXT DEFAULT '{}',
  metrics TEXT DEFAULT '[]',
  risks TEXT DEFAULT '[]',
  action_items TEXT DEFAULT '[]',
  next_week_plan TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'info',
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL,
  acknowledged_by TEXT,
  acknowledged_at TEXT,
  resolved_at TEXT,
  created_at TEXT NOT NULL
);

-- Institution events
CREATE TABLE IF NOT EXISTS institution_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  payload TEXT DEFAULT '{}',
  created_at TEXT NOT NULL,
  aggregated INTEGER NOT NULL DEFAULT 0
);

-- Institution KPIs
CREATE TABLE IF NOT EXISTS institution_kpis (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '',
  target REAL,
  trend TEXT NOT NULL DEFAULT 'stable',
  change_percent REAL NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL,
  collected_at TEXT NOT NULL
);

-- System health
CREATE TABLE IF NOT EXISTS system_health (
  system TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'unknown',
  last_checked TEXT NOT NULL,
  api_available INTEGER NOT NULL DEFAULT 0,
  dashboard_available INTEGER NOT NULL DEFAULT 0,
  metrics_available INTEGER NOT NULL DEFAULT 0,
  events_produced INTEGER NOT NULL DEFAULT 0,
  events_consumed INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);

-- Content packages (IoC production workflow)
CREATE TABLE IF NOT EXISTS ioc_content_packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'L1',
  domain TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'draft',
  stage TEXT NOT NULL DEFAULT 'research',
  assignee TEXT,
  due_date TEXT,
  concepts INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Media assets
CREATE TABLE IF NOT EXISTS ioc_media_assets (
  id TEXT PRIMARY KEY,
  kp_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  platform TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (kp_id) REFERENCES ioc_content_packages(id)
);

-- Community requests
CREATE TABLE IF NOT EXISTS ioc_community_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by TEXT,
  created_at TEXT NOT NULL
);

-- Student feedback
CREATE TABLE IF NOT EXISTS ioc_student_feedback (
  id TEXT PRIMARY KEY,
  kp_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  comment TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (kp_id) REFERENCES ioc_content_packages(id)
);
  `,
  down: `
DROP TABLE IF EXISTS ioc_student_feedback;
DROP TABLE IF EXISTS ioc_community_requests;
DROP TABLE IF EXISTS ioc_media_assets;
DROP TABLE IF EXISTS ioc_content_packages;
DROP TABLE IF EXISTS system_health;
DROP TABLE IF EXISTS institution_kpis;
DROP TABLE IF EXISTS institution_events;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS weekly_reviews;
DROP TABLE IF EXISTS action_items;
DROP TABLE IF EXISTS decisions;
DROP TABLE IF EXISTS risks;
DROP TABLE IF EXISTS milestones;
DROP TABLE IF EXISTS objectives;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS institutions;
  `,
};
