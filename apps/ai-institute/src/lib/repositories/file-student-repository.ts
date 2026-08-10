import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { StudentProfile, CreateStudentInput, StudentRepository } from "./types";

const DB_DIR = join(process.cwd(), "bhavya-ai-lab", "data");
const DB_FILE = join(DB_DIR, "students.json");

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

export class FileStudentRepository implements StudentRepository {
  async findByUserId(userId: string): Promise<StudentProfile | null> {
    const students = loadStudents();
    return students.find((s) => s.userId === userId) ?? null;
  }

  async create(data: CreateStudentInput): Promise<StudentProfile> {
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
      enrolledCourses: [],
      enrolledAt: now,
      updatedAt: now,
    };

    students.push(student);
    saveStudents(students);
    return student;
  }

  async update(userId: string, data: Partial<StudentProfile>): Promise<StudentProfile | null> {
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
}
