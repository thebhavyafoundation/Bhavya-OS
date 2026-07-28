import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getDocument } from "@/lib/data";
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

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = getCollection(id);
  if (!collection) notFound();

  const documents = collection.documentIds
    .map((docId) => getDocument(docId))
    .filter(Boolean);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, fontSize: 13, color: "#64748b" }}>
          <Link href="/collections" style={{ color: "#10b981", textDecoration: "none" }}>Collections</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#94a3b8" }}>{collection.name}</span>
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
                background: `${CATEGORY_COLORS[collection.category] || "#64748b"}22`,
                color: CATEGORY_COLORS[collection.category] || "#64748b",
                textTransform: "capitalize",
              }}
            >
              {collection.category}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              {documents.length} document{documents.length !== 1 ? "s" : ""}
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>{collection.name}</h1>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6 }}>{collection.description}</p>
        </div>

        {/* Documents */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {documents.map((doc) => (
            <Link
              key={doc!.id}
              href={`/documents/${doc!.id}`}
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{doc!.title}</h3>
                {doc!.status && (
                  <span style={{ fontSize: 11, color: "#64748b" }}>{doc!.status}</span>
                )}
              </div>
              {doc!.summary && (
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                  {doc!.summary.slice(0, 120)}{doc!.summary.length > 120 ? "..." : ""}
                </p>
              )}
            </Link>
          ))}
          {documents.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
              No documents in this collection yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
