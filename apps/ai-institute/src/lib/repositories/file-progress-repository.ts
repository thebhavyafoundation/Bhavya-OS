import type { ProgressRepository, StudentProfile } from "./types";
import { FileStudentRepository } from "./file-student-repository";

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

export class FileProgressRepository implements ProgressRepository {
  private studentRepo = new FileStudentRepository();

  async completeLesson(userId: string, lessonId: string): Promise<StudentProfile | null> {
    const student = await this.studentRepo.findByUserId(userId);
    if (!student) return null;

    const completed = student.lessonsCompleted.includes(lessonId)
      ? student.lessonsCompleted
      : [...student.lessonsCompleted, lessonId];

    return this.studentRepo.update(userId, {
      lessonsCompleted: completed,
      currentLessonIndex: student.currentLessonIndex + 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      streak: calculateStreak(student),
    });
  }

  async completeLab(userId: string, taskId: string): Promise<StudentProfile | null> {
    const student = await this.studentRepo.findByUserId(userId);
    if (!student) return null;

    const completed = student.labTasksCompleted.includes(taskId)
      ? student.labTasksCompleted
      : [...student.labTasksCompleted, taskId];

    return this.studentRepo.update(userId, {
      labTasksCompleted: completed,
      labScore: Math.round(((completed.length / 5) * 100)),
      lastActiveDate: new Date().toISOString().split("T")[0],
    });
  }

  async submitQuiz(
    userId: string,
    answers: Record<string, string | number>,
    score: number,
  ): Promise<StudentProfile | null> {
    return this.studentRepo.update(userId, {
      knowledgeCheckAnswers: answers,
      knowledgeCheckScore: score,
      lastActiveDate: new Date().toISOString().split("T")[0],
    });
  }

  async submitProject(userId: string, score: number): Promise<StudentProfile | null> {
    const updates: Partial<StudentProfile> = {
      projectSubmitted: true,
      projectScore: score,
      lastActiveDate: new Date().toISOString().split("T")[0],
    };

    if (score >= 80) {
      updates.badgeEarned = true;
    }

    return this.studentRepo.update(userId, updates);
  }

  async enroll(userId: string, courseId: string): Promise<StudentProfile | null> {
    const student = await this.studentRepo.findByUserId(userId);
    if (!student) return null;

    const enrolled = student.enrolledCourses.includes(courseId)
      ? student.enrolledCourses
      : [...student.enrolledCourses, courseId];

    return this.studentRepo.update(userId, {
      enrolledCourses: enrolled,
      currentCourse: courseId,
    });
  }

  async addReflection(
    userId: string,
    lessonId: string,
    content: string,
  ): Promise<StudentProfile | null> {
    const student = await this.studentRepo.findByUserId(userId);
    if (!student) return null;

    const entry = {
      lessonId,
      content,
      date: new Date().toISOString(),
    };

    return this.studentRepo.update(userId, {
      reflectionEntries: [...student.reflectionEntries, entry],
    });
  }
}
