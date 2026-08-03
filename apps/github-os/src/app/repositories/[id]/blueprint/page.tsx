"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Layers,
  FolderOpen,
  Route,
  AlertTriangle,
  BookOpen,
  TestTube,
  Clock,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Blueprint {
  id: string;
  blueprint_type: string;
  title: string;
  overview: string;
  folder_structure: string;
  tech_stack: string;
  implementation_roadmap: string;
  key_decisions: string;
  pitfalls: string;
  testing_strategy: string;
  deployment_guide: string;
  estimated_effort: string;
}

export default function BlueprintPage() {
  const params = useParams();
  const id = params.id as string;
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/blueprint`);
      if (res.ok) {
        const data = await res.json();
        setBlueprints(data);
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
              Build Blueprint Generator
            </h1>
            <p className="text-sm text-[#71717a] mt-1">
              Project blueprint from repository analysis
            </p>
          </div>

          {blueprints.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={24} className="mx-auto text-[#52525b] mb-3" />
              <p className="text-sm text-[#71717a]">
                No blueprints available for this repository
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {blueprints.map((bp) => {
                const folderStructure = JSON.parse(bp.folder_structure || "[]");
                const techStack = JSON.parse(bp.tech_stack || "[]");
                const roadmap = JSON.parse(bp.implementation_roadmap || "[]");
                const keyDecisions = JSON.parse(bp.key_decisions || "[]");
                const pitfalls = JSON.parse(bp.pitfalls || "[]");

                return (
                  <div key={bp.id}>
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-[#fafafa]">
                          {bp.title}
                        </h3>
                        <span className="px-2 py-0.5 text-xs rounded bg-[#27272a] text-[#a1a1aa] capitalize">
                          {bp.blueprint_type}
                        </span>
                      </div>
                      <p className="text-sm text-[#a1a1aa] mb-3">
                        {bp.overview}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-[#52525b]" />
                        <span className="text-xs text-[#52525b]">
                          {bp.estimated_effort}
                        </span>
                      </div>
                    </div>

                    {/* Folder Structure */}
                    {folderStructure.length > 0 && (
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FolderOpen size={14} className="text-[#3b82f6]" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
                            Folder Structure
                          </h4>
                        </div>
                        <div className="bg-[#0a0a0a] border border-[#27272a] rounded p-3 font-mono text-xs text-[#a1a1aa] space-y-1">
                          {folderStructure.map((f: string, i: number) => (
                            <div key={i}>{f}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {techStack.length > 0 && (
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers size={14} className="text-[#f59e0b]" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
                            Tech Stack
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {techStack.map((t: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-[#27272a] text-[#a1a1aa] text-xs rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Implementation Roadmap */}
                    {roadmap.length > 0 && (
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Route size={14} className="text-emerald-400" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
                            Implementation Roadmap
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {roadmap.map((r: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#27272a] rounded"
                            >
                              <span className="text-emerald-400 font-mono text-xs">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-sm text-[#a1a1aa]">
                                {r}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Decisions */}
                    {keyDecisions.length > 0 && (
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                        <h4 className="text-sm font-medium text-[#fafafa] mb-3">
                          Key Decisions
                        </h4>
                        <div className="space-y-2">
                          {keyDecisions.map((d: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#a1a1aa]"
                            >
                              <span className="text-[#3b82f6] mt-0.5">~</span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pitfalls */}
                    {pitfalls.length > 0 && (
                      <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle size={14} className="text-amber-400" />
                          <h4 className="text-sm font-medium text-[#fafafa]">
                            Common Pitfalls
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {pitfalls.map((p: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#a1a1aa]"
                            >
                              <span className="text-amber-400 mt-0.5">!</span>
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Testing Strategy */}
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TestTube size={14} className="text-[#3b82f6]" />
                        <h4 className="text-sm font-medium text-[#fafafa]">
                          Testing Strategy
                        </h4>
                      </div>
                      <p className="text-sm text-[#a1a1aa]">
                        {bp.testing_strategy}
                      </p>
                    </div>

                    {/* Deployment Guide */}
                    <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={14} className="text-[#3b82f6]" />
                        <h4 className="text-sm font-medium text-[#fafafa]">
                          Deployment Guide
                        </h4>
                      </div>
                      <p className="text-sm text-[#a1a1aa]">
                        {bp.deployment_guide}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
