"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

interface NodeResult {
  nodeId: string;
  capabilityId: string;
  status: string;
  artifactId?: string;
  error?: string;
}

interface PipelineData {
  planId: string;
  goal: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  totalArtifacts: number;
  nodeResults: NodeResult[];
  events: any[];
  metrics: any;
  graph: string;
}

export default function PipelinePage() {
  const params = useParams();
  const planId = params.id as string;
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/status?planId=${planId}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [planId]);

  if (loading)
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active="pipelines" />
        <main style={{ flex: 1, padding: "2rem" }}>Loading...</main>
      </div>
    );
  if (!data)
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active="pipelines" />
        <main style={{ flex: 1, padding: "2rem" }}>Pipeline not found.</main>
      </div>
    );

  const completedNodes = data.nodeResults.filter(
    (n) => n.status === "completed",
  );
  const failedNodes = data.nodeResults.filter((n) => n.status === "failed");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active="pipelines" />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              Pipeline Execution
            </h1>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                background:
                  data.status === "completed"
                    ? "#052e16"
                    : data.status === "failed"
                      ? "#450a0a"
                      : "#1e1b4b",
                color:
                  data.status === "completed"
                    ? "#22c55e"
                    : data.status === "failed"
                      ? "#ef4444"
                      : "#818cf8",
              }}
            >
              {data.status}
            </span>
          </div>
          <p style={{ color: "#a3a3a3", fontSize: "0.9rem" }}>{data.goal}</p>
          <p
            style={{
              color: "#525252",
              fontSize: "0.75rem",
              marginTop: "0.25rem",
            }}
          >
            Plan: {data.planId}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard
            label="Nodes"
            value={`${completedNodes.length}/${data.nodeResults.length}`}
          />
          <StatCard label="Artifacts" value={String(data.totalArtifacts)} />
          <StatCard label="Events" value={String(data.events?.length || 0)} />
          <StatCard
            label="Duration"
            value={
              data.completedAt
                ? `${new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()}ms`
                : "—"
            }
          />
        </div>

        {/* Execution Graph */}
        <div
          style={{
            background: "#171717",
            border: "1px solid #262626",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}
          >
            Execution Graph (DAG)
          </h2>
          <pre
            style={{
              fontSize: "0.75rem",
              color: "#a3a3a3",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              overflow: "auto",
            }}
          >
            {data.graph}
          </pre>
        </div>

        {/* Node Results */}
        <div
          style={{
            background: "#171717",
            border: "1px solid #262626",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}
          >
            Node Execution Results
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {data.nodeResults.map((nr) => (
              <div
                key={nr.nodeId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  background: "#0a0a0a",
                  borderRadius: "6px",
                  border: "1px solid #262626",
                }}
              >
                <span
                  style={{
                    color: nr.status === "completed" ? "#22c55e" : "#ef4444",
                    fontSize: "1rem",
                  }}
                >
                  ●
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    {nr.capabilityId}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#737373" }}>
                    {nr.nodeId}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: nr.status === "completed" ? "#22c55e" : "#ef4444",
                  }}
                >
                  {nr.status}
                </div>
                {nr.artifactId && (
                  <a
                    href={`/artifacts/${nr.artifactId}`}
                    style={{
                      fontSize: "0.75rem",
                      color: "#60a5fa",
                      textDecoration: "none",
                    }}
                  >
                    View Artifact →
                  </a>
                )}
                {nr.error && (
                  <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>
                    {nr.error}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        {data.events && data.events.length > 0 && (
          <div
            style={{
              background: "#171717",
              border: "1px solid #262626",
              borderRadius: "8px",
              padding: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Execution Events
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                maxHeight: "300px",
                overflow: "auto",
              }}
            >
              {data.events.slice(-20).map((evt, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    padding: "0.25rem 0",
                  }}
                >
                  <span style={{ color: "#525252", minWidth: "80px" }}>
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    style={{
                      color: evt.type.includes("completed")
                        ? "#22c55e"
                        : evt.type.includes("failed")
                          ? "#ef4444"
                          : "#818cf8",
                      minWidth: "140px",
                    }}
                  >
                    {evt.type}
                  </span>
                  <span style={{ color: "#737373" }}>{evt.nodeId || ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#171717",
        border: "1px solid #262626",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      <div
        style={{
          color: "#a3a3a3",
          fontSize: "0.8rem",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>{value}</div>
    </div>
  );
}
