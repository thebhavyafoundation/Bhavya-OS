"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default function IngestPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [domain, setDomain] = useState("academics");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ingestMode, setIngestMode] = useState<"text" | "file">("text");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title)
        setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const handleIngest = async () => {
    if (!title) return;
    if (ingestMode === "text" && !text) return;
    if (ingestMode === "file" && !selectedFile) return;

    setLoading(true);
    setResult(null);

    try {
      let koRes;
      if (ingestMode === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", title);
        formData.append("domain", domain);
        formData.append("subject", subject);
        formData.append("gradeLevel", gradeLevel);
        koRes = await fetch("/api/ingest", { method: "POST", body: formData });
      } else {
        koRes = await fetch("/api/ingest", {
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
      }

      const koData = await koRes.json();
      if (!koData.success) throw new Error(koData.error);

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
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0f" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "2rem",
          maxWidth: "900px",
          color: "#e2e8f0",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>
          Ingest Source
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: 24, fontSize: "0.9rem" }}>
          Upload a file or paste content to create a Knowledge Object and run
          the full pipeline.
        </p>

        {/* Mode Toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setIngestMode("text")}
            style={{
              padding: "8px 16px",
              background: ingestMode === "text" ? "#2563eb" : "#1e1e2e",
              border: "1px solid #334155",
              borderRadius: 6,
              color: "#e2e8f0",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Paste Text
          </button>
          <button
            onClick={() => setIngestMode("file")}
            style={{
              padding: "8px 16px",
              background: ingestMode === "file" ? "#2563eb" : "#1e1e2e",
              border: "1px solid #334155",
              borderRadius: 6,
              color: "#e2e8f0",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Upload File
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginBottom: 4,
              }}
            >
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Cell Biology"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#1e1e2e",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#e2e8f0",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  marginBottom: 4,
                }}
              >
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#1e1e2e",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#e2e8f0",
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
                  color: "#94a3b8",
                  marginBottom: 4,
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
                  padding: "10px 12px",
                  background: "#1e1e2e",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#e2e8f0",
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
                  color: "#94a3b8",
                  marginBottom: 4,
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
                  padding: "10px 12px",
                  background: "#1e1e2e",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {ingestMode === "text" ? (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  marginBottom: 4,
                }}
              >
                Content *
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your source content here — text, markdown, research paper abstract, etc."
                rows={12}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#1e1e2e",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ) : (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  marginBottom: 4,
                }}
              >
                File *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: 40,
                  background: "#1e1e2e",
                  border: "2px dashed #334155",
                  borderRadius: 12,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {selectedFile ? (
                  <div>
                    <p style={{ color: "#e2e8f0", fontWeight: 500 }}>
                      {selectedFile.name}
                    </p>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "0.8rem",
                        marginTop: 4,
                      }}
                    >
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: "#94a3b8" }}>Click to select a file</p>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "0.8rem",
                        marginTop: 4,
                      }}
                    >
                      PDF, DOCX, Markdown, or TXT
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.md,.markdown,.txt"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          )}

          <button
            onClick={handleIngest}
            disabled={
              loading ||
              !title ||
              (ingestMode === "text" && !text) ||
              (ingestMode === "file" && !selectedFile)
            }
            style={{
              padding: "12px 24px",
              background: loading ? "#334155" : "#2563eb",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              alignSelf: "flex-start",
            }}
          >
            {loading ? "Executing Pipeline..." : "Ingest & Execute Pipeline"}
          </button>
        </div>

        {result && !result.error && (
          <div
            style={{
              marginTop: 24,
              background: "#111827",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                Pipeline Complete
              </h2>
              <a
                href={`/pipeline/${result.executionId}`}
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
                gap: 16,
              }}
            >
              <div>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  Execution ID
                </p>
                <p style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>
                  {result.executionId}
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  Status
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color:
                      result.status === "completed" ? "#4ade80" : "#ef4444",
                  }}
                >
                  {result.status}
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  Duration
                </p>
                <p style={{ fontSize: "0.85rem" }}>
                  {result.totalDurationMs}ms
                </p>
              </div>
            </div>
            {result.artifacts && (
              <div style={{ marginTop: 16 }}>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Artifacts Created
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {result.artifacts.map((a: string) => (
                    <span
                      key={a}
                      style={{
                        padding: "4px 10px",
                        background: "#1e293b",
                        borderRadius: 4,
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {result?.error && (
          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: "#450a0a",
              border: "1px solid #7f1d1d",
              borderRadius: 8,
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
