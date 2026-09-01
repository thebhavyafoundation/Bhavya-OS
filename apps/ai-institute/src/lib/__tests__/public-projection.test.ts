/**
 * Public Projection Hardening — 8-Hour Window
 *
 * Locks the Phase I / Phase K fixes:
 *  - Only published + institutional KOs may surface publicly.
 *  - Projection strips sensitive fields (provenance, status, metadata, version, exercise solutions, system prompts, lesson internals).
 *  - Course / lesson public projections only expose published content.
 *  - Data-truth invariants (10 courses, 87 lesson contents, flagshipPath consistency).
 *  - `isPublicEligible` / `isPublicClassification` contracts.
 */

import { describe, it, expect } from "vitest";
import {
  isPublicEligible,
  isPublicClassification,
  projectKnowledgeObject,
  projectKnowledgeObjects,
  projectMentorAgent,
  projectMentorAgents,
  projectLesson,
  projectLessons,
} from "@/lib/public-projection";
import type { KnowledgeObject } from "@/lib/knowledge-repository";
import { courses } from "@/data/academy-courses";
import { lessonContents } from "@/data/academy-lessons";
import { flagshipPath } from "@/data/learning-paths";

function makeKO(overrides: Partial<KnowledgeObject> = {}): KnowledgeObject {
  return {
    id: overrides.id ?? `ko-${Math.random().toString(36).slice(2, 8)}`,
    title: overrides.title ?? "Test KO",
    description: overrides.description ?? "desc",
    domain: overrides.domain ?? "AI",
    grade: overrides.grade ?? 9,
    subject: overrides.subject ?? "AI",
    provenance: overrides.provenance ?? "institutional",
    status: overrides.status ?? "published",
    concepts: overrides.concepts ?? [],
    definitions: overrides.definitions ?? [],
    examples: overrides.examples ?? [],
    exercises: overrides.exercises ?? [],
    prerequisites: overrides.prerequisites ?? [],
    related: overrides.related ?? [],
    metadata: overrides.metadata ?? { internal: true },
    version: overrides.version ?? "1",
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    updatedAt: overrides.updatedAt ?? new Date().toISOString(),
  } as KnowledgeObject;
}

describe("Public Projection — classification helpers", () => {
  it("isPublicEligible only allows published", () => {
    expect(isPublicEligible("published")).toBe(true);
    expect(isPublicEligible("draft")).toBe(false);
    expect(isPublicEligible("review")).toBe(false);
    expect(isPublicEligible("approved")).toBe(false);
    expect(isPublicEligible("archived")).toBe(false);
  });

  it("isPublicClassification only allows PUBLIC", () => {
    expect(isPublicClassification("PUBLIC")).toBe(true);
    expect(isPublicClassification("COMMUNITY")).toBe(false);
    expect(isPublicClassification("INTERNAL")).toBe(false);
    expect(isPublicClassification("RESTRICTED")).toBe(false);
    expect(isPublicClassification("PRIVATE")).toBe(false);
  });
});

describe("Public Projection — knowledge objects", () => {
  it("strips provenance, status, metadata, version", () => {
    const ko = makeKO({
      metadata: { secret: 1 },
      version: "2",
      provenance: "institutional",
      status: "published",
    });
    const pub = projectKnowledgeObject(ko);
    expect(pub).not.toHaveProperty("provenance");
    expect(pub).not.toHaveProperty("status");
    expect(pub).not.toHaveProperty("metadata");
    expect(pub).not.toHaveProperty("version");
  });

  it("strips exercise solutions", () => {
    const ko = makeKO({
      exercises: [
        { prompt: "Q?", type: "short-answer", solution: "A" } as unknown as KnowledgeObject["exercises"][number],
      ],
    });
    const pub = projectKnowledgeObject(ko);
    expect(pub.exercises).toHaveLength(1);
    expect(pub.exercises[0]).not.toHaveProperty("solution");
    expect(pub.exercises[0].prompt).toBe("Q?");
  });

  it("projects all and only the public fields", () => {
    const ko = makeKO({
      title: "X",
      description: "Y",
      domain: "Forest",
      concepts: [{ name: "C", description: "D", difficulty: "beginner" }],
      definitions: [{ term: "T", definition: "Def" }],
      examples: [{ title: "E", description: "ED" }],
    });
    const pub = projectKnowledgeObject(ko);
    expect(pub.id).toBe(ko.id);
    expect(pub.title).toBe("X");
    expect(pub.description).toBe("Y");
    expect(pub.domain).toBe("Forest");
    expect(pub.concepts[0].name).toBe("C");
    expect(pub.definitions[0].term).toBe("T");
    expect(pub.examples[0].title).toBe("E");
    expect(pub.publishedAt).toBe(ko.updatedAt);
  });

  it("projectKnowledgeObjects maps correctly", () => {
    const out = projectKnowledgeObjects([makeKO({ id: "a" }), makeKO({ id: "b" })]);
    expect(out).toHaveLength(2);
    expect(out[0].id).toBe("a");
    expect(out[1].id).toBe("b");
  });

  it("handles missing optional arrays without throwing", () => {
    const ko = makeKO({
      concepts: undefined as unknown as KnowledgeObject["concepts"],
      definitions: undefined as unknown as KnowledgeObject["definitions"],
      examples: undefined as unknown as KnowledgeObject["examples"],
      exercises: undefined as unknown as KnowledgeObject["exercises"],
    });
    expect(() => projectKnowledgeObject(ko)).not.toThrow();
  });
});

