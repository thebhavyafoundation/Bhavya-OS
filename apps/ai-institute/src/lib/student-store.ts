/**
 * AI Institute — Student Data Store
 *
 * File-based persistence for student profiles, progress, and enrollment.
 * Production should use a database adapter.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "student" | "researcher" | "builder" | "mentor";
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
  enrolledAt: string;
  updatedAt: string;
}

const DB_DIR = "bhavya-ai-lab/data";
const DB_FILE = `${DB_DIR}/students.json`;

function ensureDir(): void {
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }
}

function loadStudents(): StudentProfile[] {
  ensureDir();
  if (!existsSync(DB_FILE)) return [];
  try {
    return JSON.parse(readFileSync(DB_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveStudents(students: StudentProfile[]): void {
  ensureDir();
  writeFileSync(DB_FILE, JSON.stringify(students, null, 2));
}

export function getStudentByUserId(userId: string): StudentProfile | null {
  const students = loadStudents();
  return students.find((s) => s.userId === userId) ?? null;
}

export function createStudent(data: {
  userId: string;
  name: string;
  email: string;
  role: StudentProfile["role"];
  interests: string[];
}): StudentProfile {
  const students = loadStudents();
  const existing = students.find((s) => s.userId === data.userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const student: StudentProfile = {
    id: `stu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    userId: data.userId,
    name: data.name,
    email: data.email,
    role: data.role,
    interests: data.interests,
    currentCourse: "ai-foundations",
    currentLessonIndex: 0,
    lessonsCompleted: [],
    assessmentScore: 0,
    assessmentCompleted: false,
    labTasksCompleted: [],
    labScore: 0,
    knowledgeCheckAnswers: {},
    knowledgeCheckScore: 0,
    projectSubmitted: false,
    projectScore: 0,
    badgeEarned: false,
    reflectionEntries: [],
    streak: 0,
    lastActiveDate: "",
    onboardingComplete: true,
    enrolledAt: now,
    updatedAt: now,
  };

  students.push(student);
  saveStudents(students);
  return student;
}

export function updateStudent(
  userId: string,
  data: Partial<StudentProfile>,
): StudentProfile | null {
  const students = loadStudents();
  const idx = students.findIndex((s) => s.userId === userId);
  if (idx === -1) return null;

  students[idx] = {
    ...students[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveStudents(students);
  return students[idx];
}

export function listStudents(options?: {
  limit?: number;
  offset?: number;
}): StudentProfile[] {
  const students = loadStudents();
  const start = options?.offset ?? 0;
  const end = options?.limit ? start + options.limit : undefined;
  return students.slice(start, end);
}

export function completeLesson(
  userId: string,
  lessonId: string,
): StudentProfile | null {
  const student = getStudentByUserId(userId);
  if (!student) return null;

  const completed = student.lessonsCompleted.includes(lessonId)
    ? student.lessonsCompleted
    : [...student.lessonsCompleted, lessonId];

  return updateStudent(userId, {
    lessonsCompleted: completed,
    currentLessonIndex: student.currentLessonIndex + 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
    streak: calculateStreak(student),
  });
}

function calculateStreak(student: StudentProfile): number {
  const today = new Date().toISOString().split("T")[0];
  const lastActive = student.lastActiveDate;
  if (!lastActive) return 1;

  const lastDate = new Date(lastActive);
  const todayDate = new Date(today);
  const diffDays = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return student.streak;
  if (diffDays === 1) return student.streak + 1;
  return 1;
}
