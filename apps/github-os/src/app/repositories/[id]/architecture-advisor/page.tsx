"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GitCompare,
  AlertTriangle,
  Copy,
  TrendingUp,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Advisor {
  id: string;
  comparison_repo: string;
  missing_layers: string;
  architectural_drift: string;
  duplicated_concepts: string;
  improvement_recommendations: string;
  migration_effort: string;
  tradeoffs: string;
}

export default function ArchitectureAdvisorPage() {
  const params = useParams();
  const id = params.id as string;
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/architecture-advisor`);
      if (res.ok) {
        const data = await res.json();
        setAdvisors(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

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
              className="h-8 rounded w-1/3 mb-8"
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

          <div className="mb-8">
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Architecture Advisor
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Compare against elite repositories and identify improvements
            </p>
          </div>

          {advisors.length === 0 ? (
            <div className="text-center py-20">
              <GitCompare
                size={24}
                className="mx-auto mb-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                No architecture comparisons available
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {advisors.map((advisor) => {
                const missingLayers = JSON.parse(
                  advisor.missing_layers || "[]",
                );
                const drift = JSON.parse(advisor.architectural_drift || "[]");
                const duplicated = JSON.parse(
                  advisor.duplicated_concepts || "[]",
                );
                const improvements = JSON.parse(
                  advisor.improvement_recommendations || "[]",
                );
                const tradeoffs = JSON.parse(advisor.tradeoffs || "[]");

                return (
                  <div key={advisor.id}>
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <GitCompare
                          size={14}
                          style={{ color: "var(--color-accent-gold)" }}
                        />
                        <h3
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Compared to{" "}
                          <span style={{ color: "var(--color-accent-gold)" }}>
                            {advisor.comparison_repo}
                          </span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p
                            className="text-xs mb-1"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Migration Effort
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {advisor.migration_effort}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Missing Layers */}
                    {missingLayers.length > 0 && (
                      <div
                        className="rounded-lg p-5 mb-4"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle
                            size={14}
                            style={{ color: "var(--color-accent-earth)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Missing Layers
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {missingLayers.map((l: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/20"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Architectural Drift */}
                    {drift.length > 0 && (
                      <div
                        className="rounded-lg p-5 mb-4"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp
                            size={14}
                            style={{ color: "var(--color-accent-earth)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Architectural Drift
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {drift.map((d: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <span
                                className="mt-0.5"
                                style={{ color: "var(--color-accent-earth)" }}
                              >
                                ~
                              </span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Duplicated Concepts */}
                    {duplicated.length > 0 && (
                      <div
                        className="rounded-lg p-5 mb-4"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Copy
                            size={14}
                            style={{ color: "var(--color-status-error)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Duplicated Concepts
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {duplicated.map((d: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <span
                                className="mt-0.5"
                                style={{ color: "var(--color-status-error)" }}
                              >
                                x
                              </span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Improvement Recommendations */}
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <h4
                        className="text-sm font-medium mb-3"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Improvement Recommendations
                      </h4>
                      <div className="space-y-2">
                        {improvements.map((r: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded"
                            style={{
                              background: "var(--color-bg-primary)",
                              borderColor: "var(--color-border-primary)",
                            }}
                          >
                            <span
                              className="font-mono text-xs mt-0.5"
                              style={{ color: "var(--color-accent-gold)" }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className="text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {r}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tradeoffs */}
                    {tradeoffs.length > 0 && (
                      <div
                        className="rounded-lg p-5"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <h4
                          className="text-sm font-medium mb-3"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Tradeoffs to Consider
                        </h4>
                        <div className="space-y-2">
                          {tradeoffs.map((t: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <span
                                className="mt-0.5"
                                style={{ color: "var(--color-text-tertiary)" }}
                              >
                                &lt;&gt;
                              </span>
                              {t}
                            </div>
                          ))}
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
