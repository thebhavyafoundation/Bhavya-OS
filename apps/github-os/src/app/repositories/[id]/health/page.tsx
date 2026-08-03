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

  if (!health) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <Heart size={24} className="mx-auto text-[#52525b] mb-3" />
            <p className="text-sm text-[#71717a]">
              Health data not available for this repository
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

  const recommendations = (() => {
    try {
      return JSON.parse(health.recommendations);
    } catch {
      return [];
    }
  })();

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
                Engineering Health
              </h1>
              <p className="text-sm text-[#71717a] mt-1">{repository?.name}</p>
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
                    className={`stroke-current ${getScoreColor(health.overall_score)}`}
                    strokeWidth="3"
                    strokeDasharray={`${health.overall_score} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span
                  className={`absolute inset-0 flex items-center justify-center text-lg font-semibold ${getScoreColor(health.overall_score)}`}
                >
                  {health.overall_score}
                </span>
              </div>
              <p className="text-[10px] text-[#52525b] mt-1">Overall Score</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {dimensions.map((dim) => {
              const score = health[dim.key as keyof Health] as number;
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

          {health.calculation_methodology && (
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-6">
              <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                How Score is Calculated
              </h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                {health.calculation_methodology}
              </p>
            </div>
          )}

          {recommendations.length > 0 && (
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
          )}
        </div>
      </main>
    </div>
  );
}
