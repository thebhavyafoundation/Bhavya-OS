/**
 * Bhavya Academy ↔ Experience AI relationship rows.
 *
 * HAND-AUTHORED MAPPING (not generated): a small set of defensible links
 * between Source A lessons and Source B packs. Row shapes mirror
 * ResourceRelationship in @bhavya/shared (kept local to avoid a new
 * workspace dependency; see ADR-014).
 *
 * Rules: mapping only — both endpoints stay independently identifiable.
 * No Source B bodies here, only pack slugs. Add rows only with a
 * defensible pedagogical reason, never speculatively for every lesson.
 *
 * @module source-relationships
 */

export type RelationshipKind =
  | "prerequisite"
  | "enrichment"
  | "equivalent"
  | "reference";

export interface LessonResourceRelationship {
  readonly id: string;
  /** Source A lesson id, e.g. "found-1-1". */
  readonly lessonId: string;
  /** Source B pack slug, e.g. "module-1-lesson-1-what-is-ai-en-US". */
  readonly packSlug: string;
  readonly kind: RelationshipKind;
  readonly note: string;
}

export const lessonResourceRelationships: readonly LessonResourceRelationship[] =
  [
    {
      id: "rel-found-1-1-m1-l1",
      lessonId: "found-1-1",
      packSlug: "module-1-lesson-1-what-is-ai-en-US",
      kind: "equivalent",
      note: "Both introduce what AI is; the external pack adds classroom activities.",
    },
    {
      id: "rel-found-1-2-m1-l2",
      lessonId: "found-1-2",
      packSlug: "module-1-lesson-2-machine-learning-en-US",
      kind: "equivalent",
      note: "Both cover how machines learn; the external pack adds the intelligent-paper exercise.",
    },
    {
      id: "rel-found-1-3-l1-what-is-ai",
      lessonId: "found-1-3",
      packSlug: "lesson-1-what-is-ai-en-US",
      kind: "reference",
      note: "Survey of AI system types from a second pedagogical angle.",
    },
    {
      id: "rel-found-2-1-llms",
      lessonId: "found-2-1",
      packSlug: "large-language-models-llms-11-14-en-US",
      kind: "enrichment",
      note: "Deepens language models with the Blah model-card activity.",
    },
    {
      id: "rel-llm-3-3-m2-l5",
      lessonId: "llm-3-3",
      packSlug: "module-2-lesson-5-model-cards-and-careers-en-US",
      kind: "reference",
      note: "Model-card practice context for the bias-audit and model-card exercises.",
    },
  ];

export function getRelationshipsForLesson(
  lessonId: string,
): LessonResourceRelationship[] {
  return lessonResourceRelationships.filter((r) => r.lessonId === lessonId);
}
