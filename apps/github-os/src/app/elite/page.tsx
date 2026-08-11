"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Layers,
  Code,
  BookOpen,
  FolderOpen,
  Palette,
  Brain,
  Server,
  Gauge,
  Shield,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface LibraryEntry {
  id: string;
  category: string;
  title: string;
  description: string;
  repository_id: string;
  tags: string;
  quality_score: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  architecture: <Layers size={14} />,
  testing: <Code size={14} />,
  documentation: <BookOpen size={14} />,
  "folder-structures": <FolderOpen size={14} />,
  "design-systems": <Palette size={14} />,
  "ai-agents": <Brain size={14} />,
  devops: <Server size={14} />,
  performance: <Gauge size={14} />,
  security: <Shield size={14} />,
};

const categoryColors: Record<string, string> = {
  architecture: "var(--color-accent-gold)",
  testing: "var(--color-accent-green-light)",
  documentation: "var(--color-accent-earth)",
  "folder-structures": "var(--color-viz-forest-light)",
  "design-systems": "var(--color-viz-gold)",
  "ai-agents": "var(--color-viz-sage)",
  devops: "var(--color-viz-earth)",
  performance: "var(--color-status-error)",
  security: "var(--color-viz-forest)",
};

export default function ElitePage() {
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/elite");
      if (res.ok) {
        const data = await res.json();
        setLibrary(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const categories = ["all", ...new Set(library.map((e) => e.category))];
  const filtered =
    filter === "all" ? library : library.filter((e) => e.category === filter);

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
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Elite Engineering Library
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Reusable patterns and practices from indexed repositories
              </p>
            </div>
            <Crown size={24} style={{ color: "var(--color-accent-earth)" }} />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors capitalize ${
                  filter === cat ? "" : "hover:"
                }`}
                style={{
                  background:
                    filter === cat
                      ? "var(--color-accent-gold)"
                      : "var(--color-surface)",
                  borderColor:
                    filter === cat
                      ? "var(--color-accent-gold)"
                      : "var(--color-bg-tertiary)",
                  color:
                    filter === cat
                      ? "var(--color-text-inverse)"
                      : "var(--color-text-tertiary)",
                }}
              >
                {cat === "all" ? "All Categories" : cat.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Library Entries */}
          <div className="space-y-3">
            {filtered.map((entry) => {
              const tags = JSON.parse(entry.tags || "[]");
              return (
                <div
                  key={entry.id}
                  className="rounded-lg p-5 transition-colors"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-bg-tertiary)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          color:
                            categoryColors[entry.category] ||
                            "var(--color-text-tertiary)",
                        }}
                      >
                        {categoryIcons[entry.category] || <Code size={14} />}
                      </span>
                      <div>
                        <h3
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {entry.title}
                        </h3>
                        <p
                          className="text-xs capitalize"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {entry.category.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            entry.quality_score >= 90
                              ? "var(--color-accent-green-light)"
                              : entry.quality_score >= 80
                                ? "var(--color-accent-gold)"
                                : entry.quality_score >= 70
                                  ? "var(--color-accent-earth)"
                                  : "var(--color-status-error)",
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        {entry.quality_score}
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {entry.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] rounded"
                          style={{
                            background: "var(--color-bg-tertiary)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/repositories/${entry.repository_id}`}
                      className="text-xs transition-colors"
                      style={{ color: "var(--color-accent-gold)" }}
                    >
                      View source
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
