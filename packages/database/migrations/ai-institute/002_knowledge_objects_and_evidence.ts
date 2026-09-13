import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "002_knowledge_objects_and_evidence",
  name: "Knowledge objects and evidence records — replaces filesystem persistence",
  up: `
-- Knowledge Objects table
-- Replaces bhavya-ai-lab/knowledge/objects/*.json filesystem storage.
-- Structured metadata stored in Turso; large blobs (if any) future R2 candidates.
CREATE TABLE IF NOT EXISTS knowledge_objects (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Untitled',
  description TEXT NOT NULL DEFAULT '',
  grade INTEGER NOT NULL DEFAULT 9,
  subject TEXT NOT NULL DEFAULT 'AI',
  concepts TEXT NOT NULL DEFAULT '[]',
  definitions TEXT NOT NULL DEFAULT '[]',
  examples TEXT NOT NULL DEFAULT '[]',
  misconceptions TEXT NOT NULL DEFAULT '[]',
  exercises TEXT NOT NULL DEFAULT '[]',
  "references" TEXT NOT NULL DEFAULT '[]',
  prerequisites TEXT NOT NULL DEFAULT '[]',
  related TEXT NOT NULL DEFAULT '[]',
  metadata TEXT NOT NULL DEFAULT '{}',
  provenance TEXT NOT NULL DEFAULT 'institutional',
  status TEXT NOT NULL DEFAULT 'draft',
  version TEXT NOT NULL DEFAULT '0.1.0',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ko_domain ON knowledge_objects(domain);
CREATE INDEX IF NOT EXISTS idx_ko_status ON knowledge_objects(status);
CREATE INDEX IF NOT EXISTS idx_ko_provenance ON knowledge_objects(provenance);
CREATE INDEX IF NOT EXISTS idx_ko_updated ON knowledge_objects(updated_at);

-- Evidence Records table
-- Replaces bhavya-ai-lab/evidence/*.json filesystem storage.
-- Append-only institutional audit trail for Knowledge and Forest activities.
CREATE TABLE IF NOT EXISTS evidence_records (
  id TEXT PRIMARY KEY,
  activity_type TEXT NOT NULL,
  activity_id TEXT NOT NULL DEFAULT '',
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  description TEXT NOT NULL DEFAULT '',
  metadata TEXT NOT NULL DEFAULT '{}',
  idempotency_key TEXT
);

CREATE INDEX IF NOT EXISTS idx_ev_type ON evidence_records(activity_type);
CREATE INDEX IF NOT EXISTS idx_ev_activity ON evidence_records(activity_id);
CREATE INDEX IF NOT EXISTS idx_ev_timestamp ON evidence_records(timestamp);
CREATE INDEX IF NOT EXISTS idx_ev_idempotency ON evidence_records(idempotency_key);
  `,
  down: `
DROP TABLE IF EXISTS evidence_records;
DROP TABLE IF EXISTS knowledge_objects;
  `,
};
