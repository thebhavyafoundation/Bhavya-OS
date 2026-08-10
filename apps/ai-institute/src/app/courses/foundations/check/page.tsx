"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { foundationCourse } from "@/data/course";

export default function KnowledgeCheckPage() {
  const router = useRouter();
  const { student, submitQuiz, isAuthenticated } = useAuth();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const check = foundationCourse.modules[0].knowledgeCheck;
  const question = check.questions[currentQ];
  const progressPct = ((currentQ + 1) / check.questions.length) * 100;

  function submitAnswer(answer: string | number) {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQ < check.questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      let correct = 0;
      let total = 0;
      for (const q of check.questions) {
        if (q.type === "multiple-choice" && q.correct !== undefined) {
          total++;
          if (newAnswers[q.id] === q.correct) correct++;
        }
      }
      const finalScore = total > 0 ? Math.round((correct / total) * 100) : 0;
      setScore(finalScore);
      submitQuiz(newAnswers, finalScore);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl ${
              score >= 80
                ? "bg-[#4ade80]/10 text-[#4ade80]"
                : "bg-[#c9a227]/10 text-[#c9a227]"
            }`}
          >
            {score >= 80 ? "🎉" : "📚"}
          </div>
          <h1 className="text-2xl font-bold text-[#f5f1e6] mb-2">
            {score >= 80 ? "Great Job!" : "Keep Learning!"}
          </h1>
          <p className="text-[#8a7359] mb-2">Your score: {score}%</p>
          <p className="text-sm text-[#8a7359]/60 mb-8">
            {score >= 80
              ? "You've demonstrated solid understanding. Ready for the next challenge."
              : "Review the lesson material and try again. Learning takes time."}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-5 py-2 text-sm font-medium border border-[#1a3a2a]/60 rounded-xl text-[#8a7359] hover:text-[#f5f1e6] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/courses/foundations/project"
              className="px-5 py-2 text-sm font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-xl hover:bg-[#c9a227]/90 transition-colors"
            >
              Next: Project →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <span className="text-xs text-[#8a7359]/60">
          Question {currentQ + 1} of {check.questions.length}
        </span>
      </div>
      <div className="mb-8">
        <div className="h-1 bg-[#1a3a2a]/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c9a227] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="animate-fade-in"
      >
        <p className="text-[10px] text-[#8a7359]/60 uppercase tracking-wider mb-2">
          {question.type.replace("-", " ")}
        </p>
        <h2 className="text-lg font-semibold text-[#f5f1e6] mb-6">
          {question.question}
        </h2>
        {question.type === "multiple-choice" && question.options && (
          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => submitAnswer(i)}
                className="w-full text-left p-4 border border-[#1a3a2a]/40 rounded-xl text-sm text-[#8a7359] bg-[#0d1410] hover:border-[#c9a227]/40 hover:text-[#f5f1e6] transition-all"
              >
                <span className="text-[#8a7359]/40 mr-3">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}
        {question.type === "short-answer" && (
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 bg-[#0d1410] border border-[#1a3a2a]/40 rounded-xl text-sm text-[#f5f1e6] placeholder-[#8a7359]/40 focus:outline-none focus:border-[#c9a227]/40 resize-none"
              placeholder="Write your answer..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  submitAnswer((e.target as HTMLTextAreaElement).value);
                }
              }}
            />
            <button
              onClick={() => {
                const textarea = document.querySelector("textarea");
                if (textarea) submitAnswer(textarea.value);
              }}
              className="px-5 py-2 text-sm font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-xl hover:bg-[#c9a227]/90 transition-colors"
            >
              Submit Answer
            </button>
          </div>
        )}
        {question.type === "reflection" && (
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 bg-[#0d1410] border border-[#1a3a2a]/40 rounded-xl text-sm text-[#f5f1e6] placeholder-[#8a7359]/40 focus:outline-none focus:border-[#c9a227]/40 resize-none"
              placeholder="Reflect on what you've learned..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  submitAnswer((e.target as HTMLTextAreaElement).value);
                }
              }}
            />
            <button
              onClick={() => {
                const textarea = document.querySelector("textarea");
                if (textarea) submitAnswer(textarea.value);
              }}
              className="px-5 py-2 text-sm font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-xl hover:bg-[#c9a227]/90 transition-colors"
            >
              Submit Reflection
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
