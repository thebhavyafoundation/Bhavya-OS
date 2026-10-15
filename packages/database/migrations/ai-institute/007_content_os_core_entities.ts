import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "007_content_os_core_entities",
  name: "Content OS Core Entities — Learning paths, courses, tracks, modules, lessons, knowledge packages, labs, assessments, people, credentials, portfolio, support, process",
  up: `
-- ============================================================
-- LEARNING PATH HIERARCHY
-- ============================================================

-- Learning Paths
CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  estimated_duration TEXT,
  outcomes TEXT NOT NULL DEFAULT '[]',
  prerequisites TEXT NOT NULL DEFAULT '[]',
  courses TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_learning_paths_status ON learning_paths(status);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  learning_path_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  estimated_duration TEXT,
  outcomes TEXT NOT NULL DEFAULT '[]',
  tracks TEXT NOT NULL DEFAULT '[]',
  enrollment_type TEXT NOT NULL DEFAULT 'open' CHECK (enrollment_type IN ('open', 'cohort', 'invite')),
  max_students INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_courses_learning_path ON courses(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- Tracks
CREATE TABLE IF NOT EXISTS tracks (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  modules TEXT NOT NULL DEFAULT '[]',
  skills TEXT NOT NULL DEFAULT '[]',
  outcomes TEXT NOT NULL DEFAULT '[]',
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'active')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tracks_course ON tracks(course_id);
CREATE INDEX IF NOT EXISTS idx_tracks_order ON tracks(course_id, "order");

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER,
  lessons TEXT NOT NULL DEFAULT '[]',
  labs TEXT NOT NULL DEFAULT '[]',
  challenges TEXT NOT NULL DEFAULT '[]',
  quizzes TEXT NOT NULL DEFAULT '[]',
  project TEXT,
  prerequisites TEXT NOT NULL DEFAULT '[]',
  outcomes TEXT NOT NULL DEFAULT '[]',
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'active')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_modules_track ON modules(track_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(track_id, "order");

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  objectives TEXT NOT NULL DEFAULT '[]',
  prerequisites TEXT NOT NULL DEFAULT '[]',
  estimated_time_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  content TEXT NOT NULL DEFAULT '{}',
  code_examples TEXT NOT NULL DEFAULT '[]',
  knowledge_packages TEXT NOT NULL DEFAULT '[]',
  repository_references TEXT NOT NULL DEFAULT '[]',
  mcp_references TEXT NOT NULL DEFAULT '[]',
  assessments TEXT NOT NULL DEFAULT '[]',
  reflection_prompt TEXT,
  mentor_notes TEXT,
  student_notes TEXT,
  revision_history TEXT NOT NULL DEFAULT '[]',
  version TEXT NOT NULL DEFAULT '1.0.0',
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(module_id, "order");
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);

-- Knowledge Packages (atomic, reusable knowledge units)
CREATE TABLE IF NOT EXISTS knowledge_packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT,
  content TEXT NOT NULL DEFAULT '{}',
  concepts TEXT NOT NULL DEFAULT '[]',
  definitions TEXT NOT NULL DEFAULT '[]',
  examples TEXT NOT NULL DEFAULT '[]',
  misconceptions TEXT NOT NULL DEFAULT '[]',
  exercises TEXT NOT NULL DEFAULT '[]',
  links TEXT NOT NULL DEFAULT '[]',
  confidence INTEGER DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
  version TEXT NOT NULL DEFAULT '1.0.0',
  sources TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'published', 'versioned')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_knowledge_packages_domain ON knowledge_packages(domain);
CREATE INDEX IF NOT EXISTS idx_knowledge_packages_status ON knowledge_packages(status);

-- ============================================================
-- LABS & EXERCISES
-- ============================================================

-- Labs
CREATE TABLE IF NOT EXISTS labs (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL DEFAULT '[]',
  objectives TEXT NOT NULL DEFAULT '[]',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  estimated_time_minutes INTEGER,
  dataset_id TEXT,
  starter_project_id TEXT,
  validation TEXT NOT NULL DEFAULT '{}',
  hints TEXT NOT NULL DEFAULT '[]',
  rubric TEXT,
  ai_mentor_config TEXT,
  type TEXT NOT NULL DEFAULT 'guided' CHECK (type IN ('guided', 'semi-guided', 'open')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'active')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_labs_module ON labs(module_id);
CREATE INDEX IF NOT EXISTS idx_labs_status ON labs(status);

-- Exercises (within labs)
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  lab_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'code' CHECK (type IN ('code', 'prompt', 'reflection', 'research')),
  instructions TEXT NOT NULL DEFAULT '',
  expected_output TEXT,
  validation TEXT,
  hints TEXT NOT NULL DEFAULT '[]',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_exercises_lab ON exercises(lab_id);
CREATE INDEX IF NOT EXISTS idx_exercises_order ON exercises(lab_id, "order");

-- Prompt Challenges
CREATE TABLE IF NOT EXISTS prompt_challenges (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  task TEXT NOT NULL,
  constraints TEXT NOT NULL DEFAULT '[]',
  evaluation_criteria TEXT NOT NULL DEFAULT '[]',
  sample_solutions TEXT NOT NULL DEFAULT '[]',
  rubric TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prompt_challenges_module ON prompt_challenges(module_id);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  questions TEXT NOT NULL DEFAULT '[]',
  time_limit_minutes INTEGER,
  passing_score INTEGER NOT NULL DEFAULT 80,
  retake_policy TEXT NOT NULL DEFAULT 'unlimited',
  knowledge_packages TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quizzes_module ON quizzes(module_id);

-- ============================================================
-- ASSESSMENTS, PROJECTS, CAPSTONES
-- ============================================================

-- Assessments
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  module_id TEXT,
  course_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'promptChallenge', 'codeReview', 'architectureReview', 'projectEvaluation', 'peerReview', 'reflection', 'portfolioReview')),
  rubric TEXT,
  criteria TEXT NOT NULL DEFAULT '[]',
  passing_score INTEGER NOT NULL DEFAULT 70,
  weight INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'active')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_assessments_module ON assessments(module_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course ON assessments(course_id);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  objectives TEXT NOT NULL DEFAULT '[]',
  requirements TEXT NOT NULL DEFAULT '[]',
  deliverables TEXT NOT NULL DEFAULT '[]',
  rubric TEXT,
  estimated_time_minutes INTEGER,
  resources TEXT NOT NULL DEFAULT '[]',
  ai_mentor_config TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_projects_module ON projects(module_id);

-- Capstones
CREATE TABLE IF NOT EXISTS capstones (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  learning_path_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  objectives TEXT NOT NULL DEFAULT '[]',
  requirements TEXT NOT NULL DEFAULT '[]',
  deliverables TEXT NOT NULL DEFAULT '[]',
  rubric TEXT,
  estimated_time_minutes INTEGER,
  resources TEXT NOT NULL DEFAULT '[]',
  mentor_review_required INTEGER NOT NULL DEFAULT 1,
  peer_review_optional INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
  FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_capstones_course ON capstones(course_id);
CREATE INDEX IF NOT EXISTS idx_capstones_learning_path ON capstones(learning_path_id);

-- ============================================================
-- PEOPLE ENTITIES
-- ============================================================

-- Students (extends existing student_profiles)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  learning_path_id TEXT,
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
  mentor_id TEXT,
  batch_id TEXT,
  portfolio_id TEXT,
  skills TEXT NOT NULL DEFAULT '[]',
  badges TEXT NOT NULL DEFAULT '[]',
  certificates TEXT NOT NULL DEFAULT '[]',
  progress TEXT NOT NULL DEFAULT '{}',
  lifecycle TEXT NOT NULL DEFAULT 'visitor' CHECK (lifecycle IN ('visitor', 'enrolled', 'active', 'completed', 'contributor', 'mentor')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_learning_path ON students(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_students_batch ON students(batch_id);

-- Mentors
CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  expertise TEXT NOT NULL DEFAULT '[]',
  students TEXT NOT NULL DEFAULT '[]',
  batches TEXT NOT NULL DEFAULT '[]',
  availability TEXT,
  office_hours TEXT,
  feedback TEXT NOT NULL DEFAULT '[]',
  lifecycle TEXT NOT NULL DEFAULT 'invited' CHECK (lifecycle IN ('invited', 'active', 'senior', 'lead')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mentors_user ON mentors(user_id);

-- Batches
CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  students TEXT NOT NULL DEFAULT '[]',
  mentors TEXT NOT NULL DEFAULT '[]',
  cohort_id TEXT,
  schedule TEXT,
  capacity INTEGER NOT NULL DEFAULT 30,
  lifecycle TEXT NOT NULL DEFAULT 'created' CHECK (lifecycle IN ('created', 'active', 'completed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_batches_cohort ON batches(cohort_id);

-- Cohorts
CREATE TABLE IF NOT EXISTS cohorts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  learning_path_id TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  batches TEXT NOT NULL DEFAULT '[]',
  enrollment_open INTEGER NOT NULL DEFAULT 1,
  capacity INTEGER NOT NULL DEFAULT 100,
  lifecycle TEXT NOT NULL DEFAULT 'planned' CHECK (lifecycle IN ('planned', 'open', 'active', 'completed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cohorts_learning_path ON cohorts(learning_path_id);

-- ============================================================
-- CREDENTIALS
-- ============================================================

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  student_id TEXT NOT NULL,
  competency_id TEXT,
  issued_date TEXT NOT NULL DEFAULT (datetime('now')),
  expiry_date TEXT,
  verification_url TEXT,
  evidence TEXT NOT NULL DEFAULT '[]',
  type TEXT NOT NULL DEFAULT 'completion' CHECK (type IN ('foundation', 'specialist', 'professional', 'mentor', 'completion')),
  lifecycle TEXT NOT NULL DEFAULT 'pending' CHECK (lifecycle IN ('pending', 'issued', 'verified', 'expired')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  criteria TEXT NOT NULL,
  skill_id TEXT,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT,
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  prerequisites TEXT NOT NULL DEFAULT '[]',
  assessment_methods TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_skills_domain ON skills(domain);

-- Competencies (student skill ratings)
CREATE TABLE IF NOT EXISTS competencies (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 10),
  evidence TEXT NOT NULL DEFAULT '[]',
  last_assessed TEXT,
  confidence INTEGER DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
  lifecycle TEXT NOT NULL DEFAULT 'inferred' CHECK (lifecycle IN ('inferred', 'assessed', 'verified')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE (student_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_competencies_student ON competencies(student_id);
CREATE INDEX IF NOT EXISTS idx_competencies_skill ON competencies(skill_id);

-- ============================================================
-- PORTFOLIO
-- ============================================================

-- Portfolio
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  items TEXT NOT NULL DEFAULT '[]',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'mentors', 'public')),
  last_updated TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_portfolios_student ON portfolios(student_id);

-- Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  portfolio_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('project', 'lab', 'contribution', 'reflection', 'certification')),
  link TEXT,
  evidence TEXT NOT NULL DEFAULT '[]',
  feedback TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  date_added TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_portfolio ON portfolio_items(portfolio_id);

-- ============================================================
-- SUPPORT ENTITIES
-- ============================================================

-- Resources
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'documentation', 'paper')),
  url TEXT NOT NULL,
  description TEXT,
  relevance TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Datasets
CREATE TABLE IF NOT EXISTS datasets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  format TEXT,
  size_bytes INTEGER,
  license TEXT,
  documentation TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Repositories
CREATE TABLE IF NOT EXISTS repositories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  language TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  relevance TEXT,
  contribution_guide TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- AI Tools
CREATE TABLE IF NOT EXISTS ai_tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('LLM', 'API', 'service')),
  provider TEXT,
  capabilities TEXT NOT NULL DEFAULT '[]',
  limitations TEXT NOT NULL DEFAULT '[]',
  cost_model TEXT,
  api_reference TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- MCP Servers
CREATE TABLE IF NOT EXISTS mcp_servers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  capabilities TEXT NOT NULL DEFAULT '[]',
  endpoints TEXT NOT NULL DEFAULT '[]',
  documentation TEXT,
  version TEXT,
  lifecycle TEXT NOT NULL DEFAULT 'developed' CHECK (lifecycle IN ('developed', 'tested', 'deployed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Rubrics
CREATE TABLE IF NOT EXISTS rubrics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  dimensions TEXT NOT NULL DEFAULT '[]',
  passing_score INTEGER NOT NULL DEFAULT 70,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rubrics_status ON rubrics(status);

-- ============================================================
-- PROCESS ENTITIES
-- ============================================================

-- Prerequisites (links between any learnable entities)
CREATE TABLE IF NOT EXISTS prerequisites (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'hard' CHECK (type IN ('hard', 'soft')),
  validation TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (source_type, source_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_prerequisites_source ON prerequisites(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_prerequisites_target ON prerequisites(target_type, target_id);

-- Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  from_type TEXT NOT NULL CHECK (from_type IN ('student', 'mentor', 'ai')),
  from_id TEXT NOT NULL,
  to_student_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('assessment', 'project', 'reflection')),
  content TEXT NOT NULL,
  actionable INTEGER NOT NULL DEFAULT 0,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (to_student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_feedback_student ON feedback(to_student_id);

-- Reflections
CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  linked_type TEXT NOT NULL CHECK (linked_type IN ('lesson', 'module', 'project')),
  linked_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  insights TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reflections_student ON reflections(student_id);
CREATE INDEX IF NOT EXISTS idx_reflections_linked ON reflections(linked_type, linked_id);

-- Discussions
CREATE TABLE IF NOT EXISTS discussions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  linked_type TEXT CHECK (linked_type IN ('lesson', 'lab', 'project')),
  linked_id TEXT,
  replies TEXT NOT NULL DEFAULT '[]',
  resolved INTEGER NOT NULL DEFAULT 0,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (author_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_discussions_author ON discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_discussions_linked ON discussions(linked_type, linked_id);

-- Office Hours
CREATE TABLE IF NOT EXISTS office_hours (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  attendees TEXT NOT NULL DEFAULT '[]',
  topics TEXT NOT NULL DEFAULT '[]',
  notes TEXT,
  recording_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_office_hours_mentor ON office_hours(mentor_id);
CREATE INDEX IF NOT EXISTS idx_office_hours_time ON office_hours(scheduled_time);

  `,
  down: `
DROP TABLE IF EXISTS office_hours;
DROP TABLE IF EXISTS discussions;
DROP TABLE IF EXISTS reflections;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS prerequisites;
DROP TABLE IF EXISTS rubrics;
DROP TABLE IF EXISTS mcp_servers;
DROP TABLE IF EXISTS ai_tools;
DROP TABLE IF EXISTS repositories;
DROP TABLE IF EXISTS datasets;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS portfolio_items;
DROP TABLE IF EXISTS portfolios;
DROP TABLE IF EXISTS competencies;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS cohorts;
DROP TABLE IF EXISTS batches;
DROP TABLE IF EXISTS mentors;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS capstones;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS assessments;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS prompt_challenges;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS labs;
DROP TABLE IF EXISTS knowledge_packages;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS learning_paths;
  `,
};
