"use client";

import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Lightbulb,
  GraduationCap,
  ChevronRight,
  ExternalLink,
  Star,
  Layers,
  Palette,
  MousePointer,
  Smartphone,
  Shield,
  Zap,
  Globe,
  Target,
  Filter,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { scoreToColor, scoreToBg, scoreToBorder } from "@/lib/score-color";
import { parseJsonArray } from "@/lib/json-utils";

interface Pattern {
  id: string;
  name: string;
  slug: string;
  category: string;
  explanation: string;
  use_cases: string;
  related_patterns: string;
  educational_value: string | null;
  bhavya_recommendation: string | null;
  learning_mode: string | null;
  difficulty: string;
}

interface Filters {
  categories: string[];
  difficulties: string[];
}

const categoryStyles: Record<string, React.CSSProperties> = {
  creational: {
    color: "var(--color-accent-gold)",
    background: "var(--color-viz-gold-bg)",
    borderColor: "var(--color-viz-gold-border)",
  },
  structural: {
    color: "var(--color-accent-green-light)",
    background: "var(--color-viz-forest-bg)",
    borderColor: "var(--color-viz-forest-border)",
  },
  behavioral: {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  architectural: {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
  "design-hero": {
    color: "var(--color-accent-gold)",
    background: "var(--color-viz-gold-bg)",
    borderColor: "var(--color-viz-gold-border)",
  },
  "design-navigation": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-viz-forest-bg)",
    borderColor: "var(--color-viz-forest-border)",
  },
  "design-storytelling": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "design-editorial": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "design-cards": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-viz-forest-bg)",
    borderColor: "var(--color-viz-forest-border)",
  },
  "design-forms": {
    color: "var(--color-accent-gold)",
    background: "var(--color-viz-gold-bg)",
    borderColor: "var(--color-viz-gold-border)",
  },
  "design-dashboard": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-viz-forest-bg)",
    borderColor: "var(--color-viz-forest-border)",
  },
  "design-dataviz": {
    color: "var(--color-accent-gold)",
    background: "var(--color-viz-gold-bg)",
    borderColor: "var(--color-viz-gold-border)",
  },
  "design-responsive": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "design-accessibility": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
  "design-interaction": {
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
  "motion-hover": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "motion-transition": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "motion-cursor": {
    color: "var(--color-accent-earth)",
    background: "var(--color-viz-earth-bg)",
    borderColor: "var(--color-viz-earth-border)",
  },
  "motion-page-transition": {
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
  "institutional-publication": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
  "institutional-program": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
  "institutional-project": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
  "institutional-governance": {
    color: "var(--color-accent-green-light)",
    background: "var(--color-surface-forest-subtle)",
    borderColor: "var(--color-surface-forest-medium)",
  },
};

const fallbackCategoryStyle: React.CSSProperties = {
  color: "var(--color-text-muted)",
  background: "var(--color-bg-secondary)",
  borderColor: "var(--color-border-primary)",
};

const difficultyStyles: Record<string, React.CSSProperties> = {
  beginner: { color: "var(--color-accent-green-light)" },
  intermediate: { color: "var(--color-accent-gold)" },
  advanced: { color: "var(--color-accent-earth)" },
  expert: { color: "var(--color-status-error)" },
};

const categoryGroups = [
  {
    label: "Software Patterns",
    categories: ["creational", "structural", "behavioral", "architectural"],
  },
  {
    label: "Design Patterns",
    categories: [
      "design-hero",
      "design-navigation",
      "design-storytelling",
      "design-editorial",
      "design-cards",
      "design-forms",
      "design-dashboard",
      "design-dataviz",
      "design-responsive",
      "design-accessibility",
      "design-interaction",
    ],
  },
  {
    label: "Motion Patterns",
    categories: [
      "motion-scroll",
      "motion-reveal",
      "motion-parallax",
      "motion-hover",
      "motion-transition",
      "motion-cursor",
      "motion-page-transition",
    ],
  },
  {
    label: "Institutional Patterns",
    categories: [
      "institutional-mission",
      "institutional-impact",
      "institutional-transparency",
      "institutional-research",
      "institutional-publication",
      "institutional-program",
      "institutional-project",
      "institutional-governance",
    ],
  },
];

export default function PatternLibraryPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    difficulties: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  useEffect(() => {
    fetchPatterns();
  }, [search, category, difficulty]);

  async function fetchPatterns() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);

    const res = await fetch(`/api/patterns?${params}`);
    const data = await res.json();
    setPatterns(data.patterns);
    setFilters(data.filters);
    setLoading(false);
  }

  const groupedPatterns = categoryGroups
    .map((group) => ({
      ...group,
      patterns: patterns.filter((p) => group.categories.includes(p.category)),
    }))
    .filter((group) => group.patterns.length > 0);

  const ungroupedPatterns = patterns.filter(
    (p) => !categoryGroups.some((g) => g.categories.includes(p.category)),
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
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb
                size={24}
                style={{ color: "var(--color-accent-gold)" }}
              />
              <h1
                className="text-2xl font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Pattern Library
              </h1>
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Engineering, design, motion, and institutional patterns with
              educational context
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
                placeholder="Search patterns by name, explanation, or educational value..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-primary)",
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
                border: "1px solid var(--color-border-primary)",
                color: "var(--color-text-secondary)",
              }}
            >
              <option value="">All Categories</option>
              {categoryGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.categories
                    .filter((c) => filters.categories.includes(c))
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-primary)",
                color: "var(--color-text-secondary)",
              }}
            >
              <option value="">All Difficulties</option>
              {filters.difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg p-5 animate-pulse"
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border-primary)",
                      }}
                    >
                      <div
                        className="h-5 rounded w-1/2 mb-3"
                        style={{ background: "var(--color-bg-tertiary)" }}
                      />
                      <div
                        className="h-4 rounded w-3/4 mb-2"
                        style={{ background: "var(--color-bg-tertiary)" }}
                      />
                      <div
                        className="h-4 rounded w-1/2"
                        style={{ background: "var(--color-bg-tertiary)" }}
                      />
                    </div>
                  ))}
                </div>
              ) : patterns.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen
                    size={24}
                    className="mx-auto mb-3"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    No patterns found
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {groupedPatterns.map((group) => (
                    <div key={group.label}>
                      <h2
                        className="text-xs uppercase tracking-widest mb-3 font-semibold"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {group.label}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {group.patterns.map((pattern) => (
                          <button
                            key={pattern.id}
                            onClick={() => setSelectedPattern(pattern)}
                            className="text-left rounded-lg p-4 transition-all duration-200"
                            style={{
                              background: "var(--color-surface)",
                              border:
                                selectedPattern?.id === pattern.id
                                  ? "1px solid var(--color-accent-gold)"
                                  : "1px solid var(--color-border-primary)",
                              boxShadow:
                                selectedPattern?.id === pattern.id
                                  ? "var(--ring-focus)"
                                  : "none",
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3
                                className="text-sm font-medium"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                {pattern.name}
                              </h3>
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-medium border"
                                style={
                                  categoryStyles[pattern.category] ||
                                  fallbackCategoryStyle
                                }
                              >
                                {pattern.category}
                              </span>
                            </div>
                            <p
                              className="text-xs line-clamp-2 mb-2"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              {pattern.explanation}
                            </p>
                            <div className="flex items-center gap-3">
                              <span
                                className="text-xs"
                                style={
                                  difficultyStyles[pattern.difficulty] || {
                                    color: "var(--color-text-secondary)",
                                  }
                                }
                              >
                                {pattern.difficulty}
                              </span>
                              {pattern.learning_mode && (
                                <span
                                  className="text-xs flex items-center gap-1"
                                  style={{ color: "var(--color-text-muted)" }}
                                >
                                  {pattern.learning_mode === "hands-on" ? (
                                    <Lightbulb size={10} />
                                  ) : (
                                    <BookOpen size={10} />
                                  )}
                                  {pattern.learning_mode}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {ungroupedPatterns.length > 0 && (
                    <div>
                      <h2
                        className="text-xs uppercase tracking-widest mb-3 font-semibold"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Other
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ungroupedPatterns.map((pattern) => (
                          <button
                            key={pattern.id}
                            onClick={() => setSelectedPattern(pattern)}
                            className="text-left rounded-lg p-4 transition-all duration-200"
                            style={{
                              background: "var(--color-surface)",
                              border:
                                selectedPattern?.id === pattern.id
                                  ? "1px solid var(--color-accent-gold)"
                                  : "1px solid var(--color-border-primary)",
                              boxShadow:
                                selectedPattern?.id === pattern.id
                                  ? "var(--ring-focus)"
                                  : "none",
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3
                                className="text-sm font-medium"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                {pattern.name}
                              </h3>
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-medium border"
                                style={
                                  categoryStyles[pattern.category] ||
                                  fallbackCategoryStyle
                                }
                              >
                                {pattern.category}
                              </span>
                            </div>
                            <p
                              className="text-xs line-clamp-2 mb-2"
                              style={{ color: "var(--color-text-tertiary)" }}
                            >
                              {pattern.explanation}
                            </p>
                            <div className="flex items-center gap-3">
                              <span
                                className="text-xs"
                                style={
                                  difficultyStyles[pattern.difficulty] || {
                                    color: "var(--color-text-secondary)",
                                  }
                                }
                              >
                                {pattern.difficulty}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedPattern && (
              <div className="w-[420px] flex-shrink-0">
                <div
                  className="rounded-lg p-5 sticky top-8"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-primary)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2
                        className="text-lg font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {selectedPattern.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-medium border"
                          style={
                            categoryStyles[selectedPattern.category] ||
                            fallbackCategoryStyle
                          }
                        >
                          {selectedPattern.category}
                        </span>
                        <span
                          className="text-xs"
                          style={
                            difficultyStyles[selectedPattern.difficulty] || {
                              color: "var(--color-text-secondary)",
                            }
                          }
                        >
                          {selectedPattern.difficulty}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPattern(null)}
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
                        Explanation
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {selectedPattern.explanation}
                      </p>
                    </div>

                    {selectedPattern.educational_value && (
                      <div
                        className="rounded-md p-3"
                        style={{
                          background: "var(--color-bg-primary)",
                          border: "1px solid var(--color-border-primary)",
                        }}
                      >
                        <h3
                          className="text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          <GraduationCap size={12} />
                          Educational Value
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {selectedPattern.educational_value}
                        </p>
                      </div>
                    )}

                    {selectedPattern.bhavya_recommendation && (
                      <div
                        className="rounded-md p-3"
                        style={{
                          background: "var(--color-surface-forest-subtle)",
                          border:
                            "1px solid var(--color-surface-forest-medium)",
                        }}
                      >
                        <h3
                          className="text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5"
                          style={{ color: "var(--color-accent-green-light)" }}
                        >
                          <Star size={12} />
                          Bhavya Recommendation
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {selectedPattern.bhavya_recommendation}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Use Cases
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {parseJsonArray(selectedPattern.use_cases).map(
                          (uc, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px]"
                              style={{
                                background: "var(--color-bg-secondary)",
                                border: "1px solid var(--color-border-primary)",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {uc}
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
                        Related Patterns
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {parseJsonArray(selectedPattern.related_patterns).map(
                          (rp, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px]"
                              style={{
                                background: "var(--color-bg-secondary)",
                                border: "1px solid var(--color-border-primary)",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {rp}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    {selectedPattern.learning_mode && (
                      <div
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <span>Learning mode:</span>
                        <span style={{ color: "var(--color-text-secondary)" }}>
                          {selectedPattern.learning_mode}
                        </span>
                      </div>
                    )}
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
