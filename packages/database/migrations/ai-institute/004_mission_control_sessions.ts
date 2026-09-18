import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "004_mission_control_sessions",
  name: "Mission Control execution bindings and sessions",
  up: `
-- Execution bindings on jobs. Nullable references only: a job is valid
-- unbound (manual/externally-executed work). queue_job_id references a
-- workflows JobQueue job id; session_id references mc_sessions.
ALTER TABLE mc_jobs ADD COLUMN queue_job_id TEXT NOT NULL DEFAULT '';
ALTER TABLE mc_jobs ADD COLUMN session_id TEXT NOT NULL DEFAULT '';

-- Agent/execution sessions. Minimal audit record answering
-- "which execution produced this artifact?". No tool-call capture.
CREATE TABLE IF NOT EXISTS mc_sessions (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES mc_jobs(id),
  producer TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('running','completed','failed')),
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_mc_sessions_job ON mc_sessions(job_id);
CREATE INDEX IF NOT EXISTS idx_mc_sessions_status ON mc_sessions(status);

-- Which session produced a given artifact version.
ALTER TABLE mc_artifact_versions ADD COLUMN session_id TEXT NOT NULL DEFAULT '';
  `,
  down: `
ALTER TABLE mc_artifact_versions DROP COLUMN session_id;
DROP TABLE IF EXISTS mc_sessions;
ALTER TABLE mc_jobs DROP COLUMN session_id;
ALTER TABLE mc_jobs DROP COLUMN queue_job_id;
  `,
};
