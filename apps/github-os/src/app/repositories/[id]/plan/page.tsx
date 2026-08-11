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
              Implementation Planner
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Roadmap, epics, milestones, and risk analysis
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-20">
              <Map
                size={24}
                className="mx-auto mb-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
              >
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
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className="text-lg font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {plan.title}
                        </h3>
                        <span
                          className="px-2 py-0.5 text-xs rounded capitalize"
                          style={{
                            background: "var(--color-bg-tertiary)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {plan.plan_type}
                        </span>
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Status: {plan.status}
                      </p>
                    </div>

                    {/* Roadmap */}
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Route
                          size={14}
                          style={{ color: "var(--color-accent-gold)" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Roadmap
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {roadmap.map((r: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded"
                            style={{
                              background: "var(--color-bg-primary)",
                              borderColor: "var(--color-border-primary)",
                            }}
                          >
                            <span
                              className="font-mono text-xs"
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

                    {/* Phases */}
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Layers
                          size={14}
                          style={{ color: "var(--color-accent-earth)" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Phases
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {phases.map((p: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            <ArrowRight
                              size={14}
                              className="mt-0.5 flex-shrink-0"
                              style={{ color: "var(--color-accent-earth)" }}
                            />
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Epics */}
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Target
                          size={14}
                          style={{ color: "var(--color-accent-green-light)" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
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
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Target
                          size={14}
                          style={{ color: "var(--color-accent-gold)" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Milestones
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {milestones.map((m: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded"
                            style={{
                              background: "var(--color-bg-primary)",
                              borderColor: "var(--color-border-primary)",
                            }}
                          >
                            <span
                              className="font-mono text-xs"
                              style={{ color: "var(--color-accent-gold)" }}
                            >
                              M{i + 1}
                            </span>
                            <span
                              className="text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {m}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dependencies & Learning */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div
                        className="rounded-lg p-5"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Link2
                            size={14}
                            style={{ color: "var(--color-accent-earth)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Dependencies
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {dependencies.map((d: string, i: number) => (
                            <div
                              key={i}
                              className="text-sm flex items-start gap-2"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <span
                                className="mt-0.5"
                                style={{ color: "var(--color-accent-earth)" }}
                              >
                                -
                              </span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        className="rounded-lg p-5"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen
                            size={14}
                            style={{ color: "var(--color-accent-gold)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Learning Prerequisites
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {learningPrereqs.map((l: string, i: number) => (
                            <div
                              key={i}
                              className="text-sm flex items-start gap-2"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <span
                                className="mt-0.5"
                                style={{ color: "var(--color-accent-gold)" }}
                              >
                                -
                              </span>
                              {l}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Risk Analysis */}
                    <div
                      className="rounded-lg p-5"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle
                          size={14}
                          style={{ color: "var(--color-accent-earth)" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Risk Analysis
                        </h4>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
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
