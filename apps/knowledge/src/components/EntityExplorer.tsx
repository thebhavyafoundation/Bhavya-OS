"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  person: "#8b5cf6",
  organization: "#3b82f6",
  location: "#10b981",
  species: "#22c55e",
  project: "#f59e0b",
  grant: "#f97316",
  policy: "#6366f1",
  law: "#a855f7",
  event: "#ec4899",
  concept: "#06b6d4",
  technology: "#14b8a6",
  standard: "#64748b",
  release: "#f59e0b",
};

const TYPE_ICONS: Record<string, string> = {
  person: "\u{1F464}",
  organization: "\u{1F3E2}",
  location: "\u{1F4CD}",
  species: "\u{1F33F}",
  project: "\u{1F4C1}",
  grant: "\u{1F4B0}",
  policy: "\u{1F4DC}",
  law: "\u{2696}",
  event: "\u{1F4C5}",
  concept: "\u{1F4A1}",
  technology: "\u{2699}",
  standard: "\u{1F4CB}",
  release: "\u{1F680}",
};

interface EntityData {
  id: string;
  name: string;
  type: string;
  description: string;
  documentIds: string[];
  mentions: number;
}

interface Doc {
  id: string;
  title: string;
  category: string;
}

export default function EntityExplorer({
  entities,
  documents,
}: {
  entities: EntityData[];
  documents: Doc[];
}) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [filterType, setFilterType] = useState("all");

  const types = useMemo(
    () => Array.from(new Set(entities.map((e) => e.type))),
    [entities],
  );
  const filtered = useMemo(
    () =>
      filterType === "all"
        ? entities
        : entities.filter((e) => e.type === filterType),
    [filterType, entities],
  );

  const selected = useMemo(
    () => entities.find((e) => e.id === selectedId) || null,
    [selectedId, entities],
  );
  const selectedDocs = useMemo(() => {
    if (!selected) return [];
    return selected.documentIds
      .map((id) => documents.find((d) => d.id === id))
      .filter(Boolean);
  }, [selected, documents]);

  return (
    <div>
      {/* Type filters */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}
      >
        <button
          onClick={() => setFilterType("all")}
          style={{
            padding: "5px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            border: "1px solid",
            borderColor: filterType === "all" ? "#10b981" : "#1e293b",
            background:
              filterType === "all" ? "rgba(16,185,129,0.12)" : "#0f172a",
            color: filterType === "all" ? "#10b981" : "#94a3b8",
          }}
        >
          All ({entities.length})
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "1px solid",
              borderColor:
                filterType === type
                  ? TYPE_COLORS[type] || "#3b82f6"
                  : "#1e293b",
              background:
                filterType === type
                  ? `${TYPE_COLORS[type] || "#3b82f6"}22`
                  : "#0f172a",
              color:
                filterType === type
                  ? TYPE_COLORS[type] || "#3b82f6"
                  : "#94a3b8",
            }}
          >
            {type} ({entities.filter((e) => e.type === type).length})
          </button>
        ))}
      </div>

      {/* Entity list + detail */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: selected ? "1fr 340px" : "1fr",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((entity) => (
            <div
              key={entity.id}
              onClick={() =>
                setSelectedId(selectedId === entity.id ? "" : entity.id)
              }
              style={{
                padding: "12px 16px",
                background: selectedId === entity.id ? "#1e293b" : "#0f172a",
                border: `1px solid ${selectedId === entity.id ? TYPE_COLORS[entity.type] || "#3b82f6" : "#1e293b"}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>
                    {TYPE_ICONS[entity.type] || "\u{1F4C4}"}
                  </span>
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}
                  >
                    {entity.name}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>
                    {entity.mentions} docs
                  </span>
                  <span
                    style={{ fontSize: 11, color: TYPE_COLORS[entity.type] }}
                  >
                    {entity.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ position: "sticky", top: 32, alignSelf: "start" }}>
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 12,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 20 }}>
                  {TYPE_ICONS[selected.type]}
                </span>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#f8fafc",
                    margin: 0,
                  }}
                >
                  {selected.name}
                </h3>
              </div>
              <p
                style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 8px 0" }}
              >
                {selected.description}
              </p>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                <p style={{ margin: "2px 0" }}>
                  Type:{" "}
                  <span style={{ color: TYPE_COLORS[selected.type] }}>
                    {selected.type}
                  </span>
                </p>
                <p style={{ margin: "2px 0" }}>
                  Mentioned in: {selected.documentIds.length} document
                  {selected.documentIds.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {selectedDocs.length > 0 && (
              <div
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#f8fafc",
                    marginBottom: 10,
                  }}
                >
                  Referenced In ({selectedDocs.length})
                </h4>
                {selectedDocs.map((doc) => (
                  <Link
                    key={doc!.id}
                    href={`/documents/${doc!.id}`}
                    style={{
                      display: "block",
                      padding: "6px 0",
                      fontSize: 13,
                      color: "#10b981",
                      textDecoration: "none",
                    }}
                  >
                    {doc!.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
