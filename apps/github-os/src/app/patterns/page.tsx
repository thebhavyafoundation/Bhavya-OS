"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  BookOpen,
  Lightbulb,
  GraduationCap,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Pattern {
  id: string;
  name: string;
  slug: string;
  category: string;
  explanation: string;
  use_cases: string;
  related_patterns: string;
  educational_value: string | null;
  bhavya_recommendation: string | null;
  learning_mode: string | null;
  difficulty: string;
}

interface Filters {
  categories: string[];
  difficulties: string[];
}

const categoryColors: Record<string, string> = {
  creational: "bg-violet-900/40 text-violet-300 border-violet-800",
  structural: "bg-blue-900/40 text-blue-300 border-blue-800",
  behavioral: "bg-amber-900/40 text-amber-300 border-amber-800",
  architectural: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
};

const difficultyColors: Record<string, string> = {
  beginner: "text-emerald-400",
  intermediate: "text-blue-400",
  advanced: "text-amber-400",
  expert: "text-red-400",
};

export default function PatternLibraryPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    difficulties: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  useEffect(() => {
    fetchPatterns();
  }, [search, category, difficulty]);

  async function fetchPatterns() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);

    const res = await fetch(`/api/patterns?${params}`);
    const data = await res.json();
    setPatterns(data.patterns);
    setFilters(data.filters);
    setLoading(false);
  }

  function parseJsonArray(json: string): string[] {
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#fafafa]">
              Pattern Library
            </h1>
            <p className="text-sm text-[#71717a] mt-1">
              Engineering patterns with educational context and recommendations
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]"
              />
              <input
                type="text"
                placeholder="Search patterns by name, explanation, or educational value..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#a1a1aa] appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {filters.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2.5 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#a1a1aa] appearance-none cursor-pointer"
            >
              <option value="">All Difficulties</option>
              {filters.difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-[#111111] border border-[#27272a] rounded-lg p-5 animate-pulse"
                    >
                      <div className="h-5 bg-[#27272a] rounded w-1/2 mb-3" />
                      <div className="h-4 bg-[#27272a] rounded w-3/4 mb-2" />
                      <div className="h-4 bg-[#27272a] rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : patterns.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen size={24} className="mx-auto text-[#52525b] mb-3" />
                  <p className="text-sm text-[#71717a]">No patterns found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patterns.map((pattern) => (
                    <button
                      key={pattern.id}
                      onClick={() => setSelectedPattern(pattern)}
                      className={`text-left bg-[#111111] border rounded-lg p-5 transition-all duration-200 ${
                        selectedPattern?.id === pattern.id
                          ? "border-[#3b82f6] ring-1 ring-[#3b82f6]/50"
                          : "border-[#27272a] hover:border-[#3b82f6]/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium text-[#fafafa]">
                          {pattern.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${categoryColors[pattern.category] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
                        >
                          {pattern.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717a] line-clamp-2 mb-3">
                        {pattern.explanation}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs ${difficultyColors[pattern.difficulty] || "text-zinc-400"}`}
                        >
                          {pattern.difficulty}
                        </span>
                        {pattern.learning_mode && (
                          <span className="text-xs text-[#52525b] flex items-center gap-1">
                            {pattern.learning_mode === "hands-on" ? (
                              <Lightbulb size={10} />
                            ) : (
                              <BookOpen size={10} />
                            )}
                            {pattern.learning_mode}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedPattern && (
              <div className="w-[400px] flex-shrink-0">
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 sticky top-8">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#fafafa]">
                      {selectedPattern.name}
                    </h2>
                    <button
                      onClick={() => setSelectedPattern(null)}
                      className="text-[#71717a] hover:text-[#fafafa] transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs text-[#71717a] uppercase tracking-wider mb-2">
                        Explanation
                      </h3>
                      <p className="text-sm text-[#a1a1aa] leading-relaxed">
                        {selectedPattern.explanation}
                      </p>
                    </div>

                    {selectedPattern.educational_value && (
                      <div>
                        <h3 className="text-xs text-[#71717a] uppercase tracking-wider mb-2">
                          Educational Value
                        </h3>
                        <p className="text-sm text-[#a1a1aa] leading-relaxed">
                          {selectedPattern.educational_value}
                        </p>
                      </div>
                    )}

                    {selectedPattern.bhavya_recommendation && (
                      <div className="bg-[#0a0a0a] border border-[#27272a] rounded-md p-3">
                        <h3 className="text-xs text-[#71717a] uppercase tracking-wider mb-2">
                          Bhavya Recommendation
                        </h3>
                        <p className="text-sm text-[#a1a1aa]">
                          {selectedPattern.bhavya_recommendation}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xs text-[#71717a] uppercase tracking-wider mb-2">
                        Use Cases
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {parseJsonArray(selectedPattern.use_cases).map(
                          (uc, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[#1a1a1a] border border-[#27272a] rounded text-[10px] text-[#a1a1aa]"
                            >
                              {uc}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs text-[#71717a] uppercase tracking-wider mb-2">
                        Related Patterns
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {parseJsonArray(selectedPattern.related_patterns).map(
                          (rp, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[#1a1a1a] border border-[#27272a] rounded text-[10px] text-[#a1a1aa]"
                            >
                              {rp}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
