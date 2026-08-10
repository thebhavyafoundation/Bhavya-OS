import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocument, getDocuments, getGraphNode, getLinkedNodes } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const CATEGORY_COLORS: Record<string, string> = {
  governance: "#8b5cf6",
  policy: "#3b82f6",
  standard: "#10b981",
  adr: "#a855f7",
  rfc: "#06b6d4",
  release: "#f59e0b",
  research: "#ec4899",
  report: "#6366f1",
  project: "#14b8a6",
  content: "#64748b",
  financial: "#f97316",
};

export default async function DocumentViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = getDocument(id);
  if (!doc) notFound();

  const graphNode = getGraphNode(id);
  const linkedNodes = getLinkedNodes(id);
  const allDocs = getDocuments();
  const citingDocs = allDocs.filter((d) => d.links.includes(id));

  // Simple markdown-to-HTML (headings, bold, lists, paragraphs)
  function renderContent(content: string) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} style={{ margin: "8px 0", paddingLeft: 20, color: "#cbd5e1", fontSize: 14, lineHeight: 1.7 }}>
            {listItems}
          </ul>,
        );
        listItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={i} style={{ fontSize: 24, fontWeight: 700, color: "#f8fafc", marginTop: 24, marginBottom: 12 }}>
            {line.slice(2)}
          </h1>,
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={i} style={{ fontSize: 20, fontWeight: 600, color: "#f1f5f9", marginTop: 20, marginBottom: 8 }}>
            {line.slice(3)}
          </h2>,
        );
      } else if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={i} style={{ fontSize: 16, fontWeight: 600, color: "#e2e8f0", marginTop: 16, marginBottom: 8 }}>
            {line.slice(4)}
          </h3>,
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        listItems.push(
          <li key={i}>{line.slice(2)}</li>,
        );
      } else if (line.match(/^\d+\.\s/)) {
        listItems.push(
          <li key={i}>{line.replace(/^\d+\.\s/, "")}</li>,
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        flushList();
        elements.push(
          <p key={i} style={{ fontWeight: 600, color: "#f1f5f9", margin: "8px 0", fontSize: 14 }}>
            {line.slice(2, -2)}
          </p>,
        );
      } else if (line.trim() === "") {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={i} style={{ color: "#cbd5e1", margin: "6px 0", fontSize: 14, lineHeight: 1.7 }}>
            {line}
          </p>,
        );
      }
    }
    flushList();
    return elements;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, fontSize: 13, color: "#64748b" }}>
          <Link href="/documents" style={{ color: "#10b981", textDecoration: "none" }}>Documents</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link href={`/documents?category=${doc.category}`} style={{ color: "#10b981", textDecoration: "none", textTransform: "capitalize" }}>
            {doc.category}
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#94a3b8" }}>{doc.title}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: "3px 10px",
                borderRadius: 12,
                background: `${CATEGORY_COLORS[doc.category] || "#64748b"}22`,
                color: CATEGORY_COLORS[doc.category] || "#64748b",
                textTransform: "capitalize",
              }}
            >
              {doc.category}
            </span>
            {doc.status && (
              <span style={{ fontSize: 12, color: "#64748b" }}>Status: {doc.status}</span>
            )}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>{doc.title}</h1>
          {doc.summary && (
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6 }}>{doc.summary}</p>
          )}
        </div>

        {/* Content */}
        <article style={{ marginBottom: 40 }}>
          {renderContent(doc.content)}
        </article>

        {/* Metadata Sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
          {/* Tags */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", marginBottom: 12 }}>Tags</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {doc.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 12, background: "#1e293b", color: "#94a3b8" }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Citations */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", marginBottom: 12 }}>
              Citations ({citingDocs.length})
            </h3>
            {citingDocs.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {citingDocs.slice(0, 5).map((citing) => (
                  <Link key={citing.id} href={`/documents/${citing.id}`} style={{ fontSize: 13, color: "#10b981", textDecoration: "none" }}>
                    {citing.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#64748b" }}>No documents cite this one.</p>
            )}
          </div>
        </div>

        {/* Linked Nodes */}
        {linkedNodes.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc", marginBottom: 16 }}>Related Knowledge Graph Nodes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {linkedNodes.map((node) => (
                <div key={node.id} style={{ padding: "14px 16px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc" }}>{node.title}</span>
                    <span style={{ fontSize: 11, color: CATEGORY_COLORS[node.type] || "#64748b" }}>{node.type}</span>
                  </div>
                  {node.status && <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Status: {node.status}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graph Node Info */}
        {graphNode && (
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 40 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", marginBottom: 12 }}>Knowledge Graph Entry</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: 13 }}>
              <div>
                <p style={{ color: "#64748b", margin: "0 0 4px 0" }}>ID</p>
                <p style={{ color: "#f8fafc", margin: 0, fontFamily: "monospace" }}>{graphNode.id}</p>
              </div>
              <div>
                <p style={{ color: "#64748b", margin: "0 0 4px 0" }}>Type</p>
                <p style={{ color: "#f8fafc", margin: 0, textTransform: "capitalize" }}>{graphNode.type}</p>
              </div>
              <div>
                <p style={{ color: "#64748b", margin: "0 0 4px 0" }}>Owner</p>
                <p style={{ color: "#f8fafc", margin: 0 }}>{graphNode.owner || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
