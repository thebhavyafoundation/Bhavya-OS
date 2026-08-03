"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Activity, Lightbulb } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Fitness {
  id: string;
  repository_id: string;
  engineering_quality: number;
  educational_quality: number;
  architecture_quality: number;
  maintainability: number;
  extensibility: number;
  reusability: number;
  innovation: number;
  community: number;
  bhavya_score: number;
  explanations: string;
}

const dimensions = [
  { key: "engineering_quality", label: "Engineering Quality" },
  { key: "educational_quality", label: "Educational Quality" },
  { key: "architecture_quality", label: "Architecture Quality" },
  { key: "maintainability", label: "Maintainability" },
  { key: "extensibility", label: "Extensibility" },
  { key: "reusability", label: "Reusability" },
  { key: "innovation", label: "Innovation" },
  { key: "community", label: "Community" },
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

export default function FitnessPage() {
  const params = useParams();
  const id = params.id as string;
  const [fitness, setFitness] = useState<Fitness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/fitness`);
      if (res.ok) {
        const data = await res.json();
        setFitness(data);
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

  if (!fitness) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <Activity size={24} className="mx-auto text-[#52525b] mb-3" />
            <p className="text-sm text-[#71717a]">
              No fitness report available for this repository
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

  const explanations = (() => {
    try {
      return JSON.parse(fitness.explanations);
    } catch {
      return {};
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
                Repository Fitness Report
              </h1>
              <p className="text-sm text-[#71717a] mt-1">
                Multi-dimensional quality analysis with explanations
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
                    className={`stroke-current ${getScoreColor(fitness.bhavya_score)}`}
                    strokeWidth="3"
                    strokeDasharray={`${fitness.bhavya_score} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span
                  className={`absolute inset-0 flex items-center justify-center text-lg font-semibold ${getScoreColor(fitness.bhavya_score)}`}
                >
                  {fitness.bhavya_score}
                </span>
              </div>
              <p className="text-[10px] text-[#52525b] mt-1">Bhavya Score</p>
            </div>
          </div>

          {/* Dimension Scores */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {dimensions.map((dim) => {
              const score = fitness[dim.key as keyof Fitness] as number;
              return (
                <div
                  key={dim.key}
                  className="bg-[#111111] border border-[#27272a] rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#fafafa]">{dim.label}</span>
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
                  {explanations[dim.key] && (
                    <p className="text-xs text-[#52525b] mt-2">
                      {explanations[dim.key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall Explanation */}
          {explanations.overall && (
            <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={14} className="text-[#3b82f6]" />
                <h3 className="text-sm font-medium text-[#fafafa]">
                  Overall Assessment
                </h3>
              </div>
              <p className="text-sm text-[#a1a1aa]">{explanations.overall}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
