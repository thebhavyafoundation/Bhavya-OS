"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Globe,
  ExternalLink,
  Star,
  BarChart3,
  Filter,
  ChevronRight,
  Shield,
  Zap,
  Eye,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { scoreToColor, scoreToBg, scoreToBorder } from "@/lib/score-color";
import { parseJson, parseJsonArray } from "@/lib/json-utils";

interface Website {
  id: string;
  source_url: string;
  name: string;
  description: string | null;
  framework: string | null;
  design_system: string | null;
  typography: string | null;
  color_system: string | null;
  motion_system: string | null;
  interaction_patterns: string;
  responsive_patterns: string;
  accessibility_characteristics: string;
  performance_observations: string;
  extracted_pattern_ids: string;
  bhavya_relevance_score: number;
  quality_score: number;
  analyzed_at: string;
}

interface Filters {
  frameworks: string[];
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  return (
    <div
      className="px-2 py-1 rounded border text-xs font-medium"
      style={{
        color: scoreToColor(score),
        background: scoreToBg(score),
        borderColor: scoreToBorder(score),
      }}
    >
      {label}: {score}
    </div>
  );
}

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [filters, setFilters] = useState<Filters>({ frameworks: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [framework, setFramework] = useState("");
  const [sort, setSort] = useState("bhavya_relevance_score");

  useEffect(() => {
    fetchWebsites();
  }, [search, framework, sort]);

  async function fetchWebsites() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (framework) params.set("framework", framework);
    params.set("sort", sort);

    const res = await fetch(`/api/websites?${params}`);
    const data = await res.json();
    setWebsites(data.websites);
    setFilters(data.filters);
    setLoading(false);
  }

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
              <Globe size={24} className="text-[var(--color-accent-gold)]" />
              <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                Website Intelligence
              </h1>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Analyzed websites with design patterns, accessibility,
              performance, and Bhavya relevance scoring
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
              />
              <input
                type="text"
                placeholder="Search websites by name, URL, framework..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border-primary)",
                }}
              />
            </div>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="px-3 py-2.5 border rounded-lg text-sm text-[var(--color-text-secondary)] appearance-none cursor-pointer"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <option value="">All Frameworks</option>
              {filters.frameworks.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 border rounded-lg text-sm text-[var(--color-text-secondary)] appearance-none cursor-pointer"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-primary)",
              }}
            >
              <option value="bhavya_relevance_score">Bhavya Relevance</option>
              <option value="quality_score">Quality Score</option>
              <option value="name">Name</option>
              <option value="analyzed">Recently Analyzed</option>
            </select>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-5 animate-pulse"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
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
          ) : websites.length === 0 ? (
            <div className="text-center py-20">
              <Globe
                size={24}
                className="mx-auto text-[var(--color-text-muted)] mb-3"
              />
              <p className="text-sm text-[var(--color-text-tertiary)]">
                No websites analyzed yet
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Add website intelligence records via the API
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {websites.map((website) => {
                const patterns = parseJsonArray(website.extracted_pattern_ids);
                const accessibility = parseJson(
                  website.accessibility_characteristics,
                ) as Record<string, unknown> | null;

                return (
                  <Link
                    key={website.id}
                    href={`/websites/${website.id}`}
                    className="text-left border rounded-lg p-5 hover:border-[var(--color-border-focus)] transition-all duration-200 group"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-gold)] transition-colors">
                          {website.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                          {website.source_url}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-gold)] transition-colors ml-2 flex-shrink-0 mt-1"
                      />
                    </div>

                    {website.description && (
                      <p className="text-xs text-[var(--color-text-tertiary)] line-clamp-2 mb-3">
                        {website.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {website.framework && (
                        <span
                          className="px-2 py-0.5 border rounded text-[10px] text-[var(--color-text-secondary)]"
                          style={{
                            background: "var(--color-bg-secondary)",
                            borderColor: "var(--color-border-primary)",
                          }}
                        >
                          {website.framework}
                        </span>
                      )}
                      {website.design_system && (
                        <span
                          className="px-2 py-0.5 border rounded text-[10px] text-[var(--color-text-secondary)]"
                          style={{
                            background: "var(--color-bg-secondary)",
                            borderColor: "var(--color-border-primary)",
                          }}
                        >
                          {website.design_system}
                        </span>
                      )}
                      {website.typography && (
                        <span
                          className="px-2 py-0.5 border rounded text-[10px] text-[var(--color-text-secondary)]"
                          style={{
                            background: "var(--color-bg-secondary)",
                            borderColor: "var(--color-border-primary)",
                          }}
                        >
                          {website.typography}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {patterns.slice(0, 3).map((p, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px]"
                          style={{
                            background: "var(--color-surface-forest-medium)",
                            borderColor: "var(--color-surface-forest-strong)",
                            color: "var(--color-accent-green-light)",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                      {patterns.length > 3 && (
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          +{patterns.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <ScoreBadge
                        score={website.bhavya_relevance_score}
                        label="Bhavya"
                      />
                      <ScoreBadge
                        score={website.quality_score}
                        label="Quality"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
