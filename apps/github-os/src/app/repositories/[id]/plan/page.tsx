"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Map,
  Route,
  Target,
  Layers,
  Link2,
  ArrowRight,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Plan {
  id: string;
  plan_type: string;
  title: string;
  roadmap: string;
  epics: string;
  milestones: string;
  phases: string;
  dependencies: string;
  suggested_order: string;
  risk_analysis: string;
  learning_prerequisites: string;
  status: string;
}

export default function PlanPage() {
  const params = useParams();
  const id = params.id as string;
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/plan`);
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
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
              Implementation Planner
            </h1>
            <p className="text-sm text-[#71717a] mt-1">
              Roadmap, epics, milestones, and risk analysis
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-20">
              <Map size={24} className="mx-auto text-[#52525b] mb-3" />
              <p className="text-sm text-[#71717a]">
                No implementation plans available
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((plan) => {
                const roadmap = JSON.parse(plan.roadmap || "[]");
                const epics = JSON.parse(plan.epics || "[]");
                const milestones = JSON.parse(plan.milestones || "[]");
                const phases = JSON.parse(plan.phases || "[]");
                const dependencies = JSON.parse(plan.dependencies || "[]");
                const suggestedOrder = JSON.parse(plan.suggested_order || "[]");
                const learningPrereqs = JSON.parse(
                  plan.learning_prerequisites || "[]",
                );

                return (
                  <div key={plan.id}>
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-[#fafafa]">
                          {plan.title}
                        </h3>
                        <span className="px-2 py-0.5 text-xs rounded bg-[#27272a] text-[#a1a1aa] capitalize">
                          {plan.plan_type}
                        </span>
                      </div>
                      <p className="text-xs text-[#52525b]">
                        Status: {plan.status}
                      </p>
                    </div>

                    {/* Roadmap */}
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Route size={14} className="text-[#3b82f6]" />
                        <h4 className="text-sm font-medium text-[#fafafa]">
                          Roadmap
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {roadmap.map((r: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                          >
                            <span className="text-[#3b82f6] font-mono text-xs">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm text-[#a1a1aa]">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phases */}
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Layers size={14} className="text-[#f59e0b]" />
                        <h4 className="text-sm font-medium text-[#fafafa]">
                          Phases
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {phases.map((p: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-[#a1a1aa]"
                          >
                            <ArrowRight
                              size={14}
                              className="text-[#f59e0b] mt-0.5 flex-shrink-0"
                            />
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Epics */}
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target size={14} className="text-emerald-400" />
                        <h4 className="text-sm font-medium text-[#fafafa]">
                          Epics
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {epics.map((e: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target size={14} className="text-[#3b82f6]" />
                        <h4 className="text-sm font-medium text-[#fafafa]">
                          Milestones
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {milestones.map((m: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                          >
                            <span className="text-[#3b82f6] font-mono text-xs">
                              M{i + 1}
                            </span>
                            <span className="text-sm text-[#a1a1aa]">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dependencies & Learning */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Link2 size={14} className="text-amber-400" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
                            Dependencies
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {dependencies.map((d: string, i: number) => (
                            <div
                              key={i}
                              className="text-sm text-[#a1a1aa] flex items-start gap-2"
                            >
                              <span className="text-amber-400 mt-0.5">-</span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen size={14} className="text-[#3b82f6]" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
                            Learning Prerequisites
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {learningPrereqs.map((l: string, i: number) => (
                            <div
                              key={i}
                              className="text-sm text-[#a1a1aa] flex items-start gap-2"
                            >
                              <span className="text-[#3b82f6] mt-0.5">-</span>
                              {l}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Risk Analysis */}
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={14} className="text-[#f59e0b]" />
                        <h4 className="text-sm font-medium text-[#fafafa]">
                          Risk Analysis
                        </h4>
                      </div>
                      <p className="text-sm text-[#a1a1aa]">
                        {plan.risk_analysis}
                      </p>
                    </div>
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
