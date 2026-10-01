import { describe, it, expect } from "vitest";
import {
  getAllLessons,
  getLesson,
  getLessonsForModule,
} from "@/lib/curriculum/lessons";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import type { LessonBlock, WidgetSpec } from "@/types/curriculum";

const BANNED_PLACE_NAMES =
  /uttarakhand|garhwal|himachal|shimla|churdhar|ransi|shirgul/i;

function allBlocks(): LessonBlock[] {
  return getAllLessons().flatMap((lesson) => [...lesson.blocks]);
}

describe("curriculum lesson content contract", () => {
  const lessons = getAllLessons();

  it("publishes lessons with globally unique ids", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(5);
    const ids = lessons.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses `${moduleId}-l{n}` ids that match their module", () => {
    for (const lesson of lessons) {
      expect(lesson.id).toMatch(/^[a-z0-9-]+-l\d+$/);
      expect(lesson.id.startsWith(`${lesson.moduleId}-`)).toBe(true);
    }
  });

  it("maps every lesson to a registered module", () => {
    const moduleIds = new Set(aiModules.map((module) => module.id));
    for (const lesson of lessons) {
      expect(moduleIds.has(lesson.moduleId)).toBe(true);
    }
  });

  it("gives every lesson a substantial block sequence", () => {
    for (const lesson of lessons) {
      expect(lesson.blocks.length).toBeGreaterThanOrEqual(5);
      expect(lesson.blocks[0]?.kind).toBe("prose");
      expect(lesson.blocks.some((block) => block.kind === "quiz")).toBe(true);
      expect(lesson.blocks.some((block) => block.kind === "interactive")).toBe(
        true,
      );
    }
  });

  it("keeps quiz blocks well-formed", () => {
    const quizzes = allBlocks().flatMap((block) =>
      block.kind === "quiz" ? block.questions : [],
    );
    expect(quizzes.length).toBeGreaterThanOrEqual(16);
    const ids = quizzes.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of quizzes) {
      expect(question.prompt.length).toBeGreaterThan(3);
      expect(question.options.length).toBeGreaterThanOrEqual(2);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.options.length);
      expect(question.feedback.correct.length).toBeGreaterThan(10);
      expect(question.feedback.incorrect.length).toBeGreaterThan(10);
    }
  });

  it("uses only supported widget kinds with coherent config", () => {
    const widgets: WidgetSpec[] = allBlocks().flatMap((block) =>
      block.kind === "interactive" ? [block.widget] : [],
    );
    expect(widgets.length).toBe(5);
    for (const widget of widgets) {
      expect([
        "tap-match",
        "sort-basket",
        "predict-reveal",
        "investigate",
      ]).toContain(widget.id);
      if (widget.id === "tap-match") {
        expect(widget.config.pairs.length).toBeGreaterThanOrEqual(3);
        for (const pair of widget.config.pairs) {
          expect(pair.a.length).toBeGreaterThan(0);
          expect(pair.b.length).toBeGreaterThan(0);
        }
      }
      if (widget.id === "sort-basket") {
        expect(widget.config.categories.length).toBeGreaterThanOrEqual(2);
        expect(widget.config.items.length).toBeGreaterThanOrEqual(4);
        for (const item of widget.config.items) {
          expect(widget.config.categories).toContain(item.category);
        }
      }
      if (widget.id === "predict-reveal") {
        expect(widget.config.prompt.length).toBeGreaterThan(3);
        expect(widget.config.reveal.length).toBeGreaterThan(10);
        if (widget.config.options) {
          expect(widget.config.options).toContain(widget.config.answer);
        }
      }
      if (widget.id === "investigate") {
        expect(widget.config.items.length).toBeGreaterThanOrEqual(4);
        expect(widget.config.items.some((item) => item.correct)).toBe(true);
        expect(widget.config.items.some((item) => !item.correct)).toBe(true);
      }
    }
  });

  it("gives experiment blocks materials and steps", () => {
    const experiments = allBlocks().flatMap((block) =>
      block.kind === "experiment" ? [block] : [],
    );
    expect(experiments.length).toBe(5);
    for (const experiment of experiments) {
      expect(experiment.materials.length).toBeGreaterThanOrEqual(1);
      expect(experiment.steps.length).toBeGreaterThanOrEqual(3);
      for (const step of experiment.steps) {
        expect(step.length).toBeGreaterThan(5);
      }
    }
  });

  it("gives project blocks steps and a deliverable", () => {
    const projects = allBlocks().flatMap((block) =>
      block.kind === "project" ? [block] : [],
    );
    expect(projects.length).toBe(5);
    for (const project of projects) {
      expect(project.brief.length).toBeGreaterThan(10);
      expect(project.steps.length).toBeGreaterThanOrEqual(3);
      expect(project.deliverable.length).toBeGreaterThan(10);
    }
  });

  it("contains no banned regional place names", () => {
    const prose = allBlocks()
      .map((block) => JSON.stringify(block))
      .join("\n");
    expect(prose).not.toMatch(BANNED_PLACE_NAMES);
  });

  it("maps exemplar content to its registered modules", () => {
    expect(getLessonsForModule("l0-m1").map((lesson) => lesson.id)).toEqual([
      "l0-m1-l1",
      "l0-m1-l2",
      "l0-m1-l3",
    ]);
    expect(getLessonsForModule("l4-m1").map((lesson) => lesson.id)).toEqual([
      "l4-m1-l1",
    ]);
    expect(getLessonsForModule("l0-m7").map((lesson) => lesson.id)).toEqual([
      "l0-m7-l1",
    ]);
    expect(getLesson("l0-m1", "l0-m1-l1")?.title).toBe("Defining AI");
    expect(getLesson("l0-m7", "l0-m7-l1")?.title).toBe("Ethics in AI");
    expect(getLesson("l0-m1", "l0-m1-l9")).toBeUndefined();
    expect(getLessonsForModule("l0-m2")).toEqual([]);
  });
});
