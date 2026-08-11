"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  Folder,
  FileText,
  Lightbulb,
  Wrench,
  GraduationCap,
  Star,
  ChevronRight,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface LearningPath {
  id: string;
  repository_id: string;
  prerequisites: string;
  learning_objectives: string;
  reading_order: string;
  important_folders: string;
  key_files: string;
  concepts_demonstrated: string;
  suggested_exercises: string;
  mini_projects: string;
  capstone_ideas: string;
  estimated_hours: number;
  difficulty: string;
}

interface Repository {
  id: string;
  name: string;
  description: string | null;
  learning_difficulty: string;
  why_bhavya_cares: string | null;
}

interface Health {
  overall_score: number;
  educational_completeness_score: number;
}

interface Knowledge {
  id: string;
  category: string;
  title: string;
  quality_score: number;
}

interface Pattern {
  pattern_name: string;
  confidence: number;
}

interface Export {
  id: string;
  export_type: string;
  title: string;
  metadata: string;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  intermediate: "bg-blue-900/40 text-blue-300 border-blue-800",
  advanced: "bg-amber-900/40 text-amber-300 border-amber-800",
  expert: "bg-red-900/40 text-red-300 border-red-800",
};

const exportTypeIcons: Record<string, React.ReactNode> = {
  lesson: <BookOpen size={14} />,
  workshop: <Wrench size={14} />,
  lab: <Lightbulb size={14} />,
  reading: <FileText size={14} />,
  capstone: <GraduationCap size={14} />,
};

