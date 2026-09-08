/**
 * AI Institute — Database Seed Script
 *
 * Usage: npx tsx src/scripts/db-seed.ts
 * Creates demo data: admin user, instructor, 2 students, 1 course, progress
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

  // ─── Courses ──────────────────────────────────────────────────────────────
  const courseId = uuid();
  db.prepare(
    `
    INSERT OR IGNORE INTO courses (id, title, description, instructor_id, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'active', ?, ?)
  `,
  ).run(
    courseId,
    "AI Foundations",
    "Complete AI learning path from basics to deployment",
    instructorId,
    now,
    now,
  );

  // ─── Lessons ──────────────────────────────────────────────────────────────
  const lessons = [
    { title: "What is Artificial Intelligence?", idx: 0 },
    { title: "Machine Learning Fundamentals", idx: 1 },
    { title: "Neural Networks", idx: 2 },
    { title: "Natural Language Processing", idx: 3 },
    { title: "Computer Vision", idx: 4 },
    { title: "AI Ethics and Safety", idx: 5 },
  ];

  for (const lesson of lessons) {
    db.prepare(
      `
      INSERT OR IGNORE INTO lessons (id, course_id, title, content, order_index, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      uuid(),
      courseId,
      lesson.title,
      `Content for ${lesson.title}`,
      lesson.idx,
      now,
      now,
    );
  }
  console.log("✓ Created 6 lessons");

  // ─── Student Profiles ─────────────────────────────────────────────────────
  const insertStudent = db.prepare(`
    INSERT OR IGNORE INTO student_profiles (
      id, user_id, name, email, role, interests, current_course, current_lesson_index,
      lessons_completed, assessment_score, lab_score, streak, last_active_date,
      onboarding_complete, enrolled_courses, enrolled_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
  `);

  insertStudent.run(
    uuid(),
    student1Id,
    "Demo Student",
    "student@ai-institute.com",
    "student",
    '["ai","web"]',
    courseId,
    2,
    '["lesson-1","lesson-2"]',
    75,
    60,
    5,
    now,
    `["${courseId}"]`,
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
    courseId,
    0,
    "[]",
    0,
    0,
    0,
    now,
    `["${courseId}"]`,
    now,
    now,
  );

  console.log("✓ Created 2 student profiles");

  // ─── Progress Records ─────────────────────────────────────────────────────
  const lessonIds = db
    .prepare("SELECT id FROM lessons WHERE course_id = ? ORDER BY order_index")
    .all(courseId) as { id: string }[];
  for (let i = 0; i < Math.min(2, lessonIds.length); i++) {
    db.prepare(
      `
      INSERT OR IGNORE INTO progress (id, student_id, lesson_id, status, completed_at, created_at)
      VALUES (?, ?, ?, 'completed', ?, ?)
    `,
    ).run(uuid(), student1Id, lessonIds[i].id, now, now);
  }
  console.log("✓ Created progress records");

  console.log("\n✓ Seed complete. See db-seed.ts source for demo credentials.");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
