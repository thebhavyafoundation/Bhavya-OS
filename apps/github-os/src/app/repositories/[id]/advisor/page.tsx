"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Advisor {
  repository: { id: string; name: string; bhavya_score: number };
  review: {
    overall_score: number;
    strengths: string;
    weaknesses: string;
    missing_patterns: string;
    recommendations: string;
    verdict: string;
  } | null;
  strengths: string[];
  weaknesses: string[];
  missingPatterns: string[];
  recommendations: string[];
  verdict: string;
  debt: Array<{
    id: string;
    title: string;
    severity: string;
    category: string;
    estimated_effort: string;
  }>;
  fitness: {
    bhavya_score: number;
    engineering_quality: number;
    architecture_quality: number;
  } | null;
  patterns: Array<{ pattern_name: string; confidence: number }>;
}

export default function AdvisorPage() {
  const params = useParams();
  const id = params.id as string;
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/advisor`);
      if (res.ok) {
        const data = await res.json();
        setAdvisor(data);
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

  if (!advisor) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <Shield
              size={24}
              className="mx-auto mb-3"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No advisor data available for this repository
            </p>
            <Link
              href={`/repositories/${id}`}
              className="text-sm mt-2 inline-block hover:text-[var(--color-accent-gold)]"
              style={{ color: "var(--color-accent-gold)" }}
            >
              Back to repository
            </Link>
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

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Engineering Advisor
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {advisor.repository.name}
              </p>
            </div>
            {advisor.review && (
              <div className="text-right">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {advisor.review.overall_score}
                </span>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Overall Score
                </p>
              </div>
            )}
          </div>

          {/* Verdict */}
          <div
            className="rounded-lg p-5 mb-6"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border-primary)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: "var(--color-accent-gold)" }} />
              <h3
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Verdict
              </h3>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {advisor.verdict}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="rounded-lg p-5"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle
                  size={14}
                  style={{ color: "var(--color-accent-green-light)" }}
                />
                <h3
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Strengths
                </h3>
              </div>
              <div className="space-y-2">
                {advisor.strengths.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      className="mt-0.5"
                      style={{ color: "var(--color-accent-green-light)" }}
                    >
                      +
                    </span>
                    {s}
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
                <AlertTriangle
                  size={14}
                  style={{ color: "var(--color-accent-earth)" }}
                />
                <h3
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Weaknesses
                </h3>
              </div>
              <div className="space-y-2">
                {advisor.weaknesses.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      className="mt-0.5"
                      style={{ color: "var(--color-accent-earth)" }}
                    >
                      -
                    </span>
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Patterns */}
          {advisor.missingPatterns.length > 0 && (
            <div
              className="rounded-lg p-5 mb-6"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb
                  size={14}
                  style={{ color: "var(--color-accent-earth)" }}
                />
                <h3
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Missing Patterns
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {advisor.missingPatterns.map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/20"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div
            className="rounded-lg p-5 mb-6"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border-primary)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp
                size={14}
                style={{ color: "var(--color-accent-gold)" }}
              />
              <h3
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Recommendations
              </h3>
            </div>
            <div className="space-y-2">
              {advisor.recommendations.map((rec, i) => (
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
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Debt Summary */}
          {advisor.debt.length > 0 && (
            <div
              className="rounded-lg p-5"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <h3
                className="text-sm font-medium mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                Technical Debt ({advisor.debt.length} items)
              </h3>
              <div className="space-y-2">
                {advisor.debt.slice(0, 5).map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-3 rounded"
                    style={{
                      background: "var(--color-bg-primary)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          d.severity === "high"
                            ? "bg-red-500/10 text-red-400"
                            : d.severity === "medium"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {d.severity}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {d.title}
                      </span>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {d.estimated_effort}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
