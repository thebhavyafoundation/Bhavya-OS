"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

interface KO {
  id: string;
  title: string;
  domain: string;
  subject?: string;
  gradeLevel?: string;
  description: string;
  sourceType: string;
  concepts: any[];
  createdAt: string;
}

interface PipelineResult {
  planId: string;
  goal: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  totalArtifacts: number;
  nodeResults: any[];
}

export default function HomePage() {
  const [kos, setKos] = useState<KO[]>([]);
  const [pipelines, setPipelines] = useState<PipelineResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/artifacts").then((r) => r.json()),
      fetch("/api/status").then((r) => r.json()),
    ])
      .then(([artifactsData, statusData]) => {
        setPipelines(statusData.pipelines || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active="home" />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px" }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Knowledge Studio
        </h1>
        <p style={{ color: "#a3a3a3", marginBottom: "2rem" }}>
          Convert raw knowledge into publishable educational assets through BEE
          orchestration.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {[
            { label: "Pipelines", value: pipelines.length },
            {
              label: "Completed",
              value: pipelines.filter((p) => p.status === "completed").length,
            },
            {
              label: "Artifacts",
              value: pipelines.reduce((s, p) => s + (p.totalArtifacts || 0), 0),
            },
            {
              label: "Avg Duration",
              value:
                pipelines.length > 0
                  ? `${Math.round(pipelines.reduce((s, p) => s + ((p as any).durationMs || 0), 0) / pipelines.length)}ms`
                  : "—",
            },
          ].map((stat) => (
            <div
              key={stat.label}
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
                {stat.label}
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Pipelines */}
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
              fontSize: "1.1rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Recent Pipelines
          </h2>
          {loading ? (
            <p style={{ color: "#737373" }}>Loading...</p>
          ) : pipelines.length === 0 ? (
            <p style={{ color: "#737373" }}>
              No pipelines yet. Create a Knowledge Object and execute a
              pipeline.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {pipelines
                .slice(-10)
                .reverse()
                .map((p) => (
                  <a
                    key={p.planId}
                    href={`/pipeline/${p.planId}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem 1rem",
                      background: "#0a0a0a",
                      borderRadius: "6px",
                      textDecoration: "none",
                      color: "#e5e5e5",
                      border: "1px solid #262626",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.goal}</div>
                      <div style={{ fontSize: "0.8rem", color: "#737373" }}>
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
        </div>
      </main>
    </div>
  );
}
