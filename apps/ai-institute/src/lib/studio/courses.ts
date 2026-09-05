/**
 * Studio course loading — SERVER ONLY.
 *
 * SQLite-backed course loaders with static fallback. Lives in `lib/studio/`
 * next to `db.ts` (the same home API routes already import from).
 *
 * Boundary rule: never import this module from a client component
 * ("use client"). The browser must never include the native/database layer.
 * Client components use the pure static helpers in `@/data/academy-courses`
 * (`getCourseById`, `getCourseModules`, `getLessonById`, …), which carry no
 * database reachability — not even lazily.
 *
 * @module studio/courses
 */

import type { Course, CourseLevel } from "@/data/academy-courses";
import {
  courses,
  getCourseById,
  getTotalLessons,
} from "@/data/academy-courses";

/**
 * Async version that checks SQLite for lesson count.
 * Falls back to static count when SQLite has no data.
 */
export async function getTotalLessonsAsync(courseId: string): Promise<number> {
  try {
    const { ensureStudioDb } = await import("@/lib/studio/db");
    await ensureStudioDb();
    const { getDb } = await import("@/lib/db");

    const row = getDb()
      .prepare("SELECT lessons FROM studio_courses WHERE id = ?")
      .get(courseId) as { lessons: string } | undefined;

    if (row) {
      return JSON.parse(row.lessons || "[]").length;
    }
  } catch {
    // SQLite not available
  }
  return getTotalLessons(courseId);
}

/**
 * Get the first lesson ID for a course.
 * Checks SQLite first, falls back to static data.
 */
export async function getFirstLessonId(
  courseId: string,
): Promise<string | null> {
  try {
    const { ensureStudioDb } = await import("@/lib/studio/db");
    await ensureStudioDb();
    const { getDb } = await import("@/lib/db");

    const row = getDb()
      .prepare("SELECT lessons FROM studio_courses WHERE id = ?")
      .get(courseId) as { lessons: string } | undefined;

    if (row) {
      const lessonIds: string[] = JSON.parse(row.lessons || "[]");
      return lessonIds[0] || null;
    }
  } catch {
    // SQLite not available
  }
  // Static fallback
  const course = getCourseById(courseId);
  return course?.modules[0]?.lessons[0]?.id || null;
}

/**
 * Load published courses from Studio SQLite.
 * Falls back to static course data when SQLite has no published courses.
 *
 * This ensures the public /courses page always has content,
 * while allowing Studio-created courses to take precedence.
 */
export async function loadPublishedCourses(): Promise<Course[]> {
  try {
    const { ensureStudioDb } = await import("@/lib/studio/db");
    await ensureStudioDb();
    const { getDb } = await import("@/lib/db");

    const rows = getDb()
      .prepare(
        "SELECT * FROM studio_courses WHERE status = 'published' ORDER BY updated_at DESC",
      )
      .all() as Array<{
      id: string;
      title: string;
      description: string;
      subject: string;
      grade: number;
      lessons: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>;

    if (rows.length === 0) {
      // No published courses in SQLite — fall back to static data
      return courses;
    }

    // Map SQLite courses to the Course type
    return rows.map((row) => {
      const lessonIds: string[] = JSON.parse(row.lessons || "[]");
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        domain: row.subject,
        subject: row.subject,
        grade: row.grade,
        level: "beginner" as CourseLevel,
        status: "published" as const,
        modules: [],
        prerequisites: [],
        estimatedDuration: lessonIds.length * 30, // estimate 30min per lesson
        tags: [row.subject.toLowerCase()],
        metadata: {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    });
  } catch {
    // SQLite not available — fall back to static data
    return courses;
  }
}

/**
 * Load a single published course by ID.
 * Tries SQLite first, falls back to static data.
 */
export async function loadPublishedCourseById(
  id: string,
): Promise<Course | undefined> {
  try {
    const { ensureStudioDb } = await import("@/lib/studio/db");
    await ensureStudioDb();
    const { getDb } = await import("@/lib/db");

    const row = getDb()
      .prepare(
        "SELECT * FROM studio_courses WHERE id = ? AND status = 'published'",
      )
      .get(id) as
      | {
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
      | undefined;

    if (row) {
      const lessonIds: string[] = JSON.parse(row.lessons || "[]");
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        domain: row.subject,
        subject: row.subject,
        grade: row.grade,
        level: "beginner",
        status: "published",
        modules: [],
        prerequisites: [],
        estimatedDuration: lessonIds.length * 30,
        tags: [row.subject.toLowerCase()],
        metadata: {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }

    // Not in SQLite — fall back to static data
    return getCourseById(id);
  } catch {
    return getCourseById(id);
  }
}
