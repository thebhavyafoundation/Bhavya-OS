import { describe, it, expect } from "vitest";
import {
  getAllLessons,
  getLesson,
  getLessonsForModule,
  registerLesson,
} from "@/lib/curriculum/lessons";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import type { Lesson, LessonBlock, WidgetSpec } from "@/types/curriculum";

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
