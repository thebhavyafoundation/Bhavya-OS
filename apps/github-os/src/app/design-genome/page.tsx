"use client";

import { useState, useEffect } from "react";
import {
  Dna,
  Search,
  Filter,
  Star,
  Shield,
  Zap,
  Smartphone,
  BookOpen,
  ChevronRight,
  Target,
  Leaf,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { scoreToColor, scoreToBg, scoreToBorder } from "@/lib/score-color";
import { parseJsonArray, parseJson } from "@/lib/json-utils";

interface GenomeEntry {
  id: string;
  category: string;
  pattern_name: string;
  frequency: number;
  avg_quality_score: number;
  avg_bhavya_relevance: number;
  source_ids: string;
  mission_relevance: string;
  accessibility_rating: string;
  performance_rating: string;
  mobile_rating: string;
  institutional_fit: string;
  recommended_for: string;
  evidence: string | null;
  calculated_at: string;
}

interface Filters {
  categories: string[];
}

function RatingBadge({ rating }: { rating: string }) {
  const styles: Record<string, React.CSSProperties> = {
    excellent: {
      color: "var(--color-accent-green-light)",
      background: "var(--color-viz-forest-bg)",
      borderColor: "var(--color-viz-forest-border)",
    },
    good: {
      color: "var(--color-accent-gold)",
      background: "var(--color-viz-gold-bg)",
      borderColor: "var(--color-viz-gold-border)",
    },
    moderate: {
      color: "var(--color-accent-earth)",
      background: "var(--color-viz-earth-bg)",
      borderColor: "var(--color-viz-earth-border)",
    },
    poor: {
      color: "var(--color-status-error)",
      background: "var(--color-status-error-bg, rgba(192,57,43,0.15))",
      borderColor: "var(--color-status-error-border, rgba(192,57,43,0.3))",
    },
    unknown: {
      color: "var(--color-text-muted)",
      background: "var(--color-bg-secondary)",
      borderColor: "var(--color-border-primary)",
    },
  };

  return (
    <span
      className="px-2 py-0.5 rounded border text-[10px] font-medium"
      style={styles[rating] || styles.unknown}
    >
      {rating}
    </span>
  );
}

const categoryIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  hero: Star,
  navigation: Filter,
  storytelling: BookOpen,
  editorial: BookOpen,
  cards: Target,
  forms: Target,
  dashboard: Target,
  dataviz: Target,
  maps: Target,
  timeline: Target,
  search: Search,
  filters: Filter,
  responsive: Smartphone,
  accessibility: Shield,
  interaction: Zap,
  "motion-scroll": Zap,
  "motion-reveal": Zap,
  "motion-parallax": Zap,
  "motion-hover": Zap,
  "motion-transition": Zap,
  "motion-cursor": Zap,
  "motion-page-transition": Zap,
  "institutional-mission": Leaf,
  "institutional-impact": Leaf,
  "institutional-transparency": Leaf,
  "institutional-research": Leaf,
  "institutional-publication": Leaf,
  "institutional-program": Leaf,
  "institutional-project": Leaf,
  "institutional-governance": Leaf,
};

