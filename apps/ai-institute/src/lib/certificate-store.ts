/**
 * AI Institute — Certificate persistence.
 *
 * Server-only: SQLite through the app's existing async adapter. Production
 * applies BASELINE_SCHEMA only, so the table is created here with
 * IF NOT EXISTS (the versioned migration 006 applies the same DDL locally
 * and in tests); keep both definitions in sync.
 */

import { initDatabase, getAsyncDb } from "./db";
import {
  flattenCourseLessonIds,
  issueCredentialId,
  normalizeCredentialId,
  type CertificateRecord,
} from "./certificate";
import { getCourseById } from "@/data/academy-courses";

const CERTIFICATES_DDL = `
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
`;

interface CertificateRow {
  id: string;
  credential_id: string;
  user_id: string;
  subject_id: string;
  subject_type: string;
  holder_name: string;
  subject_title: string;
  subject_level: string;
  issued_at: string;
  created_at: string;
  updated_at: string;
}

let ensured = false;

export async function ensureCertificatesTable(): Promise<void> {
  if (ensured) return;
  await initDatabase();
  await getAsyncDb().exec(CERTIFICATES_DDL);
  ensured = true;
}

function toRecord(row: CertificateRow): CertificateRecord {
  return {
    id: row.id,
    credentialId: row.credential_id,
    userId: row.user_id,
    subjectId: row.subject_id,
    subjectType: row.subject_type,
    holderName: row.holder_name,
    subjectTitle: row.subject_title,
    subjectLevel: row.subject_level,
    issuedAt: row.issued_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface IssueCertificateInput {
  userId: string;
  holderName: string;
  subjectId: string;
  subjectTitle: string;
  subjectLevel: string;
}

/**
 * Insert a certificate, or return the existing one for the same
 * (user, course) pair — claiming twice must stay idempotent.
 */
export async function insertCertificate(
  input: IssueCertificateInput,
): Promise<CertificateRecord> {
  await ensureCertificatesTable();
  const db = getAsyncDb();
  const now = new Date().toISOString();

  const existing = await db.get<CertificateRow>(
    "SELECT * FROM certificates WHERE user_id = ? AND subject_id = ?",
    input.userId,
    input.subjectId,
  );
  if (existing) return toRecord(existing);

  const id = crypto.randomUUID();
  const credentialId = issueCredentialId();

  const result = await db.run(
    `INSERT INTO certificates
       (id, credential_id, user_id, subject_id, subject_type, holder_name,
        subject_title, subject_level, issued_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'academy-course', ?, ?, ?, ?, ?, ?)
     ON CONFLICT (user_id, subject_id) DO NOTHING`,
    id,
    credentialId,
    input.userId,
    input.subjectId,
    input.holderName,
    input.subjectTitle,
    input.subjectLevel,
    now,
    now,
    now,
  );

  const row = await db.get<CertificateRow>(
    "SELECT * FROM certificates WHERE user_id = ? AND subject_id = ?",
    input.userId,
    input.subjectId,
  );
  if (row) return toRecord(row);
  throw new Error(`Certificate insert failed (${result.rowsAffected} rows)`);
}

export async function findCertificateByCredentialId(
  raw: string,
): Promise<CertificateRecord | null> {
  const credentialId = normalizeCredentialId(raw);
  if (!credentialId) return null;
  await ensureCertificatesTable();
  const row = await getAsyncDb().get<CertificateRow>(
    "SELECT * FROM certificates WHERE credential_id = ?",
    credentialId,
  );
  return row ? toRecord(row) : null;
}

export async function findCertificate(
  userId: string,
  subjectId: string,
): Promise<CertificateRecord | null> {
  await ensureCertificatesTable();
  const row = await getAsyncDb().get<CertificateRow>(
    "SELECT * FROM certificates WHERE user_id = ? AND subject_id = ?",
    userId,
    subjectId,
  );
  return row ? toRecord(row) : null;
}

export async function listCertificatesByUser(
  userId: string,
): Promise<CertificateRecord[]> {
  await ensureCertificatesTable();
  const rows = await getAsyncDb().all<CertificateRow>(
    "SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_at DESC",
    userId,
  );
  return rows.map(toRecord);
}

export interface CourseSnapshot {
  id: string;
  title: string;
  level: string;
}

/**
 * Resolve the lesson ids a learner can actually open for a course.
 *
 * Precedence mirrors `@/lib/studio/courses`: a published Studio row owns the
 * lesson list, otherwise the static course definition does. The same order is
 * what `/courses/[id]` renders, so eligibility can never demand lessons the
 * page never offered.
 */
export async function resolveCourseLessonIds(
  courseId: string,
): Promise<string[]> {
  try {
    const { ensureStudioDb } = await import("./studio/db");
    await ensureStudioDb();
    const { getDb } = await import("./db");
    const row = getDb()
      .prepare(
        "SELECT lessons FROM studio_courses WHERE id = ? AND status = 'published'",
      )
      .get(courseId) as { lessons: string } | undefined;

    if (row) {
      try {
        const parsed: unknown = JSON.parse(row.lessons || "[]");
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is string => typeof id === "string");
        }
      } catch {
        // Unparsable lesson list — the row still owns the course, so there
        // is nothing verifiable to certify.
      }
      return [];
    }
  } catch {
    // SQLite unavailable (production uses Turso) — static data below.
  }

  const course = getCourseById(courseId);
  return course ? flattenCourseLessonIds(course) : [];
}

/** Title/level snapshot source for a claimable course. */
export async function resolveCourseSnapshot(
  courseId: string,
): Promise<CourseSnapshot | null> {
  const { loadPublishedCourseById } = await import("./studio/courses");
  const course = await loadPublishedCourseById(courseId);
  if (!course) return null;
  return { id: course.id, title: course.title, level: course.level };
}
