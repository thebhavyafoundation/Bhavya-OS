/**
 * Studio Database Layer
 *
 * SQLite persistence for courses and lessons.
 * Knowledge Objects use the filesystem-based knowledge-repository.ts (canonical).
 */

import { initDatabase } from "../db";

let initialized = false;

export async function ensureStudioDb(): Promise<void> {
  if (initialized) return;
  await initDatabase();
  const { getDb } = await import("../db");
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS studio_courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      subject TEXT DEFAULT 'AI',
      grade INTEGER DEFAULT 9,
      lessons TEXT DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS studio_lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT,
      title TEXT NOT NULL,
      subject TEXT DEFAULT 'AI',
      grade INTEGER DEFAULT 9,
      duration INTEGER DEFAULT 45,
      status TEXT DEFAULT 'draft',
      learning_outcomes TEXT DEFAULT '[]',
      sections TEXT DEFAULT '[]',
      assessment TEXT,
      teacher_guide TEXT,
      workbook TEXT,
      published_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES studio_courses(id) ON DELETE SET NULL
    );

  `);

  initialized = true;
}

// ── Course CRUD ────────────────────────────────────────────────────

export interface DbCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  lessons: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function dbCourseToApi(row: DbCourse) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    subject: row.subject,
    grade: row.grade,
    lessons: JSON.parse(row.lessons || "[]"),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: "1.0.0",
  };
}

export async function dbListCourses() {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  const rows = getDb().prepare("SELECT * FROM studio_courses ORDER BY updated_at DESC").all() as unknown as DbCourse[];
  return rows.map(dbCourseToApi);
}

export async function dbGetCourse(id: string) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  const row = getDb().prepare("SELECT * FROM studio_courses WHERE id = ?").get(id) as DbCourse | undefined;
  return row ? dbCourseToApi(row) : null;
}

export async function dbCreateCourse(data: {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  grade?: number;
}) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  const now = new Date().toISOString();
  getDb().prepare(
    "INSERT INTO studio_courses (id, title, description, subject, grade, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(data.id, data.title, data.description || "", data.subject || "AI", data.grade || 9, now, now);
  return dbGetCourse(data.id);
}

export async function dbUpdateCourse(id: string, data: Partial<{
  title: string;
  description: string;
  subject: string;
  grade: number;
  status: string;
  lessons: string;
}>) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  const existing = getDb().prepare("SELECT * FROM studio_courses WHERE id = ?").get(id) as DbCourse | undefined;
  if (!existing) return null;
  const now = new Date().toISOString();
  getDb().prepare(
    "UPDATE studio_courses SET title = ?, description = ?, subject = ?, grade = ?, status = ?, lessons = ?, updated_at = ? WHERE id = ?"
  ).run(
    data.title ?? existing.title,
    data.description ?? existing.description,
    data.subject ?? existing.subject,
    data.grade ?? existing.grade,
    data.status ?? existing.status,
    data.lessons ?? existing.lessons,
    now,
    id,
  );
  return dbGetCourse(id);
}

export async function dbDeleteCourse(id: string) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  getDb().prepare("DELETE FROM studio_courses WHERE id = ?").run(id);
}

// ── Lesson CRUD ────────────────────────────────────────────────────

export interface DbLesson {
  id: string;
  course_id: string | null;
  title: string;
  subject: string;
  grade: number;
  duration: number;
  status: string;
  learning_outcomes: string;
  sections: string;
  assessment: string | null;
  teacher_guide: string | null;
  workbook: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function dbLessonToApi(row: DbLesson) {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    subject: row.subject,
    grade: row.grade,
    duration: row.duration,
    status: row.status,
    learningOutcomes: JSON.parse(row.learning_outcomes || "[]"),
    sections: JSON.parse(row.sections || "[]"),
    assessment: row.assessment ? JSON.parse(row.assessment) : null,
    teacherGuide: row.teacher_guide ? JSON.parse(row.teacher_guide) : null,
    workbook: row.workbook ? JSON.parse(row.workbook) : null,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: "1.0.0",
  };
}

export async function dbListLessons(filters?: { status?: string; courseId?: string }) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  let query = "SELECT * FROM studio_lessons";
  const conditions: string[] = [];
  const params: string[] = [];
  if (filters?.status) { conditions.push("status = ?"); params.push(filters.status); }
  if (filters?.courseId) { conditions.push("course_id = ?"); params.push(filters.courseId); }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY updated_at DESC";
  const rows = getDb().prepare(query).all(...params) as unknown as DbLesson[];
  return rows.map(dbLessonToApi);
}

export async function dbGetLesson(id: string) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  const row = getDb().prepare("SELECT * FROM studio_lessons WHERE id = ?").get(id) as DbLesson | undefined;
  return row ? dbLessonToApi(row) : null;
}

export async function dbCreateLesson(data: {
  id: string;
  courseId?: string;
  title: string;
  subject?: string;
  grade?: number;
  duration?: number;
  learningOutcomes?: object[];
  sections?: object[];
}) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  const now = new Date().toISOString();
  getDb().prepare(
    "INSERT INTO studio_lessons (id, course_id, title, subject, grade, duration, learning_outcomes, sections, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    data.id, data.courseId || null, data.title, data.subject || "AI",
    data.grade || 9, data.duration || 45,
    JSON.stringify(data.learningOutcomes || []), JSON.stringify(data.sections || []),
    now, now,
  );
  return dbGetLesson(data.id);
}

export async function dbUpdateLesson(id: string, data: Partial<{
  title: string;
  subject: string;
  grade: number;
  duration: number;
  status: string;
  learningOutcomes: object[];
  sections: object[];
  assessment: object;
  teacherGuide: object;
  workbook: object;
  publishedAt: string;
}>) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  const existing = getDb().prepare("SELECT * FROM studio_lessons WHERE id = ?").get(id) as DbLesson | undefined;
  if (!existing) return null;
  const now = new Date().toISOString();
  getDb().prepare(
    `UPDATE studio_lessons SET
      title = ?, subject = ?, grade = ?, duration = ?, status = ?,
      learning_outcomes = ?, sections = ?, assessment = ?, teacher_guide = ?,
      workbook = ?, published_at = ?, updated_at = ?
    WHERE id = ?`
  ).run(
    data.title ?? existing.title,
    data.subject ?? existing.subject,
    data.grade ?? existing.grade,
    data.duration ?? existing.duration,
    data.status ?? existing.status,
    data.learningOutcomes ? JSON.stringify(data.learningOutcomes) : existing.learning_outcomes,
    data.sections ? JSON.stringify(data.sections) : existing.sections,
    data.assessment ? JSON.stringify(data.assessment) : existing.assessment,
    data.teacherGuide ? JSON.stringify(data.teacherGuide) : existing.teacher_guide,
    data.workbook ? JSON.stringify(data.workbook) : existing.workbook,
    data.publishedAt ?? existing.published_at,
    now, id,
  );
  return dbGetLesson(id);
}

export async function dbDeleteLesson(id: string) {
  await ensureStudioDb();
  const { getDb } = await import("../db");
  getDb().prepare("DELETE FROM studio_lessons WHERE id = ?").run(id);
}
