"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import {
  BookOpen,
  FlaskConical,
  FolderOpen,
  Network,
  Flame,
  Trophy,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { getCourseById } from "@/data/academy-courses";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function DashboardPage() {
  const { user, student, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return (
      <>
        <SiteHeader />
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-4">
              Your Learning Dashboard
            </h1>
            <p className="text-sm text-text-tertiary mb-8 max-w-md mx-auto">
              Sign in to access your courses, track progress, and continue your
              AI learning journey.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-gold text-text-primary text-sm font-semibold hover:bg-accent-gold/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </motion.div>
        </div>
        <SiteFooter />
      </>
    );
  }

  const course = getCourseById("ai-foundations");
  const allLessons = course?.modules.flatMap((m) => m.lessons) ?? [];
  const totalLessons = allLessons.length;
  const completedLessons = student?.lessonsCompleted.length || 0;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const currentLessonIdx = student?.currentLessonIndex || 0;
  const currentLesson =
    allLessons[Math.min(currentLessonIdx, totalLessons - 1)];

  return (
    <>
      <SiteHeader />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-sm text-text-tertiary">
            {student?.enrolledCourses.length
              ? "Pick up where you left off"
              : "Start your AI learning journey"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!student?.enrolledCourses.length ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-border-primary bg-bg-secondary p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-gold/20 to-accent-earth/20 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-accent-gold" />
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">
                  Start Your First Course
                </h2>
                <p className="text-sm text-text-tertiary mb-6 max-w-sm mx-auto">
                  Enroll in AI Foundations to begin learning. You&apos;ll
                  explore what AI is, how it learns, and build your first AI
                  project.
                </p>
                <Link
                  href={
                    allLessons.length > 0
                      ? `/courses/ai-foundations/lessons/${allLessons[0].id}`
                      : "/courses/ai-foundations"
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-gold text-text-primary text-sm font-semibold hover:bg-accent-gold/90 transition-colors"
                >
                  Begin AI Foundations
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border-primary bg-bg-secondary p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-text-primary">
                        {currentLesson.title}
                      </h2>
                      <p className="text-sm text-text-tertiary mt-1">
                        Lesson {currentLesson.order} in AI Foundations
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <BookOpen className="w-3.5 h-3.5" />
                      {currentLesson.duration} min
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded-md bg-bg-tertiary/30 text-accent-green-light text-[10px] font-semibold uppercase">
                      Lesson {currentLesson.order}
                    </span>
                  </div>
                  <Link
                    href={
                      currentLesson
                        ? `/courses/ai-foundations/lessons/${currentLesson.id}`
                        : "/courses/ai-foundations"
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-gold text-text-primary text-sm font-semibold hover:bg-accent-gold/90 transition-colors"
                  >
                    Continue Learning
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-border-primary bg-bg-secondary p-6"
                >
                  <h3 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">
                    Your Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-text-tertiary">Overall</span>
                        <span className="text-accent-gold font-mono">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="h-2 bg-bg-tertiary/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-bg-tertiary to-accent-gold rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-text-tertiary">Lessons</span>
                        <span className="text-accent-green-light font-mono">
                          {completedLessons} / {totalLessons}
                        </span>
                      </div>
                      <div className="h-2 bg-bg-tertiary/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4ade80] rounded-full transition-all"
                          style={{
                            width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border-primary bg-bg-secondary p-6"
                >
                  <h3 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">
                    Module Outline
                  </h3>
                  <div className="space-y-2">
                    {course?.modules.map((mod) =>
                      mod.lessons.map((lesson, i) => {
                        const isCompleted = student?.lessonsCompleted.includes(
                          lesson.id,
                        );
                        const isCurrent =
                          allLessons.findIndex((l) => l.id === lesson.id) ===
                          currentLessonIdx;
                        return (
                          <Link
                            key={lesson.id}
                            href={`/courses/ai-foundations/lessons/${lesson.id}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-tertiary/20 transition-colors group"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                                isCompleted
                                  ? "bg-accent-green/20 text-accent-green-light border border-accent-green/40"
                                  : isCurrent
                                    ? "bg-accent-gold/20 text-accent-gold border border-accent-gold/40"
                                    : "border border-border-primary text-text-tertiary group-hover:border-accent-gold/40"
                              }`}
                            >
                              {isCompleted ? "✓" : lesson.order}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-text-primary truncate">
                                {lesson.title}
                              </div>
                              <div className="text-[10px] text-text-tertiary">
                                {lesson.duration} min · {mod.title}
                              </div>
                            </div>
                          </Link>
                        );
                      }),
                    )}
                    <Link
                      href="/courses/ai-foundations"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-tertiary/20 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full border border-border-primary flex items-center justify-center group-hover:border-accent-gold/40 transition-colors">
                        <FolderOpen className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary">
                          View Full Course
                        </div>
                        <div className="text-[10px] text-text-tertiary">
                          {totalLessons} lessons · {course?.modules.length}{" "}
                          modules
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border-primary bg-bg-secondary p-6"
            >
              <h3 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">
                Achievements
              </h3>
              {student?.badgeEarned ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-gold/10 border border-[#c9a227]/25">
                  <Trophy className="w-8 h-8 text-accent-gold" />
                  <div>
                    <div className="text-sm text-accent-gold font-semibold">
                      Foundation Explorer
                    </div>
                    <div className="text-[10px] text-text-tertiary">
                      Completed the AI Foundations project
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-tertiary/15 border border-border-primary/25">
                  <Trophy className="w-8 h-8 text-text-tertiary/40" />
                  <div>
                    <div className="text-sm text-text-tertiary/60">
                      No badges yet
                    </div>
                    <div className="text-[10px] text-text-tertiary/40">
                      Complete lessons to earn achievements
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border-primary bg-bg-secondary p-6"
            >
              <h3 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">
                Learning Streak
              </h3>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-tertiary/15 border border-border-primary/25">
                <Flame className="w-8 h-8 text-accent-gold" />
                <div>
                  <div className="text-2xl font-bold text-text-primary">
                    {student?.streak || 0} day
                    {(student?.streak || 0) !== 1 ? "s" : ""}
                  </div>
                  <div className="text-[10px] text-text-tertiary">
                    {(student?.streak || 0) === 0
                      ? "Complete a lesson to start your streak"
                      : "Keep learning to maintain your streak"}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-border-primary bg-bg-secondary p-6"
            >
              <h3 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href={
                    allLessons.length > 0
                      ? `/courses/ai-foundations/lessons/${allLessons[0].id}`
                      : "/courses"
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-tertiary/15 border border-border-primary/25 text-sm text-text-tertiary hover:bg-bg-tertiary/25 hover:text-text-primary transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  {student?.enrolledCourses.length
                    ? "Continue Lesson"
                    : "Start Learning"}
                </Link>
                <Link
                  href="/mentor"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-tertiary/15 border border-border-primary/25 text-sm text-text-tertiary hover:bg-bg-tertiary/25 hover:text-text-primary transition-all"
                >
                  <FlaskConical className="w-4 h-4" />
                  Ask a Mentor
                </Link>
                <Link
                  href="/knowledge-graph"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-tertiary/15 border border-border-primary/25 text-sm text-text-tertiary hover:bg-bg-tertiary/25 hover:text-text-primary transition-all"
                >
                  <Network className="w-4 h-4" />
                  Knowledge Graph
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
