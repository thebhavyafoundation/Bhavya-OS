"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  BookOpen,
  TestTube,
  Server,
  Code,
  Layers,
  Shield,
  Clock,
  Zap,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface DebtItem {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: string;
  business_impact: string;
  engineering_impact: string;
  estimated_effort: string;
  suggested_solution: string;
  related_knowledge_packages: string;
  related_adrs: string;
  status: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  documentation: <BookOpen size={14} />,
  testing: <TestTube size={14} />,
  infrastructure: <Server size={14} />,
  "code-quality": <Code size={14} />,
  dependency: <Layers size={14} />,
  architecture: <Shield size={14} />,
};

const severityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function DebtPage() {
  const params = useParams();
  const id = params.id as string;
  const [debt, setDebt] = useState<DebtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/debt`);
      if (res.ok) {
        const data = await res.json();
        setDebt(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const filteredDebt =
    filter === "all" ? debt : debt.filter((d) => d.severity === filter);

  const summary = {
    critical: debt.filter((d) => d.severity === "critical").length,
    high: debt.filter((d) => d.severity === "high").length,
    medium: debt.filter((d) => d.severity === "medium").length,
    low: debt.filter((d) => d.severity === "low").length,
  };

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
              Technical Debt Center
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Categorized debt register with severity, effort, and solutions
            </p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Critical",
                count: summary.critical,
                color: "text-red-400",
              },
              { label: "High", count: summary.high, color: "text-orange-400" },
              {
                label: "Medium",
                count: summary.medium,
                color: "text-amber-400",
              },
              { label: "Low", count: summary.low, color: "text-blue-400" },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() =>
                  setFilter(
                    filter === s.label.toLowerCase()
                      ? "all"
                      : s.label.toLowerCase(),
                  )
                }
                className={`border rounded-lg p-3 text-left transition-colors ${
                  filter === s.label.toLowerCase()
                    ? "border-[var(--color-border-focus)]"
                    : "hover:border-[var(--color-border-focus)]"
                }`}
                style={{
                  background: "var(--color-surface)",
                  borderColor:
                    filter === s.label.toLowerCase()
                      ? "var(--color-border-focus)"
                      : "var(--color-border-primary)",
                }}
              >
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {s.label}
                </p>
              </button>
            ))}
          </div>

          {/* Debt Items */}
          {filteredDebt.length === 0 ? (
            <div className="text-center py-20">
              <AlertTriangle
                size={24}
                className="mx-auto mb-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {filter === "all"
                  ? "No technical debt items found"
                  : `No ${filter} severity items`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDebt.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg p-5"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span style={{ color: "var(--color-text-tertiary)" }}>
                        {categoryIcons[item.category] || <Code size={14} />}
                      </span>
                      <div>
                        <h3
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-xs capitalize"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded border ${
                        severityColors[item.severity] || severityColors.low
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p
                        className="text-xs mb-1"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Business Impact
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {item.business_impact}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs mb-1"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Engineering Impact
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {item.engineering_impact}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock
                        size={12}
                        style={{ color: "var(--color-text-muted)" }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {item.estimated_effort}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap
                        size={12}
                        style={{ color: "var(--color-accent-gold)" }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-accent-gold)" }}
                      >
                        {item.suggested_solution}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
