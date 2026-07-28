"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  governance: "#8b5cf6", policy: "#3b82f6", standard: "#10b981",
  adr: "#a855f7", rfc: "#06b6d4", release: "#f59e0b", research: "#ec4899",
  report: "#6366f1", project: "#14b8a6", content: "#64748b", financial: "#f97316",
};

interface Doc {
  id: string; title: string; category: string; links: string[];
  tags: string[]; status?: string;
}

interface Relationship {
  type: "links_to" | "linked_by" | "same_category" | "shared_tags";
  label: string;
  docs: Doc[];
}

export default function RelationshipExplorer({ documents }: { documents: Doc[] }) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [depth, setDepth] = useState(1);

  const selected = useMemo(
    () => documents.find((d) => d.id === selectedId) || null,
    [selectedId, documents],
  );

  const relationships = useMemo((): Relationship[] => {
    if (!selected) return [];

    const rels: Relationship[] = [];

    // Links to
    const linksTo = selected.links
      .map((id) => documents.find((d) => d.id === id))
      .filter(Boolean) as Doc[];
    if (linksTo.length > 0) {
      rels.push({ type: "links_to", label: `Links To (${linksTo.length})`, docs: linksTo });
    }

    // Linked by
    const linkedBy = documents.filter((d) => d.links.includes(selected.id));
    if (linkedBy.length > 0) {
      rels.push({ type: "linked_by", label: `Referenced By (${linkedBy.length})`, docs: linkedBy });
    }

    // Same category (excluding self)
    const sameCategory = documents.filter(
      (d) => d.id !== selected.id && d.category === selected.category,
    ).slice(0, 10);
    if (sameCategory.length > 0) {
      rels.push({ type: "same_category", label: `Same Category: ${selected.category} (${sameCategory.length})`, docs: sameCategory });
    }

    // Shared tags
    const tagSet = new Set(selected.tags);
    const sharedTags = documents.filter(
      (d) => d.id !== selected.id && d.tags.some((t) => tagSet.has(t)),
    ).slice(0, 10);
    if (sharedTags.length > 0) {
      rels.push({ type: "shared_tags", label: `Shared Tags (${sharedTags.length})`, docs: sharedTags });
    }

    return rels;
  }, [selected, documents]);

  // For depth > 1, expand the relationships of relationships
  const expandedRelationships = useMemo(() => {
    if (depth <= 1 || !selected) return relationships;

    const allRelated = new Set<string>();
    relationships.forEach((r) => r.docs.forEach((d) => allRelated.add(d.id)));

    const expanded = [...relationships];
    const secondLevel = documents.filter((d) => allRelated.has(d.id));

    // Find docs that reference any of the first-level results
    const referencedBySecond = documents.filter(
      (d) => d.id !== selected.id && !allRelated.has(d.id) &&
        d.links.some((l) => allRelated.has(l)),
    ).slice(0, 10);

    if (referencedBySecond.length > 0) {
      expanded.push({
        type: "linked_by",
        label: `Indirect References (${referencedBySecond.length})`,
        docs: referencedBySecond,
      });
    }

    return expanded;
  }, [relationships, documents, selected, depth]);

  return (
    <div>
      {/* Selector */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>
          Select a document to explore its relationships
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px", background: "#0f172a",
            border: "1px solid #1e293b", borderRadius: 8, color: "#f8fafc",
            fontSize: 14, outline: "none",
          }}
        >
          <option value="">Choose a document...</option>
          {documents.map((d) => (
            <option key={d.id} value={d.id}>
              [{d.category}] {d.title}
            </option>
          ))}
        </select>
      </div>

      {/* Depth selector */}
      {selected && (
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Relationship depth:</span>
          {[1, 2].map((d) => (
            <button
              key={d}
              onClick={() => setDepth(d)}
              style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                border: "1px solid", borderColor: depth === d ? "#10b981" : "#1e293b",
                background: depth === d ? "rgba(16,185,129,0.12)" : "#0f172a",
                color: depth === d ? "#10b981" : "#94a3b8",
              }}
            >
              {d === 1 ? "Direct" : "Extended"}
            </button>
          ))}
        </div>
      )}

      {/* Selected document info */}
      {selected && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10,
                background: `${CATEGORY_COLORS[selected.category] || "#64748b"}22`,
                color: CATEGORY_COLORS[selected.category] || "#64748b",
              }}
            >
              {selected.category}
            </span>
            {selected.status && (
              <span style={{ fontSize: 11, color: "#64748b" }}>{selected.status}</span>
            )}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc", margin: "0 0 8px 0" }}>{selected.title}</h3>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {selected.tags.map((tag) => (
              <span key={tag} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, background: "#1e293b", color: "#94a3b8" }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Relationships */}
      {expandedRelationships.map((rel) => (
        <div key={`${rel.type}-${rel.label}`} style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", marginBottom: 10 }}>{rel.label}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {rel.docs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedId(doc.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "#0f172a", border: "1px solid #1e293b",
                  borderRadius: 8, cursor: "pointer", transition: "border-color 0.15s",
                }}
              >
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc" }}>{doc.title}</span>
                  {doc.status && (
                    <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>{doc.status}</span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: CATEGORY_COLORS[doc.category] || "#64748b" }}>
                  {doc.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!selected && (
        <div style={{ padding: 60, textAlign: "center", color: "#64748b" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>&#x1F578;</p>
          <p style={{ fontSize: 15 }}>Select a document above to explore its relationships.</p>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>
            See how documents connect through citations, categories, and shared tags.
          </p>
        </div>
      )}
    </div>
  );
}
