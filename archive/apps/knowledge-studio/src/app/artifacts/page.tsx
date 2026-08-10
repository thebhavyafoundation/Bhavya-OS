"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

interface Artifact {
  id: string;
  planId: string;
  type: string;
  nodeId: string;
  capabilityId: string;
  data: any;
  provenance: any;
  createdAt: string;
}

export default function ArtifactsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/artifacts")
      .then((r) => r.json())
      .then((d) => {
        setArtifacts(d.artifacts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active="artifacts" />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Generated Artifacts
        </h1>
        <p style={{ color: "#a3a3a3", marginBottom: "1.5rem" }}>
          All artifacts produced by pipeline executions. Each artifact includes
          full provenance.
        </p>

        {loading ? (
          <p style={{ color: "#737373" }}>Loading...</p>
        ) : artifacts.length === 0 ? (
          <p style={{ color: "#737373" }}>
            No artifacts yet. Run a pipeline first.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {artifacts.map((a) => (
              <a
                key={a.id}
                href={`/artifacts/${a.id}`}
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.15rem 0.4rem",
                        borderRadius: "4px",
                        background: "#1e1b4b",
                        color: "#818cf8",
                      }}
                    >
                      {a.type}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                      {a.capabilityId}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#737373" }}>
                    {a.id}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "#737373" }}>
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#525252",
                      marginTop: "0.25rem",
                    }}
                  >
                    Plan: {a.planId.slice(0, 20)}...
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
