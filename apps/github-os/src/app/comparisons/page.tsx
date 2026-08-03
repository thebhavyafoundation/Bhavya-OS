"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Plus, X, ChevronDown } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Repository {
  id: string;
  name: string;
  bhavya_score: number;
  health_score: number;
  technology_score: number;
  language: string | null;
  engineering_maturity: string;
}

interface Comparison {
  id: string;
  repo_a_name: string;
  repo_a_score: number;
  repo_a_language: string | null;
  repo_a_maturity: string;
  repo_b_name: string;
  repo_b_score: number;
  repo_b_language: string | null;
  repo_b_maturity: string;
  comparison: string;
}

export default function ComparisonsPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [repoA, setRepoA] = useState("");
  const [repoB, setRepoB] = useState("");
  const [showPicker, setShowPicker] = useState<"a" | "b" | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [reposRes, compRes] = await Promise.all([
      fetch("/api/repositories"),
      fetch("/api/comparisons"),
    ]);
    const reposData = await reposRes.json();
    const compData = await compRes.json();
    setRepositories(reposData.repositories);
    setComparisons(compData.comparisons);
    setLoading(false);
  }

  async function createComparison() {
    if (!repoA || !repoB || repoA === repoB) return;

    const res = await fetch("/api/comparisons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_a_id: repoA, repo_b_id: repoB }),
    });
    const data = await res.json();
    if (data.comparison) {
      await loadData();
      setRepoA("");
      setRepoB("");
    }
  }

  function getComparisonData(comp: Comparison) {
    try {
      return typeof comp.comparison === "string"
        ? JSON.parse(comp.comparison)
        : comp.comparison;
    } catch {
      return null;
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#fafafa]">
              Repository Comparisons
            </h1>
            <p className="text-sm text-[#71717a] mt-1">
              Compare repositories side by side
            </p>
          </div>

          <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-8">
            <h2 className="text-sm font-medium text-[#fafafa] mb-4">
              New Comparison
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <label className="block text-xs text-[#71717a] mb-2">
                  Repository A
                </label>
                <button
                  onClick={() => setShowPicker("a")}
                  className="w-full flex items-center justify-between px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-md text-sm text-[#a1a1aa] hover:border-[#3b82f6] transition-colors"
                >
                  {repoA
                    ? repositories.find((r) => r.id === repoA)?.name || repoA
                    : "Select repository..."}
                  <ChevronDown size={14} />
                </button>
                {showPicker === "a" && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#111111] border border-[#27272a] rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {repositories.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRepoA(r.id);
                          setShowPicker(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-[#fafafa] transition-colors"
                      >
                        {r.name}
                        <span className="ml-2 text-[10px] text-[#52525b]">
                          {r.bhavya_score}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ArrowLeftRight size={16} className="text-[#52525b] mt-6" />

              <div className="flex-1 relative">
                <label className="block text-xs text-[#71717a] mb-2">
                  Repository B
                </label>
                <button
                  onClick={() => setShowPicker("b")}
                  className="w-full flex items-center justify-between px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-md text-sm text-[#a1a1aa] hover:border-[#3b82f6] transition-colors"
                >
                  {repoB
                    ? repositories.find((r) => r.id === repoB)?.name || repoB
                    : "Select repository..."}
                  <ChevronDown size={14} />
                </button>
                {showPicker === "b" && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#111111] border border-[#27272a] rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {repositories
                      .filter((r) => r.id !== repoA)
                      .map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            setRepoB(r.id);
                            setShowPicker(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-[#fafafa] transition-colors"
                        >
                          {r.name}
                          <span className="ml-2 text-[10px] text-[#52525b]">
                            {r.bhavya_score}
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <button
                onClick={createComparison}
                disabled={!repoA || !repoB || repoA === repoB}
                className="mt-6 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#27272a] disabled:text-[#52525b] text-white text-sm rounded-md transition-colors"
              >
                Compare
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#111111] border border-[#27272a] rounded-lg p-5 animate-pulse"
                >
                  <div className="h-5 bg-[#27272a] rounded w-1/3 mb-3" />
                  <div className="h-4 bg-[#27272a] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : comparisons.length === 0 ? (
            <div className="text-center py-20">
              <ArrowLeftRight
                size={24}
                className="mx-auto text-[#52525b] mb-3"
              />
              <p className="text-sm text-[#71717a]">No comparisons yet</p>
              <p className="text-xs text-[#52525b] mt-1">
                Select two repositories above to compare them
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comparisons.map((comp) => {
                const data = getComparisonData(comp);
                return (
                  <div
                    key={comp.id}
                    className="bg-[#111111] border border-[#27272a] rounded-lg p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#fafafa]">
                          {comp.repo_a_name}
                        </span>
                        <ArrowLeftRight size={14} className="text-[#52525b]" />
                        <span className="text-sm font-medium text-[#fafafa]">
                          {comp.repo_b_name}
                        </span>
                      </div>
                    </div>

                    {data && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-[#71717a] mb-1">
                              {comp.repo_a_name}
                            </p>
                            <p
                              className={`text-2xl font-semibold ${
                                data.score_delta > 0
                                  ? "text-emerald-400"
                                  : data.score_delta < 0
                                    ? "text-red-400"
                                    : "text-blue-400"
                              }`}
                            >
                              {comp.repo_a_score}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-[#71717a] mb-1">
                              Score Difference
                            </p>
                            <p
                              className={`text-2xl font-semibold ${
                                data.score_delta > 0
                                  ? "text-emerald-400"
                                  : data.score_delta < 0
                                    ? "text-red-400"
                                    : "text-[#71717a]"
                              }`}
                            >
                              {data.score_delta > 0 ? "+" : ""}
                              {data.score_delta}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-[#71717a] mb-1">
                              {comp.repo_b_name}
                            </p>
                            <p
                              className={`text-2xl font-semibold ${
                                data.score_delta < 0
                                  ? "text-emerald-400"
                                  : data.score_delta > 0
                                    ? "text-red-400"
                                    : "text-blue-400"
                              }`}
                            >
                              {comp.repo_b_score}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="border border-[#27272a] rounded-md p-3">
                            <span className="text-[#71717a]">Language:</span>{" "}
                            <span className="text-[#fafafa]">
                              {comp.repo_a_language || "N/A"}
                            </span>
                          </div>
                          <div className="border border-[#27272a] rounded-md p-3">
                            <span className="text-[#71717a]">Language:</span>{" "}
                            <span className="text-[#fafafa]">
                              {comp.repo_b_language || "N/A"}
                            </span>
                          </div>
                          <div className="border border-[#27272a] rounded-md p-3">
                            <span className="text-[#71717a]">Maturity:</span>{" "}
                            <span className="text-[#fafafa] capitalize">
                              {comp.repo_a_maturity}
                            </span>
                          </div>
                          <div className="border border-[#27272a] rounded-md p-3">
                            <span className="text-[#71717a]">Maturity:</span>{" "}
                            <span className="text-[#fafafa] capitalize">
                              {comp.repo_b_maturity}
                            </span>
                          </div>
                        </div>

                        {data.common_technology?.length > 0 && (
                          <div>
                            <p className="text-xs text-[#71717a] mb-2">
                              Common Technology
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {data.common_technology.map((t: string) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 bg-[#1a1a1a] border border-[#27272a] rounded text-[10px] text-[#a1a1aa]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.common_patterns?.length > 0 && (
                          <div>
                            <p className="text-xs text-[#71717a] mb-2">
                              Common Patterns
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {data.common_patterns.map((p: string) => (
                                <span
                                  key={p}
                                  className="px-2 py-0.5 bg-[#1a1a1a] border border-[#27272a] rounded text-[10px] text-[#a1a1aa]"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.common_dependencies?.length > 0 && (
                          <div>
                            <p className="text-xs text-[#71717a] mb-2">
                              Common Dependencies
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {data.common_dependencies.map((d: string) => (
                                <span
                                  key={d}
                                  className="px-2 py-0.5 bg-[#1a1a1a] border border-[#27272a] rounded text-[10px] text-[#a1a1aa] font-mono"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-[#0a0a0a] border border-[#27272a] rounded-md p-3">
                          <p className="text-xs text-[#52525b] mb-1">
                            Recommendation
                          </p>
                          <p className="text-sm text-[#a1a1aa]">
                            {data.recommendation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
