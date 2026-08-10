"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  provider: string;
  interests: string[];
  onboardingComplete: boolean;
  createdAt: string;
}

interface StudentProfile {
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
  enrolledCourses: string[];
  onboardingComplete: boolean;
  enrolledAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  student: StudentProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updateStudent: (data: Partial<StudentProfile>) => void;
  enrollInCourse: (courseId: string) => void;
  completeLesson: (lessonId: string) => void;
  completeLab: (taskId: string) => void;
  submitQuiz: (
    answers: Record<string, string | number>,
    score: number,
  ) => void;
  submitProject: (score: number) => void;
  addReflection: (lessonId: string, content: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setStudent(data.student);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error };
      }

      setUser(data.user);

      const studentRes = await fetch("/api/student");
      if (studentRes.ok) {
        const studentData = await studentRes.json();
        setStudent(studentData.student);
      }

      return { success: true };
    },
    [],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<{ success: boolean; error?: string }> => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error };
      }

      setUser(data.user);

      const studentRes = await fetch("/api/student");
      if (studentRes.ok) {
        const studentData = await studentRes.json();
        setStudent(studentData.student);
      }

      return { success: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setStudent(null);
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      setUser(updated);

      if (student) {
        const studentRes = await fetch("/api/student", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: updated.name, email: updated.email, interests: updated.interests }),
        });
        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setStudent(studentData.student);
        }
      }
    },
    [user, student],
  );

  const updateStudent = useCallback(
    async (data: Partial<StudentProfile>) => {
      if (!student) return;
      const res = await fetch("/api/student", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const studentData = await res.json();
        setStudent(studentData.student);
      }
    },
    [student],
  );

  const enrollInCourse = useCallback(
    async (courseId: string) => {
      if (!student) return;
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enroll", data: { courseId } }),
      });
      if (res.ok) {
        const studentData = await res.json();
        setStudent(studentData.student);
      }
    },
    [student],
  );

  const completeLesson = useCallback(
    async (lessonId: string) => {
      if (!student) return;
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "completeLesson", data: { lessonId } }),
      });
      if (res.ok) {
        const studentData = await res.json();
        setStudent(studentData.student);
      }
    },
    [student],
  );

  const completeLab = useCallback(
    async (taskId: string) => {
      if (!student) return;
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "completeLab", data: { taskId } }),
      });
      if (res.ok) {
        const studentData = await res.json();
        setStudent(studentData.student);
      }
    },
    [student],
  );

  const submitQuiz = useCallback(
    async (answers: Record<string, string | number>, score: number) => {
      if (!student) return;
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submitQuiz", data: { answers, score } }),
      });
      if (res.ok) {
        const studentData = await res.json();
        setStudent(studentData.student);
      }
    },
    [student],
  );

  const submitProject = useCallback(
    async (score: number) => {
      if (!student) return;
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submitProject", data: { score } }),
      });
      if (res.ok) {
        const studentData = await res.json();
        setStudent(studentData.student);
      }
    },
    [student],
  );

  const addReflection = useCallback(
    async (lessonId: string, content: string) => {
      if (!student) return;
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addReflection", data: { lessonId, content } }),
      });
      if (res.ok) {
        const studentData = await res.json();
        setStudent(studentData.student);
      }
    },
    [student],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        updateStudent,
        enrollInCourse,
        completeLesson,
        completeLab,
        submitQuiz,
        submitProject,
        addReflection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
