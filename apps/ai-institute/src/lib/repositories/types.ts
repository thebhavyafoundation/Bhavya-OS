export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  provider: string;
  interests: string[];
  onboardingComplete: boolean;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
  role?: string;
  provider?: string;
}

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

export interface CreateStudentInput {
  userId: string;
  name: string;
  email: string;
  role: StudentProfile["role"];
  interests: string[];
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  updateRole(userId: string, role: string): Promise<User | null>;
}

export interface StudentRepository {
  findByUserId(userId: string): Promise<StudentProfile | null>;
  create(data: CreateStudentInput): Promise<StudentProfile>;
  update(userId: string, data: Partial<StudentProfile>): Promise<StudentProfile | null>;
}

export interface ProgressRepository {
  completeLesson(userId: string, lessonId: string): Promise<StudentProfile | null>;
  completeLab(userId: string, taskId: string): Promise<StudentProfile | null>;
  submitQuiz(userId: string, answers: Record<string, string | number>, score: number): Promise<StudentProfile | null>;
  submitProject(userId: string, score: number): Promise<StudentProfile | null>;
  enroll(userId: string, courseId: string): Promise<StudentProfile | null>;
  addReflection(userId: string, lessonId: string, content: string): Promise<StudentProfile | null>;
}

export interface SessionRepository {
  create(userId: string): Promise<{ token: string; expiresAt: string }>;
  findByToken(token: string): Promise<{ userId: string; expiresAt: string } | null>;
  delete(token: string): Promise<void>;
}
