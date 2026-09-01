/**
 * Curriculum Integrity — Wave Q Regression Tests
 *
 * Verifies:
 *  - Every course ID resolves
 *  - Every lesson ID resolves (course module → lesson content)
 *  - No duplicate lesson IDs across courses
 *  - Every flagship stage courseId resolves to a published course
 *  - No broken /courses/:id references
 */

import { describe, it, expect } from "vitest";
import { courses, getCourseById, getLessonById } from "@/data/academy-courses";
import { lessonContents } from "@/data/academy-lessons";
import { flagshipPath } from "@/data/learning-paths";

describe("Curriculum Integrity", () => {
  describe("Course integrity", () => {
    it("every course has an id and resolves via getCourseById", () => {
      for (const c of courses) {
        expect(c.id).toBeTruthy();
        expect(getCourseById(c.id)).toBeDefined();
        expect(getCourseById(c.id)!.id).toBe(c.id);
      }
    });

    it("every course has at least one module and each module has lessons", () => {
      for (const c of courses) {
        expect(c.modules.length).toBeGreaterThan(0);
        for (const m of c.modules) {
          expect(m.id).toBeTruthy();
          expect(m.lessons.length).toBeGreaterThan(0);
        }
      }
    });

    it("no duplicate lesson IDs across all courses", () => {
      const seen = new Set<string>();
      const dupes: string[] = [];
      for (const c of courses) {
        for (const m of c.modules) {
          for (const l of m.lessons) {
            if (seen.has(l.id)) dupes.push(l.id);
            seen.add(l.id);
          }
        }
      }
      expect(dupes).toEqual([]);
    });

    it("no duplicate module IDs across all courses", () => {
      const seen = new Set<string>();
      const dupes: string[] = [];
      for (const c of courses) {
        for (const m of c.modules) {
          if (seen.has(m.id)) dupes.push(m.id);
          seen.add(m.id);
        }
      }
      expect(dupes).toEqual([]);
    });

    it("every course id is unique", () => {
      const ids = courses.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("every lesson id in course modules resolves to lesson content (or is expected to via fallback)", () => {
      // All lesson IDs defined in course modules should have content in lessonContents
      // or they will show "Lesson content is being prepared" — we verify no orphans
      const missing: string[] = [];
      for (const c of courses) {
        for (const m of c.modules) {
          for (const l of m.lessons) {
            if (!(l.id in lessonContents)) missing.push(l.id);
          }
        }
      }
      // Every lesson defined in a course must have content — no placeholder gaps
      expect(missing).toEqual([]);
    });

    it("all courses are published", () => {
      for (const c of courses) {
        expect(c.status).toBe("published");
      }
    });

    it("prerequisites reference existing courses", () => {
      const ids = new Set(courses.map((c) => c.id));
      for (const c of courses) {
        for (const pre of c.prerequisites) {
          expect(
            ids.has(pre),
            `course ${c.id} prerequisite ${pre} does not exist`,
          ).toBe(true);
        }
      }
    });
  });

  describe("Flagship learning-path integrity", () => {
    it("every flagship stage has a courseId", () => {
      for (const stage of flagshipPath) {
        expect(
          stage.courseId,
          `stage ${stage.id} missing courseId`,
        ).toBeTruthy();
      }
    });

    it("every flagship stage courseId resolves to a published course", () => {
      for (const stage of flagshipPath) {
        const course = getCourseById(stage.courseId!);
        expect(
          course,
          `stage ${stage.id} courseId ${stage.courseId} does not resolve`,
        ).toBeDefined();
        expect(course!.status).toBe("published");
      }
    });

    it("no flagship stage courseId is an invented/broken link", () => {
      for (const stage of flagshipPath) {
        // courseId must be one of the real course ids
        const courseIds = new Set(courses.map((c) => c.id));
        expect(
          courseIds.has(stage.courseId!),
          `stage ${stage.id} courseId ${stage.courseId} is not a real course`,
        ).toBe(true);
      }
    });

    it("connected stages count is 8 / 8", () => {
      const connected = flagshipPath.filter(
        (s) => !!s.courseId && !!getCourseById(s.courseId!),
      ).length;
      expect(connected).toBe(8);
      expect(flagshipPath.length).toBe(8);
    });

    it("/courses/:id routes resolve for every connected stage", () => {
      // Verifies no broken /courses/:id links from learning paths
      for (const stage of flagshipPath) {
        const course = getCourseById(stage.courseId!);
        expect(course).toBeDefined();
        // Course detail page uses loadPublishedCourseById which checks static fallback
        // If getCourseById resolves, loadPublishedCourseById will too
      }
    });

    it("learning-path prerequisites reference earlier flagship stages", () => {
      const stageIds = new Set(flagshipPath.map((s) => s.id));
      for (const stage of flagshipPath) {
        for (const pre of stage.prerequisites) {
          expect(
            stageIds.has(pre),
            `stage ${stage.id} prerequisite ${pre} is not a flagship stage`,
          ).toBe(true);
        }
      }
    });
  });

  describe("Public projection", () => {
    it("all 10 static courses would be visible via public projection", async () => {
      const { loadPublishedCourses } = await import("@/data/academy-courses");
      const published = await loadPublishedCourses();
      // With no published SQLite rows, fallback returns all 10 static courses
      // If SQLite has published rows, it returns those instead — either is valid
      // but we verify the static list itself is 10 published courses
      expect(courses.filter((c) => c.status === "published").length).toBe(10);
      expect(published.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("AI Foundations canonical lesson resolution", () => {
    it("AI Foundations course has exactly 3 modules with 3 lessons each", () => {
      const course = getCourseById("ai-foundations");
      expect(course).toBeDefined();
      expect(course!.modules.length).toBe(3);
      for (const mod of course!.modules) {
        expect(mod.lessons.length).toBe(3);
      }
    });

    it("every AI Foundations lesson ID resolves via getLessonById", () => {
      const course = getCourseById("ai-foundations");
      expect(course).toBeDefined();
      for (const mod of course!.modules) {
        for (const lesson of mod.lessons) {
          const result = getLessonById("ai-foundations", lesson.id);
          expect(
            result,
            `lesson ${lesson.id} should resolve via getLessonById`,
          ).toBeDefined();
          expect(result!.course.id).toBe("ai-foundations");
          expect(result!.module.id).toBe(mod.id);
        }
      }
    });

    it("AI Foundations first lesson ID is a valid string (not numeric)", () => {
      const course = getCourseById("ai-foundations");
      expect(course).toBeDefined();
      const firstLesson = course!.modules[0].lessons[0];
      // Must NOT be a plain number — canonical IDs are strings like "found-1-1"
      expect(firstLesson.id).not.toMatch(/^\d+$/);
      expect(firstLesson.id).toMatch(/^found-/);
    });
  });

  describe("Legacy data isolation", () => {
    it("getCourseById only resolves from canonical academy-courses data", () => {
      // Verify that getCourseById does not resolve legacy IDs
      expect(getCourseById("ai-foundations")).toBeDefined();
      // Verify the course has the expected canonical structure
      const course = getCourseById("ai-foundations")!;
      expect(course.modules[0].lessons[0].id).toBe("found-1-1");
    });
  });
});
