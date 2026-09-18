import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "003_mission_control",
  name: "Mission Control jobs, artifacts, approvals, decisions",
  up: `
-- Mission Control jobs — persisted auditable envelopes over work.
-- References .ai/tasks contract ids optionally; never re-implements orchestration.
CREATE TABLE IF NOT EXISTS mc_jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled job',
  department TEXT NOT NULL DEFAULT 'engineering',
  agent TEXT NOT NULL DEFAULT '',
  task_contract_ids TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','awaiting_approval','revising','completed','stopped','failed','cancelled')),
  created_by TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mc_jobs_status ON mc_jobs(status);
CREATE INDEX IF NOT EXISTS idx_mc_jobs_department ON mc_jobs(department);
CREATE INDEX IF NOT EXISTS idx_mc_jobs_updated ON mc_jobs(updated_at);

-- Mission Control artifacts — registry entities for human review.
CREATE TABLE IF NOT EXISTS mc_artifacts (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES mc_jobs(id),
  kind TEXT NOT NULL DEFAULT 'document',
  title TEXT NOT NULL DEFAULT 'Untitled artifact',
  source TEXT NOT NULL DEFAULT 'bhavya-internal',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','review','approved','rejected','revision_requested','revising','verified','integrating','integrated','superseded','archived')),
  current_version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mc_artifacts_job ON mc_artifacts(job_id);
CREATE INDEX IF NOT EXISTS idx_mc_artifacts_status ON mc_artifacts(status);

-- Artifact versions — lineage, incl. human-uploaded replacements.
CREATE TABLE IF NOT EXISTS mc_artifact_versions (
  id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL REFERENCES mc_artifacts(id),
  version INTEGER NOT NULL,
  path TEXT NOT NULL DEFAULT '',
  hash TEXT NOT NULL DEFAULT '',
  producer TEXT NOT NULL DEFAULT '',
  parent_version INTEGER,
  human_replacement INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (artifact_id, version)
);

CREATE INDEX IF NOT EXISTS idx_mc_versions_artifact ON mc_artifact_versions(artifact_id);

-- Approval requests — one per artifact review round.
CREATE TABLE IF NOT EXISTS mc_approval_requests (
  id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL REFERENCES mc_artifacts(id),
  version INTEGER NOT NULL,
  requested_by TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','revision_requested','expired','cancelled')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  decided_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_mc_approvals_artifact ON mc_approval_requests(artifact_id);
CREATE INDEX IF NOT EXISTS idx_mc_approvals_status ON mc_approval_requests(status);

-- Human decisions — append-only audit log. Never updated or deleted.
CREATE TABLE IF NOT EXISTS mc_decisions (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL
    CHECK (action IN ('approve','reject','approve_with_modification','request_revision','regenerate','upload_replacement','pause','resume','retry','abort','takeover','approve_integration')),
  target_kind TEXT NOT NULL,
  target_id TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  instruction TEXT NOT NULL DEFAULT '',
  artifact_version INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mc_decisions_target ON mc_decisions(target_kind, target_id);
CREATE INDEX IF NOT EXISTS idx_mc_decisions_actor ON mc_decisions(actor);
CREATE INDEX IF NOT EXISTS idx_mc_decisions_created ON mc_decisions(created_at);
  `,
  down: `
DROP TABLE IF EXISTS mc_decisions;
DROP TABLE IF EXISTS mc_approval_requests;
DROP TABLE IF EXISTS mc_artifact_versions;
DROP TABLE IF EXISTS mc_artifacts;
DROP TABLE IF EXISTS mc_jobs;
  `,
};
