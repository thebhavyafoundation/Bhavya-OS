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
          <Link
            href={`/repositories/${id}`}
            className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-[#fafafa] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to repository
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#fafafa]">
              Architecture Advisor
            </h1>
            <p className="text-sm text-[#71717a] mt-1">
              Compare against elite repositories and identify improvements
            </p>
          </div>

          {advisors.length === 0 ? (
            <div className="text-center py-20">
              <GitCompare size={24} className="mx-auto text-[#52525b] mb-3" />
              <p className="text-sm text-[#71717a]">
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
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <GitCompare size={14} className="text-[#3b82f6]" />
                        <h3 className="text-sm font-medium text-[#fafafa]">
                          Compared to{" "}
                          <span className="text-[#3b82f6]">
                            {advisor.comparison_repo}
                          </span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[#52525b] mb-1">
                            Migration Effort
                          </p>
                          <p className="text-sm text-[#a1a1aa]">
                            {advisor.migration_effort}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Missing Layers */}
                    {missingLayers.length > 0 && (
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle size={14} className="text-amber-400" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
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
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp size={14} className="text-[#f59e0b]" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
                            Architectural Drift
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {drift.map((d: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#a1a1aa]"
                            >
                              <span className="text-[#f59e0b] mt-0.5">~</span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Duplicated Concepts */}
                    {duplicated.length > 0 && (
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Copy size={14} className="text-red-400" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
                            Duplicated Concepts
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {duplicated.map((d: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#a1a1aa]"
                            >
                              <span className="text-red-400 mt-0.5">x</span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Improvement Recommendations */}
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <h4 className="text-sm font-medium text-[#fafafa] mb-3">
                        Improvement Recommendations
                      </h4>
                      <div className="space-y-2">
                        {improvements.map((r: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                          >
                            <span className="text-[#3b82f6] font-mono text-xs mt-0.5">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm text-[#a1a1aa]">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tradeoffs */}
                    {tradeoffs.length > 0 && (
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                        <h4 className="text-sm font-medium text-[#fafafa] mb-3">
                          Tradeoffs to Consider
                        </h4>
                        <div className="space-y-2">
                          {tradeoffs.map((t: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#a1a1aa]"
                            >
                              <span className="text-[#71717a] mt-0.5">
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
