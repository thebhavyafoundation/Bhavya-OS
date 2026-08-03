"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import {
  FolderGit2,
  BookOpen,
  GraduationCap,
  Search,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface Repository {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  bhavya_score: number;
  engineering_maturity: string;
}

export default function Dashboard() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/repositories");
      const data = await res.json();
      setRepositories(data.repositories || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function getScoreColor(score: number) {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-amber-400";
    return "text-red-400";
  }

  const maturityColors: Record<string, string> = {
    emerging: "bg-amber-900/40 text-amber-300 border-amber-800",
    developing: "bg-blue-900/40 text-blue-300 border-blue-800",
    mature: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
    exemplary: "bg-purple-900/40 text-purple-300 border-purple-800",
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#fafafa]">
                  Engineering Mentor
                </h1>
                <p className="text-sm text-[#71717a] mt-1">
                  Understand repositories like a senior engineer
                </p>
              </div>
              <button
                onClick={() => setCmdOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#71717a] hover:text-[#fafafa] hover:border-[#3f3f46] transition-colors"
              >
                <Search size={14} />
                <span>Search</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-[#1a1a1a] border border-[#27272a] rounded text-[10px] font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>
          </header>

          <div className="bg-[#111111] border border-[#27272a] rounded-lg p-6 mb-8">
            <h2 className="text-sm font-medium text-[#fafafa] mb-4">
              What would you like to do?
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Link
                href="/repositories"
                className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#27272a] rounded-lg hover:border-[#3b82f6] transition-colors group"
              >
                <FolderGit2 size={20} className="text-[#3b82f6]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#fafafa]">
                    Browse Repositories
                  </p>
                  <p className="text-[11px] text-[#52525b]">
                    Discover and analyze codebases
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-[#52525b] group-hover:text-[#3b82f6] transition-colors"
                />
              </Link>
              <Link
                href="/knowledge"
                className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#27272a] rounded-lg hover:border-[#3b82f6] transition-colors group"
              >
                <BookOpen size={20} className="text-[#f59e0b]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#fafafa]">
                    Explore Knowledge
                  </p>
                  <p className="text-[11px] text-[#52525b]">
                    Patterns, packages, and insights
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-[#52525b] group-hover:text-[#f59e0b] transition-colors"
                />
              </Link>
              <Link
                href="/learning"
                className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#27272a] rounded-lg hover:border-[#3b82f6] transition-colors group"
              >
                <GraduationCap size={20} className="text-emerald-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#fafafa]">
                    Start Learning
                  </p>
                  <p className="text-[11px] text-[#52525b]">
                    Educational exports and materials
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-[#52525b] group-hover:text-[#22c55e] transition-colors"
                />
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[#fafafa]">
                Recent Repositories
              </h2>
              <Link
                href="/repositories"
                className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
              >
                View all
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-[#111111] border border-[#27272a] rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-4 bg-[#27272a] rounded w-1/3 mb-2" />
                    <div className="h-3 bg-[#27272a] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {repositories.slice(0, 5).map((repo) => (
                  <Link
                    key={repo.id}
                    href={`/repositories/${repo.id}`}
                    className="flex items-center justify-between p-4 bg-[#111111] border border-[#27272a] rounded-lg hover:border-[#3f3f46] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FolderGit2 size={16} className="text-[#52525b]" />
                      <div>
                        <p className="text-sm font-medium text-[#fafafa]">
                          {repo.name}
                        </p>
                        <p className="text-xs text-[#52525b] truncate max-w-md">
                          {repo.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 text-xs text-[#52525b]">
                          <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                          {repo.language}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${maturityColors[repo.engineering_maturity] || ""}`}
                      >
                        {repo.engineering_maturity}
                      </span>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(repo.bhavya_score)}`}
                      >
                        {repo.bhavya_score}
                      </span>
                      <ChevronRight size={14} className="text-[#52525b]" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
              <p className="text-xs text-[#52525b] mb-1">Repositories</p>
              <p className="text-2xl font-semibold text-[#fafafa]">
                {repositories.length}
              </p>
            </div>
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
              <p className="text-xs text-[#52525b] mb-1">Avg Bhavya Score</p>
              <p
                className={`text-2xl font-semibold ${getScoreColor(
                  repositories.length
                    ? Math.round(
                        repositories.reduce((a, r) => a + r.bhavya_score, 0) /
                          repositories.length,
                      )
                    : 0,
                )}`}
              >
                {repositories.length
                  ? Math.round(
                      repositories.reduce((a, r) => a + r.bhavya_score, 0) /
                        repositories.length,
                    )
                  : "—"}
              </p>
            </div>
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4">
              <p className="text-xs text-[#52525b] mb-1">Maturity</p>
              <p className="text-2xl font-semibold text-[#fafafa]">
                {
                  repositories.filter(
                    (r) =>
                      r.engineering_maturity === "mature" ||
                      r.engineering_maturity === "exemplary",
                  ).length
                }
                <span className="text-sm font-normal text-[#52525b]">
                  {" "}
                  / {repositories.length}
                </span>
              </p>
            </div>
          </div>

          <footer className="pt-8 border-t border-[#27272a] text-center text-xs text-[#52525b]">
            GitHub OS v2.0 — Engineering Mentor — Bhavya Foundation
          </footer>
        </div>
      </main>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
