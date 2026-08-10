"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import {
  BookOpen,
  FlaskConical,
  FolderOpen,
  BarChart3,
  Network,
  Flame,
  Trophy,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { foundationCourse } from "@/data/course";

export default function DashboardPage() {
  const { user, student, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <h1 className="text-3xl font-bold text-[#f5f1e6] tracking-tight mb-4">
            Your Learning Dashboard
          </h1>
          <p className="text-sm text-[#8a7359] mb-8 max-w-md mx-auto">
            Sign in to access your courses, track progress, and continue your AI learning journey.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c9a227] text-[#0a0f0d] text-sm font-semibold hover:bg-[#c9a227]/90 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  const totalLessons = foundationCourse.modules[0].lessons.length;
  const completedLessons = student?.lessonsCompleted.length || 0;
  const progressPercent = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  const currentLessonIdx = student?.currentLessonIndex || 0;
  const currentLesson = foundationCourse.modules[0].lessons[
    Math.min(currentLessonIdx, totalLessons - 1)
  ];

  const completedLabs = student?.labTasksCompleted.length || 0;
  const totalLabs = 4;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#f5f1e6] tracking-tight mb-1">
          Welcome back, {user.name}
        </h1>
        <p className="text-sm text-[#8a7359]">
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
              className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#c9a227]/20 to-[#8a7359]/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-[#c9a227]" />
              </div>
              <h2 className="text-lg font-semibold text-[#f5f1e6] mb-2">
                Start Your First Course
              </h2>
              <p className="text-sm text-[#8a7359] mb-6 max-w-sm mx-auto">
                Enroll in AI Foundations to begin learning. You&apos;ll explore what AI is, how it learns, and build your first AI project.
              </p>
              <Link
                href="/courses/foundations/lessons/1"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c9a227] text-[#0a0f0d] text-sm font-semibold hover:bg-[#c9a227]/90 transition-colors"
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
                className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#f5f1e6]">
                      {currentLesson.title}
                    </h2>
                    <p className="text-sm text-[#8a7359] mt-1">
                      {currentLesson.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8a7359]">
                    <BookOpen className="w-3.5 h-3.5" />
                    {currentLesson.estimatedTime} min
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-1 rounded-md bg-[#1a3a2a]/30 text-[#4ade80] text-[10px] font-semibold uppercase">
                    {currentLesson.difficulty}
                  </span>
                  <span className="text-xs text-[#8a7359]">
                    {currentLesson.objectives.length} objectives
                  </span>
                </div>
                <Link
                  href={`/courses/foundations/lessons/${currentLessonIdx + 1}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a227] text-[#0a0f0d] text-sm font-semibold hover:bg-[#c9a227]/90 transition-colors"
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-6"
              >
                <h3 className="text-sm font-semibold text-[#c9a227] uppercase tracking-wider mb-4">
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#8a7359]">Overall</span>
                      <span className="text-[#c9a227] font-mono">{progressPercent}%</span>
                    </div>
                    <div className="h-2 bg-[#1a3a2a]/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#1a3a2a] to-[#c9a227] rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#8a7359]">Lessons</span>
                      <span className="text-[#4ade80] font-mono">
                        {completedLessons} / {totalLessons}
                      </span>
                    </div>
                    <div className="h-2 bg-[#1a3a2a]/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4ade80] rounded-full transition-all"
                        style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#8a7359]">Lab Tasks</span>
                      <span className="text-[#4ade80] font-mono">{completedLabs} / {totalLabs}</span>
                    </div>
                    <div className="h-2 bg-[#1a3a2a]/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4ade80] rounded-full transition-all"
                        style={{ width: `${totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-6"
              >
                <h3 className="text-sm font-semibold text-[#c9a227] uppercase tracking-wider mb-4">
                  Module Outline
                </h3>
                <div className="space-y-2">
                  {foundationCourse.modules[0].lessons.map((lesson, i) => {
                    const isCompleted = student?.lessonsCompleted.includes(lesson.id);
                    const isCurrent = i === currentLessonIdx;
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/foundations/lessons/${i + 1}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a3a2a]/20 transition-colors group"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                            isCompleted
                              ? "bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40"
                              : isCurrent
                                ? "bg-[#c9a227]/20 text-[#c9a227] border border-[#c9a227]/40"
                                : "border border-[#1a3a2a]/60 text-[#8a7359] group-hover:border-[#c9a227]/40"
                          }`}
                        >
                          {isCompleted ? "✓" : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-[#f5f1e6] truncate">
                            {lesson.title}
                          </div>
                          <div className="text-[10px] text-[#8a7359]">
                            {lesson.estimatedTime} min
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  <Link
                    href="/courses/foundations/lab"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a3a2a]/20 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full border border-[#1a3a2a]/60 flex items-center justify-center group-hover:border-[#c9a227]/40 transition-colors">
                      <FlaskConical className="w-3.5 h-3.5 text-[#8a7359] group-hover:text-[#c9a227]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#f5f1e6]">Prompt Engineering Lab</div>
                      <div className="text-[10px] text-[#8a7359]">45 min</div>
                    </div>
                  </Link>
                  <Link
                    href="/courses/foundations/check"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a3a2a]/20 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full border border-[#1a3a2a]/60 flex items-center justify-center group-hover:border-[#c9a227]/40 transition-colors">
                      <BarChart3 className="w-3.5 h-3.5 text-[#8a7359] group-hover:text-[#c9a227]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#f5f1e6]">Knowledge Check</div>
                      <div className="text-[10px] text-[#8a7359]">4 questions</div>
                    </div>
                  </Link>
                  <Link
                    href="/courses/foundations/project"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a3a2a]/20 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full border border-[#1a3a2a]/60 flex items-center justify-center group-hover:border-[#c9a227]/40 transition-colors">
                      <FolderOpen className="w-3.5 h-3.5 text-[#8a7359] group-hover:text-[#c9a227]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#f5f1e6]">Build Your AI Assistant</div>
                      <div className="text-[10px] text-[#8a7359]">Mini Project</div>
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
            className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-6"
          >
            <h3 className="text-sm font-semibold text-[#c9a227] uppercase tracking-wider mb-4">
              Achievements
            </h3>
            {student?.badgeEarned ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/25">
                <Trophy className="w-8 h-8 text-[#c9a227]" />
                <div>
                  <div className="text-sm text-[#c9a227] font-semibold">Foundation Explorer</div>
                  <div className="text-[10px] text-[#8a7359]">
                    Completed the AI Foundations project
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a3a2a]/15 border border-[#1a3a2a]/25">
                <Trophy className="w-8 h-8 text-[#8a7359]/40" />
                <div>
                  <div className="text-sm text-[#8a7359]/60">No badges yet</div>
                  <div className="text-[10px] text-[#8a7359]/40">
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
            className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-6"
          >
            <h3 className="text-sm font-semibold text-[#c9a227] uppercase tracking-wider mb-4">
              Learning Streak
            </h3>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a3a2a]/15 border border-[#1a3a2a]/25">
              <Flame className="w-8 h-8 text-[#c9a227]" />
              <div>
                <div className="text-2xl font-bold text-[#f5f1e6]">
                  {student?.streak || 0} day{(student?.streak || 0) !== 1 ? "s" : ""}
                </div>
                <div className="text-[10px] text-[#8a7359]">
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
            className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-6"
          >
            <h3 className="text-sm font-semibold text-[#c9a227] uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/courses/foundations/lessons/1"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a3a2a]/15 border border-[#1a3a2a]/25 text-sm text-[#8a7359] hover:bg-[#1a3a2a]/25 hover:text-[#f5f1e6] transition-all"
              >
                <BookOpen className="w-4 h-4" />
                {student?.enrolledCourses.length ? "Continue Lesson" : "Start Learning"}
              </Link>
              <Link
                href="/mentor"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a3a2a]/15 border border-[#1a3a2a]/25 text-sm text-[#8a7359] hover:bg-[#1a3a2a]/25 hover:text-[#f5f1e6] transition-all"
              >
                <FlaskConical className="w-4 h-4" />
                Ask a Mentor
              </Link>
              <Link
                href="/knowledge-graph"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a3a2a]/15 border border-[#1a3a2a]/25 text-sm text-[#8a7359] hover:bg-[#1a3a2a]/25 hover:text-[#f5f1e6] transition-all"
              >
                <Network className="w-4 h-4" />
                Knowledge Graph
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
