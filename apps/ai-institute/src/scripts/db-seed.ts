/**
 * AI Institute — Database Seed Script
 *
 * Usage: npx tsx src/scripts/db-seed.ts
 * Creates demo data: admin user, instructor, 2 students, student profiles
 *
 * NOTE: courses/lessons/progress tables are managed by the knowledge engine
 * (knowledge_packages/learning_paths). This script only seeds user/auth tables.
 */

import { getAdaptedDatabase, migrate } from "@bhavya/database";

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function hashPassword(password: string): string {
  // Synchronous bcrypt for seed script
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcrypt = require("bcryptjs");
  return bcrypt.hashSync(password, 12);
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to seed in production environment");
    process.exit(1);
  }

  await migrate("ai-institute");

  const db = getAdaptedDatabase("ai-institute");
  const now = new Date().toISOString();

  // ─── Users ───────────────────────────────────────────────────────────────
  const adminId = uuid();
  const instructorId = uuid();
  const student1Id = uuid();
  const student2Id = uuid();
  const adminHash = hashPassword("admin123");
  const studentHash = hashPassword("student123");

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, name, password_hash, role, provider, interests, onboarding_complete, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'local', ?, 1, ?, ?)
  `);

  insertUser.run(
    adminId,
    "admin@ai-institute.com",
    "Platform Admin",
    adminHash,
    "admin",
    '["platform","education"]',
    now,
    now,
  );
  insertUser.run(
    instructorId,
    "instructor@ai-institute.com",
    "Dr. Bhavya",
    adminHash,
    "instructor",
    '["ai","education","ethics"]',
    now,
    now,
  );
  insertUser.run(
    student1Id,
    "student@ai-institute.com",
    "Demo Student",
    studentHash,
    "student",
    '["ai","web"]',
    now,
    now,
  );
  insertUser.run(
    student2Id,
    "researcher@ai-institute.com",
    "Demo Researcher",
    studentHash,
    "researcher",
    '["ai","research"]',
    now,
    now,
  );

  console.log("✓ Created 4 users");

  // ─── Sessions ─────────────────────────────────────────────────────────────
  const sessionToken = uuid();
  db.prepare(
    `INSERT INTO sessions (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)`,
  ).run(
    student1Id,
    sessionToken,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    now,
  );
  console.log("✓ Created demo session");

  // ─── Student Profiles ─────────────────────────────────────────────────────
  const insertStudent = db.prepare(`
    INSERT OR IGNORE INTO student_profiles (
      id, user_id, name, email, role, interests, current_course, current_lesson_index,
      lessons_completed, assessment_score, assessment_completed, lab_tasks_completed,
      lab_score, knowledge_check_answers, knowledge_check_score, project_submitted,
      project_score, badge_earned, reflection_entries, streak, last_active_date,
      onboarding_complete, enrolled_courses, enrolled_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
  `);

  insertStudent.run(
    uuid(),
    student1Id,
    "Demo Student",
    "student@ai-institute.com",
    "student",
    '["ai","web"]',
    "",
    2,
    '["lesson-1","lesson-2"]',
    75,
    0,
    "[]",
    60,
    "{}",
    0,
    0,
    0,
    0,
    "[]",
    5,
    now,
    "[]",
    now,
    now,
  );

  insertStudent.run(
    uuid(),
    student2Id,
    "Demo Researcher",
    "researcher@ai-institute.com",
    "researcher",
    '["ai","research"]',
    "",
    0,
    "[]",
    0,
    0,
    "[]",
    0,
    "{}",
    0,
    0,
    0,
    0,
    "[]",
    0,
    now,
    "[]",
    now,
    now,
  );

  console.log("✓ Created 2 student profiles");

  console.log("\n✓ Seed complete. See db-seed.ts source for demo credentials.");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