const categoryColors: Record<string, React.CSSProperties> = {
  hero: {
    color: "var(--color-accent-gold)",
    background: "var(--color-viz-gold-bg)",
    borderColor: "var(--color-viz-gold-border)",
  },
  navigation: {
    color: "var(--color-accent-green-light)",
    background: "var(--color-viz-forest-bg)",
    borderColor: "var(--color-viz-forest-border)",
  },
  storytelling: {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  editorial: {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  cards: {
    color: "var(--color-accent-green-light)",
    background: "var(--color-viz-forest-bg)",
    borderColor: "var(--color-viz-forest-border)",
  },
  forms: {
    color: "var(--color-accent-gold)",
    background: "var(--color-viz-gold-bg)",
    borderColor: "var(--color-viz-gold-border)",
  },
  dashboard: {
    color: "var(--color-accent-green-light)",
    background: "var(--color-viz-forest-bg)",
    borderColor: "var(--color-viz-forest-border)",
  },
  dataviz: {
    color: "var(--color-accent-gold)",
    background: "var(--color-viz-gold-bg)",
    borderColor: "var(--color-viz-gold-border)",
  },
  "motion-scroll": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "motion-reveal": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "motion-parallax": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "institutional-mission": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
  "institutional-impact": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
  "institutional-transparency": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
  "institutional-research": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
};

export default function DesignGenomePage() {
  const [genome, setGenome] = useState<GenomeEntry[]>([]);
  const [filters, setFilters] = useState<Filters>({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [mission, setMission] = useState("");
  const [sort, setSort] = useState("avg_bhavya_relevance");
  const [selectedEntry, setSelectedEntry] = useState<GenomeEntry | null>(null);

  useEffect(() => {
    fetchGenome();
  }, [search, category, mission, sort]);

  async function fetchGenome() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (mission) params.set("mission", mission);
    params.set("sort", sort);

    const res = await fetch(`/api/design-genome?${params}`);
    const data = await res.json();
    setGenome(data.genome);
    setFilters(data.filters);
    setLoading(false);
  }

  const filteredGenome = genome.filter((g) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      g.pattern_name.toLowerCase().includes(term) ||
      g.category.toLowerCase().includes(term) ||
      g.evidence?.toLowerCase().includes(term)
    );
  });

  // Group by category
  const grouped = filteredGenome.reduce(
    (acc, entry) => {
      if (!acc[entry.category]) acc[entry.category] = [];
      acc[entry.category].push(entry);
      return acc;
    },
    {} as Record<string, GenomeEntry[]>,
  );

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Dna size={24} style={{ color: "var(--color-accent-gold)" }} />
              <h1
                className="text-2xl font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Design Genome
              </h1>
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Aggregated pattern intelligence across analyzed repositories and
              websites
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <input
                type="text"
                placeholder="Search patterns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent-gold)] transition-colors"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border-primary)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
                color: "var(--color-text-secondary)",
              }}
            >
              <option value="">All Categories</option>
              {filters.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
                color: "var(--color-text-secondary)",
              }}
            >
              <option value="avg_bhavya_relevance">Bhavya Relevance</option>
              <option value="avg_quality_score">Quality Score</option>
              <option value="frequency">Frequency</option>
              <option value="pattern_name">Name</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div
              className="rounded-lg p-4 text-center"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {genome.length}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Total Patterns
              </div>
            </div>
            <div
              className="rounded-lg p-4 text-center"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-accent-gold)" }}
              >
                {genome.filter((g) => g.avg_bhavya_relevance >= 70).length}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                High Bhavya Fit
              </div>
            </div>
            <div
              className="rounded-lg p-4 text-center"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-accent-green-light)" }}
              >
                {
                  genome.filter((g) => g.accessibility_rating === "excellent")
                    .length
                }
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Accessible
              </div>
            </div>
            <div
              className="rounded-lg p-4 text-center"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-accent-gold)" }}
              >
                {new Set(genome.map((g) => g.category)).size}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Categories
              </div>
            </div>
          </div>

          {/* Content */}
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
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <div
                        className="h-5 rounded w-1/3 mb-3"
                        style={{ background: "var(--color-bg-tertiary)" }}
                      />
                      <div
                        className="h-4 rounded w-2/3 mb-2"
                        style={{ background: "var(--color-bg-tertiary)" }}
                      />
                    </div>
                  ))}
                </div>
              ) : filteredGenome.length === 0 ? (
                <div className="text-center py-20">
                  <Dna
                    size={24}
                    className="mx-auto mb-3"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    No genome entries found
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Analyze websites and repositories to build the design genome
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(grouped).map(([cat, entries]) => {
                    const CatIcon = categoryIcons[cat] || Star;
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-3">
                          <CatIcon size={16} />
                          <h2
                            className="text-sm font-medium uppercase tracking-wider"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {cat}
                          </h2>
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            ({entries.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {entries.map((entry) => {
                            const recommended = parseJsonArray(
                              entry.recommended_for,
                            );
                            return (
                              <button
                                key={entry.id}
                                onClick={() => setSelectedEntry(entry)}
                                className="text-left rounded-lg p-4 transition-all duration-200"
                                style={{
                                  background: "var(--color-surface)",
                                  borderColor:
                                    selectedEntry?.id === entry.id
                                      ? "var(--color-accent-gold)"
                                      : "var(--color-border-primary)",
                                  ...(selectedEntry?.id === entry.id
                                    ? { boxShadow: "var(--ring-focus)" }
                                    : {}),
                                }}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h3
                                    className="text-sm font-medium"
                                    style={{
                                      color: "var(--color-text-primary)",
                                    }}
                                  >
                                    {entry.pattern_name}
                                  </h3>
                                  <span
                                    className="text-xs"
                                    style={{
                                      color: "var(--color-text-tertiary)",
                                    }}
                                  >
                                    {entry.frequency}x
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  <RatingBadge
                                    rating={entry.accessibility_rating}
                                  />
                                  <RatingBadge
                                    rating={entry.performance_rating}
                                  />
                                  <RatingBadge rating={entry.mobile_rating} />
                                  <RatingBadge
                                    rating={entry.institutional_fit}
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  <div
                                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                                    style={{
                                      background: "var(--color-bg-secondary)",
                                    }}
                                  >
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${entry.avg_bhavya_relevance}%`,
                                        background: "var(--color-accent-gold)",
                                      }}
                                    />
                                  </div>
                                  <span
                                    className="text-[10px]"
                                    style={{
                                      color: "var(--color-text-tertiary)",
                                    }}
                                  >
                                    {Math.round(entry.avg_bhavya_relevance)}%
                                  </span>
                                </div>

                                {recommended.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {recommended.slice(0, 3).map((r, i) => (
                                      <span
                                        key={i}
                                        className="px-1.5 py-0.5 rounded text-[9px]"
                                        style={{
                                          background:
                                            "var(--color-surface-forest-medium)",
                                          borderColor:
                                            "var(--color-surface-forest-strong)",
                                          color:
                                            "var(--color-accent-green-light)",
                                          borderWidth: 1,
                                          borderStyle: "solid",
                                        }}
                                      >
                                        {r}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedEntry && (
              <div className="w-[380px] flex-shrink-0">
                <div
                  className="rounded-lg p-5 sticky top-8"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2
                      className="text-lg font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {selectedEntry.pattern_name}
                    </h2>
                    <button
                      onClick={() => setSelectedEntry(null)}
                      className="transition-colors"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Category
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded border text-[10px] font-medium"
                        style={
                          categoryColors[selectedEntry.category] || {
                            color: "var(--color-text-muted)",
                            background: "var(--color-bg-secondary)",
                            borderColor: "var(--color-border-primary)",
                          }
                        }
                      >
                        {selectedEntry.category}
                      </span>
                    </div>

                    {selectedEntry.evidence && (
                      <div>
                        <h3
                          className="text-xs uppercase tracking-wider mb-2"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          Evidence
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {selectedEntry.evidence}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Ratings
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Accessibility
                          </span>
                          <RatingBadge
                            rating={selectedEntry.accessibility_rating}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Performance
                          </span>
                          <RatingBadge
                            rating={selectedEntry.performance_rating}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Mobile
                          </span>
                          <RatingBadge rating={selectedEntry.mobile_rating} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Institutional Fit
                          </span>
                          <RatingBadge
                            rating={selectedEntry.institutional_fit}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Scores
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs w-24"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Quality
                          </span>
                          <div
                            className="flex-1 h-1.5 rounded-full overflow-hidden"
                            style={{ background: "var(--color-bg-secondary)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${selectedEntry.avg_quality_score}%`,
                                background: "var(--color-accent-gold)",
                              }}
                            />
                          </div>
                          <span
                            className="text-[10px] w-6"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            {Math.round(selectedEntry.avg_quality_score)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs w-24"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Bhavya Fit
                          </span>
                          <div
                            className="flex-1 h-1.5 rounded-full overflow-hidden"
                            style={{ background: "var(--color-bg-secondary)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${selectedEntry.avg_bhavya_relevance}%`,
                                background: "var(--color-accent-gold)",
                              }}
                            />
                          </div>
                          <span
                            className="text-[10px] w-6"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            {Math.round(selectedEntry.avg_bhavya_relevance)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Recommended For
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {parseJsonArray(selectedEntry.recommended_for).map(
                          (r, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px]"
                              style={{
                                background:
                                  "var(--color-surface-forest-medium)",
                                borderColor:
                                  "var(--color-surface-forest-strong)",
                                color: "var(--color-accent-green-light)",
                                borderWidth: 1,
                                borderStyle: "solid",
                              }}
                            >
                              {r}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h3
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Mission Relevance
                      </h3>
                      <div
                        className="rounded-md p-3"
                        style={{
                          background: "var(--color-bg-primary)",
                          borderColor: "var(--color-border-primary)",
                          borderWidth: 1,
                          borderStyle: "solid",
                        }}
                      >
                        <pre
                          className="text-[10px] whitespace-pre-wrap font-mono"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {JSON.stringify(
                            parseJson(selectedEntry.mission_relevance),
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                    </div>

                    <div
                      className="text-[10px]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Sources: {parseJsonArray(selectedEntry.source_ids).length}{" "}
                      analyzed sources
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
