"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  BookOpen,
  TestTube,
  RefreshCw,
  Calendar,
  Layout,
  Brain,
  FileText,
  GraduationCap,
  Lightbulb,
  Shield,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Review {
  id: string;
  repository_id: string;
  review_type: string;
  overall_score: number;
  architecture_score: number;
  code_organization_score: number;
  documentation_score: number;
  testing_score: number;
  automation_score: number;
  maintainability_score: number;
  extensibility_score: number;
  developer_experience_score: number;
  educational_value_score: number;
  future_risk_score: number;
  strengths: string;
  weaknesses: string;
  missing_patterns: string;
  recommendations: string;
  verdict: string;
}

const dimensions = [
  {
    key: "architecture_score",
    label: "Architecture",
    icon: <Layout size={14} />,
  },
  {
    key: "code_organization_score",
    label: "Code Organization",
    icon: <FileText size={14} />,
  },
  {
    key: "documentation_score",
    label: "Documentation",
    icon: <BookOpen size={14} />,
  },
  { key: "testing_score", label: "Testing", icon: <TestTube size={14} /> },
  {
    key: "automation_score",
    label: "Automation",
    icon: <RefreshCw size={14} />,
  },
  {
    key: "maintainability_score",
    label: "Maintainability",
    icon: <Calendar size={14} />,
  },
  {
    key: "extensibility_score",
    label: "Extensibility",
    icon: <Brain size={14} />,
  },
  {
    key: "developer_experience_score",
    label: "Developer Experience",
    icon: <GraduationCap size={14} />,
  },
  {
    key: "educational_value_score",
    label: "Educational Value",
    icon: <Lightbulb size={14} />,
  },
  {
    key: "future_risk_score",
    label: "Future Risk",
    icon: <Shield size={14} />,
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

export default function ReviewPage() {
  const params = useParams();
  const id = params.id as string;
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/review`);
      if (res.ok) {
        const data = await res.json();
        setReview(data);
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

  if (!review) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <ClipboardCheck
              size={24}
              className="mx-auto mb-3"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No review available for this repository
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

  const strengths = JSON.parse(review.strengths || "[]");
  const weaknesses = JSON.parse(review.weaknesses || "[]");
  const missingPatterns = JSON.parse(review.missing_patterns || "[]");
  const recommendations = JSON.parse(review.recommendations || "[]");

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
                Engineering Review
              </h1>
              <p
                className="text-sm mt-1 capitalize"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {review.review_type} review
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
                    stroke={getScoreColor(review.overall_score)}
                    strokeWidth="3"
                    strokeDasharray={`${review.overall_score} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-lg font-semibold"
                  style={{ color: getScoreColor(review.overall_score) }}
                >
                  {review.overall_score}
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

          {/* Dimension Scores */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {dimensions.map((dim) => {
              const score = review[dim.key as keyof Review] as number;
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

          {/* Verdict */}
          <div
            className="rounded-lg p-5 mb-6"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border-primary)",
            }}
          >
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Verdict
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {review.verdict}
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
              <h3
                className="text-sm font-medium mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                Strengths
              </h3>
              <div className="space-y-2">
                {strengths.map((s: string, i: number) => (
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
              <h3
                className="text-sm font-medium mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                Weaknesses
              </h3>
              <div className="space-y-2">
                {weaknesses.map((w: string, i: number) => (
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
          {missingPatterns.length > 0 && (
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
                Missing Patterns
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingPatterns.map((p: string, i: number) => (
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
        </div>
      </main>
    </div>
  );
}
