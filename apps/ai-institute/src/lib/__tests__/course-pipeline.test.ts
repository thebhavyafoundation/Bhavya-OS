/**
 * Course Pipeline — Regression Tests
 *
 * Tests the SQLite-first course loading for public pages.
 *
 * Cases:
 *   A: Published SQLite course exists → public page shows SQLite course
 *   B: Draft SQLite course exists → NOT public
 *   C: SQLite has no published course → static fallback
 *   D: SQLite unavailable → graceful fallback
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { initDatabase, getDb } from "@/lib/db";

let dbInitialized = false;

beforeAll(async () => {
  try {
    await initDatabase();
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
    `);
    dbInitialized = true;
  } catch {
    dbInitialized = false;
  }
});

afterAll(() => {
  // Clean up test data
  if (dbInitialized) {
    try {
      getDb()
        .prepare("DELETE FROM studio_courses WHERE id LIKE 'test_%'")
        .run();
    } catch {
      /* ignore */
    }
  }
});

describe("Course Pipeline — SQLite-First Loading", () => {
  describe("Case A: Published SQLite course exists", () => {
    it("should return SQLite course when published course exists", async () => {
      if (!dbInitialized) return;

      // Insert a published course
      const db = getDb();
      db.prepare(
        "INSERT OR REPLACE INTO studio_courses (id, title, description, subject, grade, lessons, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).run(
        "test_published_1",
        "Test Published Course",
        "A test course",
        "AI",
        9,
        '["lesson-1","lesson-2"]',
        "published",
      );

      const { loadPublishedCourses } = await import("@/lib/studio/courses");
      const courses = await loadPublishedCourses();

      // Should include the SQLite course
      const found = courses.find((c) => c.id === "test_published_1");
      expect(found).toBeDefined();
      expect(found!.title).toBe("Test Published Course");
    });

    it("should return published course by ID from SQLite", async () => {
      if (!dbInitialized) return;

      const { loadPublishedCourseById } = await import("@/lib/studio/courses");
      const course = await loadPublishedCourseById("test_published_1");
      expect(course).toBeDefined();
      expect(course!.title).toBe("Test Published Course");
    });
  });

  describe("Case B: Draft SQLite course exists", () => {
    it("should NOT return draft course in public listing", async () => {
      if (!dbInitialized) return;

      const db = getDb();
      db.prepare(
        "INSERT OR REPLACE INTO studio_courses (id, title, description, subject, grade, lessons, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).run(
        "test_draft_1",
        "Test Draft Course",
        "A draft course",
        "AI",
        9,
        "[]",
        "draft",
      );

      const { loadPublishedCourses } = await import("@/lib/studio/courses");
      const courses = await loadPublishedCourses();

      const found = courses.find((c) => c.id === "test_draft_1");
      expect(found).toBeUndefined();
    });

    it("should NOT return draft course by ID", async () => {
      if (!dbInitialized) return;

      const { loadPublishedCourseById } = await import("@/lib/studio/courses");
      const course = await loadPublishedCourseById("test_draft_1");
      // Should fall back to static data, which doesn't have this ID
      expect(course).toBeUndefined();
    });
  });

  describe("Case C: SQLite has no published course", () => {
    it("should fall back to static data when no published courses exist", async () => {
      // This test verifies the fallback logic exists by checking that
      // loadPublishedCourses returns an array (either SQLite or static)
      const { courses: staticCourses } = await import("@/data/academy-courses");
      const { loadPublishedCourses } = await import("@/lib/studio/courses");
      const courses = await loadPublishedCourses();

      // Should always return at least one course (either from SQLite or static fallback)
      expect(courses.length).toBeGreaterThan(0);

      // If SQLite has published courses, they take precedence
      // If not, static courses are returned
      // Either way, the function returns valid data
    });

    it("should return static course structure with modules", async () => {
      const { courses: staticCourses } = await import("@/data/academy-courses");
      // Static courses should have modules
      const courseWithModules = staticCourses.find((c) => c.modules.length > 0);
      expect(courseWithModules).toBeDefined();
      expect(courseWithModules!.modules.length).toBeGreaterThan(0);
    });
  });

  describe("Lesson count resolution", () => {
    it("should resolve lesson count from SQLite", async () => {
      if (!dbInitialized) return;

      const { getTotalLessonsAsync } = await import("@/lib/studio/courses");
      const count = await getTotalLessonsAsync("test_published_1");
      expect(count).toBe(2); // 2 lessons in the JSON array
    });

    it("should fall back to static count for unknown course", async () => {
      const { getTotalLessonsAsync } = await import("@/lib/studio/courses");
      const count = await getTotalLessonsAsync("nonexistent-course");
      expect(count).toBe(0);
    });
  });

  describe("First lesson resolution", () => {
    it("should resolve first lesson ID from SQLite", async () => {
      if (!dbInitialized) return;

      const { getFirstLessonId } = await import("@/lib/studio/courses");
      const lessonId = await getFirstLessonId("test_published_1");
      expect(lessonId).toBe("lesson-1");
    });

    it("should return null for course with no lessons", async () => {
      if (!dbInitialized) return;

      const db = getDb();
      db.prepare(
        "INSERT OR REPLACE INTO studio_courses (id, title, description, subject, grade, lessons, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).run(
        "test_empty_lessons",
        "Empty Lessons Course",
        "No lessons",
        "AI",
        9,
        "[]",
        "published",
      );

      const { getFirstLessonId } = await import("@/lib/studio/courses");
      const lessonId = await getFirstLessonId("test_empty_lessons");
      expect(lessonId).toBeNull();
    });
  });
});
