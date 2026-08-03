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
    if (confidence >= 0.9) return "text-emerald-400";
    if (confidence >= 0.8) return "text-blue-400";
    if (confidence >= 0.7) return "text-amber-400";
    return "text-red-400";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-[#27272a] rounded w-1/3 mb-8" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-[#111111] rounded-lg mb-4" />
            ))}
          </div>
        </main>
      </div>
    );
  }

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

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#fafafa]">
              Institutional Memory
            </h1>
            <p className="text-sm text-[#71717a] mt-1">
              What we know about {repository?.name}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-medium text-[#fafafa]">
              Questions & Answers
            </h2>
            {memory.length === 0 ? (
              <div className="text-center py-12">
                <Brain size={24} className="mx-auto text-[#52525b] mb-3" />
                <p className="text-sm text-[#71717a]">
                  No institutional memory yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {memory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#111111] border border-[#27272a] rounded-lg p-5"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <HelpCircle
                        size={16}
                        className="text-[#3b82f6] mt-0.5 flex-shrink-0"
                      />
                      <h3 className="text-sm font-medium text-[#fafafa]">
                        {item.question}
                      </h3>
                      <span
                        className={`ml-auto text-xs ${getConfidenceColor(item.confidence)}`}
                      >
                        {Math.round(item.confidence * 100)}% confidence
                      </span>
                    </div>
                    <div className="ml-7">
                      <p className="text-sm text-[#a1a1aa] leading-relaxed mb-3">
                        {item.answer}
                      </p>
                      <div className="space-y-1.5">
                        {parseEvidence(item.evidence).map((e, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle
                              size={10}
                              className="text-emerald-400"
                            />
                            <span className="text-xs text-[#71717a]">{e}</span>
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
            <h2 className="text-lg font-medium text-[#fafafa] mb-4">
              Similar Repositories
            </h2>
            {crossRepo.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle
                  size={24}
                  className="mx-auto text-[#52525b] mb-3"
                />
                <p className="text-sm text-[#71717a]">
                  No similar repositories found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crossRepo.map((repo) => (
                  <Link
                    key={repo.id}
                    href={`/repositories/${repo.id}`}
                    className="bg-[#111111] border border-[#27272a] rounded-lg p-4 hover:border-[#3b82f6]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-[#fafafa]">
                          {repo.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {repo.language && (
                            <span className="text-xs text-[#71717a]">
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
                        <span className="text-lg font-semibold text-[#fafafa]">
                          {repo.bhavya_score}
                        </span>
                        <p className="text-[10px] text-[#52525b]">
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
