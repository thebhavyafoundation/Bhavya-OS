"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  GraduationCap,
  Search,
  BookOpen,
  Clock,
  BarChart3,
} from "lucide-react";
import {
  Card,
  Badge,
  Skeleton,
  Breadcrumb,
  EmptyState,
  AppLayout,
} from "@bhavya/platform-ui";

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
    <AppLayout sidebar={<Sidebar />}>
      <div className="animate-fade-in">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Learning" },
          ]}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">
            Learning
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Educational materials generated from repositories
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex-1 relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search learning materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-secondary transition-colors"
            />
          </div>
          <div className="flex gap-1 bg-bg-secondary border border-border-primary rounded-md p-1 overflow-x-auto">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 text-xs rounded capitalize transition-colors whitespace-nowrap ${
                  typeFilter === type
                    ? "bg-bg-hover text-text-primary"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                {type === "all" ? "All" : type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} padding="lg">
                    <Skeleton width="30%" height={16} className="mb-2" />
                    <Skeleton width="60%" height={12} />
                  </Card>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<GraduationCap size={24} />}
                title={
                  search || typeFilter !== "all"
                    ? "No materials match your filters"
                    : "No learning materials yet"
                }
                description="Learning materials are generated when you analyze repositories"
              />
            ) : (
              <div className="space-y-3">
                {filtered.map((exp, i) => (
                  <button
                    key={exp.id}
                    onClick={() => setSelected(exp)}
                    className={`w-full text-left border rounded-lg p-5 transition-all duration-fast animate-fade-in ${
                      selected?.id === exp.id
                        ? "bg-bg-secondary border-accent-blue"
                        : "bg-bg-secondary border-border-primary hover:border-border-secondary"
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-text-tertiary">
                        {typeIcons[exp.export_type] || <BookOpen size={14} />}
                      </span>
                      <Badge variant="default" size="sm">
                        {exp.export_type}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-text-primary mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-text-muted truncate">
                      {exp.content.substring(0, 100)}...
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <Card padding="lg" className="sticky top-8 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-text-tertiary">
                    {typeIcons[selected.export_type] || (
                      <BookOpen size={14} />
                    )}
                  </span>
                  <Badge variant="default" size="sm">
                    {selected.export_type}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-text-primary mb-4">
                  {selected.title}
                </h3>
                <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed max-h-[60vh] overflow-y-auto">
                  {selected.content}
                </pre>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
