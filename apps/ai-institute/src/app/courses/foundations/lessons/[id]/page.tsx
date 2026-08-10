"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { foundationCourse } from "@/data/course";

const difficultyColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#0d1210] overflow-hidden my-6">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[10px] text-[#8a7359] ml-2 uppercase tracking-wider">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-[#8a7359] hover:text-[#f5f1e6] bg-white/5 hover:bg-white/10 rounded-md transition-all duration-200"
          >
            {copied ? (
              <>
                <svg
                  className="w-3 h-3 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-[#8a7359] hover:text-[#f5f1e6] bg-white/5 hover:bg-white/10 rounded-md transition-all duration-200">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Run Code
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code className="text-[#f5f1e6]/80 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { student, completeLesson, isAuthenticated } = useAuth();
  const lessonId = Number(params.id) || 1;

  const lessons = foundationCourse.modules[0].lessons;
  const lessonIdx = Math.max(0, Math.min(lessonId - 1, lessons.length - 1));
  const courseLesson = lessons[lessonIdx];
  const isCompleted = student?.lessonsCompleted.includes(courseLesson.id);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const progress = student?.lessonsCompleted.length
    ? Math.round((student.lessonsCompleted.length / lessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#1a3a2a] via-[#c9a227] to-[#1a3a2a]"
        />
      </div>

      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0f0d]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/courses/foundations"
            className="text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors duration-200"
          >
            ← Module 1: Foundations
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8a7359]">{courseLesson.estimatedTime} min</span>
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c9a227] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${
                difficultyColor[courseLesson.difficulty] || difficultyColor.Intermediate
              }`}
            >
              {courseLesson.difficulty}
            </span>
            <span className="text-sm text-[#8a7359]">{courseLesson.estimatedTime} min</span>
            {isCompleted && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Completed
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#f5f1e6] mb-4 tracking-tight">
            {courseLesson.title}
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-xl border border-[#1a3a2a]/50 bg-[#1a3a2a]/10 p-6 mb-12"
        >
          <h2 className="text-sm font-semibold text-[#c9a227] mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Learning Objectives
          </h2>
          <ul className="space-y-2.5">
            {courseLesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-[#c9a227]">
                    {i + 1}
                  </span>
                </span>
                <span className="text-sm text-[#f5f1e6]/80 leading-relaxed">
                  {obj}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[15px] text-[#f5f1e6]/70 leading-[1.8] whitespace-pre-wrap"
          >
            {courseLesson.content.reading}
          </motion.div>

          {courseLesson.content.keyConcepts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[#1a3a2a]/50 bg-[#1a3a2a]/10 p-6"
            >
              <h2 className="text-lg font-semibold text-[#f5f1e6] mb-4">Key Concepts</h2>
              <div className="space-y-3">
                {courseLesson.content.keyConcepts.map((concept, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#c9a227]">{i + 1}</span>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-[#f5f1e6]">{concept.term}</span>
                      <span className="text-sm text-[#f5f1e6]/60"> — {concept.definition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {courseLesson.content.examples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-[#f5f1e6] mb-4">Examples</h2>
              {courseLesson.content.examples.map((ex, i) => (
                <div key={i} className="mb-6">
                  <h3 className="text-sm font-medium text-[#c9a227] mb-2">{ex.title}</h3>
                  <CodeBlock code={ex.code} language="python" />
                  <p className="text-sm text-[#f5f1e6]/60 mt-2">{ex.explanation}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 space-y-6"
        >
          <h2 className="text-xl font-semibold text-[#f5f1e6]">
            Exercises
          </h2>
          {courseLesson.exercises.map((exercise, i) => (
            <div key={exercise.id} className="rounded-xl border border-[#c9a227]/20 bg-[#c9a227]/[0.03] p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#c9a227]">{i + 1}</span>
                </div>
                <span className="text-xs font-medium text-[#c9a227] uppercase tracking-wider">
                  {exercise.type}
                </span>
              </div>
              <h3 className="text-sm font-medium text-[#f5f1e6] mb-2">{exercise.title}</h3>
              <p className="text-sm text-[#f5f1e6]/70 leading-relaxed">{exercise.instructions}</p>
            </div>
          ))}
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          {isCompleted ? (
            <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-emerald-400">Lesson Completed</span>
            </div>
          ) : (
            <button
              onClick={() => completeLesson(courseLesson.id)}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#d4b23a] text-[#0a0f0d] text-sm font-semibold hover:from-[#d4b23a] hover:to-[#dfc04a] transition-all"
            >
              Mark as Complete
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 flex items-center justify-between gap-4"
        >
          {lessonIdx > 0 ? (
            <Link
              href={`/courses/foundations/lessons/${lessonIdx}`}
              className="flex-1 group p-5 rounded-xl border border-white/5 bg-[#111916] hover:border-white/10 transition-all duration-200"
            >
              <span className="text-[10px] text-[#8a7359] uppercase tracking-wider">
                Previous
              </span>
              <p className="text-sm font-medium text-[#f5f1e6]/70 group-hover:text-[#f5f1e6] mt-1 transition-colors">
                ← {lessons[lessonIdx - 1].title}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {lessonIdx < lessons.length - 1 ? (
            <Link
              href={`/courses/foundations/lessons/${lessonId + 2}`}
              className="flex-1 group p-5 rounded-xl border border-white/5 bg-[#111916] hover:border-[#c9a227]/20 transition-all duration-200 text-right"
            >
              <span className="text-[10px] text-[#8a7359] uppercase tracking-wider">
                Next
              </span>
              <p className="text-sm font-medium text-[#f5f1e6]/70 group-hover:text-[#f5f1e6] mt-1 transition-colors">
                {lessons[lessonIdx + 1].title} →
              </p>
            </Link>
          ) : (
            <Link
              href="/courses/foundations/lab"
              className="flex-1 group p-5 rounded-xl border border-white/5 bg-[#111916] hover:border-[#c9a227]/20 transition-all duration-200 text-right"
            >
              <span className="text-[10px] text-[#8a7359] uppercase tracking-wider">
                Next
              </span>
              <p className="text-sm font-medium text-[#f5f1e6]/70 group-hover:text-[#f5f1e6] mt-1 transition-colors">
                Lab →
              </p>
            </Link>
          )}
        </motion.div>
      </article>
    </div>
  );
}
