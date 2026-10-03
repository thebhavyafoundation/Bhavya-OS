// Empty lesson registry — populated by Task 13 (P5 content).
// Exports the registration function for Task 13 to use.
import type { Lesson } from "@/data/curriculum";

const registry: Lesson[] = [];

export function getLessons(moduleId: string): Lesson[] {
  return registry
    .filter((l) => l.moduleId === moduleId)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getLesson(
  moduleId: string,
  lessonId: string,
): Lesson | undefined {
  return registry.find((l) => l.moduleId === moduleId && l.id === lessonId);
}

export function getAllCurriculumLessonIds(): string[] {
  return registry.map((l) => `${l.moduleId}:${l.id}`);
}

// Called by Task 13 content files to register lessons
export function registerLessons(lessons: Lesson[]): void {
  registry.push(...lessons);
}
