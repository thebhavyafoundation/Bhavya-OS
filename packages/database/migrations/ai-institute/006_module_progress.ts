import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "006_module_progress",
  name: "module_progress",
  up: `
CREATE TABLE IF NOT EXISTS module_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  lessons_completed TEXT NOT NULL DEFAULT '[]',
  quiz_score INTEGER,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, module_id)
);
CREATE INDEX IF NOT EXISTS idx_module_progress_user ON module_progress(user_id);
`,
  down: `DROP TABLE IF EXISTS module_progress;`,
};
