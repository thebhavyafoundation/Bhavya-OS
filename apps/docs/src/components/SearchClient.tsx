"use client";

import { useState, useMemo, useCallback } from "react";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  path: string;
  content: string;
  tags?: string[];
  type: string;
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "governance", label: "Governance" },
  { id: "policy", label: "Policies" },
  { id: "standard", label: "Standards" },
  { id: "adr", label: "ADRs" },
  { id: "rfc", label: "RFCs" },
  { id: "release", label: "Releases" },
  { id: "app", label: "Applications" },
  { id: "package", label: "Packages" },
];

export default function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items
      .filter((item) => {
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = activeCategory === "all" || item.type === activeCategory;
        return matchesQuery && matchesCategory;
      })
      .slice(0, 20);
  }, [query, activeCategory, items]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search documents, standards, releases, policies..."
          value={query}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--text)",
            fontSize: 14,
            fontFamily: "var(--font)",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--mono)",
              cursor: "pointer",
              border: "1px solid",
              borderColor: activeCategory === cat.id ? "var(--accent)" : "var(--border)",
              background: activeCategory === cat.id ? "rgba(34,197,94,0.12)" : "var(--surface)",
              color: activeCategory === cat.id ? "var(--accent)" : "var(--text-2)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {query.trim() && (
        <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {results.map((item) => (
          <a
            key={item.id}
            href={item.path}
            style={{
              display: "block",
              padding: "16px 20px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              textDecoration: "none",
              color: "var(--text)",
              transition: "border-color 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</span>
              <span className={`badge badge-${item.type === "adr" ? "purple" : item.type === "release" ? "warn" : "blue"}`}>
                {item.category}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-2)", margin: 0 }}>{item.content}</p>
            {item.tags && item.tags.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {item.tags.map((tag) => (
                  <span className="link-tag" key={tag}>#{tag}</span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
