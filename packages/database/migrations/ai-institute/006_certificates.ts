import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "006_certificates",
  name: "Course completion certificates — credential records",
  up: `
-- Certificates of completion for academy courses.
-- One row per (user, course); credential_id is the public, unguessable
-- handle used by /verify/<credentialId>. Eligibility is never stored here:
-- it is derived at claim time from student_profiles.lessons_completed plus
-- the static/studio course definition, so a certificate stays an issued
-- record rather than a second source of truth.
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  credential_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  subject_type TEXT NOT NULL DEFAULT 'academy-course',
  holder_name TEXT NOT NULL,
  subject_title TEXT NOT NULL,
  subject_level TEXT NOT NULL DEFAULT '',
  issued_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_subject ON certificates(subject_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued ON certificates(issued_at);
  `,
  down: `
DROP TABLE IF EXISTS certificates;
  `,
};
