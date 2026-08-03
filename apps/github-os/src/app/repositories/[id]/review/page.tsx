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
  if (score >= 90) return "text-emerald-400";
  if (score >= 80) return "text-blue-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

function getScoreBg(score: number) {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 70) return "bg-amber-500";
  return "bg-red-500";
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

  if (!review) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <ClipboardCheck size={24} className="mx-auto text-[#52525b] mb-3" />
            <p className="text-sm text-[#71717a]">
              No review available for this repository
            </p>
            <Link
              href={`/repositories/${id}`}
              className="text-sm text-[#3b82f6] hover:text-[#60a5fa] mt-2 inline-block"
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

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-[#fafafa]">
                Engineering Review
              </h1>
              <p className="text-sm text-[#71717a] mt-1 capitalize">
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
                    stroke="#27272a"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    className={`stroke-current ${getScoreColor(review.overall_score)}`}
                    strokeWidth="3"
                    strokeDasharray={`${review.overall_score} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span
                  className={`absolute inset-0 flex items-center justify-center text-lg font-semibold ${getScoreColor(review.overall_score)}`}
                >
                  {review.overall_score}
                </span>
              </div>
              <p className="text-[10px] text-[#52525b] mt-1">Overall Score</p>
            </div>
          </div>

          {/* Dimension Scores */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {dimensions.map((dim) => {
              const score = review[dim.key as keyof Review] as number;
              return (
                <div
                  key={dim.key}
                  className="bg-[#111111] border border-[#27272a] rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#71717a]">{dim.icon}</span>
                      <span className="text-sm text-[#fafafa]">
                        {dim.label}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-semibold ${getScoreColor(score)}`}
                    >
                      {score}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getScoreBg(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verdict */}
          <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-6">
            <h3 className="text-sm font-medium text-[#fafafa] mb-2">Verdict</h3>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              {review.verdict}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
              <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                Strengths
              </h3>
              <div className="space-y-2">
                {strengths.map((s: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-[#a1a1aa]"
                  >
                    <span className="text-emerald-400 mt-0.5">+</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
              <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                Weaknesses
              </h3>
              <div className="space-y-2">
                {weaknesses.map((w: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-[#a1a1aa]"
                  >
                    <span className="text-amber-400 mt-0.5">-</span>
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Patterns */}
          {missingPatterns.length > 0 && (
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-6">
              <h3 className="text-sm font-medium text-[#fafafa] mb-3">
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
          <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
            <h3 className="text-sm font-medium text-[#fafafa] mb-3">
              Recommendations
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                >
                  <Lightbulb
                    size={14}
                    className="text-[#f59e0b] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-[#a1a1aa]">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
