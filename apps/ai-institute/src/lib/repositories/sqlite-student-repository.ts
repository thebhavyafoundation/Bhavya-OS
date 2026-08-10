import { getDatabase } from "../sqlite";
import type { StudentProfile, CreateStudentInput, StudentRepository } from "./types";

function generateId(): string {
  return `stu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function rowToStudent(row: Record<string, unknown>): StudentProfile {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as StudentProfile["role"],
    interests: JSON.parse((row.interests as string) ?? "[]"),
    currentCourse: row.current_course as string,
    currentLessonIndex: row.current_lesson_index as number,
    lessonsCompleted: JSON.parse((row.lessons_completed as string) ?? "[]"),
    assessmentScore: row.assessment_score as number,
    assessmentCompleted: (row.assessment_completed as number) === 1,
    labTasksCompleted: JSON.parse((row.lab_tasks_completed as string) ?? "[]"),
    labScore: row.lab_score as number,
    knowledgeCheckAnswers: JSON.parse((row.knowledge_check_answers as string) ?? "{}"),
    knowledgeCheckScore: row.knowledge_check_score as number,
    projectSubmitted: (row.project_submitted as number) === 1,
    projectScore: row.project_score as number,
    badgeEarned: (row.badge_earned as number) === 1,
    reflectionEntries: JSON.parse((row.reflection_entries as string) ?? "[]"),
    streak: row.streak as number,
    lastActiveDate: row.last_active_date as string,
    onboardingComplete: (row.onboarding_complete as number) === 1,
    enrolledCourses: JSON.parse((row.enrolled_courses as string) ?? "[]"),
    enrolledAt: row.enrolled_at as string,
    updatedAt: row.updated_at as string,
  };
}

function studentToRow(id: string, data: Partial<StudentProfile>): Record<string, unknown> {
  const row: Record<string, unknown> = { id };
  if (data.userId !== undefined) row.user_id = data.userId;
  if (data.name !== undefined) row.name = data.name;
  if (data.email !== undefined) row.email = data.email;
  if (data.role !== undefined) row.role = data.role;
  if (data.interests !== undefined) row.interests = JSON.stringify(data.interests);
  if (data.currentCourse !== undefined) row.current_course = data.currentCourse;
  if (data.currentLessonIndex !== undefined) row.current_lesson_index = data.currentLessonIndex;
  if (data.lessonsCompleted !== undefined) row.lessons_completed = JSON.stringify(data.lessonsCompleted);
  if (data.assessmentScore !== undefined) row.assessment_score = data.assessmentScore;
  if (data.assessmentCompleted !== undefined) row.assessment_completed = data.assessmentCompleted ? 1 : 0;
  if (data.labTasksCompleted !== undefined) row.lab_tasks_completed = JSON.stringify(data.labTasksCompleted);
  if (data.labScore !== undefined) row.lab_score = data.labScore;
  if (data.knowledgeCheckAnswers !== undefined) row.knowledge_check_answers = JSON.stringify(data.knowledgeCheckAnswers);
  if (data.knowledgeCheckScore !== undefined) row.knowledge_check_score = data.knowledgeCheckScore;
  if (data.projectSubmitted !== undefined) row.project_submitted = data.projectSubmitted ? 1 : 0;
  if (data.projectScore !== undefined) row.project_score = data.projectScore;
  if (data.badgeEarned !== undefined) row.badge_earned = data.badgeEarned ? 1 : 0;
  if (data.reflectionEntries !== undefined) row.reflection_entries = JSON.stringify(data.reflectionEntries);
  if (data.streak !== undefined) row.streak = data.streak;
  if (data.lastActiveDate !== undefined) row.last_active_date = data.lastActiveDate;
  if (data.onboardingComplete !== undefined) row.onboarding_complete = data.onboardingComplete ? 1 : 0;
  if (data.enrolledCourses !== undefined) row.enrolled_courses = JSON.stringify(data.enrolledCourses);
  if (data.enrolledAt !== undefined) row.enrolled_at = data.enrolledAt;
  if (data.updatedAt !== undefined) row.updated_at = data.updatedAt;
  return row;
}

export class SqliteStudentRepository implements StudentRepository {
  async findByUserId(userId: string): Promise<StudentProfile | null> {
    const db = getDatabase({ path: "" });
    const row = db
      .prepare("SELECT * FROM student_profiles WHERE user_id = ?")
      .get(userId) as Record<string, unknown> | undefined;
    return row ? rowToStudent(row) : null;
  }

  async create(data: CreateStudentInput): Promise<StudentProfile> {
    const db = getDatabase({ path: "" });
    const existing = await this.findByUserId(data.userId);
    if (existing) return existing;

    const now = new Date().toISOString();
    const id = generateId();

    db.prepare(
      `INSERT INTO student_profiles (id, user_id, name, email, role, interests, current_course, current_lesson_index, lessons_completed, assessment_score, assessment_completed, lab_tasks_completed, lab_score, knowledge_check_answers, knowledge_check_score, project_submitted, project_score, badge_earned, reflection_entries, streak, last_active_date, onboarding_complete, enrolled_courses, enrolled_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      data.userId,
      data.name,
      data.email,
      data.role,
      JSON.stringify(data.interests),
      "ai-foundations",
      0,
      "[]",
      0,
      0,
      "[]",
      0,
      "{}",
      0,
      0,
      0,
      0,
      "[]",
      0,
      "",
      1,
      "[]",
      now,
      now,
    );

    return this.findByUserId(data.userId) as Promise<StudentProfile>;
  }

  async update(userId: string, data: Partial<StudentProfile>): Promise<StudentProfile | null> {
    const db = getDatabase({ path: "" });
    const existing = await this.findByUserId(userId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const row = studentToRow(existing.id, { ...data, updatedAt: now });
    const cols = Object.keys(row).filter((k) => k !== "id");
    const sets = cols.map((c) => `${c} = ?`).join(", ");
    const vals = cols.map((c) => row[c]);
    vals.push(existing.id);

    db.prepare(`UPDATE student_profiles SET ${sets} WHERE id = ?`).run(...vals);
    return this.findByUserId(userId);
  }
}
