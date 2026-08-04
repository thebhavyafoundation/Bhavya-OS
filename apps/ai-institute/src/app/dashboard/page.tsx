"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProgress } from "@/data/progress";
import { foundationCourse } from "@/data/course";

export default function DashboardPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ReturnType<
    typeof getProgress
  > | null>(null);

  useEffect(() => {
    const p = getProgress();
    if (!p.enrolled) {
      router.push("/assessment");
      return;
    }
    setProgress(p);
  }, [router]);

  if (!progress) return null;

  const module = foundationCourse.modules[0];
  const totalLessons = module.lessons.length;
  const completedLessons = progress.lessonsCompleted.length;
  const lessonProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const totalTasks = module.lab.tasks.length;
  const completedTasks = progress.labTasksCompleted.length;
  const labProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const overallProgress = Math.round(
    lessonProgress * 0.4 +
      labProgress * 0.3 +
      (progress.projectSubmitted ? 30 : 0),
  );

  const currentLesson =
    module.lessons[progress.currentLessonIndex] || module.lessons[0];

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <span className="text-sm font-semibold text-text-primary">
              AI Institute
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-tertiary">
              🔥 {progress.streak} day streak
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-text-secondary">
            {completedLessons === 0
              ? "Ready to start your first lesson?"
              : `You've completed ${completedLessons} of ${totalLessons} lessons. Keep going!`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Lesson */}
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                Current Lesson
              </p>
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                {currentLesson.title}
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                {currentLesson.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-text-tertiary mb-4">
                <span>⏱ {currentLesson.estimatedTime} min</span>
                <span>📊 {currentLesson.difficulty}</span>
                <span>📝 {currentLesson.objectives.length} objectives</span>
              </div>
              <Link
                href={`/courses/foundations/lessons/${currentLesson.id}`}
                className="inline-block px-5 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
              >
                {completedLessons === 0
                  ? "Start Lesson 1"
                  : "Continue Learning"}
              </Link>
            </div>

            {/* Progress */}
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-tertiary">Overall</span>
                    <span className="text-text-primary font-medium">
                      {overallProgress}%
                    </span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-blue rounded-full transition-all"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-tertiary">Lessons</span>
                    <span className="text-text-primary">
                      {completedLessons}/{totalLessons}
                    </span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-green rounded-full transition-all"
                      style={{ width: `${lessonProgress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-tertiary">Lab Tasks</span>
                    <span className="text-text-primary">
                      {completedTasks}/{totalTasks}
                    </span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-yellow rounded-full transition-all"
                      style={{ width: `${labProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Module Outline */}
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Module: {module.title}
              </h3>
              <div className="space-y-2">
                {module.lessons.map((lesson, i) => {
                  const completed = progress.lessonsCompleted.includes(
                    lesson.id,
                  );
                  const current = i === progress.currentLessonIndex;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/foundations/lessons/${lesson.id}`}
                      className={`flex items-center gap-3 p-3 rounded-md text-sm transition-colors ${
                        current
                          ? "bg-accent-blue/10 border border-accent-blue/30"
                          : completed
                            ? "bg-bg-tertiary"
                            : "hover:bg-bg-tertiary"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          completed
                            ? "bg-accent-green text-white"
                            : current
                              ? "bg-accent-blue text-white"
                              : "bg-bg-hover text-text-muted"
                        }`}
                      >
                        {completed ? "✓" : i + 1}
                      </span>
                      <span
                        className={
                          current
                            ? "text-text-primary font-medium"
                            : "text-text-secondary"
                        }
                      >
                        {lesson.title}
                      </span>
                    </Link>
                  );
                })}
                <Link
                  href="/courses/foundations/lab"
                  className={`flex items-center gap-3 p-3 rounded-md text-sm transition-colors ${
                    progress.labTasksCompleted.length > 0
                      ? "bg-bg-tertiary"
                      : "hover:bg-bg-tertiary"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      progress.labTasksCompleted.length ===
                      module.lab.tasks.length
                        ? "bg-accent-green text-white"
                        : "bg-bg-hover text-text-muted"
                    }`}
                  >
                    {progress.labTasksCompleted.length ===
                    module.lab.tasks.length
                      ? "✓"
                      : "🔬"}
                  </span>
                  <span className="text-text-secondary">
                    {module.lab.title}
                  </span>
                </Link>
                <Link
                  href="/courses/foundations/check"
                  className={`flex items-center gap-3 p-3 rounded-md text-sm transition-colors ${
                    progress.knowledgeCheckScore > 0
                      ? "bg-bg-tertiary"
                      : "hover:bg-bg-tertiary"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      progress.knowledgeCheckScore >= 80
                        ? "bg-accent-green text-white"
                        : "bg-bg-hover text-text-muted"
                    }`}
                  >
                    {progress.knowledgeCheckScore >= 80 ? "✓" : "📝"}
                  </span>
                  <span className="text-text-secondary">Knowledge Check</span>
                </Link>
                <Link
                  href="/courses/foundations/project"
                  className={`flex items-center gap-3 p-3 rounded-md text-sm transition-colors ${
                    progress.projectSubmitted
                      ? "bg-bg-tertiary"
                      : "hover:bg-bg-tertiary"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      progress.projectSubmitted
                        ? "bg-accent-green text-white"
                        : "bg-bg-hover text-text-muted"
                    }`}
                  >
                    {progress.projectSubmitted ? "✓" : "🚀"}
                  </span>
                  <span className="text-text-secondary">Mini Project</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Achievements
              </h3>
              {progress.badgeEarned ? (
                <div className="flex items-center gap-3 p-3 bg-accent-yellow/10 border border-accent-yellow/30 rounded-md">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Foundation Explorer
                    </p>
                    <p className="text-[11px] text-text-tertiary">
                      Completed AI Foundations
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted">
                  Complete lessons and the project to earn your first badge.
                </p>
              )}
            </div>

            {/* Learning Streak */}
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Learning Streak
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-text-primary mb-1">
                  🔥 {progress.streak}
                </div>
                <p className="text-xs text-text-tertiary">days in a row</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href={`/courses/foundations/lessons/${currentLesson.id}`}
                  className="block w-full text-left p-3 border border-border-primary rounded-md text-sm text-text-secondary hover:border-border-secondary hover:text-text-primary transition-colors"
                >
                  📖 Continue Lesson
                </Link>
                <Link
                  href="/courses/foundations/lab"
                  className="block w-full text-left p-3 border border-border-primary rounded-md text-sm text-text-secondary hover:border-border-secondary hover:text-text-primary transition-colors"
                >
                  🔬 Open Lab
                </Link>
                <Link
                  href="/courses/foundations/project"
                  className="block w-full text-left p-3 border border-border-primary rounded-md text-sm text-text-secondary hover:border-border-secondary hover:text-text-primary transition-colors"
                >
                  🚀 Work on Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
