"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  governance: "#8b5cf6", policy: "#3b82f6", standard: "#10b981",
  adr: "#a855f7", rfc: "#06b6d4", release: "#f59e0b", content: "#64748b",
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

interface Doc {
  id: string; title: string; category: string; summary: string;
  tags: string[]; readingTime: number; status?: string;
}

export default function SearchClient({ documents }: { documents: Doc[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return documents
      .filter((d) => {
        const matches = d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCat = activeCategory === "all" || d.category === activeCategory;
        return matches && matchesCat;
      })
      .slice(0, 30);
  }, [query, activeCategory, documents]);

  return (
    <div>
      <input
        type="text" placeholder="Search documents, standards, policies..." value={query}
        onChange={(e) => setQuery(e.target.value)} autoFocus
        style={{
          width: "100%", padding: "14px 18px", background: "#fff", border: "1px solid #d4d4d0",
          borderRadius: 10, color: "#1a1a1a", fontSize: 15, outline: "none", marginBottom: 20,
        }}
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
              border: "1px solid", borderColor: activeCategory === cat.id ? "#0D503C" : "#d4d4d0",
              background: activeCategory === cat.id ? "#0D503C" : "#fff",
              color: activeCategory === cat.id ? "#fff" : "#666",
            }}
          >{cat.label}</button>
        ))}
      </div>

      {query.trim() && (
        <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {results.map((doc) => (
          <Link key={doc.id} href={`/read/${doc.id}`}
            style={{
              display: "block", padding: "16px 20px", background: "#fff",
              border: "1px solid #e5e5e0", borderRadius: 10, textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{doc.title}</h3>
              <span style={{ fontSize: 11, color: CATEGORY_COLORS[doc.category] || "#888" }}>{doc.category}</span>
            </div>
            {doc.summary && (
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 6px 0" }}>{doc.summary.slice(0, 120)}...</p>
            )}
            <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>{doc.readingTime} min read</p>
          </Link>
        ))}
        {query.trim() && results.length === 0 && (
          <p style={{ padding: 40, textAlign: "center", color: "#888" }}>No results found.</p>
        )}
        {!query.trim() && (
          <p style={{ padding: 40, textAlign: "center", color: "#888" }}>Type to search the library.</p>
        )}
      </div>
    </div>
  );
}
