/**
 * AI Institute — Data Migration Script
 *
 * Reads existing JSON files from bhavya-ai-lab/data/ and imports them into SQLite.
 * Skips duplicates (by email for users, by userId for students).
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { getDatabase, migrate } from "../src/lib/sqlite";
import { aiInstituteMigrations } from "../src/lib/migrations";

interface OldUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  provider: string;
  interests: string[];
  onboardingComplete: boolean;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

interface OldSession {
  userId: string;
  token: string;
  expiresAt: string;
}

interface OldStudent {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  currentCourse: string;
  currentLessonIndex: number;
  lessonsCompleted: string[];
  assessmentScore: number;
  assessmentCompleted: boolean;
  labTasksCompleted: string[];
  labScore: number;
  knowledgeCheckAnswers: Record<string, string | number>;
  knowledgeCheckScore: number;
  projectSubmitted: boolean;
  projectScore: number;
  badgeEarned: boolean;
  reflectionEntries: { lessonId: string; content: string; date: string }[];
  streak: number;
  lastActiveDate: string;
  onboardingComplete: boolean;
  enrolledCourses: string[];
  enrolledAt: string;
  updatedAt: string;
}

const DATA_DIR = join(process.cwd(), "bhavya-ai-lab", "data");
const DB_PATH = join(process.cwd(), "bhavya-ai-lab", "ai-institute.db");

function loadJson<T>(filename: string): T[] {
  const path = join(DATA_DIR, filename);
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return [];
  }
}

function migrateUsers(db: ReturnType<typeof getDatabase>): number {
  const users = loadJson<OldUser>("users.json");
  if (users.length === 0) return 0;

  const existing = db.prepare("SELECT email FROM users").all() as { email: string }[];
  const existingEmails = new Set(existing.map((r) => r.email));

  let count = 0;
  for (const u of users) {
    if (existingEmails.has(u.email)) continue;
    db.prepare(
      `INSERT INTO users (id, email, name, avatar, role, provider, interests, onboarding_complete, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      u.id, u.email, u.name, u.avatar ?? null, u.role, u.provider,
      JSON.stringify(u.interests), u.onboardingComplete ? 1 : 0,
      u.passwordHash, u.createdAt, u.updatedAt,
    );
    count++;
  }
  return count;
}

function migrateSessions(db: ReturnType<typeof getDatabase>): number {
  const sessions = loadJson<OldSession>("sessions.json");
  if (sessions.length === 0) return 0;

  let count = 0;
  for (const s of sessions) {
    try {
      db.prepare(
        `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
      ).run(s.token, s.userId, s.expiresAt);
      count++;
    } catch {
      // Skip if token already exists or user_id FK fails
    }
  }
  return count;
}

function migrateStudents(db: ReturnType<typeof getDatabase>): number {
  const students = loadJson<OldStudent>("students.json");
  if (students.length === 0) return 0;

  const existing = db.prepare("SELECT user_id FROM student_profiles").all() as { user_id: string }[];
  const existingUserIds = new Set(existing.map((r) => r.user_id));

  let count = 0;
  for (const s of students) {
    if (existingUserIds.has(s.userId)) continue;
    db.prepare(
      `INSERT INTO student_profiles (id, user_id, name, email, role, interests, current_course, current_lesson_index, lessons_completed, assessment_score, assessment_completed, lab_tasks_completed, lab_score, knowledge_check_answers, knowledge_check_score, project_submitted, project_score, badge_earned, reflection_entries, streak, last_active_date, onboarding_complete, enrolled_courses, enrolled_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      s.id, s.userId, s.name, s.email, s.role,
      JSON.stringify(s.interests), s.currentCourse, s.currentLessonIndex,
      JSON.stringify(s.lessonsCompleted), s.assessmentScore, s.assessmentCompleted ? 1 : 0,
      JSON.stringify(s.labTasksCompleted), s.labScore,
      JSON.stringify(s.knowledgeCheckAnswers), s.knowledgeCheckScore,
      s.projectSubmitted ? 1 : 0, s.projectScore, s.badgeEarned ? 1 : 0,
      JSON.stringify(s.reflectionEntries), s.streak, s.lastActiveDate,
      s.onboardingComplete ? 1 : 0, JSON.stringify(s.enrolledCourses),
      s.enrolledAt, s.updatedAt,
    );
    count++;
  }
  return count;
}

function main(): void {
  console.log("AI Institute — Data Migration");
  console.log("==============================\n");

  // Initialize database and run migrations
  console.log("Initializing database...");
  getDatabase({ path: DB_PATH });
  const result = migrate(aiInstituteMigrations);
  console.log(`Applied ${result.applied.length} migration(s)\n`);

  const db = getDatabase({ path: "" });

  // Migrate data
  const usersMigrated = migrateUsers(db);
  console.log(`Users:      ${usersMigrated} migrated`);

  const sessionsMigrated = migrateSessions(db);
  console.log(`Sessions:   ${sessionsMigrated} migrated`);

  const studentsMigrated = migrateStudents(db);
  console.log(`Students:   ${studentsMigrated} migrated`);

  console.log("\nMigration complete!");
}

main();
