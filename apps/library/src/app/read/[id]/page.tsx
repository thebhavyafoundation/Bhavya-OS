import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocument, getDocuments } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const CATEGORY_COLORS: Record<string, string> = {
  governance: "#8b5cf6", policy: "#3b82f6", standard: "#10b981",
  adr: "#a855f7", rfc: "#06b6d4", release: "#f59e0b", content: "#64748b",
};

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = getDocument(id);
  if (!doc) notFound();

  const allDocs = getDocuments();
  const currentIndex = allDocs.findIndex((d) => d.id === id);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  function renderContent(content: string) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} style={{ margin: "12px 0", paddingLeft: 24, color: "#444", fontSize: 15, lineHeight: 1.8 }}>
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
        elements.push(<h1 key={i} style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginTop: 32, marginBottom: 16 }}>{line.slice(2)}</h1>);
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(<h2 key={i} style={{ fontSize: 22, fontWeight: 600, color: "#1a1a1a", marginTop: 28, marginBottom: 12 }}>{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        flushList();
        elements.push(<h3 key={i} style={{ fontSize: 18, fontWeight: 600, color: "#333", marginTop: 20, marginBottom: 10 }}>{line.slice(4)}</h3>);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        listItems.push(<li key={i}>{line.slice(2)}</li>);
      } else if (line.match(/^\d+\.\s/)) {
        listItems.push(<li key={i}>{line.replace(/^\d+\.\s/, "")}</li>);
      } else if (line.startsWith("**") && line.endsWith("**")) {
        flushList();
        elements.push(<p key={i} style={{ fontWeight: 600, color: "#1a1a1a", margin: "12px 0", fontSize: 15 }}>{line.slice(2, -2)}</p>);
      } else if (line.trim() === "") {
        flushList();
      } else {
        flushList();
        elements.push(<p key={i} style={{ color: "#444", margin: "8px 0", fontSize: 15, lineHeight: 1.8 }}>{line}</p>);
      }
    }
    flushList();
    return elements;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", display: "flex" }}>
      <Sidebar />

      <article style={{ flex: 1, maxWidth: 720, margin: "0 auto", padding: "40px 48px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
          <Link href="/" style={{ color: "#0D503C", textDecoration: "none" }}>Library</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link href="/browse" style={{ color: "#0D503C", textDecoration: "none" }}>Browse</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#666" }}>{doc.title}</span>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span
            style={{
              fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 12,
              background: `${CATEGORY_COLORS[doc.category] || "#888"}15`,
              color: CATEGORY_COLORS[doc.category] || "#888", textTransform: "capitalize",
            }}
          >
            {doc.category}
          </span>
          <span style={{ fontSize: 13, color: "#888" }}>{doc.readingTime} min read</span>
          {doc.status && <span style={{ fontSize: 13, color: "#888" }}>{doc.status}</span>}
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", marginBottom: 16, lineHeight: 1.2 }}>{doc.title}</h1>

        {doc.summary && (
          <p style={{ fontSize: 16, color: "#666", marginBottom: 32, lineHeight: 1.6, fontStyle: "italic" }}>{doc.summary}</p>
        )}

        {/* Content */}
        <div style={{ marginBottom: 48 }}>
          {renderContent(doc.content)}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 40 }}>
          {doc.tags.map((tag) => (
            <span key={tag} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 16, background: "#f0f0ec", color: "#666" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e5e0", paddingTop: 24 }}>
          {prevDoc ? (
            <Link href={`/read/${prevDoc.id}`} style={{ textDecoration: "none", maxWidth: "45%" }}>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 4px 0" }}>&larr; Previous</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#0D503C", margin: 0 }}>{prevDoc.title}</p>
            </Link>
          ) : <div />}
          {nextDoc ? (
            <Link href={`/read/${nextDoc.id}`} style={{ textDecoration: "none", maxWidth: "45%", textAlign: "right" }}>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 4px 0" }}>Next &rarr;</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#0D503C", margin: 0 }}>{nextDoc.title}</p>
            </Link>
          ) : <div />}
        </div>
      </article>
    </div>
  );
}
