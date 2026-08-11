"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  BookOpen,
  TestTube,
  RefreshCw,
  Calendar,
  Layout,
  Brain,
  FileText,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Health {
  id: string;
  repository_id: string;
  overall_score: number;
  documentation_score: number;
  test_coverage_score: number;
  dependency_freshness_score: number;
  release_cadence_score: number;
  architecture_consistency_score: number;
  knowledge_coverage_score: number;
  adr_coverage_score: number;
  educational_completeness_score: number;
  calculation_methodology: string | null;
  recommendations: string;
  calculated_at: string;
}

interface Repository {
  id: string;
  name: string;
  bhavya_score: number;
}

const dimensions = [
  {
    key: "documentation_score",
    label: "Documentation",
    icon: <BookOpen size={14} />,
  },
  {
    key: "test_coverage_score",
    label: "Test Coverage",
    icon: <TestTube size={14} />,
  },
  {
    key: "dependency_freshness_score",
    label: "Dependency Freshness",
    icon: <RefreshCw size={14} />,
  },
  {
    key: "release_cadence_score",
    label: "Release Cadence",
    icon: <Calendar size={14} />,
  },
  {
    key: "architecture_consistency_score",
    label: "Architecture",
    icon: <Layout size={14} />,
  },
  {
    key: "knowledge_coverage_score",
    label: "Knowledge Coverage",
    icon: <Brain size={14} />,
  },
  {
    key: "adr_coverage_score",
    label: "ADR Coverage",
    icon: <FileText size={14} />,
  },
  {
    key: "educational_completeness_score",
    label: "Educational",
    icon: <GraduationCap size={14} />,
  },
];

function getScoreColor(score: number) {
  if (score >= 90) return "var(--color-accent-green-light)";
  if (score >= 80) return "var(--color-accent-gold)";
  if (score >= 70) return "var(--color-accent-earth)";
  return "var(--color-status-error)";
}

function getScoreBg(score: number) {
  if (score >= 90) return "var(--color-accent-green-light)";
  if (score >= 80) return "var(--color-accent-gold)";
  if (score >= 70) return "var(--color-accent-earth)";
  return "var(--color-status-error)";
}

export default function HealthPage() {
  const params = useParams();
  const id = params.id as string;
  const [repository, setRepository] = useState<Repository | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/health`);
      const data = await res.json();
      setRepository(data.repository);
      setHealth(data.health);
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

  if (!health) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <Heart
              size={24}
              className="mx-auto mb-3"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Health data not available for this repository
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

  const recommendations = (() => {
    try {
      return JSON.parse(health.recommendations);
    } catch {
      return [];
    }
  })();

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
                Engineering Health
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {repository?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke="var(--color-bg-tertiary)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke={getScoreColor(health.overall_score)}
                    strokeWidth="3"
                    strokeDasharray={`${health.overall_score} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-lg font-semibold"
                  style={{ color: getScoreColor(health.overall_score) }}
                >
                  {health.overall_score}
                </span>
              </div>
              <p
                className="text-[10px] mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                Overall Score
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {dimensions.map((dim) => {
              const score = health[dim.key as keyof Health] as number;
              return (
                <div
                  key={dim.key}
                  className="rounded-lg p-4"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{ color: "var(--color-text-tertiary)" }}>
                        {dim.icon}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {dim.label}
                      </span>
                    </div>
                    <span
                      className="text-lg font-semibold"
                      style={{ color: getScoreColor(score) }}
                    >
                      {score}
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--color-bg-tertiary)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        background: getScoreBg(score),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {health.calculation_methodology && (
            <div
              className="rounded-lg p-5 mb-6"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <h3
                className="text-sm font-medium mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                How Score is Calculated
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {health.calculation_methodology}
              </p>
            </div>
          )}

          {recommendations.length > 0 && (
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
                Recommendations
              </h3>
              <div className="space-y-2">
                {recommendations.map((rec: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded"
                    style={{
                      background: "var(--color-bg-primary)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <Lightbulb
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: "var(--color-accent-earth)" }}
                    />
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
          )}
        </div>
      </main>
    </div>
  );
}
