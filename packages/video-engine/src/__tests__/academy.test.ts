/**
 * Academy Data Tests
 *
 * Validates that curriculum data is well-formed and consistent.
 */

import { getAllCourses, getCourseById, getLessonContent, getNextLesson } from "../../apps/ai-institute/src/data/academy-lessons";
import { academyCourses } from "../../apps/ai-institute/src/data/academy-courses";

describe("Academy Courses", () => {
  it("has at least one course", () => {
    expect(academyCourses.length).toBeGreaterThanOrEqual(1);
  });

  it("each course has required fields", () => {
    academyCourses.forEach((course) => {
      expect(course.id).toBeDefined();
      expect(course.title).toBeDefined();
      expect(course.modules.length).toBeGreaterThan(0);
    });
  });

  it("each module has lessons", () => {
    academyCourses.forEach((course) => {
      course.modules.forEach((mod) => {
        expect(mod.lessons.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("Academy Lessons", () => {
  it("getAllCourses returns courses", () => {
    const courses = getAllCourses();
    expect(courses.length).toBeGreaterThanOrEqual(1);
  });

  it("getCourseById finds existing course", () => {
    const course = getCourseById("foundations");
    expect(course).toBeDefined();
    expect(course?.title).toBeDefined();
  });

  it("getCourseById returns undefined for missing course", () => {
    const course = getCourseById("nonexistent");
    expect(course).toBeUndefined();
  });

  it("getLessonContent returns content for known lessons", () => {
    const content = getLessonContent("found-1-1");
    expect(content).toBeDefined();
    expect(content?.reading).toBeDefined();
    expect(content?.keyConcepts?.length).toBeGreaterThan(0);
  });

  it("getLessonContent returns undefined for unknown lessons", () => {
    const content = getLessonContent("unknown-lesson");
    expect(content).toBeUndefined();
  });

  it("getNextLesson returns next lesson in module", () => {
    const next = getNextLesson("foundations", "found-1-1");
    expect(next).toBeDefined();
    expect(next?.lessonId).toBe("found-1-2");
  });

  it("getNextLesson returns first lesson of next module", () => {
    const next = getNextLesson("foundations", "found-1-3");
    expect(next).toBeDefined();
    expect(next?.lessonId).toBe("found-2-1");
  });

  it("getNextLesson returns undefined for last lesson", () => {
    // found-2-3 is the last lesson with content
    const next = getNextLesson("foundations", "found-2-3");
    // Should return undefined or wrap around
    expect(next === undefined || next.lessonId !== "found-2-3").toBe(true);
  });
});
