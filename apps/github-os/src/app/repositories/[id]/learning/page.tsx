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
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-[#27272a] rounded w-1/3 mb-4" />
            <div className="h-64 bg-[#111111] rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!repository || !learningPath) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <p className="text-[#71717a]">Learning path not found</p>
            <Link
              href="/repositories"
              className="text-sm text-[#3b82f6] hover:text-[#60a5fa] mt-2 inline-block"
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
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/repositories/${id}`}
            className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-[#fafafa] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to repository
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-[#fafafa]">
                  Learning Mode: {repository.name}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium border ${difficultyColors[learningPath.difficulty]}`}
                >
                  {learningPath.difficulty}
                </span>
              </div>
              <p className="text-sm text-[#71717a]">{repository.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-[#71717a]">
                <Clock size={14} />
                {learningPath.estimated_hours} hours
              </div>
              {health && (
                <div className="flex items-center gap-2 text-sm text-[#71717a] mt-1">
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
                        ? "bg-[#1a1a1a] text-[#fafafa]"
                        : "text-[#71717a] hover:text-[#fafafa] hover:bg-[#111111]"
                    }`}
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
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                      <h3 className="text-sm font-medium text-[#fafafa] mb-2">
                        Why Learn This
                      </h3>
                      <p className="text-sm text-[#a1a1aa] leading-relaxed">
                        {repository.why_bhavya_cares}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                      <p className="text-xs text-[#71717a] mb-1">
                        Estimated Hours
                      </p>
                      <p className="text-2xl font-semibold text-[#fafafa]">
                        {learningPath.estimated_hours}
                      </p>
                    </div>
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                      <p className="text-xs text-[#71717a] mb-1">Difficulty</p>
                      <p className="text-2xl font-semibold text-[#fafafa] capitalize">
                        {learningPath.difficulty}
                      </p>
                    </div>
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
                      <p className="text-xs text-[#71717a] mb-1">Concepts</p>
                      <p className="text-2xl font-semibold text-[#fafafa]">
                        {
                          parseJsonArray(learningPath.concepts_demonstrated)
                            .length
                        }
                      </p>
                    </div>
                  </div>

                  {patterns.length > 0 && (
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                      <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                        Patterns You'll Learn
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {patterns.map((p, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-[#1a1a1a] border border-[#27272a] rounded text-xs text-[#a1a1aa]"
                          >
                            {p.pattern_name} ({p.confidence}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {exports.length > 0 && (
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                      <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                        Educational Materials
                      </h3>
                      <div className="space-y-2">
                        {exports.map((e) => (
                          <div
                            key={e.id}
                            className="flex items-center gap-3 p-2 bg-[#0a0a0a] border border-[#27272a] rounded"
                          >
                            {exportTypeIcons[e.export_type] || (
                              <FileText size={14} />
                            )}
                            <span className="text-sm text-[#fafafa]">
                              {e.title}
                            </span>
                            <span className="ml-auto text-xs text-[#52525b] capitalize">
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
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                    Prerequisites
                  </h3>
                  <div className="space-y-3">
                    {parseJsonArray(learningPath.prerequisites).map(
                      (prereq, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#27272a] flex items-center justify-center text-xs text-[#71717a]">
                            {i + 1}
                          </span>
                          <span className="text-sm text-[#a1a1aa]">
                            {prereq}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeSection === "objectives" && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                    Learning Objectives
                  </h3>
                  <div className="space-y-3">
                    {parseJsonArray(learningPath.learning_objectives).map(
                      (obj, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Target
                            size={14}
                            className="text-[#3b82f6] mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm text-[#a1a1aa]">{obj}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeSection === "reading" && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                    Suggested Reading Order
                  </h3>
                  <div className="space-y-3">
                    {parseJsonArray(learningPath.reading_order).map(
                      (step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded bg-[#3b82f6] flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-sm text-[#a1a1aa] font-mono">
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
                  <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                    <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                      Important Folders
                    </h3>
                    <div className="space-y-2">
                      {parseJsonArray(learningPath.important_folders).map(
                        (folder, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 bg-[#0a0a0a] border border-[#27272a] rounded"
                          >
                            <Folder size={14} className="text-[#f59e0b]" />
                            <span className="text-sm text-[#a1a1aa] font-mono">
                              {folder}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                    <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                      Key Files
                    </h3>
                    <div className="space-y-2">
                      {parseJsonArray(learningPath.key_files).map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 bg-[#0a0a0a] border border-[#27272a] rounded"
                        >
                          <FileText size={14} className="text-[#3b82f6]" />
                          <span className="text-sm text-[#a1a1aa] font-mono">
                            {file}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "concepts" && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                    Concepts Demonstrated
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {parseJsonArray(learningPath.concepts_demonstrated).map(
                      (concept, i) => (
                        <div
                          key={i}
                          className="p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                        >
                          <Lightbulb
                            size={14}
                            className="text-[#f59e0b] mb-2"
                          />
                          <p className="text-sm text-[#fafafa]">{concept}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeSection === "exercises" && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                    Suggested Exercises
                  </h3>
                  <div className="space-y-3">
                    {parseJsonArray(learningPath.suggested_exercises).map(
                      (exercise, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                        >
                          <Wrench
                            size={14}
                            className="text-[#22c55e] mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm text-[#a1a1aa]">
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
                  <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                    <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                      Mini Projects
                    </h3>
                    <div className="space-y-3">
                      {parseJsonArray(learningPath.mini_projects).map(
                        (project, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                          >
                            <div className="w-6 h-6 rounded bg-[#22c55e] flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-sm text-[#a1a1aa]">
                              {project}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                    <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                      Capstone Ideas
                    </h3>
                    <div className="space-y-3">
                      {parseJsonArray(learningPath.capstone_ideas).map(
                        (idea, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                          >
                            <GraduationCap
                              size={14}
                              className="text-[#a855f7] mt-0.5 flex-shrink-0"
                            />
                            <span className="text-sm text-[#a1a1aa]">
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
