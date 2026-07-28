"use client";

import { useState, useMemo } from "react";
const TYPE_COLORS: Record<string, string> = {
  adr: "#a855f7",
  rfc: "#06b6d4",
  standard: "#10b981",
  release: "#f59e0b",
  app: "#ec4899",
  package: "#6366f1",
};

interface GraphNodeData {
  id: string;
  type: string;
  title: string;
  owner?: string;
  status?: string;
  created?: string;
  links?: string[];
}

export default function GraphClient({ nodes }: { nodes: GraphNodeData[] }) {
  const [selected, setSelected] = useState<GraphNodeData | null>(null);
  const [filter, setFilter] = useState("all");

  const types = useMemo(() => Array.from(new Set(nodes.map((n) => n.type))), [nodes]);
  const filtered = useMemo(
    () => (filter === "all" ? nodes : nodes.filter((n) => n.type === filter)),
    [filter, nodes],
  );

  const linkedNodes = useMemo(
    () => (selected?.links ? nodes.filter((n) => selected.links?.includes(n.id)) : []),
    [selected, nodes],
  );

  const linkedBy = useMemo(
    () => nodes.filter((n) => n.links?.includes(selected?.id || "")),
    [selected, nodes],
  );

  return (
    <div>
      {/* Type Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
            border: "1px solid", borderColor: filter === "all" ? "#10b981" : "#1e293b",
            background: filter === "all" ? "rgba(16,185,129,0.12)" : "#0f172a",
            color: filter === "all" ? "#10b981" : "#94a3b8",
          }}
        >
          All ({nodes.length})
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
              border: "1px solid",
              borderColor: filter === type ? TYPE_COLORS[type] || "#3b82f6" : "#1e293b",
              background: filter === type ? `${TYPE_COLORS[type] || "#3b82f6"}22` : "#0f172a",
              color: filter === type ? TYPE_COLORS[type] || "#3b82f6" : "#94a3b8",
            }}
          >
            {type} ({nodes.filter((n) => n.type === type).length})
          </button>
        ))}
      </div>

      {/* Graph Visualization */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: 24 }}>
        {/* Node List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelected(selected?.id === node.id ? null : node)}
              style={{
                padding: "14px 18px",
                background: selected?.id === node.id ? "#1e293b" : "#0f172a",
                border: `1px solid ${selected?.id === node.id ? TYPE_COLORS[node.type] || "#3b82f6" : "#1e293b"}`,
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{node.title}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 11, color: TYPE_COLORS[node.type] || "#64748b" }}>{node.type}</span>
                  {node.status && (
                    <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 8, background: "#1e293b", color: "#64748b" }}>
                      {node.status}
                    </span>
                  )}
                </div>
              </div>
              {node.owner && (
                <p style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Owner: {node.owner}</p>
              )}
              {node.links && node.links.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {node.links.slice(0, 5).map((linkId) => {
                    const linked = nodes.find((n) => n.id === linkId);
                    return (
                      <span key={linkId} style={{ fontSize: 11, padding: "1px 6px", borderRadius: 8, background: "#1e293b", color: "#94a3b8" }}>
                        {linked?.title || linkId}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ position: "sticky", top: 32, alignSelf: "start" }}>
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{selected.title}</h3>
                <span style={{ fontSize: 11, color: TYPE_COLORS[selected.type] || "#64748b" }}>{selected.type}</span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                <p style={{ margin: "4px 0" }}>ID: <span style={{ fontFamily: "monospace" }}>{selected.id}</span></p>
                {selected.owner && <p style={{ margin: "4px 0" }}>Owner: {selected.owner}</p>}
                {selected.status && <p style={{ margin: "4px 0" }}>Status: {selected.status}</p>}
                {selected.created && <p style={{ margin: "4px 0" }}>Created: {selected.created}</p>}
              </div>
            </div>

            {linkedNodes.length > 0 && (
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", marginBottom: 10 }}>
                  Links To ({linkedNodes.length})
                </h4>
                {linkedNodes.map((n) => (
                  <div key={n.id} style={{ padding: "4px 0", fontSize: 12, color: "#94a3b8" }}>
                    <span style={{ color: TYPE_COLORS[n.type] || "#64748b" }}>{n.type}</span> {n.title}
                  </div>
                ))}
              </div>
            )}

            {linkedBy.length > 0 && (
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", marginBottom: 10 }}>
                  Linked By ({linkedBy.length})
                </h4>
                {linkedBy.map((n) => (
                  <div key={n.id} style={{ padding: "4px 0", fontSize: 12, color: "#94a3b8" }}>
                    <span style={{ color: TYPE_COLORS[n.type] || "#64748b" }}>{n.type}</span> {n.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
