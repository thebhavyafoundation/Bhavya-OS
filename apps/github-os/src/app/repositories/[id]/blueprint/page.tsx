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
              Build Blueprint Generator
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Project blueprint from repository analysis
            </p>
          </div>

          {blueprints.length === 0 ? (
            <div className="text-center py-20">
              <FileText
                size={24}
                className="mx-auto mb-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
              >
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
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className="text-lg font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {bp.title}
                        </h3>
                        <span
                          className="px-2 py-0.5 text-xs rounded capitalize"
                          style={{
                            background: "var(--color-bg-tertiary)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {bp.blueprint_type}
                        </span>
                      </div>
                      <p
                        className="text-sm mb-3"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {bp.overview}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock
                          size={12}
                          style={{ color: "var(--color-text-muted)" }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {bp.estimated_effort}
                        </span>
                      </div>
                    </div>

                    {/* Folder Structure */}
                    {folderStructure.length > 0 && (
                      <div
                        className="rounded-lg p-5 mb-4"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <FolderOpen
                            size={14}
                            style={{ color: "var(--color-accent-gold)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Folder Structure
                          </h4>
                        </div>
                        <div
                          className="rounded p-3 font-mono text-xs space-y-1"
                          style={{
                            background: "var(--color-bg-primary)",
                            borderColor: "var(--color-border-primary)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {folderStructure.map((f: string, i: number) => (
                            <div key={i}>{f}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {techStack.length > 0 && (
                      <div
                        className="rounded-lg p-5 mb-4"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Layers
                            size={14}
                            style={{ color: "var(--color-accent-earth)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Tech Stack
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {techStack.map((t: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs rounded-full"
                              style={{
                                background: "var(--color-bg-tertiary)",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Implementation Roadmap */}
                    {roadmap.length > 0 && (
                      <div
                        className="rounded-lg p-5 mb-4"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Route
                            size={14}
                            style={{ color: "var(--color-accent-green-light)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Implementation Roadmap
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {roadmap.map((r: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 rounded"
                              style={{
                                background: "var(--color-bg-primary)",
                                borderColor: "var(--color-border-primary)",
                              }}
                            >
                              <span
                                className="font-mono text-xs"
                                style={{
                                  color: "var(--color-accent-green-light)",
                                }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span
                                className="text-sm"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                {r}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Decisions */}
                    {keyDecisions.length > 0 && (
                      <div
                        className="rounded-lg p-5 mb-4"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <h4
                          className="text-sm font-medium mb-3"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Key Decisions
                        </h4>
                        <div className="space-y-2">
                          {keyDecisions.map((d: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <span
                                className="mt-0.5"
                                style={{ color: "var(--color-accent-gold)" }}
                              >
                                ~
                              </span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pitfalls */}
                    {pitfalls.length > 0 && (
                      <div
                        className="rounded-lg p-5 mb-4"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border-primary)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle
                            size={14}
                            style={{ color: "var(--color-accent-earth)" }}
                          />
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Common Pitfalls
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {pitfalls.map((p: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <span
                                className="mt-0.5"
                                style={{ color: "var(--color-accent-earth)" }}
                              >
                                !
                              </span>
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Testing Strategy */}
                    <div
                      className="rounded-lg p-5 mb-4"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TestTube
                          size={14}
                          style={{ color: "var(--color-accent-gold)" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Testing Strategy
                        </h4>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {bp.testing_strategy}
                      </p>
                    </div>

                    {/* Deployment Guide */}
                    <div
                      className="rounded-lg p-5"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen
                          size={14}
                          style={{ color: "var(--color-accent-gold)" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Deployment Guide
                        </h4>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
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
