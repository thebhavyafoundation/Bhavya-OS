"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  assessmentQuestions,
  calculateAssessmentScore,
} from "@/data/progress";

export default function AssessmentPage() {
  const router = useRouter();
  const { isAuthenticated, student } = useAuth();
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ReturnType<
    typeof calculateAssessmentScore
  > | null>(null);

  function startQuiz() {
    setStep("quiz");
    setCurrentQ(0);
  }

  function answerQuestion(questionId: string, answerIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    if (currentQ < assessmentQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      const r = calculateAssessmentScore(answers);
      setResult(r);
      if (student) {
        fetch("/api/student/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submitQuiz",
            data: { answers, score: r.score },
          }),
        });
        fetch("/api/student/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "enroll",
            data: { courseId: "ai-foundations" },
          }),
        });
      }
      setStep("result");
    }
  }

  if (step === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-accent-blue/10 text-accent-blue flex items-center justify-center mx-auto mb-4 text-xl">
              🎯
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              AI Readiness Assessment
            </h1>
            <p className="text-sm text-text-secondary">
              8 questions. 3 minutes. We&apos;ll figure out where you should start.
            </p>
          </div>

          <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary mb-6">
            <h3 className="text-sm font-medium text-text-primary mb-3">
              What we&apos;re measuring:
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                Programming basics
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                Logical reasoning
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
                AI familiarity
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                Your goals
              </div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="w-full py-3 text-base font-semibold bg-accent-blue text-white rounded-lg hover:bg-accent-blue-hover transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  if (step === "quiz") {
    const q = assessmentQuestions[currentQ];
    const progress = ((currentQ + 1) / assessmentQuestions.length) * 100;

    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-text-tertiary mb-2">
              <span>
                Question {currentQ + 1} of {assessmentQuestions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-blue transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
              {q.category.replace("_", " ")}
            </p>
            <h2 className="text-base font-medium text-text-primary mb-6">
              {q.question}
            </h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answerQuestion(q.id, i)}
                  className={`w-full text-left p-3 border rounded-md text-sm transition-colors ${
                    answers[q.id] === i
                      ? "border-accent-blue bg-accent-blue/10 text-text-primary"
                      : "border-border-primary bg-bg-primary text-text-secondary hover:border-border-secondary hover:text-text-primary"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "result" && result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-accent-green/10 text-accent-green flex items-center justify-center mx-auto mb-6 text-2xl">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Assessment Complete
          </h1>
          <p className="text-text-secondary mb-8">
            Here&apos;s your personalized roadmap.
          </p>

          <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary mb-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-tertiary">Your Level</span>
              <span className="text-sm font-semibold text-text-primary">
                {result.level}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-tertiary">Score</span>
              <span className="text-sm font-semibold text-text-primary">
                {result.score}%
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-tertiary">Suggested Pace</span>
              <span className="text-sm font-semibold text-text-primary">
                {result.pace}
              </span>
            </div>
            <div className="border-t border-border-primary pt-4 mt-4">
              <p className="text-sm text-text-secondary">
                {result.recommendation}
              </p>
            </div>
          </div>

          <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary mb-6 text-left">
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Your Roadmap
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-accent-blue/10 text-accent-blue text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span className="text-text-secondary">
                  AI Foundations Course
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-bg-tertiary text-text-muted text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span className="text-text-tertiary">Prompt Engineering</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-bg-tertiary text-text-muted text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span className="text-text-tertiary">Agent Building</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-bg-tertiary text-text-muted text-xs flex items-center justify-center font-bold">
                  4
                </span>
                <span className="text-text-tertiary">Your First Project</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 text-base font-semibold bg-accent-blue text-white rounded-lg hover:bg-accent-blue-hover transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
