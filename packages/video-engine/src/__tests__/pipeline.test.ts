/**
 * Video Engine Pipeline Tests
 *
 * Tests for curriculum-to-video conversion pipeline.
 */

import { lessonToComposition, courseToCompositions, mergeCompositions, compositionToHTML } from "../pipeline";
import type { CurriculumCourse } from "../pipeline";

const MOCK_COURSE: CurriculumCourse = {
  id: "test-course",
  title: "Introduction to AI",
  modules: [
    {
      id: "mod-1",
      title: "What is AI?",
      lessons: [
        {
          id: "les-1-1",
          title: "Defining Artificial Intelligence",
          order: 1,
          reading: "Artificial Intelligence (AI) is the simulation of human intelligence by machines.\n\nIt encompasses learning, reasoning, and self-correction.",
          keyConcepts: [
            { term: "Artificial Intelligence", description: "Machines that mimic human intelligence" },
            { term: "Machine Learning", description: "Systems that learn from data" },
          ],
          examples: [{ title: "Virtual Assistants", description: "Siri and Alexa use AI to understand and respond to voice commands." }],
          exercises: ["Define AI in your own words", "List 3 examples of AI in daily life"],
          reflection: "How does AI impact your daily routine?",
        },
        {
          id: "les-1-2",
          title: "Types of AI",
          order: 2,
          keyConcepts: [
            { term: "Narrow AI", description: "AI designed for a specific task" },
            { term: "General AI", description: "AI with human-level cognitive abilities" },
          ],
        },
      ],
    },
  ],
};

describe("lessonToComposition", () => {
  it("creates a composition from a lesson", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[0]);

    expect(comp.id).toBe("composition-test-course-les-1-1");
    expect(comp.title).toContain("Defining Artificial Intelligence");
    expect(comp.scenes.length).toBeGreaterThan(0);
    expect(comp.metadata.lessonId).toBe("les-1-1");
    expect(comp.metadata.totalDuration).toBeGreaterThan(0);
  });

  it("includes title scene", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[0]);
    const titleScene = comp.scenes.find((s) => s.type === "title");
    expect(titleScene).toBeDefined();
  });

  it("creates concept scenes for key concepts", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[0]);
    const conceptScenes = comp.scenes.filter((s) => s.type === "concept");
    expect(conceptScenes.length).toBeGreaterThanOrEqual(2);
  });

  it("includes assessment scene when enabled", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[0], { includeAssessments: true });
    const assessment = comp.scenes.find((s) => s.type === "assessment");
    expect(assessment).toBeDefined();
  });

  it("excludes assessment when disabled", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[0], { includeAssessments: false });
    const assessment = comp.scenes.find((s) => s.type === "assessment");
    expect(assessment).toBeUndefined();
  });

  it("includes summary scene when enabled", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[0], { includeSummary: true });
    const summary = comp.scenes.find((s) => s.type === "summary");
    expect(summary).toBeDefined();
  });

  it("handles lessons with minimal content", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[1]);
    expect(comp.scenes.length).toBeGreaterThan(0);
    expect(comp.metadata.totalDuration).toBeGreaterThan(0);
  });
});

describe("courseToCompositions", () => {
  it("creates one composition per lesson", () => {
    const comps = courseToCompositions(MOCK_COURSE);
    expect(comps.length).toBe(2);
  });

  it("each composition has correct lesson ID", () => {
    const comps = courseToCompositions(MOCK_COURSE);
    expect(comps[0].metadata.lessonId).toBe("les-1-1");
    expect(comps[1].metadata.lessonId).toBe("les-1-2");
  });
});

describe("mergeCompositions", () => {
  it("merges multiple compositions into one", () => {
    const comps = courseToCompositions(MOCK_COURSE);
    const merged = mergeCompositions(comps);

    expect(merged.scenes.length).toBe(comps.reduce((sum, c) => sum + c.scenes.length, 0));
    expect(merged.metadata.totalDuration).toBe(comps.reduce((sum, c) => sum + c.metadata.totalDuration, 0));
  });

  it("uses custom title", () => {
    const comps = courseToCompositions(MOCK_COURSE);
    const merged = mergeCompositions(comps, "Custom Title");
    expect(merged.title).toBe("Custom Title");
  });
});

describe("compositionToHTML", () => {
  it("generates valid HTML", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[0]);
    const html = compositionToHTML(comp);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html>");
    expect(html).toContain("</html>");
    expect(html).toContain(comp.title);
  });

  it("includes all scenes", () => {
    const comp = lessonToComposition(MOCK_COURSE, 0, MOCK_COURSE.modules[0].lessons[0]);
    const html = compositionToHTML(comp);

    comp.scenes.forEach((scene) => {
      expect(html).toContain(`scene-${scene.type}`);
    });
  });
});
