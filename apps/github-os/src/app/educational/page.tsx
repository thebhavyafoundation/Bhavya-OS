"use client";

import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Wrench,
  Lightbulb,
  FileText,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface EducationalExport {
  id: string;
  repository_id: string;
  export_type: string;
  title: string;
  content: string;
  metadata: string;
  repository_name?: string;
}

interface Filters {
  types: string[];
  repositories: { id: string; name: string }[];
}

const typeIcons: Record<string, React.ReactNode> = {
  lesson: <BookOpen size={14} />,
  workshop: <Wrench size={14} />,
  lab: <Lightbulb size={14} />,
  reading: <FileText size={14} />,
  capstone: <GraduationCap size={14} />,
};

const typeColors: Record<string, { bg: string; text: string; border: string }> =
  {
    lesson: {
      bg: "var(--color-viz-forest-bg)",
      text: "var(--color-viz-forest-light)",
      border: "var(--color-viz-forest-border)",
    },
    workshop: {
      bg: "var(--color-viz-earth-bg)",
      text: "var(--color-viz-earth-light)",
      border: "var(--color-viz-earth-border)",
    },
    lab: {
      bg: "var(--color-viz-gold-bg)",
      text: "var(--color-viz-gold-light)",
      border: "var(--color-viz-gold-border)",
    },
    reading: {
      bg: "var(--color-viz-sage-bg)",
      text: "var(--color-viz-sage-light)",
      border: "var(--color-viz-sage-border)",
    },
    capstone: {
      bg: "var(--color-viz-gold-light-bg)",
      text: "var(--color-viz-gold-light)",
      border: "var(--color-viz-gold-light-border)",
    },
  };

export default function EducationalPage() {
  const [exports, setExports] = useState<EducationalExport[]>([]);
  const [filters, setFilters] = useState<Filters>({
    types: [],
    repositories: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [exportType, setExportType] = useState("");
  const [repository, setRepository] = useState("");
  const [selectedExport, setSelectedExport] =
    useState<EducationalExport | null>(null);

  useEffect(() => {
    fetchExports();
  }, [exportType, repository]);

  async function fetchExports() {
    setLoading(true);
    const params = new URLSearchParams();
    if (exportType) params.set("type", exportType);
    if (repository) params.set("repository", repository);

    const res = await fetch(`/api/educational?${params}`);
    const data = await res.json();
    setExports(data.exports);
    setFilters(data.filters);
    setLoading(false);
  }

  function parseMetadata(metadata: string) {
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  }

  const filteredExports = exports.filter((e) =>
    search
      ? e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase())
      : true,
  );

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Educational Exports
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Reusable learning materials generated from repositories
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <input
                type="text"
                placeholder="Search exports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-bg-tertiary)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-bg-tertiary)",
                color: "var(--color-text-secondary)",
              }}
              aria-label="Filter by export type"
            >
              <option value="">All Types</option>
              {filters.types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-bg-tertiary)",
                color: "var(--color-text-secondary)",
              }}
              aria-label="Filter by repository"
            >
              <option value="">All Repositories</option>
              {filters.repositories.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg p-5 animate-pulse"
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-bg-tertiary)",
                      }}
                    >
                      <div
                        className="h-5 rounded w-1/3 mb-3"
                        style={{ background: "var(--color-bg-tertiary)" }}
                      />
                      <div
                        className="h-4 rounded w-1/2"
                        style={{ background: "var(--color-bg-tertiary)" }}
                      />
                    </div>
                  ))}
                </div>
              ) : filteredExports.length === 0 ? (
                <div className="text-center py-20">
                  <GraduationCap
                    size={24}
                    className="mx-auto mb-3"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    No educational exports found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExports.map((exp) => {
                    const meta = parseMetadata(exp.metadata);
                    return (
                      <button
                        key={exp.id}
                        onClick={() => setSelectedExport(exp)}
                        className="w-full text-left border rounded-lg p-5 transition-all duration-200"
                        style={{
                          background: "var(--color-surface)",
                          borderColor:
                            selectedExport?.id === exp.id
                              ? "var(--color-accent-gold)"
                              : "var(--color-bg-tertiary)",
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span
                              className="p-1.5 rounded"
                              style={{
                                background:
                                  typeColors[exp.export_type]?.bg ||
                                  "var(--color-bg-tertiary)",
                                color:
                                  typeColors[exp.export_type]?.text ||
                                  "var(--color-text-tertiary)",
                                border: `1px solid ${typeColors[exp.export_type]?.border || "var(--color-bg-tertiary)"}`,
                              }}
                            >
                              {typeIcons[exp.export_type] || (
                                <FileText size={14} />
                              )}
                            </span>
                            <div>
                              <h3
                                className="text-sm font-medium"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                {exp.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span
                                  className="text-xs capitalize"
                                  style={{ color: "var(--color-text-muted)" }}
                                >
                                  {exp.export_type}
                                </span>
                                {exp.repository_name && (
                                  <>
                                    <span
                                      className="text-xs"
                                      style={{
                                        color: "var(--color-text-muted)",
                                      }}
                                    >
                                      ·
                                    </span>
                                    <span
                                      className="text-xs"
                                      style={{
                                        color: "var(--color-text-muted)",
                                      }}
                                    >
                                      {exp.repository_name}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {meta.duration && (
                            <span
                              className="text-xs"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              {meta.duration}
                            </span>
                          )}
                        </div>
                        <p
                          className="text-xs line-clamp-2 ml-10"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          {exp.content.split("\n")[0]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedExport && (
              <div className="w-[400px] flex-shrink-0">
                <div
                  className="rounded-lg p-5 sticky top-8 max-h-[calc(100vh-120px)] overflow-y-auto"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-bg-tertiary)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="p-1.5 rounded"
                        style={{
                          background:
                            typeColors[selectedExport.export_type]?.bg ||
                            "var(--color-bg-tertiary)",
                          color:
                            typeColors[selectedExport.export_type]?.text ||
                            "var(--color-text-tertiary)",
                          border: `1px solid ${typeColors[selectedExport.export_type]?.border || "var(--color-bg-tertiary)"}`,
                        }}
                      >
                        {typeIcons[selectedExport.export_type] || (
                          <FileText size={14} />
                        )}
                      </span>
                      <div>
                        <h2
                          className="text-lg font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {selectedExport.title}
                        </h2>
                        <span
                          className="text-xs capitalize"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {selectedExport.export_type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedExport(null)}
                      className="transition-colors"
                      style={{ color: "var(--color-text-tertiary)" }}
                      aria-label="Close detail panel"
                    >
                      ✕
                    </button>
                  </div>

                  <pre
                    className="text-sm whitespace-pre-wrap font-mono leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {selectedExport.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
