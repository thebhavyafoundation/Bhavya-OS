// Lesson Registry — populated by P5 content task
// This module exports registration functions and a populate function.
// The actual lesson data is defined in lesson-content.ts to avoid circular imports.

import type {
  Lesson,
  LessonBlock,
  QuizQuestion,
  WidgetSpec,
  DiagramSpec,
  ExperimentBlock,
  ProjectBlock,
} from "@/data/curriculum";

const LESSON_REGISTRY: Map<string, Lesson> = new Map();

export function getLessons(moduleId: string): Lesson[] {
  const lessons: Lesson[] = [];
  for (const lesson of LESSON_REGISTRY.values()) {
    if (lesson.moduleId === moduleId) lessons.push(lesson);
  }
  return lessons.sort((a, b) => a.id.localeCompare(b.id));
}

export function getLessonsForModule(moduleId: string): Lesson[] {
  return getLessons(moduleId);
}

export function getAllLessons(): Lesson[] {
  return Array.from(LESSON_REGISTRY.values()).sort((a, b) =>
    a.id.localeCompare(b.id),
  );
}

export function getLesson(
  moduleId: string,
  lessonId: string,
): Lesson | undefined {
  return LESSON_REGISTRY.get(`${moduleId}:${lessonId}`);
}

export function getAllCurriculumLessonIds(): string[] {
  return Array.from(LESSON_REGISTRY.keys());
}

export function registerLesson(lesson: Lesson): void {
  LESSON_REGISTRY.set(`${lesson.moduleId}:${lesson.id}`, lesson);
}

// Re-export types
export type {
  Lesson,
  LessonBlock,
  QuizQuestion,
  WidgetSpec,
  DiagramSpec,
  ExperimentBlock,
  ProjectBlock,
};
