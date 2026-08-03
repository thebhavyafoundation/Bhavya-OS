"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Star,
  GitFork,
  Heart,
  BookOpen,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Repository {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  health_score: number;
  technology_score: number;
  bhavya_score: number;
  engineering_maturity: string;
  recommendation_type: string;
  why_bhavya_cares: string | null;
  learning_difficulty: string;
  topics: string;
  latest_release: string | null;
}

interface Filters {
  languages: string[];
  maturities: string[];
  recommendations: string[];
}

const maturityColors: Record<string, string> = {
  emerging: "bg-amber-900/40 text-amber-300 border-amber-800",
  developing: "bg-blue-900/40 text-blue-300 border-blue-800",
  mature: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  exemplary: "bg-purple-900/40 text-purple-300 border-purple-800",
};

const recColors: Record<string, string> = {
  adopt: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  study: "bg-blue-900/40 text-blue-300 border-blue-800",
  reference: "bg-violet-900/40 text-violet-300 border-violet-800",
  monitor: "bg-amber-900/40 text-amber-300 border-amber-800",
  archive: "bg-zinc-800/40 text-zinc-400 border-zinc-700",
};

const difficultyColors: Record<string, string> = {
  beginner: "text-emerald-400",
  intermediate: "text-blue-400",
  advanced: "text-amber-400",
  expert: "text-red-400",
};

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filters, setFilters] = useState<Filters>({
    languages: [],
    maturities: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [maturity, setMaturity] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [sort, setSort] = useState("bhavya_score");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRepositories();
  }, [search, language, maturity, recommendation, sort]);

  async function fetchRepositories() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (language) params.set("language", language);
    if (maturity) params.set("maturity", maturity);
    if (recommendation) params.set("recommendation", recommendation);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/repositories?${params}`);
    const data = await res.json();
    setRepositories(data.repositories);
    setFilters(data.filters);
    setLoading(false);
  }

  function getScoreColor(score: number) {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-amber-400";
    return "text-red-400";
  }

  function getScoreBg(score: number) {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-[#fafafa]">
                Repositories
              </h1>
              <p className="text-sm text-[#71717a] mt-1">
                {repositories.length} repositories in your ecosystem
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-colors ${
                  showFilters
                    ? "bg-[#1a1a1a] border-[#3b82f6] text-[#fafafa]"
                    : "bg-[#111111] border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"
                }`}
              >
                <Filter size={14} />
                Filters
              </button>
              <div className="relative">
                <ArrowUpDown
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="pl-8 pr-4 py-1.5 bg-[#111111] border border-[#27272a] rounded-md text-sm text-[#a1a1aa] appearance-none cursor-pointer"
                >
                  <option value="bhavya_score">Bhavya Score</option>
                  <option value="name">Name</option>
                  <option value="stars">Stars</option>
                  <option value="health">Health Score</option>
                  <option value="technology">Technology Score</option>
                  <option value="updated">Last Updated</option>
                </select>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#71717a] mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#27272a] rounded-md text-sm text-[#a1a1aa]"
                  >
                    <option value="">All Languages</option>
                    {filters.languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#71717a] mb-2">
                    Maturity
                  </label>
                  <select
                    value={maturity}
                    onChange={(e) => setMaturity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#27272a] rounded-md text-sm text-[#a1a1aa]"
                  >
                    <option value="">All Maturities</option>
                    {filters.maturities.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#71717a] mb-2">
                    Recommendation
                  </label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#27272a] rounded-md text-sm text-[#a1a1aa]"
                  >
                    <option value="">All Recommendations</option>
                    {filters.recommendations.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {(language || maturity || recommendation) && (
                <button
                  onClick={() => {
                    setLanguage("");
                    setMaturity("");
                    setRecommendation("");
                  }}
                  className="mt-3 text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          <div className="relative mb-6">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]"
            />
            <input
              type="text"
              placeholder="Search repositories by name, description, language, or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#3b82f6] transition-colors"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : repositories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-[#52525b]" />
              </div>
              <p className="text-[#71717a] text-sm">No repositories found</p>
              <p className="text-[#52525b] text-xs mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repositories.map((repo) => (
                <Link
                  key={repo.id}
                  href={`/repositories/${repo.id}`}
                  className="group bg-[#111111] border border-[#27272a] rounded-lg p-5 hover:border-[#3b82f6]/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#fafafa] truncate group-hover:text-[#3b82f6] transition-colors">
                        {repo.name}
                      </h3>
                      <p className="text-xs text-[#71717a] mt-1 line-clamp-2">
                        {repo.description}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <div className="relative">
                        <svg className="w-10 h-10" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="15.91549430918954"
                            fill="none"
                            stroke="#27272a"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.91549430918954"
                            fill="none"
                            className={getScoreColor(repo.bhavya_score)}
                            strokeWidth="3"
                            strokeDasharray={`${repo.bhavya_score} 100`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                        </svg>
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${getScoreColor(repo.bhavya_score)}`}
                        >
                          {repo.bhavya_score}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3 text-xs text-[#71717a]">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={12} />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={12} />
                      {repo.forks}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${maturityColors[repo.engineering_maturity] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
                    >
                      {repo.engineering_maturity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${recColors[repo.recommendation_type] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
                    >
                      {repo.recommendation_type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${difficultyColors[repo.learning_difficulty] || "text-zinc-400"}`}
                    >
                      {repo.learning_difficulty}
                    </span>
                  </div>

                  {repo.why_bhavya_cares && (
                    <p className="text-xs text-[#52525b] line-clamp-2 mb-3">
                      {repo.why_bhavya_cares}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Heart size={10} className="text-[#52525b]" />
                        <span className="text-[10px] text-[#52525b]">
                          Health {repo.health_score}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen size={10} className="text-[#52525b]" />
                        <span className="text-[10px] text-[#52525b]">
                          Tech {repo.technology_score}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-[#52525b] group-hover:text-[#3b82f6] transition-colors"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
