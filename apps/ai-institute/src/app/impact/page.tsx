"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProgress } from "@/data/progress";
import { problemLibrary } from "@bhavya/impact-runtime";
import type { ProblemCategory } from "@bhavya/impact-runtime";

const categoryColors: Record<ProblemCategory, string> = {
  education: "bg-accent-blue/10 text-accent-blue",
  accessibility: "bg-accent-purple/10 text-accent-purple",
  healthcare: "bg-accent-green/10 text-accent-green",
  agriculture: "bg-accent-yellow/10 text-accent-yellow",
  environment: "bg-accent-green/10 text-accent-green",
  "local-government": "bg-accent-blue/10 text-accent-blue",
  "small-business": "bg-accent-yellow/10 text-accent-yellow",
  ngos: "bg-accent-purple/10 text-accent-purple",
  "open-source": "bg-accent-blue/10 text-accent-blue",
  "bhavya-foundation": "bg-accent-blue/10 text-accent-blue",
};

const categoryLabels: Record<ProblemCategory, string> = {
  education: "Education",
  accessibility: "Accessibility",
  healthcare: "Healthcare",
  agriculture: "Agriculture",
  environment: "Environment",
  "local-government": "Local Government",
  "small-business": "Small Business",
  ngos: "NGOs",
  "open-source": "Open Source",
  "bhavya-foundation": "Bhavya Foundation",
};

export default function ImpactPage() {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ProblemCategory | "all"
  >("all");

  useEffect(() => {
    const p = getProgress();
    if (!p.enrolled) {
      router.push("/assessment");
      return;
    }
    setEnrolled(true);
  }, [router]);

  if (!enrolled) return null;

  const filteredProblems =
    selectedCategory === "all"
      ? problemLibrary
      : problemLibrary.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        ← Back to Dashboard
      </Link>
      <div className="mb-8 animate-fade-in">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Impact Projects
        </p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Solve Real Problems
        </h1>
        <p className="text-sm text-text-secondary">
          Choose a real-world problem. Research it. Build a solution. Create
          impact. Every project answers: Whose problem am I solving? What
          evidence guided my solution? What did I build? How can someone else
          build on my work?
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            selectedCategory === "all"
              ? "bg-accent-blue text-white"
              : "bg-bg-secondary text-text-secondary hover:text-text-primary"
          }`}
        >
          All
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as ProblemCategory)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedCategory === key
                ? "bg-accent-blue text-white"
                : "bg-bg-secondary text-text-secondary hover:text-text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Problems */}
      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            className="border border-border-primary rounded-lg p-6 bg-bg-secondary hover:border-border-secondary transition-colors animate-fade-in"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                    categoryColors[problem.category]
                  }`}
                >
                  {categoryLabels[problem.category]}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                    problem.difficulty === "beginner"
                      ? "bg-accent-green/10 text-accent-green"
                      : problem.difficulty === "intermediate"
                        ? "bg-accent-yellow/10 text-accent-yellow"
                        : "bg-accent-red/10 text-accent-red"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <span className="text-[10px] text-text-muted">
                {problem.estimatedDuration}
              </span>
            </div>

            <h2 className="text-lg font-bold text-text-primary mb-2">
              {problem.title}
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              {problem.statement}
            </p>

            <div className="mb-4">
              <p className="text-xs text-text-muted mb-1">Stakeholders</p>
              <p className="text-sm text-text-secondary">
                {problem.stakeholders.join(", ")}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-xs text-text-muted mb-2">
                Open Source Opportunity
              </p>
              <p className="text-sm text-text-secondary">
                {problem.openSourceOpportunity}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-primary">
              <div className="flex gap-2">
                {problem.suggestedAITechniques.slice(0, 3).map((technique) => (
                  <span
                    key={technique}
                    className="px-2 py-0.5 text-[10px] bg-bg-primary border border-border-primary rounded text-text-muted"
                  >
                    {technique}
                  </span>
                ))}
              </div>
              <Link
                href={`/impact/${problem.id}`}
                className="px-4 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
              >
                Select Problem →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
