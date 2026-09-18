"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [selected, setSelected] = useState<string | null>(null);
  const flowNodes = useMemo(() => layout(nodes, edges), [nodes, edges]);
  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e, i) => ({
        id: `e${i}`,
        source: e.from,
        target: e.to,
        label: e.rel,
        style: { fontSize: 10 },
      })),
    [edges],
  );

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      setSelected(node.id);
      const target = targetFor(node.id);
      if (target) router.push(target);
    },
    [router],
  );

  const selectedNode = selected ? nodes.find((n) => n.id === selected) : undefined;

  if (nodes.length === 0) {
    return <p className="text-xs text-text-muted">No graph data — records will appear here as jobs, artifacts, and decisions are created.</p>;
  }

  return (
    <div>
      <div style={{ height: 420 }} className="rounded-xl border border-border-primary overflow-hidden bg-bg-primary">
        <ReactFlow nodes={flowNodes} edges={flowEdges} onNodeClick={onNodeClick} fitView colorMode="dark">
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
          </span>
        ) : (
          <span>Select a node for details. Job nodes navigate to the job record.</span>
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
