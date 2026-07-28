import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProject,
  getSourcesByProject,
  getEvidenceByProject,
  getReviewsByProject,
} from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  idea: "#94a3b8",
  proposal: "#f59e0b",
  active: "#10b981",
  analysis: "#06b6d4",
  draft: "#8b5cf6",
  review: "#3b82f6",
  revision: "#f97316",
  approval: "#14b8a6",
  published: "#22c55e",
  archived: "#64748b",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const sources = getSourcesByProject(id);
  const evidence = getEvidenceByProject(id);
  const reviews = getReviewsByProject(id);

  const NEXT_STATUS: Record<string, string> = {
    idea: "proposal",
    proposal: "active",
    active: "analysis",
    analysis: "draft",
    draft: "review",
    review: "approval",
    approval: "published",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960 }}>
        <div style={{ marginBottom: 20, fontSize: 13, color: "#888" }}>
          <Link href="/" style={{ color: "#0D503C", textDecoration: "none" }}>
            Research
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#666" }}>{project.title}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a" }}>
            {project.title}
          </h1>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: "4px 12px",
              borderRadius: 14,
              background: `${STATUS_COLORS[project.status]}15`,
              color: STATUS_COLORS[project.status],
            }}
          >
            {project.status}
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
          PI: {project.principalInvestigator} &middot; Mission:{" "}
          {project.mission} &middot; Started:{" "}
          {new Date(project.startDate).toLocaleDateString()}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {NEXT_STATUS[project.status] && (
            <form
              method="POST"
              action={`/api/projects/${id}/advance`}
              style={{ display: "inline" }}
            >
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  background: "#0D503C",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Advance to {NEXT_STATUS[project.status]}
              </button>
            </form>
          )}
          <Link
            href={`/projects/${id}/sources/new`}
            style={{
              padding: "8px 16px",
              background: "#fff",
              color: "#444",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            + Add Source
          </Link>
          <Link
            href={`/projects/${id}/evidence/new`}
            style={{
              padding: "8px 16px",
              background: "#fff",
              color: "#444",
              border: "1px solid #d4d4d0",
              borderRadius: 8,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            + Add Evidence
          </Link>
        </div>

        {/* Objectives */}
        {project.objectives.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: 10,
              }}
            >
              Objectives
            </h2>
            <ul
              style={{
                paddingLeft: 20,
                color: "#444",
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              {project.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Findings */}
        {project.findings.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: 10,
              }}
            >
              Findings
            </h2>
            <ul
              style={{
                paddingLeft: 20,
                color: "#444",
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              {project.findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Sources */}
        <section style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 10,
            }}
          >
            Sources ({sources.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sources.map((src) => (
              <div
                key={src.id}
                style={{
                  padding: "12px 16px",
                  background: "#f8f8f5",
                  border: "1px solid #e5e5e0",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}
                  >
                    {src.name}
                  </span>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <span style={{ fontSize: 11, color: "#888" }}>
                      {src.type}
                    </span>
                    <span style={{ fontSize: 11, color: "#888" }}>
                      Credibility: {(src.credibility * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                {src.author && (
                  <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>
                    Author: {src.author}
                  </p>
                )}
              </div>
            ))}
            {sources.length === 0 && (
              <p style={{ fontSize: 13, color: "#888" }}>No sources yet.</p>
            )}
          </div>
        </section>

        {/* Evidence */}
        <section style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 10,
            }}
          >
            Evidence ({evidence.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {evidence.map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: "12px 16px",
                  background: "#f8f8f5",
                  border: "1px solid #e5e5e0",
                  borderRadius: 8,
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1a1a1a",
                    margin: "0 0 4px 0",
                  }}
                >
                  {ev.claim}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#666",
                    margin: "0 0 4px 0",
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{ev.excerpt}&rdquo;
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    fontSize: 12,
                    color: "#888",
                  }}
                >
                  <span>Strength: {ev.strength}</span>
                  <span>Confidence: {(ev.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
            {evidence.length === 0 && (
              <p style={{ fontSize: 13, color: "#888" }}>
                No evidence recorded yet.
              </p>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 10,
            }}
          >
            Reviews ({reviews.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  padding: "12px 16px",
                  background: "#f8f8f5",
                  border: "1px solid #e5e5e0",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}
                  >
                    {rev.reviewer}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 10,
                      background:
                        rev.decision === "approve"
                          ? "#dcfce7"
                          : rev.decision === "revise"
                            ? "#fef3c7"
                            : "#fee2e2",
                      color:
                        rev.decision === "approve"
                          ? "#16a34a"
                          : rev.decision === "revise"
                            ? "#d97706"
                            : "#dc2626",
                    }}
                  >
                    {rev.decision}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
                  {rev.comments}
                </p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p style={{ fontSize: 13, color: "#888" }}>No reviews yet.</p>
            )}
          </div>
        </section>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 12,
                  padding: "3px 10px",
                  borderRadius: 12,
                  background: "#f0f0ec",
                  color: "#666",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