export default function LearningModePage() {
  const params = useParams();
  const id = params.id as string;
  const [repository, setRepository] = useState<Repository | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [exports, setExports] = useState<Export[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/learning`);
      const data = await res.json();
      setRepository(data.repository);
      setLearningPath(data.learningPath);
      setHealth(data.health);
      setKnowledge(data.knowledge || []);
      setPatterns(data.patterns || []);
      setExports(data.exports || []);
      setLoading(false);
    }
    load();
  }, [id]);

  function parseJsonArray(json: string): string[] {
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  if (loading) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div
              className="h-8 rounded w-1/3 mb-4"
              style={{ background: "var(--color-bg-tertiary)" }}
            />
            <div
              className="h-64 rounded-lg"
              style={{ background: "var(--color-surface)" }}
            />
          </div>
        </main>
      </div>
    );
  }

  if (!repository || !learningPath) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <p style={{ color: "var(--color-text-tertiary)" }}>
              Learning path not found
            </p>
            <Link
              href="/repositories"
              className="text-sm mt-2 inline-block hover:text-[var(--color-accent-gold)]"
              style={{ color: "var(--color-accent-gold)" }}
            >
              Back to repositories
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview", icon: <Target size={14} /> },
    {
      id: "prerequisites",
      label: "Prerequisites",
      icon: <BookOpen size={14} />,
    },
    { id: "objectives", label: "Objectives", icon: <Target size={14} /> },
    { id: "reading", label: "Reading Order", icon: <FileText size={14} /> },
    { id: "files", label: "Key Files", icon: <Folder size={14} /> },
    { id: "concepts", label: "Concepts", icon: <Lightbulb size={14} /> },
    { id: "exercises", label: "Exercises", icon: <Wrench size={14} /> },
    { id: "projects", label: "Projects", icon: <GraduationCap size={14} /> },
  ];

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/repositories/${id}`}
            className="inline-flex items-center gap-2 text-sm transition-colors mb-6 hover:text-[var(--color-text-primary)]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <ArrowLeft size={14} />
            Back to repository
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1
                  className="text-2xl font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Learning Mode: {repository.name}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium border ${difficultyColors[learningPath.difficulty]}`}
                >
                  {learningPath.difficulty}
                </span>
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {repository.description}
              </p>
            </div>
            <div className="text-right">
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                <Clock size={14} />
                {learningPath.estimated_hours} hours
              </div>
              {health && (
                <div
                  className="flex items-center gap-2 text-sm mt-1"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <Star size={14} />
                  Educational completeness:{" "}
                  {health.educational_completeness_score}%
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-[200px] flex-shrink-0">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === section.id
                        ? "text-[var(--color-text-primary)]"
                        : "hover:text-[var(--color-text-primary)]"
                    }`}
                    style={{
                      background:
                        activeSection === section.id
                          ? "var(--color-bg-secondary)"
                          : "transparent",
                      color:
                        activeSection === section.id
                          ? "var(--color-text-primary)"
                          : "var(--color-text-tertiary)",
                    }}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1">
              {activeSection === "overview" && (
                <div className="space-y-6">
                  {repository.why_bhavya_cares && (
                    <div
                      className="rounded-lg p-5"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <h3
                        className="text-sm font-medium mb-2"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Why Learn This
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {repository.why_bhavya_cares}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className="rounded-lg p-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <p
                        className="text-xs mb-1"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Estimated Hours
                      </p>
                      <p
                        className="text-2xl font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {learningPath.estimated_hours}
                      </p>
                    </div>
                    <div
                      className="rounded-lg p-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <p
                        className="text-xs mb-1"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Difficulty
                      </p>
                      <p
                        className="text-2xl font-semibold capitalize"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {learningPath.difficulty}
                      </p>
                    </div>
                    <div
                      className="rounded-lg p-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <p
                        className="text-xs mb-1"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Concepts
                      </p>
                      <p
                        className="text-2xl font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {
                          parseJsonArray(learningPath.concepts_demonstrated)
                            .length
                        }
                      </p>
                    </div>
                  </div>

                  {patterns.length > 0 && (
                    <div
                      className="rounded-lg p-5"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <h3
                        className="text-sm font-medium mb-3"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Patterns You'll Learn
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {patterns.map((p, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded text-xs"
                            style={{
                              background: "var(--color-bg-secondary)",
                              borderColor: "var(--color-border-primary)",
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            {p.pattern_name} ({p.confidence}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {exports.length > 0 && (
                    <div
                      className="rounded-lg p-5"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <h3
                        className="text-sm font-medium mb-3"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Educational Materials
                      </h3>
                      <div className="space-y-2">
                        {exports.map((e) => (
                          <div
                            key={e.id}
                            className="flex items-center gap-3 p-2 rounded"
                            style={{
                              background: "var(--color-bg-primary)",
                              borderColor: "var(--color-border-primary)",
                            }}
                          >
                            {exportTypeIcons[e.export_type] || (
                              <FileText size={14} />
                            )}
                            <span
                              className="text-sm"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {e.title}
                            </span>
                            <span
                              className="ml-auto text-xs capitalize"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {e.export_type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === "prerequisites" && (
                <div
                  className="rounded-lg p-5"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <h3
                    className="text-sm font-medium mb-4"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Prerequisites
                  </h3>
                  <div className="space-y-3">
                    {parseJsonArray(learningPath.prerequisites).map(
                      (prereq, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                            style={{
                              background: "var(--color-bg-secondary)",
                              borderColor: "var(--color-border-primary)",
                              color: "var(--color-text-tertiary)",
                            }}
                          >
                            {i + 1}
                          </span>
                          <span
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {prereq}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeSection === "objectives" && (
                <div
                  className="rounded-lg p-5"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <h3
                    className="text-sm font-medium mb-4"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Learning Objectives
                  </h3>
                  <div className="space-y-3">
                    {parseJsonArray(learningPath.learning_objectives).map(
                      (obj, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Target
                            size={14}
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: "var(--color-accent-gold)" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {obj}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeSection === "reading" && (
                <div
                  className="rounded-lg p-5"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <h3
                    className="text-sm font-medium mb-4"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Suggested Reading Order
                  </h3>
                  <div className="space-y-3">
                    {parseJsonArray(learningPath.reading_order).map(
                      (step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-xs text-white font-medium flex-shrink-0"
                            style={{ background: "var(--color-accent-gold)" }}
                          >
                            {i + 1}
                          </div>
                          <span
                            className="text-sm font-mono"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {step}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeSection === "files" && (
                <div className="space-y-6">
                  <div
                    className="rounded-lg p-5"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <h3
                      className="text-sm font-medium mb-4"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Important Folders
                    </h3>
                    <div className="space-y-2">
                      {parseJsonArray(learningPath.important_folders).map(
                        (folder, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 rounded"
                            style={{
                              background: "var(--color-bg-primary)",
                              borderColor: "var(--color-border-primary)",
                            }}
                          >
                            <Folder
                              size={14}
                              style={{ color: "var(--color-accent-earth)" }}
                            />
                            <span
                              className="text-sm font-mono"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {folder}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div
                    className="rounded-lg p-5"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <h3
                      className="text-sm font-medium mb-4"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Key Files
                    </h3>
                    <div className="space-y-2">
                      {parseJsonArray(learningPath.key_files).map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 rounded"
                          style={{
                            background: "var(--color-bg-primary)",
                            borderColor: "var(--color-border-primary)",
                          }}
                        >
                          <FileText
                            size={14}
                            style={{ color: "var(--color-accent-gold)" }}
                          />
                          <span
                            className="text-sm font-mono"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {file}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "concepts" && (
                <div
                  className="rounded-lg p-5"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <h3
                    className="text-sm font-medium mb-4"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Concepts Demonstrated
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {parseJsonArray(learningPath.concepts_demonstrated).map(
                      (concept, i) => (
                        <div
                          key={i}
                          className="p-3 rounded"
                          style={{
                            background: "var(--color-bg-primary)",
                            borderColor: "var(--color-border-primary)",
                          }}
                        >
                          <Lightbulb
                            size={14}
                            className="mb-2"
                            style={{ color: "var(--color-accent-earth)" }}
                          />
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {concept}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeSection === "exercises" && (
                <div
                  className="rounded-lg p-5"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <h3
                    className="text-sm font-medium mb-4"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Suggested Exercises
                  </h3>
                  <div className="space-y-3">
                    {parseJsonArray(learningPath.suggested_exercises).map(
                      (exercise, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded"
                          style={{
                            background: "var(--color-bg-primary)",
                            borderColor: "var(--color-border-primary)",
                          }}
                        >
                          <Wrench
                            size={14}
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: "var(--color-accent-green-light)" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {exercise}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeSection === "projects" && (
                <div className="space-y-6">
                  <div
                    className="rounded-lg p-5"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <h3
                      className="text-sm font-medium mb-4"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Mini Projects
                    </h3>
                    <div className="space-y-3">
                      {parseJsonArray(learningPath.mini_projects).map(
                        (project, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded"
                            style={{
                              background: "var(--color-bg-primary)",
                              borderColor: "var(--color-border-primary)",
                            }}
                          >
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center text-xs text-white font-medium flex-shrink-0"
                              style={{
                                background: "var(--color-accent-green-light)",
                              }}
                            >
                              {i + 1}
                            </div>
                            <span
                              className="text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {project}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div
                    className="rounded-lg p-5"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <h3
                      className="text-sm font-medium mb-4"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Capstone Ideas
                    </h3>
                    <div className="space-y-3">
                      {parseJsonArray(learningPath.capstone_ideas).map(
                        (idea, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded"
                            style={{
                              background: "var(--color-bg-primary)",
                              borderColor: "var(--color-border-primary)",
                            }}
                          >
                            <GraduationCap
                              size={14}
                              className="mt-0.5 flex-shrink-0"
                              style={{ color: "var(--color-accent-purple)" }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {idea}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
