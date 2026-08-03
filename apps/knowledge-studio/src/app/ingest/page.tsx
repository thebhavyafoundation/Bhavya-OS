"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default function IngestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [domain, setDomain] = useState("academics");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleIngest = async () => {
    if (!title || !text) return;
    setLoading(true);

    try {
      // Step 1: Create KO
      const koRes = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          text,
          domain,
          subject,
          gradeLevel,
          sourceType: "text",
        }),
      });
      const koData = await koRes.json();
      if (!koData.success) throw new Error(koData.error);

      // Step 2: Execute pipeline
      const execRes = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ koId: koData.ko.id }),
      });
      const execData = await execRes.json();
      if (!execData.success) throw new Error(execData.error);

      setResult(execData);
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active="ingest" />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "900px" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Ingest Source
        </h1>
        <p style={{ color: "#a3a3a3", marginBottom: "1.5rem" }}>
          Paste content and create a Knowledge Object, then execute the full
          pipeline through BEE.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                color: "#a3a3a3",
                marginBottom: "0.25rem",
              }}
            >
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Cell Biology"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "#171717",
                border: "1px solid #262626",
                borderRadius: "6px",
                color: "#e5e5e5",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#a3a3a3",
                  marginBottom: "0.25rem",
                }}
              >
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  background: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "6px",
                  color: "#e5e5e5",
                  fontSize: "0.85rem",
                }}
              >
                <option value="academics">Academics</option>
                <option value="knowledge">Knowledge</option>
                <option value="research">Research</option>
                <option value="media">Media</option>
                <option value="engineering">Engineering</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#a3a3a3",
                  marginBottom: "0.25rem",
                }}
              >
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., biology"
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  background: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "6px",
                  color: "#e5e5e5",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#a3a3a3",
                  marginBottom: "0.25rem",
                }}
              >
                Grade Level
              </label>
              <input
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                placeholder="8"
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  background: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "6px",
                  color: "#e5e5e5",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                color: "#a3a3a3",
                marginBottom: "0.25rem",
              }}
            >
              Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your source content here — text, markdown, research paper abstract, etc."
              rows={12}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#171717",
                border: "1px solid #262626",
                borderRadius: "6px",
                color: "#e5e5e5",
                fontSize: "0.85rem",
                fontFamily: "monospace",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={handleIngest}
            disabled={!title || !text || loading}
            style={{
              padding: "0.75rem 1.5rem",
              background: loading ? "#262626" : "#fff",
              color: loading ? "#737373" : "#000",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              alignSelf: "flex-start",
            }}
          >
            {loading ? "Executing Pipeline..." : "Ingest & Execute Pipeline"}
          </button>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div
            style={{
              marginTop: "2rem",
              background: "#171717",
              border: "1px solid #262626",
              borderRadius: "8px",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                Pipeline Complete
              </h2>
              <a
                href={`/pipeline/${result.planId}`}
                style={{
                  color: "#60a5fa",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                View Details →
              </a>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              <div>
                <span style={{ color: "#737373", fontSize: "0.8rem" }}>
                  Plan ID
                </span>
                <div style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>
                  {result.planId}
                </div>
              </div>
              <div>
                <span style={{ color: "#737373", fontSize: "0.8rem" }}>
                  Status
                </span>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color:
                      result.status === "completed" ? "#22c55e" : "#ef4444",
                  }}
                >
                  {result.status}
                </div>
              </div>
              <div>
                <span style={{ color: "#737373", fontSize: "0.8rem" }}>
                  Artifacts
                </span>
                <div style={{ fontSize: "0.85rem" }}>
                  {result.totalArtifacts}
                </div>
              </div>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <span style={{ color: "#737373", fontSize: "0.8rem" }}>
                Node Results
              </span>
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                {result.nodeResults?.map((nr: any) => (
                  <div
                    key={nr.nodeId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    <span
                      style={{
                        color:
                          nr.status === "completed" ? "#22c55e" : "#ef4444",
                      }}
                    >
                      ●
                    </span>
                    <span style={{ color: "#a3a3a3" }}>{nr.capabilityId}</span>
                    <span style={{ color: "#525252" }}>→</span>
                    <span>{nr.artifactId || nr.error}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {result?.error && (
          <div
            style={{
              marginTop: "2rem",
              background: "#450a0a",
              border: "1px solid #7f1d1d",
              borderRadius: "8px",
              padding: "1rem",
              color: "#fca5a5",
            }}
          >
            Error: {result.error}
          </div>
        )}
      </main>
    </div>
  );
}
