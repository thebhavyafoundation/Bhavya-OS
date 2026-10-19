import { describe, it, expect } from "vitest";
import {
  getAllLessons,
  getLesson,
  getLessonsForModule,
  registerLesson,
  getModuleLessonCounts,
} from "@/lib/curriculum/lessons";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import type { Lesson, LessonBlock, WidgetSpec } from "@/data/curriculum/types";

const BANNED_PLACE_NAMES =
  /uttarakhand|garhwal|himachal|shimla|churdhar|ransi|shirgul/i;

describe("curriculum lesson content API contract", () => {
  it("exports getAllLessons returning array", () => {
    const lessons = getAllLessons();
    expect(Array.isArray(lessons)).toBe(true);
  });

  it("exports getLessonsForModule returning array", () => {
    const lessons = getLessonsForModule("l0-m1");
    expect(Array.isArray(lessons)).toBe(true);
  });

  it("exports getLesson returning Lesson | undefined", () => {
    const lesson = getLesson("l0-m1", "l0-m1-l1");
    expect(lesson === undefined || typeof lesson === "object").toBe(true);
  });

  it("exports registerLesson function", () => {
    expect(typeof registerLesson).toBe("function");
  });

  it("registerLesson adds lesson to registry", () => {
    const testModuleId = aiModules[0]?.id || "l0-m1";
    const testLesson: Lesson = {
      id: "test-l1",
      moduleId: testModuleId,
      title: "Test Lesson",
      band: "12-15",
      durationMin: 30,
      blocks: [
        { kind: "prose", text: "Hello" },
        {
          kind: "quiz",
          questions: [
            {
              id: "q1",
              prompt: "Q?",
              options: ["A", "B"],
              correctIndex: 0,
              feedback: { correct: "Yes", incorrect: "No" },
            },
          ],
        },
        {
          kind: "interactive",
          widget: { id: "tap-match", config: { pairs: [{ a: "A", b: "B" }] } },
        },
        {
          kind: "experiment",
          title: "Exp",
          materials: ["M"],
          steps: ["S1", "S2"],
        },
        { kind: "project", brief: "P", steps: ["S1"], deliverable: "D" },
      ],
    };
    registerLesson(testLesson);
    const lessons = getLessonsForModule(testModuleId);
    expect(lessons.length).toBeGreaterThanOrEqual(1);
    expect(lessons.find((l) => l.id === "test-l1")).toBeDefined();
  });

  it("maps every lesson to a registered module when present", () => {
    const moduleIds = new Set(aiModules.map((module) => module.id));
    const lessons = getAllLessons();
    for (const lesson of lessons) {
      expect(moduleIds.has(lesson.moduleId)).toBe(true);
    }
  });

  it("contains no banned regional place names in registered lessons", () => {
    const prose = getAllLessons()
      .flatMap((lesson) => lesson.blocks)
      .map((block) => JSON.stringify(block))
      .join("\n");
    expect(prose).not.toMatch(BANNED_PLACE_NAMES);
  });
});

/**
 * Regression guard for the empty-registry bug.
 *
 * `lib/curriculum/lessons.ts` once held a `Map` that nothing ever wrote to.
 * Every function above still returned a correctly typed value — an empty
 * array, or `undefined` — so all seven original assertions passed while the
 * curriculum lesson route resolved zero lessons and emitted no static paths.
 *
 * A guard has to assert *content*, not shape, or it will be just as vacuous
 * as the code it replaced. These assert that authored lessons actually exist,
 * that they carry a body, and that a known module resolves them.
 */
describe("curriculum lessons are actually reachable", () => {
  it("exposes at least one authored lesson", () => {
    const lessons = getAllLessons();
    expect(lessons.length).toBeGreaterThan(0);
  });

  it("exposes lessons for the level-0 introductory module", () => {
    const lessons = getLessonsForModule("l0-m1");
    expect(lessons.length).toBeGreaterThan(0);
  });

  it("gives every exposed lesson real prose or an interaction", () => {
    for (const lesson of getAllLessons()) {
      const substantive = lesson.blocks.filter(
        (block) =>
          (block.kind === "prose" && block.text.trim().length > 40) ||
          block.kind === "interactive" ||
          block.kind === "quiz" ||
          block.kind === "experiment" ||
          block.kind === "project",
      );
      expect(
        substantive.length,
        `${lesson.moduleId}:${lesson.id}`,
      ).toBeGreaterThan(0);
    }
  });

  it("resolves each exposed lesson by its own key", () => {
    for (const lesson of getAllLessons()) {
      expect(getLesson(lesson.moduleId, lesson.id)).toEqual(lesson);
    }
  });

  it("reports per-module lesson counts that match the registry", () => {
    const counts = getModuleLessonCounts();
    const lessons = getAllLessons();
    expect(counts.size).toBeGreaterThan(0);

    const summed = [...counts.values()].reduce((a, b) => a + b, 0);
    expect(summed).toBe(lessons.length);

    // The counts drive the "ready to study now" list on /curriculum, so a
    // count that disagreed with the registry would advertise a module that
    // cannot be opened.
    for (const lesson of lessons) {
      expect(counts.get(lesson.moduleId)).toBeGreaterThan(0);
    }
  });

  it("never reports a lesson count for a module with no lessons", () => {
    for (const [moduleId, count] of getModuleLessonCounts()) {
      if (count > 0) {
        expect(getLessonsForModule(moduleId)).toHaveLength(count);
      }
    }
  });
});
