import Link from "next/link";
import { getDocuments, getDocumentsByCategory, type DocumentCategory, type KnowledgeDocument } from "@/lib/data";
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

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "governance", label: "Governance" },
  { id: "policy", label: "Policies" },
  { id: "standard", label: "Standards" },
  { id: "adr", label: "ADRs" },
  { id: "rfc", label: "RFCs" },
  { id: "release", label: "Releases" },
  { id: "content", label: "Content" },
];

function DocumentCard({ doc }: { doc: KnowledgeDocument }) {
  return (
    <Link
      href={`/documents/${doc.id}`}
      style={{
        display: "block",
        padding: "16px 20px",
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 10,
        textDecoration: "none",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{doc.title}</h3>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 12,
            background: `${CATEGORY_COLORS[doc.category] || "#64748b"}22`,
            color: CATEGORY_COLORS[doc.category] || "#64748b",
          }}
        >
          {doc.category}
        </span>
      </div>
      {doc.summary && (
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 8px 0", lineHeight: 1.5 }}>
          {doc.summary.slice(0, 120)}{doc.summary.length > 120 ? "..." : ""}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {doc.status && (
          <span style={{ fontSize: 11, color: "#64748b" }}>Status: {doc.status}</span>
        )}
        {doc.tags.slice(0, 3).map((tag) => (
          <span key={tag} style={{ fontSize: 11, color: "#475569" }}>#{tag}</span>
        ))}
        {doc.links.length > 0 && (
          <span style={{ fontSize: 11, color: "#475569" }}>{doc.links.length} link{doc.links.length !== 1 ? "s" : ""}</span>
        )}
      </div>
    </Link>
  );
}

export default function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = { category: undefined as string | undefined, q: undefined as string | undefined, ...searchParams };
  const activeCategory = params.category || "all";
  const query = params.q || "";

  let documents = activeCategory === "all"
    ? getDocuments()
    : getDocumentsByCategory(activeCategory as DocumentCategory);

  if (query) {
    const q = query.toLowerCase();
    documents = documents.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Documents</h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>
            Browse and search the institutional knowledge base.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/documents" : `/documents?category=${cat.id}`}
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "var(--mono, monospace)",
                textDecoration: "none",
                border: "1px solid",
                borderColor: activeCategory === cat.id ? "#10b981" : "#1e293b",
                background: activeCategory === cat.id ? "rgba(16,185,129,0.12)" : "#0f172a",
                color: activeCategory === cat.id ? "#10b981" : "#94a3b8",
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
          {documents.length} document{documents.length !== 1 ? "s" : ""}
          {activeCategory !== "all" ? ` in ${activeCategory}` : ""}
          {query ? ` matching "${query}"` : ""}
        </p>

        {/* Document List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
          {documents.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
              No documents found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
