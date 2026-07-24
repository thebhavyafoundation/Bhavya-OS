"use client";

import { useState } from "react";

interface GraphNode {
  id: string;
  type: string;
  title: string;
  owner?: string;
  status?: string;
  links?: string[];
}

const TYPE_COLORS: Record<string, string> = {
  adr: "var(--purple)",
  rfc: "var(--blue)",
  standard: "var(--accent)",
  release: "var(--warn)",
  app: "#ec4899",
  package: "#06b6d4",
};

export default function GraphClient({ nodes }: { nodes: GraphNode[] }) {
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const types = Array.from(new Set(nodes.map((n) => n.type)));
  const filtered = filter === "all" ? nodes : nodes.filter((n) => n.type === filter);

  const linkedNodes = selected?.links
    ? nodes.filter((n) => selected.links?.includes(n.id))
    : [];

  const linkedBy = nodes.filter((n) => n.links?.includes(selected?.id || ""));

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
            fontFamily: "var(--mono)", cursor: "pointer", border: "1px solid",
            borderColor: filter === "all" ? "var(--accent)" : "var(--border)",
            background: filter === "all" ? "rgba(34,197,94,0.12)" : "var(--surface)",
            color: filter === "all" ? "var(--accent)" : "var(--text-2)",
          }}
        >
          All ({nodes.length})
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
              fontFamily: "var(--mono)", cursor: "pointer", border: "1px solid",
              borderColor: filter === type ? TYPE_COLORS[type] || "var(--blue)" : "var(--border)",
              background: filter === type ? `${TYPE_COLORS[type] || "var(--blue)"}22` : "var(--surface)",
              color: filter === type ? TYPE_COLORS[type] || "var(--blue)" : "var(--text-2)",
            }}
          >
            {type} ({nodes.filter((n) => n.type === type).length})
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 320px" : "1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelected(selected?.id === node.id ? null : node)}
              style={{
                padding: "14px 18px",
                background: selected?.id === node.id ? "var(--surface-2)" : "var(--surface)",
                border: `1px solid ${selected?.id === node.id ? TYPE_COLORS[node.type] || "var(--blue)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{node.title}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className="link-tag" style={{ color: TYPE_COLORS[node.type] }}>{node.type}</span>
                  {node.status && <span className="link-tag">{node.status}</span>}
                </div>
              </div>
              {node.owner && (
                <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>Owner: {node.owner}</p>
              )}
              {node.links && node.links.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {node.links.map((linkId) => {
                    const linked = nodes.find((n) => n.id === linkId);
                    return (
                      <span key={linkId} className="link-tag">
                        → {linked?.title || linkId}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ position: "sticky", top: 32, alignSelf: "start" }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-title">
                <span>{selected.title}</span>
                <span className="link-tag" style={{ color: TYPE_COLORS[selected.type] }}>{selected.type}</span>
              </div>
              <div className="card-desc">ID: {selected.id}</div>
              {selected.owner && <div className="card-desc">Owner: {selected.owner}</div>}
              {selected.status && <div className="card-desc">Status: {selected.status}</div>}
            </div>

            {linkedNodes.length > 0 && (
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-title" style={{ fontSize: 12, marginBottom: 8 }}>
                  Links To ({linkedNodes.length})
                </div>
                {linkedNodes.map((n) => (
                  <div key={n.id} style={{ padding: "4px 0", fontSize: 12, color: "var(--text-2)" }}>
                    <span className="link-tag" style={{ color: TYPE_COLORS[n.type] }}>{n.type}</span> {n.title}
                  </div>
                ))}
              </div>
            )}

            {linkedBy.length > 0 && (
              <div className="card">
                <div className="card-title" style={{ fontSize: 12, marginBottom: 8 }}>
                  Linked By ({linkedBy.length})
                </div>
                {linkedBy.map((n) => (
                  <div key={n.id} style={{ padding: "4px 0", fontSize: 12, color: "var(--text-2)" }}>
                    <span className="link-tag" style={{ color: TYPE_COLORS[n.type] }}>{n.type}</span> {n.title}
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
