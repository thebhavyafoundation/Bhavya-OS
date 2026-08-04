"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProgress, saveProgress } from "@/data/progress";
import { foundationCourse, type Lesson } from "@/data/course";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const [progress, setProgress] = useState<ReturnType<
    typeof getProgress
  > | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<
    "read" | "examples" | "exercises" | "reflect" | "notes"
  >("read");
  const [notes, setNotes] = useState("");
  const [reflection, setReflection] = useState("");
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const p = getProgress();
    if (!p.enrolled) {
      router.push("/assessment");
      return;
    }
    setProgress(p);

    const mod = foundationCourse.modules[0];
    const found = mod.lessons.find((l) => l.id === lessonId);
    if (found) setLesson(found);
  }, [lessonId, router]);

  function completeLesson() {
    if (!progress || !lesson) return;
    const p = { ...progress };
    if (!p.lessonsCompleted.includes(lesson.id)) {
      p.lessonsCompleted.push(lesson.id);
    }
    const mod = foundationCourse.modules[0];
    const currentIndex = mod.lessons.findIndex((l) => l.id === lesson.id);
    if (currentIndex < mod.lessons.length - 1) {
      p.currentLessonIndex = currentIndex + 1;
    }
    if (reflection.trim()) {
      p.reflectionEntries.push({
        lessonId: lesson.id,
        content: reflection,
        date: new Date().toISOString(),
      });
    }
    saveProgress(p);
    setProgress(p);
    setShowComplete(true);
  }

  if (!lesson || !progress) return null;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-xs text-text-tertiary">
            ⏱ {lesson.estimatedTime} min
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
            Lesson
          </p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {lesson.title}
          </h1>
          <p className="text-sm text-text-secondary mb-4">
            {lesson.description}
          </p>

          {/* Objectives */}
          <div className="border border-border-primary rounded-lg p-4 bg-bg-secondary mb-4">
            <h3 className="text-xs font-medium text-text-primary mb-2">
              By the end of this lesson, you will be able to:
            </h3>
            <ul className="space-y-1">
              {lesson.objectives.map((obj, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          {lesson.prerequisites.length > 0 && (
            <p className="text-xs text-text-muted">
              Prerequisites: {lesson.prerequisites.join(", ")}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border-primary mb-6 overflow-x-auto">
          {(["read", "examples", "exercises", "reflect", "notes"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-text-primary border-b-2 border-accent-blue"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                {tab === "read" && "📖 Reading"}
                {tab === "examples" && "💻 Examples"}
                {tab === "exercises" && "✏️ Exercises"}
                {tab === "reflect" && "💭 Reflect"}
                {tab === "notes" && "📝 Notes"}
              </button>
            ),
          )}
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === "read" && (
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {lesson.content.reading}
                </div>
              </div>

              {/* Key Concepts */}
              <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
                <h3 className="text-sm font-medium text-text-primary mb-4">
                  Key Concepts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lesson.content.keyConcepts.map((kc, i) => (
                    <div
                      key={i}
                      className="p-3 bg-bg-primary border border-border-primary rounded-md"
                    >
                      <p className="text-sm font-medium text-text-primary mb-1">
                        {kc.term}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {kc.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Packages */}
              {lesson.knowledgePackages.length > 0 && (
                <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
                  <h3 className="text-sm font-medium text-text-primary mb-4">
                    Related Knowledge
                  </h3>
                  <div className="space-y-2">
                    {lesson.knowledgePackages.map((kp) => (
                      <div
                        key={kp.id}
                        className="flex items-center justify-between p-2 bg-bg-primary border border-border-primary rounded"
                      >
                        <span className="text-sm text-text-primary">
                          {kp.title}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {kp.relevance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Repository References */}
              {lesson.repositoryReferences.length > 0 && (
                <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
                  <h3 className="text-sm font-medium text-text-primary mb-4">
                    References
                  </h3>
                  <div className="space-y-2">
                    {lesson.repositoryReferences.map((ref) => (
                      <a
                        key={ref.url}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 bg-bg-primary border border-border-primary rounded hover:border-border-secondary transition-colors"
                      >
                        <span className="text-sm text-accent-blue">
                          {ref.name}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {ref.relevance}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "examples" && (
            <div className="space-y-6">
              {lesson.content.examples.map((ex, i) => (
                <div
                  key={i}
                  className="border border-border-primary rounded-lg bg-bg-secondary overflow-hidden"
                >
                  <div className="px-6 py-3 border-b border-border-primary">
                    <h3 className="text-sm font-medium text-text-primary">
                      {ex.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-text-secondary font-mono leading-relaxed overflow-x-auto mb-4 whitespace-pre-wrap">
                      {ex.code}
                    </pre>
                    <p className="text-xs text-text-tertiary">
                      {ex.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "exercises" && (
            <div className="space-y-6">
              {lesson.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="border border-border-primary rounded-lg p-6 bg-bg-secondary"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                        ex.type === "prompt"
                          ? "bg-accent-blue/10 text-accent-blue"
                          : ex.type === "code"
                            ? "bg-accent-green/10 text-accent-green"
                            : "bg-accent-purple/10 text-accent-purple"
                      }`}
                    >
                      {ex.type}
                    </span>
                    <h3 className="text-sm font-medium text-text-primary">
                      {ex.title}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {ex.instructions}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reflect" && (
            <div className="space-y-6">
              <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
                <h3 className="text-sm font-medium text-text-primary mb-4">
                  {lesson.reflection.prompt}
                </h3>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full h-32 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-secondary resize-none"
                  placeholder="Write your reflection..."
                />
                {lesson.reflection.followUp.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-text-muted mb-2">
                      Follow-up questions:
                    </p>
                    <ul className="space-y-1">
                      {lesson.reflection.followUp.map((q, i) => (
                        <li key={i} className="text-xs text-text-tertiary">
                          • {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-6">
              <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
                <h3 className="text-sm font-medium text-text-primary mb-4">
                  Your Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-48 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-secondary resize-none"
                  placeholder="Take notes as you learn..."
                />
                <p className="text-[11px] text-text-muted mt-2">
                  Notes are saved locally in your browser.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Complete Button */}
        <div className="mt-8 border-t border-border-primary pt-6">
          {showComplete ? (
            <div className="text-center animate-fade-in">
              <div className="text-2xl mb-2">🎉</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Lesson Complete!
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Great work. Keep the momentum going.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-5 py-2 text-sm font-medium border border-border-primary rounded-md text-text-secondary hover:text-text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/courses/foundations/lab"
                  className="px-5 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
                >
                  Next: Lab →
                </Link>
              </div>
            </div>
          ) : (
            <button
              onClick={completeLesson}
              className="w-full py-3 text-sm font-semibold bg-accent-green text-white rounded-md hover:bg-accent-green-hover transition-colors"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
