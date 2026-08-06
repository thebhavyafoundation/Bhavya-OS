"use client";

import { useState, useEffect } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: "not-started" | "learning" | "practiced" | "mastered";
  score: number;
  lastPracticed: string;
}

interface ProgressData {
  skills: Skill[];
  totalTimeSpent: number;
  simulationsRun: number;
  projectsCompleted: number;
  learningVelocity: number;
  streak: number;
  weeklyActivity: number[];
}

const initialSkills: Skill[] = [
  {
    id: "prompt-eng",
    name: "Prompt Engineering",
    category: "fundamentals",
    level: "mastered",
    score: 92,
    lastPracticed: "2h ago",
  },
  {
    id: "attention",
    name: "Attention Mechanism",
    category: "llm",
    level: "practiced",
    score: 75,
    lastPracticed: "1d ago",
  },
  {
    id: "rag",
    name: "RAG Systems",
    category: "rag",
    level: "learning",
    score: 45,
    lastPracticed: "3d ago",
  },
  {
    id: "agents",
    name: "AI Agents",
    category: "agents",
    level: "not-started",
    score: 0,
    lastPracticed: "never",
  },
  {
    id: "embeddings",
    name: "Embeddings",
    category: "embeddings",
    level: "practiced",
    score: 68,
    lastPracticed: "2d ago",
  },
  {
    id: "fine-tuning",
    name: "Fine-Tuning",
    category: "llm",
    level: "not-started",
    score: 0,
    lastPracticed: "never",
  },
  {
    id: "vector-db",
    name: "Vector Databases",
    category: "rag",
    level: "learning",
    score: 35,
    lastPracticed: "5d ago",
  },
  {
    id: "tool-calling",
    name: "Tool Calling",
    category: "agents",
    level: "not-started",
    score: 0,
    lastPracticed: "never",
  },
  {
    id: "safety",
    name: "AI Safety",
    category: "ethics",
    level: "practiced",
    score: 70,
    lastPracticed: "1w ago",
  },
  {
    id: "system-design",
    name: "System Design",
    category: "architecture",
    level: "learning",
    score: 40,
    lastPracticed: "4d ago",
  },
];

export function ProgressIntelligence() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [view, setView] = useState<"skills" | "analytics" | "gaps">("skills");

  const levelColors: Record<string, string> = {
    "not-started": "#64748b",
    learning: "#f59e0b",
    practiced: "#3b82f6",
    mastered: "#22c55e",
  };

  const mastered = skills.filter((s) => s.level === "mastered").length;
  const practiced = skills.filter((s) => s.level === "practiced").length;
  const learning = skills.filter((s) => s.level === "learning").length;
  const notStarted = skills.filter((s) => s.level === "not-started").length;
  const avgScore = Math.round(
    skills.reduce((sum, s) => sum + s.score, 0) / skills.length,
  );

  const weakAreas = skills.filter((s) => s.score < 50 && s.score > 0);
  const strongAreas = skills.filter((s) => s.score >= 80);
  const recommendations = skills.filter(
    (s) => s.level === "not-started" || s.score < 50,
  );

  const weeklyActivity = [85, 72, 90, 65, 88, 45, 78];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Progress Intelligence</h3>
        <div className="flex gap-2">
          {(["skills", "analytics", "gaps"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs rounded-lg ${view === v ? "bg-[#22c55e] text-black" : "bg-white/10 text-white/60"}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-black/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[#22c55e]">{mastered}</div>
          <div className="text-xs text-white/40">Mastered</div>
        </div>
        <div className="bg-black/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[#3b82f6]">{practiced}</div>
          <div className="text-xs text-white/40">Practiced</div>
        </div>
        <div className="bg-black/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[#f59e0b]">{learning}</div>
          <div className="text-xs text-white/40">Learning</div>
        </div>
        <div className="bg-black/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white/30">{notStarted}</div>
          <div className="text-xs text-white/40">Not Started</div>
        </div>
      </div>

      {view === "skills" && (
        <div className="space-y-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: levelColors[skill.level] }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-white/40">
                    {skill.lastPracticed}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${skill.score}%`,
                        backgroundColor: levelColors[skill.level],
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/40 w-8">
                    {skill.score}%
                  </span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 capitalize">
                {skill.level.replace("-", " ")}
              </span>
            </div>
          ))}
        </div>
      )}

      {view === "analytics" && (
        <div className="space-y-4">
          {/* Learning Velocity */}
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3">Learning Velocity</h4>
            <div className="flex items-end gap-1 h-24">
              {weeklyActivity.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-[#22c55e] rounded-t transition-all duration-500"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[10px] text-white/30">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center mt-2 text-xs text-white/40">
              Average:{" "}
              {Math.round(
                weeklyActivity.reduce((a, b) => a + b, 0) /
                  weeklyActivity.length,
              )}{" "}
              min/day
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3">Skills by Category</h4>
            <div className="space-y-2">
              {[
                "fundamentals",
                "llm",
                "rag",
                "agents",
                "embeddings",
                "ethics",
                "architecture",
              ].map((cat) => {
                const catSkills = skills.filter((s) => s.category === cat);
                const avg =
                  catSkills.length > 0
                    ? Math.round(
                        catSkills.reduce((sum, s) => sum + s.score, 0) /
                          catSkills.length,
                      )
                    : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-white/50 w-24 capitalize">
                      {cat}
                    </span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3b82f6] rounded-full"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/40 w-8">{avg}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === "gaps" && (
        <div className="space-y-4">
          {/* Weak Areas */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-400 mb-2">
              Knowledge Gaps
            </h4>
            {weakAreas.length > 0 ? (
              <div className="space-y-2">
                {weakAreas.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-red-400">!</span>
                    <span className="text-white/70">{skill.name}</span>
                    <span className="text-xs text-white/40">
                      ({skill.score}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50">
                No significant gaps detected.
              </p>
            )}
          </div>

          {/* Strong Areas */}
          <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-[#22c55e] mb-2">
              Strong Areas
            </h4>
            <div className="space-y-2">
              {strongAreas.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 text-sm">
                  <span className="text-[#22c55e]">✓</span>
                  <span className="text-white/70">{skill.name}</span>
                  <span className="text-xs text-white/40">
                    ({skill.score}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-[#3b82f6] mb-2">
              Recommended Next
            </h4>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-white/70">{skill.name}</span>
                  <span className="text-xs text-[#3b82f6]">
                    {skill.level === "not-started"
                      ? "Start learning →"
                      : "Practice more →"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
