import type { Migration } from "./sqlite";

export const aiInstituteMigrations: Migration[] = [
  {
    id: "001_initial",
    name: "Initial schema — users, sessions, student_profiles",
    up: `
-- Users table
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

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Student profiles table
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
`,
    down: `
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
`,
  },
];