describe("Public Projection — eligibility matrix (Phase I guard)", () => {
  // Mirrors the filter used in knowledge/stats route and public-projection helpers:
  //   status === 'published' && provenance === 'institutional'
  function isPublicKO(ko: KnowledgeObject): boolean {
    const status = (ko.status as string) || "draft";
    const provenance = (ko.provenance as string) || "institutional";
    return status === "published" && provenance === "institutional";
  }

  const combos: Array<[KnowledgeObject["provenance"], KnowledgeObject["status"], boolean]> = [
    ["institutional", "published", true],
    ["institutional", "draft", false],
    ["test-seed", "published", false],
    ["test-seed", "draft", false],
  ];

  for (const [prov, status, eligible] of combos) {
    it(`${prov} + ${status} → ${eligible ? "eligible" : "ineligible"}`, () => {
      const ko = makeKO({ provenance: prov, status });
      expect(isPublicKO(ko)).toBe(eligible);
    });
  }

  it("published imported KO is also ineligible (never leaks)", () => {
    const ko = makeKO({ provenance: "imported" as unknown as KnowledgeObject["provenance"], status: "published" });
    expect(isPublicKO(ko)).toBe(false);
  });
});

describe("Public Projection — mentors", () => {
  it("strips systemPrompt", () => {
    const pub = projectMentorAgent({
      id: "m1",
      name: "Mentor",
      description: "d",
      specialties: ["AI"],
      personality: "kind",
      systemPrompt: "SECRET PROMPT",
    });
    expect(pub).not.toHaveProperty("systemPrompt");
    expect(pub.id).toBe("m1");
    expect(pub.specialties).toEqual(["AI"]);
  });

  it("projectMentorAgents maps", () => {
    const out = projectMentorAgents([
      { id: "a", name: "A" },
      { id: "b", name: "B", systemPrompt: "hidden" },
    ]);
    expect(out).toHaveLength(2);
    expect(out[1]).not.toHaveProperty("systemPrompt");
  });
});

describe("Public Projection — lessons", () => {
  it("strips assessment / teacherGuide / workbook", () => {
    const pub = projectLesson({
      id: "l1",
      courseId: "c1",
      title: "L1",
      subject: "AI",
      grade: 9,
      duration: 30,
      status: "published",
      learningOutcomes: ["a"],
      sections: [{ title: "S", content: "C", type: "reading" }],
      assessment: { secret: 1 },
      teacherGuide: { secret: 2 },
      workbook: { secret: 3 },
      publishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as Parameters<typeof projectLesson>[0]);
    expect(pub).not.toHaveProperty("assessment");
    expect(pub).not.toHaveProperty("teacherGuide");
    expect(pub).not.toHaveProperty("workbook");
    expect(pub.sections).toHaveLength(1);
  });

  it("projectLessons maps", () => {
    const make = (id: string) =>
      ({
        id,
        courseId: "c1",
        title: id,
        subject: "AI",
        grade: 9,
        duration: 10,
        status: "published",
        learningOutcomes: [],
        sections: [],
        assessment: null,
        teacherGuide: null,
        workbook: null,
        publishedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }) as unknown as Parameters<typeof projectLesson>[0];
    const out = projectLessons([make("a"), make("b")]);
    expect(out).toHaveLength(2);
    expect(out[0].id).toBe("a");
  });
});

describe("Data-Truth invariants (Phase K guard)", () => {
  it("canonical course count is 10 published", () => {
    expect(courses.filter((c) => c.status === "published").length).toBe(10);
    expect(courses).toHaveLength(10);
  });

  it("lesson content count is 87", () => {
    expect(Object.keys(lessonContents)).toHaveLength(87);
  });

  it("flagship path length stays the source of truth for 'stages' stat", () => {
    // Guards the learning-paths fix: hardcoded '8' replaced by flagshipPath.length
    expect(flagshipPath.length).toBe(8);
    // Every stage must have a courseId that resolves
    const ids = new Set(courses.map((c) => c.id));
    for (const s of flagshipPath) {
      expect(s.courseId, `stage ${s.id} missing courseId`).toBeTruthy();
      expect(ids.has(s.courseId!), `stage ${s.id} courseId ${s.courseId} not in courses`).toBe(true);
    }
  });

  it("no duplicate lesson IDs across courses (curriculum graph)", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const c of courses) for (const m of c.modules) for (const l of m.lessons) {
      if (seen.has(l.id)) dupes.push(l.id);
      seen.add(l.id);
    }
    expect(dupes).toEqual([]);
    // Must match total lessonContents keys
    expect(seen.size).toBe(Object.keys(lessonContents).length);
  });
});
