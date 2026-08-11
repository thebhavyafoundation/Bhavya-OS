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
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Repository Comparisons
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Compare repositories side by side
            </p>
          </div>

          <div
            className="rounded-lg p-5 mb-8"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-primary)",
            }}
          >
            <h2
              className="text-sm font-medium mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              New Comparison
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <label
                  className="block text-xs mb-2"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Repository A
                </label>
                <button
                  onClick={() => setShowPicker("a")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors"
                  style={{
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {repoA
                    ? repositories.find((r) => r.id === repoA)?.name || repoA
                    : "Select repository..."}
                  <ChevronDown size={14} />
                </button>
                {showPicker === "a" && (
                  <div
                    className="absolute z-10 top-full left-0 right-0 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border-primary)",
                    }}
                  >
                    {repositories.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRepoA(r.id);
                          setShowPicker(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {r.name}
                        <span
                          className="ml-2 text-[10px]"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {r.bhavya_score}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ArrowLeftRight
                size={16}
                className="mt-6"
                style={{ color: "var(--color-text-muted)" }}
              />

              <div className="flex-1 relative">
                <label
                  className="block text-xs mb-2"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Repository B
                </label>
                <button
                  onClick={() => setShowPicker("b")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors"
                  style={{
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {repoB
                    ? repositories.find((r) => r.id === repoB)?.name || repoB
                    : "Select repository..."}
                  <ChevronDown size={14} />
                </button>
                {showPicker === "b" && (
                  <div
                    className="absolute z-10 top-full left-0 right-0 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border-primary)",
                    }}
                  >
                    {repositories
                      .filter((r) => r.id !== repoA)
                      .map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            setRepoB(r.id);
                            setShowPicker(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm transition-colors"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {r.name}
                          <span
                            className="ml-2 text-[10px]"
                            style={{ color: "var(--color-text-muted)" }}
                          >
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
                className="mt-6 px-4 py-2 text-white text-sm rounded-md transition-colors"
                style={{
                  background: "var(--color-accent-gold)",
                  opacity: !repoA || !repoB || repoA === repoB ? 0.5 : 1,
                }}
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
                  className="rounded-lg p-5 animate-pulse"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-primary)",
                  }}
                >
                  <div
                    className="h-5 rounded w-1/3 mb-3"
                    style={{ background: "var(--color-bg-tertiary)" }}
                  />
                  <div
                    className="h-4 rounded w-1/2"
                    style={{ background: "var(--color-bg-tertiary)" }}
                  />
                </div>
              ))}
            </div>
          ) : comparisons.length === 0 ? (
            <div className="text-center py-20">
              <ArrowLeftRight
                size={24}
                className="mx-auto mb-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                No comparisons yet
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
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
                    className="rounded-lg p-5"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border-primary)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {comp.repo_a_name}
                        </span>
                        <ArrowLeftRight
                          size={14}
                          style={{ color: "var(--color-text-muted)" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {comp.repo_b_name}
                        </span>
                      </div>
                    </div>

                    {data && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p
                              className="text-xs mb-1"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              {comp.repo_a_name}
                            </p>
                            <p
                              className="text-2xl font-semibold"
                              style={{
                                color:
                                  data.score_delta > 0
                                    ? "var(--color-accent-green-light)"
                                    : data.score_delta < 0
                                      ? "var(--color-status-error)"
                                      : "var(--color-accent-gold)",
                              }}
                            >
                              {comp.repo_a_score}
                            </p>
                          </div>
                          <div className="text-center">
                            <p
                              className="text-xs mb-1"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              Score Difference
                            </p>
                            <p
                              className="text-2xl font-semibold"
                              style={{
                                color:
                                  data.score_delta > 0
                                    ? "var(--color-accent-green-light)"
                                    : data.score_delta < 0
                                      ? "var(--color-status-error)"
                                      : "var(--color-text-tertiary)",
                              }}
                            >
                              {data.score_delta > 0 ? "+" : ""}
                              {data.score_delta}
                            </p>
                          </div>
                          <div className="text-center">
                            <p
                              className="text-xs mb-1"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              {comp.repo_b_name}
                            </p>
                            <p
                              className="text-2xl font-semibold"
                              style={{
                                color:
                                  data.score_delta < 0
                                    ? "var(--color-accent-green-light)"
                                    : data.score_delta > 0
                                      ? "var(--color-status-error)"
                                      : "var(--color-accent-gold)",
                              }}
                            >
                              {comp.repo_b_score}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div
                            className="rounded-md p-3"
                            style={{
                              border: "1px solid var(--color-border-primary)",
                            }}
                          >
                            <span
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              Language:
                            </span>{" "}
                            <span
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {comp.repo_a_language || "N/A"}
                            </span>
                          </div>
                          <div
                            className="rounded-md p-3"
                            style={{
                              border: "1px solid var(--color-border-primary)",
                            }}
                          >
                            <span
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              Language:
                            </span>{" "}
                            <span
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {comp.repo_b_language || "N/A"}
                            </span>
                          </div>
                          <div
                            className="rounded-md p-3"
                            style={{
                              border: "1px solid var(--color-border-primary)",
                            }}
                          >
                            <span
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              Maturity:
                            </span>{" "}
                            <span
                              className="capitalize"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {comp.repo_a_maturity}
                            </span>
                          </div>
                          <div
                            className="rounded-md p-3"
                            style={{
                              border: "1px solid var(--color-border-primary)",
                            }}
                          >
                            <span
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              Maturity:
                            </span>{" "}
                            <span
                              className="capitalize"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {comp.repo_b_maturity}
                            </span>
                          </div>
                        </div>

                        {data.common_technology?.length > 0 && (
                          <div>
                            <p
                              className="text-xs mb-2"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              Common Technology
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {data.common_technology.map((t: string) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 text-[10px] rounded"
                                  style={{
                                    background: "var(--color-bg-secondary)",
                                    border:
                                      "1px solid var(--color-border-primary)",
                                    color: "var(--color-text-secondary)",
                                  }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.common_patterns?.length > 0 && (
                          <div>
                            <p
                              className="text-xs mb-2"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              Common Patterns
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {data.common_patterns.map((p: string) => (
                                <span
                                  key={p}
                                  className="px-2 py-0.5 text-[10px] rounded"
                                  style={{
                                    background: "var(--color-bg-secondary)",
                                    border:
                                      "1px solid var(--color-border-primary)",
                                    color: "var(--color-text-secondary)",
                                  }}
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.common_dependencies?.length > 0 && (
                          <div>
                            <p
                              className="text-xs mb-2"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              Common Dependencies
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {data.common_dependencies.map((d: string) => (
                                <span
                                  key={d}
                                  className="px-2 py-0.5 text-[10px] rounded font-mono"
                                  style={{
                                    background: "var(--color-bg-secondary)",
                                    border:
                                      "1px solid var(--color-border-primary)",
                                    color: "var(--color-text-secondary)",
                                  }}
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div
                          className="rounded-md p-3"
                          style={{
                            background: "var(--color-bg-primary)",
                            border: "1px solid var(--color-border-primary)",
                          }}
                        >
                          <p
                            className="text-xs mb-1"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Recommendation
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
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
