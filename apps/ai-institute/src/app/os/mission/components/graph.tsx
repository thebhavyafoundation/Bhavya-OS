"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export interface MCNodeDatum {
  id: string;
  kind: string;
  label: string;
  status: string;
}

export interface MCEdgeDatum {
  from: string;
  to: string;
  rel: string;
}

const KIND_COLORS: Record<string, string> = {
  job: "#d4a017",
  task_contract: "#7c8aff",
  artifact: "#4cc38a",
  version: "#4cc38a",
  approval: "#e08a3c",
  decision: "#e06c75",
  session: "#9a9a9a",
};

function layout(nodes: MCNodeDatum[], edges: MCEdgeDatum[]) {
  const depthOf = (id: string, seen: string[] = []): number => {
    if (seen.includes(id)) return 0;
    const incoming = edges.filter((e) => e.to === id);
    if (incoming.length === 0) return 0;
    return 1 + Math.max(...incoming.map((e) => depthOf(e.from, [...seen, id])));
  };
  const byDepth = new Map<number, MCNodeDatum[]>();
  for (const n of nodes) {
    const d = depthOf(n.id);
    byDepth.set(d, [...(byDepth.get(d) ?? []), n]);
  }
  const positioned: Node[] = [];
  for (const [d, group] of [...byDepth.entries()].sort((a, b) => a[0] - b[0])) {
    group.forEach((n, i) => {
      positioned.push({
        id: n.id,
        position: { x: d * 260, y: i * 110 },
        data: { label: `${n.label} · ${n.status}` },
        style: {
          border: `1px solid ${KIND_COLORS[n.kind] ?? "#666"}`,
          borderRadius: 8,
          padding: 8,
          fontSize: 11,
          width: 220,
          background: "#1a1a1a",
          color: "#eee",
        },
      });
    });
  }
  return positioned;
}

function targetFor(nodeId: string): string | null {
  if (!nodeId.startsWith("job:")) return null;
  return `/os/mission/jobs/${nodeId.slice("job:".length)}`;
}

export function MissionGraph({ nodes, edges }: { nodes: MCNodeDatum[]; edges: MCEdgeDatum[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSelected = searchParams.get("node");
  const initialHidden = (searchParams.get("hide") ?? "").split(",").filter(Boolean);
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const [selectedEdge, setSelectedEdge] = useState<number | null>(null);
  const [hidden, setHidden] = useState<string[]>(initialHidden);

  const kinds = useMemo(() => [...new Set(nodes.map((n) => n.kind))], [nodes]);
  const visible = useMemo(() => nodes.filter((n) => !hidden.includes(n.kind)), [nodes, hidden]);
  const visibleIds = useMemo(() => new Set(visible.map((n) => n.id)), [visible]);
  const visibleEdges = useMemo(
    () => edges.map((e, i) => ({ ...e, i })).filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to)),
    [edges, visibleIds],
  );

  function syncUrl(nextSelected: string | null, nextHidden: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextSelected) params.set("node", nextSelected);
    else params.delete("node");
    if (nextHidden.length > 0) params.set("hide", nextHidden.join(","));
    else params.delete("hide");
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function toggleKind(kind: string) {
    const next = hidden.includes(kind) ? hidden.filter((k) => k !== kind) : [...hidden, kind];
    setHidden(next);
    setSelectedEdge(null);
    syncUrl(selected, next);
  }

  const flowNodes = useMemo(() => layout(visible, visibleEdges), [visible, visibleEdges]);
  const flowEdges: Edge[] = useMemo(
    () =>
      visibleEdges.map((e) => ({
        id: `e${e.i}`,
        source: e.from,
        target: e.to,
        label: e.rel,
        style: { fontSize: 10 },
      })),
    [visibleEdges],
  );

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      setSelected(node.id);
      setSelectedEdge(null);
      const params = new URLSearchParams(window.location.search);
      params.set("node", node.id);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  const onEdgeClick = useCallback(
    (_: unknown, edge: Edge) => {
      const idx = Number(edge.id.slice(1));
      setSelectedEdge(Number.isFinite(idx) ? idx : null);
      setSelected(null);
    },
    [],
  );

  function openSelected() {
    if (!selected) return;
    const target = targetFor(selected);
    if (target) router.push(target);
  }

  const selectedNode = selected ? nodes.find((n) => n.id === selected) : undefined;
  const edgeDetail = selectedEdge !== null ? visibleEdges[selectedEdge] : undefined;

  if (nodes.length === 0) {
    return <p className="text-xs text-text-muted">No graph data — records will appear here as jobs, artifacts, and decisions are created.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filter node types">
        {kinds.map((k) => (
          <label key={k} className="flex items-center gap-1.5 text-xs text-text-secondary border border-border-primary rounded-full px-2.5 py-1">
            <input type="checkbox" checked={!hidden.includes(k)} onChange={() => toggleKind(k)} />
            {k}
          </label>
        ))}
      </div>
      <div style={{ height: 420 }} className="rounded-xl border border-border-primary overflow-hidden bg-bg-primary">
        <ReactFlow nodes={flowNodes} edges={flowEdges} onNodeClick={onNodeClick} onEdgeClick={onEdgeClick} fitView colorMode="dark">
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div className="mt-3 text-xs text-text-secondary" role="status" aria-live="polite">
        {selectedNode ? (
          <span>
            Selected: <span className="font-semibold text-text-primary">{selectedNode.label}</span>
            {" "}({selectedNode.kind} · {selectedNode.status})
            {targetFor(selectedNode.id) && (
              <button type="button" onClick={openSelected} className="ml-2 text-accent-gold hover:underline">
                Open record →
              </button>
            )}
          </span>
        ) : edgeDetail ? (
          <span>
            Edge: <span className="font-semibold text-text-primary">{edgeDetail.rel}</span>
            {" "}— {edgeDetail.from} → {edgeDetail.to} (FACT: persisted relationship, see evidence trail)
          </span>
        ) : (
          <span>Select a node or edge for details. Graph shows persisted records only.</span>
        )}
      </div>
      <ul className="mt-2 space-y-1 text-xs text-text-muted">
        {nodes.map((n) => (
          <li key={n.id}>
            <span className="font-mono">{n.kind}</span>: {n.label} ({n.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
