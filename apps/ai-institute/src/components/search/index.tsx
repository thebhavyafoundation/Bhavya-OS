"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { knowledgeGraph } from "@/data/knowledge-graph";
import { learningPaths } from "@/data/learning-paths";

interface SearchResult {
  id: string;
  type: "concept" | "path" | "project" | "glossary" | "paper";
  title: string;
  description: string;
  url: string;
  score: number;
  tags: string[];
}

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const allResults: SearchResult[] = useMemo(() => {
    const results: SearchResult[] = [];

    // Concepts
    for (const node of knowledgeGraph) {
      results.push({
        id: node.id,
        type: "concept",
        title: node.title,
        description: node.description,
        url: `/concepts/${node.slug}`,
        score: 0,
        tags: [node.category, node.difficulty],
      });
    }

    // Learning Paths
    for (const path of learningPaths) {
      results.push({
        id: path.id,
        type: "path",
        title: path.title,
        description: path.description,
        url: `/learning-paths#${path.slug}`,
        score: 0,
        tags: [path.difficulty, "learning-path"],
      });
    }

    // Glossary terms
    for (const node of knowledgeGraph) {
      for (const term of node.glossary) {
        results.push({
          id: `glossary-${term.term}`,
          type: "glossary",
          title: term.term,
          description: term.definition,
          url: `/concepts/${node.slug}#glossary`,
          score: 0,
          tags: ["glossary", node.category],
        });
      }
    }

    return results;
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/);

    return allResults
      .map((result) => {
        let score = 0;
        const titleLower = result.title.toLowerCase();
        const descLower = result.description.toLowerCase();

        // Exact match in title
        if (titleLower.includes(queryLower)) score += 100;

        // Word matches in title
        for (const word of words) {
          if (titleLower.includes(word)) score += 30;
          if (descLower.includes(word)) score += 10;
        }

        // Tag matches
        for (const tag of result.tags) {
          if (tag.includes(queryLower)) score += 20;
        }

        return { ...result, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .filter((r) => filter === "all" || r.type === filter)
      .slice(0, 10);
  }, [query, allResults, filter]);

  const typeIcons: Record<string, string> = {
    concept: "🧠",
    path: "🎯",
    project: "🔨",
    glossary: "📖",
    paper: "📄",
  };

  // TODO: reference design tokens
  const typeColors: Record<string, string> = {
    concept: "#22c55e",
    path: "#3b82f6",
    project: "#8b5cf6",
    glossary: "#f59e0b",
    paper: "#ef4444",
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-accent-green/50"
          placeholder="Search concepts, paths, glossary..."
        />
        <svg
          className="absolute left-3 top-3.5 w-4 h-4 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-3 text-white/40 hover:text-white/60"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      {isOpen && query && (
        <div className="flex gap-2 mt-2">
          {["all", "concept", "path", "glossary"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 text-xs rounded-full ${
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {f === "all"
                ? "All"
                : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
            </button>
          ))}
          <span className="text-xs text-white/30 self-center">
            {filteredResults.length} results
          </span>
        </div>
      )}

      {/* Results */}
      {isOpen && query && filteredResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-primary border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {filteredResults.map((result) => (
            <Link
              key={result.id}
              href={result.url}
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <span className="text-lg">{typeIcons[result.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white/90 truncate">
                  {result.title}
                </div>
                <div className="text-xs text-white/50 truncate">
                  {result.description}
                </div>
                <div className="flex gap-1 mt-1">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: typeColors[result.type] + "20",
                      color: typeColors[result.type],
                    }}
                  >
                    {result.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && filteredResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-primary border border-white/10 rounded-xl shadow-2xl p-6 text-center z-50">
          <div className="text-2xl mb-2">🔍</div>
          <div className="text-sm text-white/50">
            No results for &quot;{query}&quot;
          </div>
        </div>
      )}
    </div>
  );
}
