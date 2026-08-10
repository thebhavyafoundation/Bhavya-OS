"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

interface Package {
  id: string;
  title: string;
  description: string;
  domain: string;
  subject: string;
  gradeLevel: string;
  status: string;
  version: string;
  lesson: any;
  assessment: any;
  teacherGuide: any;
  workbook: any;
  website: any;
  publication: any;
  versionMeta: any;
  provenance: any[];
  createdAt: string;
  updatedAt: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    setLoading(true);
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
      }
    } catch {}
    setLoading(false);
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch {}
  }

  const filtered = packages.filter(
    (p) => !filterStatus || p.status === filterStatus,
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0f" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", color: "#e2e8f0" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>
          Knowledge Packages
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: 32 }}>
          Complete production packages with artifacts, publication status, and
          version history.
        </p>

        {/* Search */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search packages..."
            style={{
              flex: 1,
              padding: "10px 16px",
              background: "#1e1e2e",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#e2e8f0",
              fontSize: "0.9rem",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Search
          </button>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["", "draft", "in_review", "approved", "published", "archived"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: "6px 14px",
                  background: filterStatus === s ? "#2563eb" : "#1e1e2e",
                  border: "1px solid #334155",
                  borderRadius: 6,
                  color: "#e2e8f0",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                {s || "All"}
              </button>
            ),
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div
            style={{
              marginBottom: 24,
              padding: 16,
              background: "#1a1a2e",
              borderRadius: 12,
              border: "1px solid #334155",
            }}
          >
            <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>
              Search Results ({searchResults.length})
            </h3>
            {searchResults.map((r, i) => (
              <div
                key={i}
                style={{ padding: "8px 0", borderBottom: "1px solid #1e293b" }}
              >
                <span style={{ color: "#60a5fa" }}>{r.packageId}</span>
                <span style={{ color: "#64748b", marginLeft: 12 }}>
                  score: {r.score.toFixed(2)}
                </span>
                {r.matches?.slice(0, 2).map((m: any, j: number) => (
                  <div
                    key={j}
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.8rem",
                      marginLeft: 16,
                    }}
                  >
                    {m.section}: {m.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Packages List */}
        {loading ? (
          <p style={{ color: "#64748b" }}>Loading...</p>
        ) : (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div>
              {filtered.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  style={{
                    padding: 16,
                    background:
                      selectedPkg?.id === pkg.id ? "#1e293b" : "#111827",
                    border: "1px solid #1e293b",
                    borderRadius: 10,
                    marginBottom: 8,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                      {pkg.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          pkg.status === "published"
                            ? "#166534"
                            : pkg.status === "in_review"
                              ? "#854d0e"
                              : "#1e293b",
                        color:
                          pkg.status === "published"
                            ? "#4ade80"
                            : pkg.status === "in_review"
                              ? "#fbbf24"
                              : "#94a3b8",
                      }}
                    >
                      {pkg.status}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "0.8rem",
                      margin: "4px 0 0",
                    }}
                  >
                    {pkg.subject} · {pkg.gradeLevel} · v{pkg.version}
                  </p>
                  <p
                    style={{
                      color: "#475569",
                      fontSize: "0.75rem",
                      margin: "4px 0 0",
                    }}
                  >
                    {pkg.provenance?.length || 0} artifacts ·{" "}
                    {pkg.website?.totalPages || 0} pages
                  </p>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            {selectedPkg && (
              <div
                style={{
                  padding: 20,
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  position: "sticky",
                  top: 32,
                  maxHeight: "80vh",
                  overflow: "auto",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  {selectedPkg.title}
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.85rem",
                    marginBottom: 16,
                  }}
                >
                  {selectedPkg.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      padding: 12,
                      background: "#1a1a2e",
                      borderRadius: 8,
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
                      Status
                    </p>
                    <p
                      style={{
                        fontWeight: 600,
                        color:
                          selectedPkg.status === "published"
                            ? "#4ade80"
                            : "#fbbf24",
                      }}
                    >
                      {selectedPkg.status}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: 12,
                      background: "#1a1a2e",
                      borderRadius: 8,
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
                      Version
                    </p>
                    <p style={{ fontWeight: 600 }}>{selectedPkg.version}</p>
                  </div>
                  <div
                    style={{
                      padding: 12,
                      background: "#1a1a2e",
                      borderRadius: 8,
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
                      Website Pages
                    </p>
                    <p style={{ fontWeight: 600 }}>
                      {selectedPkg.website?.totalPages || 0}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: 12,
                      background: "#1a1a2e",
                      borderRadius: 8,
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
                      Provenance
                    </p>
                    <p style={{ fontWeight: 600 }}>
                      {selectedPkg.provenance?.length || 0} steps
                    </p>
                  </div>
                </div>

                {/* Publication */}
                {selectedPkg.publication && (
                  <div style={{ marginBottom: 20 }}>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      Publication
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                      Status: {selectedPkg.publication.status}
                    </p>
                    {selectedPkg.publication.publishedAt && (
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                        Published:{" "}
                        {new Date(
                          selectedPkg.publication.publishedAt,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedPkg.publication.immutableHash && (
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.85rem",
                          fontFamily: "monospace",
                        }}
                      >
                        Hash: {selectedPkg.publication.immutableHash}
                      </p>
                    )}
                  </div>
                )}

                {/* Artifacts */}
                <div>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Artifacts
                  </h3>
                  {[
                    "lesson",
                    "assessment",
                    "teacherGuide",
                    "workbook",
                    "website",
                  ].map(
                    (key) =>
                      selectedPkg[key] && (
                        <div
                          key={key}
                          style={{
                            padding: "6px 0",
                            borderBottom: "1px solid #1e293b",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{ color: "#e2e8f0", fontSize: "0.85rem" }}
                          >
                            {key}
                          </span>
                          <span
                            style={{ color: "#4ade80", fontSize: "0.8rem" }}
                          >
                            ✓
                          </span>
                        </div>
                      ),
                  )}
                </div>

                {/* Website preview */}
                {selectedPkg.website?.pages?.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      Website Pages
                    </h3>
                    {selectedPkg.website.pages.map((p: any, i: number) => (
                      <div
                        key={i}
                        style={{
                          padding: "6px 0",
                          borderBottom: "1px solid #1e293b",
                        }}
                      >
                        <span style={{ color: "#60a5fa", fontSize: "0.85rem" }}>
                          {p.path}
                        </span>
                        <span
                          style={{
                            color: "#64748b",
                            fontSize: "0.8rem",
                            marginLeft: 8,
                          }}
                        >
                          {p.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
