"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function ArtifactDetailPage() {
  const params = useParams();
  const artifactId = params.id as string;
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/artifacts?id=${artifactId}`)
      .then((r) => r.json())
      .then((d) => {
        setArtifact(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [artifactId]);

  if (loading)
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active="artifacts" />
        <main style={{ flex: 1, padding: "2rem" }}>Loading...</main>
      </div>
    );
  if (!artifact)
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active="artifacts" />
        <main style={{ flex: 1, padding: "2rem" }}>Artifact not found.</main>
      </div>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active="artifacts" />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px" }}>
        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                background: "#1e1b4b",
                color: "#818cf8",
              }}
            >
              {artifact.type}
            </span>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 600 }}>
              {artifact.capabilityId}
            </h1>
          </div>
          <p style={{ color: "#737373", fontSize: "0.8rem" }}>
            ID: {artifact.id}
          </p>
        </div>

        {/* Provenance */}
        <div
          style={{
            background: "#171717",
            border: "1px solid #262626",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}
          >
            Provenance
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            {artifact.provenance &&
              Object.entries(artifact.provenance).map(([key, val]) => (
                <div key={key}>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#737373",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {key}
                  </div>
                  <div style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>
                    {String(val)}
                  </div>
                </div>
              ))}
          </div>
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #262626",
            }}
          >
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#737373" }}>
                  Plan:{" "}
                </span>
                <a
                  href={`/pipeline/${artifact.planId}`}
                  style={{
                    color: "#60a5fa",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  {artifact.planId}
                </a>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#737373" }}>
                  Node:{" "}
                </span>
                <span style={{ fontSize: "0.8rem" }}>{artifact.nodeId}</span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#737373" }}>
                  Created:{" "}
                </span>
                <span style={{ fontSize: "0.8rem" }}>
                  {new Date(artifact.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Artifact Content */}
        <div
          style={{
            background: "#171717",
            border: "1px solid #262626",
            borderRadius: "8px",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}
          >
            Artifact Content
          </h2>
          <pre
            style={{
              fontSize: "0.75rem",
              color: "#a3a3a3",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "#0a0a0a",
              padding: "1rem",
              borderRadius: "6px",
              maxHeight: "600px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(artifact.data, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}
