"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Layers,
  Code,
  BookOpen,
  FolderOpen,
  Palette,
  Brain,
  Server,
  Gauge,
  Shield,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface LibraryEntry {
  id: string;
  category: string;
  title: string;
  description: string;
  repository_id: string;
  tags: string;
  quality_score: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  architecture: <Layers size={14} />,
  testing: <Code size={14} />,
  documentation: <BookOpen size={14} />,
  "folder-structures": <FolderOpen size={14} />,
  "design-systems": <Palette size={14} />,
  "ai-agents": <Brain size={14} />,
  devops: <Server size={14} />,
  performance: <Gauge size={14} />,
  security: <Shield size={14} />,
};

const categoryColors: Record<string, string> = {
  architecture: "text-[#3b82f6]",
  testing: "text-emerald-400",
  documentation: "text-amber-400",
  "folder-structures": "text-purple-400",
  "design-systems": "text-pink-400",
  "ai-agents": "text-cyan-400",
  devops: "text-orange-400",
  performance: "text-red-400",
  security: "text-green-400",
};

export default function ElitePage() {
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/elite");
      if (res.ok) {
        const data = await res.json();
        setLibrary(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const categories = ["all", ...new Set(library.map((e) => e.category))];
  const filtered =
    filter === "all" ? library : library.filter((e) => e.category === filter);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-[#27272a] rounded w-1/3 mb-8" />
            <div className="h-64 bg-[#111111] rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-[#fafafa]">
                Elite Engineering Library
              </h1>
              <p className="text-sm text-[#71717a] mt-1">
                Reusable patterns and practices from indexed repositories
              </p>
            </div>
            <Crown size={24} className="text-[#f59e0b]" />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors capitalize ${
                  filter === cat
                    ? "bg-[#3b82f6] border-[#3b82f6] text-white"
                    : "bg-[#111111] border-[#27272a] text-[#71717a] hover:text-[#fafafa] hover:border-[#3f3f46]"
                }`}
              >
                {cat === "all" ? "All Categories" : cat.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Library Entries */}
          <div className="space-y-3">
            {filtered.map((entry) => {
              const tags = JSON.parse(entry.tags || "[]");
              return (
                <div
                  key={entry.id}
                  className="bg-[#111111] border border-[#27272a] rounded-lg p-5 hover:border-[#3f3f46] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          categoryColors[entry.category] || "text-[#71717a]"
                        }
                      >
                        {categoryIcons[entry.category] || <Code size={14} />}
                      </span>
                      <div>
                        <h3 className="text-sm font-medium text-[#fafafa]">
                          {entry.title}
                        </h3>
                        <p className="text-xs text-[#52525b] capitalize">
                          {entry.category.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            entry.quality_score >= 90
                              ? "#10b981"
                              : entry.quality_score >= 80
                                ? "#3b82f6"
                                : entry.quality_score >= 70
                                  ? "#f59e0b"
                                  : "#ef4444",
                        }}
                      />
                      <span className="text-xs text-[#71717a]">
                        {entry.quality_score}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#a1a1aa] mb-3">
                    {entry.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#27272a] text-[#a1a1aa] text-[10px] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/repositories/${entry.repository_id}`}
                      className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                    >
                      View source
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
