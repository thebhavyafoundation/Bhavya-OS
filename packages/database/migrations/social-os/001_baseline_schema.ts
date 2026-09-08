import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "001_baseline_schema",
  name: "Baseline schema — 11 tables for communication operations",
  up: `
-- Publications
CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform_content TEXT DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  priority TEXT NOT NULL DEFAULT 'normal',
  source_type TEXT NOT NULL DEFAULT 'blog',
  source_knowledge_package_id TEXT,
  source_version TEXT,
  source_review_status TEXT,
  source_constitution_citation TEXT,
  campaign_id TEXT,
  scheduled_at TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'system',
  version INTEGER NOT NULL DEFAULT 1,
  tags TEXT DEFAULT '[]'
);

-- Approval records
CREATE TABLE IF NOT EXISTS approval_records (
  id TEXT PRIMARY KEY,
  publication_id TEXT NOT NULL,
  requested_by TEXT NOT NULL DEFAULT 'system',
  requested_at TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);

-- Platform content
CREATE TABLE IF NOT EXISTS platform_content (
  id TEXT PRIMARY KEY,
  publication_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  text TEXT NOT NULL,
  media TEXT DEFAULT '[]',
  hashtags TEXT DEFAULT '[]',
  mentions TEXT DEFAULT '[]',
  character_count INTEGER NOT NULL DEFAULT 0,
  is_within_limits INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);

-- Analytics snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id TEXT PRIMARY KEY,
  publication_id TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  metrics TEXT DEFAULT '{}',
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);

-- Platforms
CREATE TABLE IF NOT EXISTS platforms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  integration_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 0,
  constraints TEXT DEFAULT '{}'
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  processed INTEGER NOT NULL DEFAULT 0
);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'ongoing',
  status TEXT NOT NULL DEFAULT 'planning',
  knowledge_package_id TEXT,
  channels TEXT DEFAULT '[]',
  start_date TEXT,
  end_date TEXT,
  objectives TEXT DEFAULT '[]',
  audience TEXT DEFAULT '[]',
  assets TEXT DEFAULT '[]',
  publications TEXT DEFAULT '[]',
  approvals TEXT DEFAULT '[]',
  metrics TEXT DEFAULT '{}',
  retrospective TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Editorial calendar
CREATE TABLE IF NOT EXISTS editorial_calendar (
  id TEXT PRIMARY KEY,
  campaign_id TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  platforms TEXT DEFAULT '[]',
  scheduled_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  publication_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- Community feedback
CREATE TABLE IF NOT EXISTS community_feedback (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  classification TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  author TEXT,
  url TEXT,
  sentiment REAL DEFAULT 0.5,
  knowledge_package_id TEXT,
  campaign_id TEXT,
  processed_at TEXT,
  created_at TEXT NOT NULL
);

-- Brand reviews
CREATE TABLE IF NOT EXISTS brand_reviews (
  id TEXT PRIMARY KEY,
  publication_id TEXT NOT NULL,
  reviewed_at TEXT NOT NULL,
  passed INTEGER NOT NULL DEFAULT 0,
  brand_name_correct INTEGER NOT NULL DEFAULT 0,
  tagline_present INTEGER NOT NULL DEFAULT 0,
  color_palette_consistent INTEGER NOT NULL DEFAULT 0,
  tone_consistent INTEGER NOT NULL DEFAULT 0,
  issues TEXT DEFAULT '[]',
  FOREIGN KEY (publication_id) REFERENCES publications(id)
);

-- Institution metrics
CREATE TABLE IF NOT EXISTS institution_metrics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '',
  trend TEXT NOT NULL DEFAULT 'stable',
  change_percent REAL NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT '',
  collected_at TEXT NOT NULL
);

-- Communication strategies
CREATE TABLE IF NOT EXISTS communication_strategies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  channels TEXT DEFAULT '[]',
  frequency TEXT NOT NULL DEFAULT '',
  audience TEXT DEFAULT '[]',
  objectives TEXT DEFAULT '[]',
  kpis TEXT DEFAULT '[]',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- Publishing windows
CREATE TABLE IF NOT EXISTS publishing_windows (
  id TEXT PRIMARY KEY,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  platforms TEXT DEFAULT '[]',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata'
);
  `,
  down: `
DROP TABLE IF EXISTS publishing_windows;
DROP TABLE IF EXISTS communication_strategies;
DROP TABLE IF EXISTS institution_metrics;
DROP TABLE IF EXISTS brand_reviews;
DROP TABLE IF EXISTS community_feedback;
DROP TABLE IF EXISTS editorial_calendar;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS platforms;
DROP TABLE IF EXISTS analytics_snapshots;
DROP TABLE IF EXISTS platform_content;
DROP TABLE IF EXISTS approval_records;
DROP TABLE IF EXISTS publications;
  `,
};
