"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProgress, saveProgress } from "@/data/progress";
import { foundationCourse } from "@/data/course";

export default function ProjectPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ReturnType<typeof getProgress>>(() =>
    getProgress(),
  );
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [aiReview, setAiReview] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [projectScore, setProjectScore] = useState(0);

  useEffect(() => {
    const p = getProgress();
    if (!p.enrolled) {
      router.push("/assessment");
      return;
    }
    setProgress(p);
    setCode(foundationCourse.modules[0].project.starterCode);
  }, [router]);

  const project = foundationCourse.modules[0].project;

  function submitProject() {
    setIsReviewing(true);

    // Simulate AI review
    setTimeout(() => {
      const hasImplementation =
        code.includes("async") || code.includes("await");
      const hasSystemMessage =
        code.includes("systemMessage") || code.includes("system");
      const hasTypes = code.includes("interface") || code.includes("type");
      const hasReset = code.includes("reset");
      const hasErrorHandling =
        code.includes("try") ||
        code.includes("catch") ||
        code.includes("error");

      let score = 0;
      const feedback: string[] = [];

      if (hasImplementation) {
        score += 25;
        feedback.push("✅ Implemented chat method with async/await");
      } else {
        feedback.push("❌ Chat method not implemented yet");
      }

      if (hasSystemMessage) {
        score += 20;
        feedback.push("✅ System message included");
      } else {
        feedback.push("⚠️ Add a system message to define the assistant's role");
      }

      if (hasTypes) {
        score += 20;
        feedback.push("✅ TypeScript types defined");
      } else {
        feedback.push("⚠️ Add TypeScript interfaces for better type safety");
      }

      if (hasReset) {
        score += 15;
        feedback.push("✅ Reset method implemented");
      } else {
        feedback.push("⚠️ Implement the reset method");
      }

      if (hasErrorHandling) {
        score += 20;
        feedback.push("✅ Error handling present");
      } else {
        feedback.push("⚠️ Add try/catch for error handling");
      }

      setProjectScore(score);
      setAiReview(feedback.join("\n\n"));

      const p = { ...progress };
      p.projectSubmitted = true;
      p.projectScore = score;
      if (score >= 80) {
        p.badgeEarned = true;
      }
      saveProgress(p);
      setProgress(p);
      setIsReviewing(false);
      setSubmitted(true);
    }, 2000);
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <nav className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-8 animate-fade-in">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl ${
                projectScore >= 80
                  ? "bg-accent-green/10 text-accent-green"
                  : "bg-accent-yellow/10 text-accent-yellow"
              }`}
            >
              {projectScore >= 80 ? "🏆" : "📝"}
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Project Submitted
            </h1>
            <p className="text-text-secondary">Score: {projectScore}/100</p>
          </div>

          {progress?.badgeEarned && (
            <div className="border border-accent-yellow/30 bg-accent-yellow/10 rounded-lg p-6 mb-6 text-center animate-fade-in">
              <div className="text-3xl mb-2">🏆</div>
              <h2 className="text-lg font-bold text-text-primary mb-1">
                Badge Earned!
              </h2>
              <p className="text-sm text-text-secondary">
                Foundation Explorer — Completed AI Foundations
              </p>
            </div>
          )}

          <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary mb-6 animate-fade-in">
            <h3 className="text-sm font-medium text-text-primary mb-4">
              AI Review
            </h3>
            <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
              {aiReview}
            </div>
          </div>

          <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary mb-6 animate-fade-in">
            <h3 className="text-sm font-medium text-text-primary mb-4">
              Rubric
            </h3>
            <div className="space-y-3">
              {project.rubric.map((r) => (
                <div key={r.dimension}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-secondary">{r.dimension}</span>
                    <span className="text-text-muted">{r.weight}%</span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    {r.criteria.join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-5 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-xs text-text-tertiary">Mini Project</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 animate-fade-in">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
            Project
          </p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {project.title}
          </h1>
          <p className="text-sm text-text-secondary">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Requirements */}
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Requirements
              </h3>
              <ul className="space-y-2">
                {project.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Objectives
              </h3>
              <ul className="space-y-2">
                {project.objectives.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1.5 flex-shrink-0" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Submission
              </h3>
              <p className="text-sm text-text-secondary">
                {project.submissionInstructions}
              </p>
            </div>
          </div>

          {/* Right: Code Editor */}
          <div className="border border-border-primary rounded-lg bg-bg-secondary animate-fade-in">
            <div className="px-6 py-3 border-b border-border-primary flex items-center justify-between">
              <h3 className="text-sm font-medium text-text-primary">
                Your Code
              </h3>
              <span className="text-[10px] text-text-muted">TypeScript</span>
            </div>
            <div className="p-6">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-secondary font-mono focus:outline-none focus:border-border-secondary resize-none"
                spellCheck={false}
              />
              <button
                onClick={submitProject}
                disabled={isReviewing}
                className="w-full mt-4 py-3 text-sm font-semibold bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
              >
                {isReviewing ? "Reviewing with AI..." : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
