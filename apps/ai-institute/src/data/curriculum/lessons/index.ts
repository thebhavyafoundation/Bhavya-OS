/**
 * Lesson registry — re-export of the single implementation.
 *
 * This file previously held a second, empty `Map` that was a near-identical
 * copy of `lib/curriculum/lessons.ts`. Both exposed the same six functions,
 * neither was populated by anything outside a test, and the curriculum lesson
 * route imported the empty one — so every lesson page resolved zero lessons
 * while still typechecking.
 *
 * Two copies of a registry is the failure mode: one gets wired, one does not,
 * and nothing tells you which. There is now exactly one implementation, in
 * `lib/curriculum/lessons.ts`, and this module exists only so the
 * `@/data/curriculum/lessons` import path keeps resolving.
 */

export {
  getLessons,
  getLessonsForModule,
  getAllLessons,
  getLesson,
  getAllCurriculumLessonIds,
  registerLesson,
} from "@/lib/curriculum/lessons";

export type {
  Lesson,
  LessonBlock,
  QuizQuestion,
  WidgetSpec,
  DiagramSpec,
  ExperimentBlock,
  ProjectBlock,
} from "@/data/curriculum/types";
