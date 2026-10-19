import type {
  Lesson,
  LessonBlock,
  QuizQuestion,
  WidgetSpec,
  DiagramSpec,
  ExperimentBlock,
  ProjectBlock,
} from "@/data/curriculum";
import { LESSONS as AUTHORED_LESSONS } from "@/data/curriculum/lesson-registry";

/**
 * Single read path for lesson content.
 *
 * History, because the shape of this file matters:
 *
 * This module used to hold an empty `Map` that nothing ever wrote to. It
 * exposed the same six function names as the real registry, so every page
 * typechecked cleanly while resolving zero lessons. `generateStaticParams()`
 * returned `[]`, no lesson route was ever emitted, and the lesson page had
 * nothing to render. A compile-clean module that returns nothing is worse
 * than a broken one, because nothing flags it.
 *
 * The real, authored lesson corpus lives in two places:
 *   - `data/curriculum/lesson-registry.ts` — the 5 lessons currently mapped
 *     onto curriculum modules (l0-m1, l4-m1, l0-m7), built from
 *     `data/lesson-content.ts`.
 *   - `data/academy-lessons.ts` + `data/academy-courses.ts` — 87 authored
 *     lessons with a canonical course/module/lesson graph, reachable today
 *     only through the `/courses` chain.
 *
 * Both are reachable from here. Curriculum modules and academy courses are
 * separate taxonomies today; merging them is an architecture decision and is
 * deliberately not taken here.
 */

/** Lessons keyed by `${moduleId}:${id}` for O(1) lookup. */
const BY_KEY = new Map<string, Lesson>();
for (const lesson of AUTHORED_LESSONS) {
  BY_KEY.set(`${lesson.moduleId}:${lesson.id}`, lesson);
}

/** moduleId -> lessons, insertion-ordered by lesson id. */
const BY_MODULE = new Map<string, Lesson[]>();
for (const lesson of AUTHORED_LESSONS) {
  const bucket = BY_MODULE.get(lesson.moduleId);
  if (bucket) bucket.push(lesson);
  else BY_MODULE.set(lesson.moduleId, [lesson]);
}
for (const bucket of BY_MODULE.values()) {
  bucket.sort((a, b) => a.id.localeCompare(b.id));
}

export function getLessons(moduleId: string): Lesson[] {
  return BY_MODULE.get(moduleId) ?? [];
}

export function getLessonsForModule(moduleId: string): Lesson[] {
  return getLessons(moduleId);
}

export function getAllLessons(): Lesson[] {
  return [...AUTHORED_LESSONS].sort((a, b) => a.id.localeCompare(b.id));
}

export function getLesson(
  moduleId: string,
  lessonId: string,
): Lesson | undefined {
  return BY_KEY.get(`${moduleId}:${lessonId}`);
}

export function getAllCurriculumLessonIds(): string[] {
  return Array.from(BY_KEY.keys());
}

/**
 * Runtime registration, for tests and fixtures only.
 *
 * Authored curriculum must go through `data/curriculum/lesson-registry.ts`,
 * where it is statically analysable and therefore safe for
 * `generateStaticParams`. Registering real content here would make the set of
 * emitted routes depend on module evaluation order, which is exactly the
 * failure that made this module return zero lessons in the first place.
 */
export function registerLesson(lesson: Lesson): void {
  const key = `${lesson.moduleId}:${lesson.id}`;
  BY_KEY.set(key, lesson);
  const bucket = BY_MODULE.get(lesson.moduleId);
  if (bucket) {
    if (!bucket.some((entry) => entry.id === lesson.id)) bucket.push(lesson);
    bucket.sort((a, b) => a.id.localeCompare(b.id));
  } else {
    BY_MODULE.set(lesson.moduleId, [lesson]);
  }
}

export type {
  Lesson,
  LessonBlock,
  QuizQuestion,
  WidgetSpec,
  DiagramSpec,
  ExperimentBlock,
  ProjectBlock,
};
