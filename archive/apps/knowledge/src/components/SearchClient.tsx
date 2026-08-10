"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  governance: "#8b5cf6",
  policy: "#3b82f6",
  standard: "#10b981",
  adr: "#a855f7",
  rfc: "#06b6d4",
  release: "#f59e0b",
  research: "#ec4899",
  report: "#6366f1",
  project: "#14b8a6",
  content: "#64748b",
  financial: "#f97316",
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "governance", label: "Governance" },
  { id: "policy", label: "Policies" },
  { id: "standard", label: "Standards" },
  { id: "adr", label: "ADRs" },
  { id: "rfc", label: "RFCs" },
  { id: "release", label: "Releases" },
  { id: "content", label: "Content" },
];

interface SearchDoc {
  id: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  status?: string;
}

export default function SearchClient({ documents }: { documents: SearchDoc[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return documents
      .filter((doc) => {
        const matchesQuery =
          doc.title.toLowerCase().includes(q) ||
          doc.summary.toLowerCase().includes(q) ||
          doc.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = activeCategory === "all" || doc.category === activeCategory;
        return matchesQuery && matchesCategory;
      })
      .slice(0, 30);
  }, [query, activeCategory, documents]);

  function highlight(text: string, q: string): React.ReactNode {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} style={{ background: "rgba(16,185,129,0.25)", color: "#10b981", borderRadius: 2, padding: "0 2px" }}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
  }

  return (
    <div>
      {/* Search Input */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search documents, standards, policies, ADRs, RFCs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 10,
            color: "#f8fafc",
            fontSize: 15,
            outline: "none",
          }}
        />
      </div>

      {/* Category Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "1px solid",
              borderColor: activeCategory === cat.id ? "#10b981" : "#1e293b",
              background: activeCategory === cat.id ? "rgba(16,185,129,0.12)" : "#0f172a",
              color: activeCategory === cat.id ? "#10b981" : "#94a3b8",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {query.trim() && (
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {results.map((doc) => (
          <Link
            key={doc.id}
            href={`/documents/${doc.id}`}
            style={{
              display: "block",
              padding: "16px 20px",
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 10,
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>
                {highlight(doc.title, query)}
              </h3>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: `${CATEGORY_COLORS[doc.category] || "#64748b"}22`,
                  color: CATEGORY_COLORS[doc.category] || "#64748b",
                }}
              >
                {doc.category}
              </span>
            </div>
            {doc.summary && (
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 8px 0", lineHeight: 1.5 }}>
                {highlight(doc.summary.slice(0, 150), query)}
              </p>
            )}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {doc.tags.slice(0, 4).map((tag) => (
                <span key={tag} style={{ fontSize: 11, color: "#475569" }}>#{tag}</span>
              ))}
            </div>
          </Link>
        ))}
        {query.trim() && results.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
            No results found. Try a different search term.
          </div>
        )}
        {!query.trim() && (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
            Type to search across all institutional knowledge.
          </div>
        )}
      </div>
    </div>
  );
}
