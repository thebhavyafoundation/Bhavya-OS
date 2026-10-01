import { LESSONS } from "@/data/curriculum/lesson-registry";
import type { Lesson } from "@/types/curriculum";

export function getAllLessons(): readonly Lesson[] {
  return LESSONS;
}

export function getLessonsForModule(moduleId: string): readonly Lesson[] {
  return LESSONS.filter((lesson) => lesson.moduleId === moduleId);
}

export function getLesson(
  moduleId: string,
  lessonId: string,
): Lesson | undefined {
  return LESSONS.find(
    (lesson) => lesson.moduleId === moduleId && lesson.id === lessonId,
  );
}
