"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

interface PipelineSummary {
  planId: string;
  goal: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  totalArtifacts: number;
}

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<PipelineSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => {
        setPipelines(d.pipelines || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active="pipelines" />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Pipeline Executions
        </h1>
        <p style={{ color: "#a3a3a3", marginBottom: "1.5rem" }}>
          All BEE pipeline executions. Click to inspect execution graph, node
          results, and events.
        </p>

        {loading ? (
          <p style={{ color: "#737373" }}>Loading...</p>
        ) : pipelines.length === 0 ? (
          <p style={{ color: "#737373" }}>No pipelines yet.</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {pipelines
              .slice()
              .reverse()
              .map((p) => (
                <a
                  key={p.planId}
                  href={`/pipeline/${p.planId}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#e5e5e5",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: "0.25rem" }}>
                      {p.goal}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#737373" }}>
                      {p.planId}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", color: "#737373" }}>
                      {p.totalArtifacts} artifacts
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#737373" }}>
                      {new Date(p.startedAt).toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        background:
                          p.status === "completed"
                            ? "#052e16"
                            : p.status === "failed"
                              ? "#450a0a"
                              : "#1e1b4b",
                        color:
                          p.status === "completed"
                            ? "#22c55e"
                            : p.status === "failed"
                              ? "#ef4444"
                              : "#818cf8",
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
