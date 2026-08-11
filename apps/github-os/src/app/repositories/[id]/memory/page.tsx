"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface MemoryItem {
  id: string;
  question: string;
  answer: string;
  evidence: string;
  confidence: number;
}

interface CrossRepo {
  id: string;
  name: string;
  bhavya_score: number;
  language: string | null;
  engineering_maturity: string;
}

interface Repository {
  id: string;
  name: string;
}

const maturityColors: Record<string, string> = {
  emerging: "bg-amber-900/40 text-amber-300 border-amber-800",
  developing: "bg-blue-900/40 text-blue-300 border-blue-800",
  mature: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  exemplary: "bg-purple-900/40 text-purple-300 border-purple-800",
};

export default function MemoryPage() {
  const params = useParams();
  const id = params.id as string;
  const [repository, setRepository] = useState<Repository | null>(null);
  const [memory, setMemory] = useState<MemoryItem[]>([]);
  const [crossRepo, setCrossRepo] = useState<CrossRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/memory`);
      const data = await res.json();
      setRepository(data.repository);
      setMemory(data.memory || []);
      setCrossRepo(data.crossRepo || []);
      setLoading(false);
    }
    load();
  }, [id]);

  function parseEvidence(evidence: string): string[] {
    try {
      return JSON.parse(evidence);
    } catch {
      return [];
    }
  }

  function getConfidenceColor(confidence: number) {
    if (confidence >= 0.9) return "var(--color-accent-green-light)";
    if (confidence >= 0.8) return "var(--color-accent-gold)";
    if (confidence >= 0.7) return "var(--color-accent-earth)";
    return "var(--color-status-error)";
  }

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
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-lg mb-4"
                style={{ background: "var(--color-surface)" }}
              />
            ))}
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
              Institutional Memory
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              What we know about {repository?.name}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <h2
              className="text-lg font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Questions & Answers
            </h2>
            {memory.length === 0 ? (
              <div className="text-center py-12">
                <Brain
                  size={24}
                  className="mx-auto mb-3"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  No institutional memory yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {memory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg p-5"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <HelpCircle
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: "var(--color-accent-gold)" }}
                      />
                      <h3
                        className="text-sm font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {item.question}
                      </h3>
                      <span
                        className="ml-auto text-xs"
                        style={{ color: getConfidenceColor(item.confidence) }}
                      >
                        {Math.round(item.confidence * 100)}% confidence
                      </span>
                    </div>
                    <div className="ml-7">
                      <p
                        className="text-sm leading-relaxed mb-3"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {item.answer}
                      </p>
                      <div className="space-y-1.5">
                        {parseEvidence(item.evidence).map((e, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle
                              size={10}
                              style={{
                                color: "var(--color-accent-green-light)",
                              }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              {e}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2
              className="text-lg font-medium mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Similar Repositories
            </h2>
            {crossRepo.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle
                  size={24}
                  className="mx-auto mb-3"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  No similar repositories found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crossRepo.map((repo) => (
                  <Link
                    key={repo.id}
                    href={`/repositories/${repo.id}`}
                    className="rounded-lg p-4 transition-colors hover:border-[var(--color-accent-gold)]"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {repo.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {repo.language && (
                            <span
                              className="text-xs"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              {repo.language}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${maturityColors[repo.engineering_maturity]}`}
                          >
                            {repo.engineering_maturity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-lg font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {repo.bhavya_score}
                        </span>
                        <p
                          className="text-[10px]"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Bhavya Score
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
