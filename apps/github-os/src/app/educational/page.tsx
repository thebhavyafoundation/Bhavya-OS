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

const typeColors: Record<string, string> = {
  lesson: "bg-blue-900/40 text-blue-300 border-blue-800",
  workshop: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  lab: "bg-amber-900/40 text-amber-300 border-amber-800",
  reading: "bg-violet-900/40 text-violet-300 border-violet-800",
  capstone: "bg-pink-900/40 text-pink-300 border-pink-800",
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
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#fafafa]">
              Educational Exports
            </h1>
            <p className="text-sm text-[#71717a] mt-1">
              Reusable learning materials generated from repositories
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]"
              />
              <input
                type="text"
                placeholder="Search exports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="px-3 py-2.5 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#a1a1aa] appearance-none cursor-pointer"
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
              className="px-3 py-2.5 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#a1a1aa] appearance-none cursor-pointer"
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
                      className="bg-[#111111] border border-[#27272a] rounded-lg p-5 animate-pulse"
                    >
                      <div className="h-5 bg-[#27272a] rounded w-1/3 mb-3" />
                      <div className="h-4 bg-[#27272a] rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredExports.length === 0 ? (
                <div className="text-center py-20">
                  <GraduationCap
                    size={24}
                    className="mx-auto text-[#52525b] mb-3"
                  />
                  <p className="text-sm text-[#71717a]">
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
                        className={`w-full text-left bg-[#111111] border rounded-lg p-5 transition-all duration-200 ${
                          selectedExport?.id === exp.id
                            ? "border-[#3b82f6] ring-1 ring-[#3b82f6]/50"
                            : "border-[#27272a] hover:border-[#3b82f6]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={`p-1.5 rounded ${typeColors[exp.export_type] || "bg-zinc-800 text-zinc-400"}`}
                            >
                              {typeIcons[exp.export_type] || (
                                <FileText size={14} />
                              )}
                            </span>
                            <div>
                              <h3 className="text-sm font-medium text-[#fafafa]">
                                {exp.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-[#52525b] capitalize">
                                  {exp.export_type}
                                </span>
                                {exp.repository_name && (
                                  <>
                                    <span className="text-xs text-[#52525b]">
                                      ·
                                    </span>
                                    <span className="text-xs text-[#52525b]">
                                      {exp.repository_name}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {meta.duration && (
                            <span className="text-xs text-[#71717a]">
                              {meta.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#71717a] line-clamp-2 ml-10">
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
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 sticky top-8 max-h-[calc(100vh-120px)] overflow-y-auto">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`p-1.5 rounded ${typeColors[selectedExport.export_type] || "bg-zinc-800 text-zinc-400"}`}
                      >
                        {typeIcons[selectedExport.export_type] || (
                          <FileText size={14} />
                        )}
                      </span>
                      <div>
                        <h2 className="text-lg font-semibold text-[#fafafa]">
                          {selectedExport.title}
                        </h2>
                        <span className="text-xs text-[#52525b] capitalize">
                          {selectedExport.export_type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedExport(null)}
                      className="text-[#71717a] hover:text-[#fafafa] transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <pre className="text-sm text-[#a1a1aa] whitespace-pre-wrap font-mono leading-relaxed">
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
