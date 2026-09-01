/**
 * AI Institute — Student Data Store
 *
 * All persistence goes through repository interfaces.
 * No direct database access.
 */

import { initDatabase } from "./db";
import { getStudentRepository, getProgressRepository } from "./repositories";

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "student" | "researcher" | "builder" | "mentor" | "volunteer" | "donor" | "educator";
  interests: string[];
  currentCourse: string;
  currentLessonIndex: number;
  lessonsCompleted: string[];
  assessmentScore: number;
  assessmentCompleted: boolean;
  labTasksCompleted: string[];
  labScore: number;
  knowledgeCheckAnswers: Record<string, string | number>;
  knowledgeCheckScore: number;
  projectSubmitted: boolean;
  projectScore: number;
  badgeEarned: boolean;
  reflectionEntries: { lessonId: string; content: string; date: string }[];
  streak: number;
  lastActiveDate: string;
  onboardingComplete: boolean;
  enrolledCourses: string[];
  enrolledAt: string;
  updatedAt: string;
}

async function ensureDb(): Promise<void> {
  await initDatabase();
}

export async function getStudentByUserId(userId: string): Promise<StudentProfile | null> {
  await ensureDb();
  const repo = getStudentRepository();
  return repo.findByUserId(userId) as unknown as StudentProfile | null;
}

export async function createStudent(data: {
  userId: string;
  name: string;
  email: string;
  role: StudentProfile["role"];
  interests: string[];
}): Promise<StudentProfile> {
  await ensureDb();
  const repo = getStudentRepository();
  return repo.create(data) as unknown as StudentProfile;
}

export async function updateStudent(
  userId: string,
  data: Partial<StudentProfile>,
): Promise<StudentProfile | null> {
  await ensureDb();
  const repo = getStudentRepository();
  return repo.update(userId, data) as unknown as StudentProfile | null;
}

export async function completeLesson(
  userId: string,
  lessonId: string,
): Promise<StudentProfile | null> {
  await ensureDb();
  const progressRepo = getProgressRepository();
  return progressRepo.completeLesson(userId, lessonId) as unknown as StudentProfile | null;
}
