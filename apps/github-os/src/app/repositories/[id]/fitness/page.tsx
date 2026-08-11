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

  if (!fitness) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <Activity
              size={24}
              className="mx-auto mb-3"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No fitness report available for this repository
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

  const explanations = (() => {
    try {
      return JSON.parse(fitness.explanations);
    } catch {
      return {};
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
                Repository Fitness Report
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-tertiary)" }}
              >
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
                    stroke="var(--color-bg-tertiary)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke={getScoreColor(fitness.bhavya_score)}
                    strokeWidth="3"
                    strokeDasharray={`${fitness.bhavya_score} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-lg font-semibold"
                  style={{ color: getScoreColor(fitness.bhavya_score) }}
                >
                  {fitness.bhavya_score}
                </span>
              </div>
              <p
                className="text-[10px] mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                Bhavya Score
              </p>
            </div>
          </div>

          {/* Dimension Scores */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {dimensions.map((dim) => {
              const score = fitness[dim.key as keyof Fitness] as number;
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
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {dim.label}
                    </span>
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
                  {explanations[dim.key] && (
                    <p
                      className="text-xs mt-2"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {explanations[dim.key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall Explanation */}
          {explanations.overall && (
            <div
              className="rounded-lg p-5"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb
                  size={14}
                  style={{ color: "var(--color-accent-gold)" }}
                />
                <h3
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Overall Assessment
                </h3>
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {explanations.overall}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
