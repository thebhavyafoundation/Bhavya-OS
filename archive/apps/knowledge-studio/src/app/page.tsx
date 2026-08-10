"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

interface KO {
  id: string;
  title: string;
  domain: string;
  subject?: string;
  grade_level?: string;
  description?: string;
  source_type: string;
  status: string;
  concepts?: any[];
  created_at: string;
}

interface Pipeline {
  id: string;
  goal: string;
  status: string;
  started_at: string;
  completed_at?: string;
  total_duration_ms?: number;
  ko_id: string;
}

export default function HomePage() {
  const [kos, setKos] = useState<KO[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/kos").then((r) => r.json()),
      fetch("/api/pipelines").then((r) => r.json()),
    ])
      .then(([kosData, pipesData]) => {
        setKos(kosData.kos || []);
        setPipelines(pipesData.pipelines || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const completedPipelines = pipelines.filter((p) => p.status === "completed");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0f" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "2rem",
          maxWidth: "1200px",
          color: "#e2e8f0",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 4 }}>
          Knowledge Studio
        </h1>
        <p
          style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem" }}
        >
          Convert raw knowledge into publishable educational assets through BEE
          orchestration.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            { label: "Knowledge Objects", value: kos.length, color: "#60a5fa" },
            {
              label: "Pipelines Run",
              value: pipelines.length,
              color: "#a78bfa",
            },
            {
              label: "Completed",
              value: completedPipelines.length,
              color: "#4ade80",
            },
            {
              label: "Avg Duration",
              value:
                completedPipelines.length > 0
                  ? `${Math.round(completedPipelines.reduce((s, p) => s + (p.total_duration_ms || 0), 0) / completedPipelines.length)}ms`
                  : "—",
              color: "#fbbf24",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#111827",
                border: "1px solid #1e293b",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <a
            href="/ingest"
            style={{
              display: "block",
              padding: 20,
              background: "#111827",
              border: "1px solid #1e293b",
              borderRadius: 12,
              textDecoration: "none",
              color: "#e2e8f0",
              transition: "border-color 0.15s",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>
              New Knowledge Object
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
              Upload text, PDF, DOCX, or Markdown to create a KO
            </p>
          </a>
          <a
            href="/packages"
            style={{
              display: "block",
              padding: 20,
              background: "#111827",
              border: "1px solid #1e293b",
              borderRadius: 12,
              textDecoration: "none",
              color: "#e2e8f0",
              transition: "border-color 0.15s",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>
              View Packages
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
              Browse published and draft knowledge packages
            </p>
          </a>
        </div>

        {/* Recent Knowledge Objects */}
        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16 }}>
            Recent Knowledge Objects
          </h2>
          {loading ? (
            <p style={{ color: "#64748b" }}>Loading...</p>
          ) : kos.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <p style={{ color: "#64748b", marginBottom: 12 }}>
                No knowledge objects yet.
              </p>
              <a
                href="/ingest"
                style={{ color: "#60a5fa", fontSize: "0.9rem" }}
              >
                Create your first KO →
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {kos.slice(0, 10).map((ko) => (
                <a
                  key={ko.id}
                  href={`/pipeline/${ko.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "#0a0a0f",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: "#e2e8f0",
                    border: "1px solid #1e293b",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                      {ko.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {ko.subject || ko.domain} · {ko.source_type}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {ko.concepts?.length || 0} concepts
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          ko.status === "ready"
                            ? "#166534"
                            : ko.status === "processing"
                              ? "#854d0e"
                              : "#1e293b",
                        color:
                          ko.status === "ready"
                            ? "#4ade80"
                            : ko.status === "processing"
                              ? "#fbbf24"
                              : "#94a3b8",
                      }}
                    >
                      {ko.status}
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
