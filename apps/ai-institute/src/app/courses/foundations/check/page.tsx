"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProgress, saveProgress } from "@/data/progress";
import { foundationCourse } from "@/data/course";

export default function KnowledgeCheckPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ReturnType<typeof getProgress>>(() =>
    getProgress(),
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const p = getProgress();
    if (!p.enrolled) {
      router.push("/assessment");
      return;
    }
    setProgress(p);
  }, [router]);

  const check = foundationCourse.modules[0].knowledgeCheck;
  const question = check.questions[currentQ];
  const progressPct = ((currentQ + 1) / check.questions.length) * 100;

  function submitAnswer(answer: string | number) {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQ < check.questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      // Calculate score
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
      const p = { ...progress };
      p.knowledgeCheckAnswers = newAnswers;
      p.knowledgeCheckScore = finalScore;
      saveProgress(p);
      setProgress(p);
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
                ? "bg-accent-green/10 text-accent-green"
                : "bg-accent-yellow/10 text-accent-yellow"
            }`}
          >
            {score >= 80 ? "🎉" : "📚"}
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {score >= 80 ? "Great Job!" : "Keep Learning!"}
          </h1>
          <p className="text-text-secondary mb-2">Your score: {score}%</p>
          <p className="text-sm text-text-tertiary mb-8">
            {score >= 80
              ? "You've demonstrated solid understanding. Ready for the next challenge."
              : "Review the lesson material and try again. Learning takes time."}
          </p>

          <div className="space-y-3">
            {check.questions.map((q) => {
              const userAnswer = answers[q.id];
              const isCorrect =
                q.type === "multiple-choice" && userAnswer === q.correct;
              return (
                <div
                  key={q.id}
                  className="text-left p-3 border border-border-primary rounded-md bg-bg-secondary"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isCorrect
                          ? "bg-accent-green text-white"
                          : "bg-accent-red text-white"
                      }`}
                    >
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <span className="text-xs text-text-secondary line-clamp-1">
                      {q.question}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Link
              href="/dashboard"
              className="px-5 py-2 text-sm font-medium border border-border-primary rounded-md text-text-secondary hover:text-text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/courses/foundations/project"
              className="px-5 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
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
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <span className="text-xs text-text-tertiary">
          Question {currentQ + 1} of {check.questions.length}
        </span>
      </div>
      {/* Progress */}
      <div className="mb-8">
        <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-blue transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="animate-fade-in">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
          {question.type.replace("-", " ")}
        </p>
        <h2 className="text-lg font-semibold text-text-primary mb-6">
          {question.question}
        </h2>

        {question.type === "multiple-choice" && question.options && (
          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => submitAnswer(i)}
                className="w-full text-left p-4 border border-border-primary rounded-md text-sm text-text-secondary bg-bg-secondary hover:border-border-secondary hover:text-text-primary transition-colors"
              >
                <span className="text-text-muted mr-3">
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
              className="w-full h-32 p-3 bg-bg-secondary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-secondary resize-none"
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
              className="px-5 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
            >
              Submit Answer
            </button>
          </div>
        )}

        {question.type === "reflection" && (
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 bg-bg-secondary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-secondary resize-none"
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
              className="px-5 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
            >
              Submit Reflection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
