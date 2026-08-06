"use client";

import { useState } from "react";
import Link from "next/link";
import { learningPaths, type LearningPath } from "@/data/learning-paths";

const difficultyOrder = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
};

export default function LearningPathsPage() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const filteredPaths =
    filterDifficulty === "all"
      ? learningPaths
      : learningPaths.filter((p) => p.difficulty === filterDifficulty);

  const sortedPaths = [...filteredPaths].sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white/70 mb-4 inline-block"
          >
            ← Back to AI University
          </Link>
          <h1 className="text-4xl font-bold mb-3">Learning Paths</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Structured journeys from beginner to expert. Each path includes
            projects, assessments, and certifications.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {["all", "beginner", "intermediate", "advanced", "expert"].map(
            (d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterDifficulty === d
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {d === "all"
                  ? "All Paths"
                  : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ),
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Path Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedPaths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path)}
                  className={`text-left p-6 rounded-xl border transition-all ${
                    selectedPath?.id === path.id
                      ? "border-[#22c55e]/50 bg-[#22c55e]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{path.icon}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: path.color + "20",
                        color: path.color,
                      }}
                    >
                      {path.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{path.title}</h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">
                    {path.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span>{path.estimatedDuration}</span>
                    <span>•</span>
                    <span>{path.estimatedHours} hours</span>
                    <span>•</span>
                    <span>{path.modules.length} modules</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedPath ? (
              <div className="sticky top-8 bg-white/5 border border-white/10 rounded-xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{selectedPath.icon}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: selectedPath.color + "20",
                      color: selectedPath.color,
                    }}
                  >
                    {selectedPath.difficulty}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  {selectedPath.title}
                </h2>
                <p className="text-white/60 text-sm mb-6">
                  {selectedPath.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold">
                      {selectedPath.estimatedHours}
                    </div>
                    <div className="text-xs text-white/40">Hours</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold">
                      {selectedPath.modules.length}
                    </div>
                    <div className="text-xs text-white/40">Modules</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold">
                      {selectedPath.projects.length}
                    </div>
                    <div className="text-xs text-white/40">Projects</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold">
                      {selectedPath.outcomes.length}
                    </div>
                    <div className="text-xs text-white/40">Outcomes</div>
                  </div>
                </div>

                {/* Prerequisites */}
                {selectedPath.prerequisites.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white/80 mb-2">
                      Prerequisites
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPath.prerequisites.map((pre) => (
                        <span
                          key={pre}
                          className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70"
                        >
                          {pre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outcomes */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    What You'll Learn
                  </h3>
                  <ul className="space-y-1">
                    {selectedPath.outcomes.map((outcome, i) => (
                      <li
                        key={i}
                        className="text-white/50 text-sm flex items-start gap-2"
                      >
                        <span className="text-[#22c55e] mt-1">✓</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Modules */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">
                    Curriculum
                  </h3>
                  <div className="space-y-3">
                    {selectedPath.modules.map((mod) => (
                      <div key={mod.id} className="bg-white/5 rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-2">
                          {mod.title}
                        </h4>
                        <p className="text-xs text-white/40 mb-2">
                          {mod.description}
                        </p>
                        <div className="space-y-1">
                          {mod.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={
                                    lesson.type === "project"
                                      ? "text-[#22c55e]"
                                      : lesson.type === "hands-on"
                                        ? "text-[#3b82f6]"
                                        : lesson.type === "video"
                                          ? "text-[#ef4444]"
                                          : "text-white/40"
                                  }
                                >
                                  {lesson.type === "project"
                                    ? "◆"
                                    : lesson.type === "hands-on"
                                      ? "▶"
                                      : lesson.type === "video"
                                        ? "●"
                                        : "○"}
                                </span>
                                <span className="text-white/60">
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-white/30">
                                {lesson.duration}m
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">
                    Projects
                  </h3>
                  <div className="space-y-3">
                    {selectedPath.projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white/5 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm">
                            {project.title}
                          </h4>
                          <span className="text-xs text-white/30">
                            {project.estimatedHours}h
                          </span>
                        </div>
                        <p className="text-xs text-white/40 mb-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/80 mb-2">
                    Certifications
                  </h3>
                  <div className="space-y-1">
                    {selectedPath.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-white/60"
                      >
                        <span className="text-[#ca8a04]">🏆</span>
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/paths/${selectedPath.slug}`}
                  className="block w-full text-center bg-[#22c55e] text-black font-semibold py-3 rounded-lg hover:bg-[#16a34a] transition-colors"
                >
                  Start This Path →
                </Link>
              </div>
            ) : (
              <div className="sticky top-8 bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold mb-2">Choose a Path</h3>
                <p className="text-white/50 text-sm">
                  Select a learning path to see its full curriculum, projects,
                  and certifications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
