"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  GraduationCap,
  Search,
  ChevronRight,
  BookOpen,
  Clock,
  BarChart3,
} from "lucide-react";

interface EducationalExport {
  id: string;
  repository_id: string;
  export_type: string;
  title: string;
  content: string;
  metadata: string;
  repository_name?: string;
}

export default function LearningPage() {
  const [exports, setExports] = useState<EducationalExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selected, setSelected] = useState<EducationalExport | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/educational");
      const data = await res.json();
      setExports(data.exports || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = exports.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.export_type.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || e.export_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const types = ["all", ...new Set(exports.map((e) => e.export_type))];

  const typeIcons: Record<string, React.ReactNode> = {
    lesson: <BookOpen size={14} />,
    workshop: <Clock size={14} />,
    lab: <BarChart3 size={14} />,
    reading: <BookOpen size={14} />,
    capstone: <GraduationCap size={14} />,
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#52525b] mb-6">
            <Link href="/" className="hover:text-[#fafafa] transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#71717a]">Learning</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#fafafa]">Learning</h1>
            <p className="text-sm text-[#71717a] mt-1">
              Educational materials generated from repositories
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]"
              />
              <input
                type="text"
                placeholder="Search learning materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-[#27272a] rounded-md text-sm text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#3f3f46]"
              />
            </div>
            <div className="flex gap-1 bg-[#111111] border border-[#27272a] rounded-md p-1">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 text-xs rounded capitalize transition-colors ${
                    typeFilter === type
                      ? "bg-[#27272a] text-[#fafafa]"
                      : "text-[#71717a] hover:text-[#fafafa]"
                  }`}
                >
                  {type === "all" ? "All" : type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-[#111111] border border-[#27272a] rounded-lg p-5 animate-pulse"
                    >
                      <div className="h-4 bg-[#27272a] rounded w-1/3 mb-2" />
                      <div className="h-3 bg-[#27272a] rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <GraduationCap
                    size={24}
                    className="mx-auto text-[#52525b] mb-3"
                  />
                  <p className="text-sm text-[#71717a]">
                    {search || typeFilter !== "all"
                      ? "No materials match your filters"
                      : "No learning materials yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setSelected(exp)}
                      className={`w-full text-left bg-[#111111] border rounded-lg p-5 transition-colors ${
                        selected?.id === exp.id
                          ? "border-[#3b82f6]"
                          : "border-[#27272a] hover:border-[#3f3f46]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#71717a]">
                          {typeIcons[exp.export_type] || <BookOpen size={14} />}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] rounded bg-[#27272a] text-[#a1a1aa] capitalize">
                          {exp.export_type}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-[#fafafa] mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-[#52525b] truncate">
                        {exp.content.substring(0, 100)}...
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <div className="w-[400px] flex-shrink-0">
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 sticky top-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#71717a]">
                      {typeIcons[selected.export_type] || (
                        <BookOpen size={14} />
                      )}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-[#27272a] text-[#a1a1aa] capitalize">
                      {selected.export_type}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-[#fafafa] mb-4">
                    {selected.title}
                  </h3>
                  <pre className="text-xs text-[#a1a1aa] whitespace-pre-wrap font-mono leading-relaxed max-h-[60vh] overflow-y-auto">
                    {selected.content}
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
