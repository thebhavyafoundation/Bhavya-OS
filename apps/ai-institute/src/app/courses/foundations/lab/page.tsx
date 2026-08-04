"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProgress, saveProgress } from "@/data/progress";
import { foundationCourse } from "@/data/course";

export default function LabPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ReturnType<typeof getProgress>>(() =>
    getProgress(),
  );
  const [activeTask, setActiveTask] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showHint, setShowHint] = useState(0);

  useEffect(() => {
    const p = getProgress();
    if (!p.enrolled) {
      router.push("/assessment");
      return;
    }
    setProgress(p);
  }, [router]);

  const lab = foundationCourse.modules[0].lab;
  const task = lab.tasks[activeTask];

  function evaluatePrompt() {
    if (!userInput.trim()) return;
    setIsEvaluating(true);

    // Simulate AI evaluation
    setTimeout(() => {
      const wordCount = userInput.trim().split(/\s+/).length;
      const hasStructure =
        userInput.includes(":") ||
        userInput.includes(".") ||
        userInput.includes(",");
      const hasSpecifics = userInput.length > 50;

      let score = 0;
      let feedback = "";

      if (wordCount < 5) {
        feedback =
          "Too brief. Try adding more detail about what you want the AI to do.";
        score = 20;
      } else if (!hasStructure) {
        feedback =
          "Good start. Consider adding structure — separate the task from any constraints or format requirements.";
        score = 40;
      } else if (!hasSpecifics) {
        feedback =
          "Decent structure. Add more specifics — who is the audience? What format should the output be in?";
        score = 60;
      } else {
        feedback =
          "Strong prompt! You've included structure and specifics. Try adding an example of the expected output to make it even better.";
        score = 85;
      }

      setAiFeedback(`Score: ${score}/100\n\n${feedback}`);
      setIsEvaluating(false);
    }, 1500);
  }

  function completeTask() {
    const p = { ...progress };
    if (!p.labTasksCompleted.includes(task.id)) {
      p.labTasksCompleted.push(task.id);
    }
    saveProgress(p);
    setProgress(p);

    if (activeTask < lab.tasks.length - 1) {
      setActiveTask((prev) => prev + 1);
      setUserInput("");
      setAiFeedback("");
      setShowHint(0);
    }
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
          <span className="text-xs text-text-tertiary">
            Task {activeTask + 1} of {lab.tasks.length}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 animate-fade-in">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
            Lab
          </p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {lab.title}
          </h1>
          <p className="text-sm text-text-secondary">{lab.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Task */}
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    progress.labTasksCompleted.includes(task.id)
                      ? "bg-accent-green text-white"
                      : "bg-accent-blue text-white"
                  }`}
                >
                  {progress.labTasksCompleted.includes(task.id)
                    ? "✓"
                    : activeTask + 1}
                </span>
                <h2 className="text-base font-semibold text-text-primary">
                  {task.title}
                </h2>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                {task.instruction}
              </p>

              <div className="border border-border-primary rounded-md p-3 bg-bg-primary mb-4">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Expected Output
                </p>
                <p className="text-xs text-text-secondary">
                  {task.expectedOutput}
                </p>
              </div>

              {/* Hints */}
              <div className="space-y-2">
                {task.hints.map((hint, i) => (
                  <div key={i}>
                    {showHint > i ? (
                      <div className="p-2 bg-accent-yellow/10 border border-accent-yellow/30 rounded text-xs text-text-secondary animate-fade-in">
                        💡 {hint}
                      </div>
                    ) : showHint === i ? (
                      <button
                        onClick={() => setShowHint((prev) => prev + 1)}
                        className="text-xs text-accent-yellow hover:underline"
                      >
                        Reveal hint {i + 1}
                      </button>
                    ) : null}
                  </div>
                ))}
                {showHint < task.hints.length && (
                  <button
                    onClick={() => setShowHint((prev) => prev + 1)}
                    className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Need a hint? ({task.hints.length - showHint} remaining)
                  </button>
                )}
              </div>
            </div>

            {/* Task Navigation */}
            <div className="flex gap-2">
              {lab.tasks.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTask(i);
                    setUserInput("");
                    setAiFeedback("");
                    setShowHint(0);
                  }}
                  className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
                    i === activeTask
                      ? "bg-accent-blue text-white"
                      : progress.labTasksCompleted.includes(t.id)
                        ? "bg-accent-green text-white"
                        : "bg-bg-tertiary text-text-muted hover:bg-bg-hover"
                  }`}
                >
                  {progress.labTasksCompleted.includes(t.id) ? "✓" : i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Workspace */}
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg bg-bg-secondary animate-fade-in">
              <div className="px-6 py-3 border-b border-border-primary">
                <h3 className="text-sm font-medium text-text-primary">
                  Your Prompt
                </h3>
              </div>
              <div className="p-6">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full h-40 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary font-mono placeholder-text-muted focus:outline-none focus:border-border-secondary resize-none"
                  placeholder="Write your prompt here..."
                />
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={evaluatePrompt}
                    disabled={isEvaluating || !userInput.trim()}
                    className="px-4 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
                  >
                    {isEvaluating ? "Evaluating..." : "Get AI Feedback"}
                  </button>
                  {progress.labTasksCompleted.includes(task.id) ||
                    (aiFeedback && (
                      <button
                        onClick={completeTask}
                        className="px-4 py-2 text-sm font-medium bg-accent-green text-white rounded-md hover:bg-accent-green-hover transition-colors"
                      >
                        Mark Complete
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            {aiFeedback && (
              <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  AI Feedback
                </h3>
                <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                  {aiFeedback}
                </div>
              </div>
            )}

            {/* Rubric */}
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary animate-fade-in">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Evaluation Criteria
              </h3>
              <div className="space-y-3">
                {lab.rubric.map((r) => (
                  <div key={r.dimension}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-secondary">{r.dimension}</span>
                      <span className="text-text-muted">{r.weight}%</span>
                    </div>
                    <div className="flex gap-1">
                      {r.levels.map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-1.5 bg-bg-tertiary rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
