import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getDocument } from "@/lib/data";

const CATEGORY_COLORS: Record<string, string> = {
  governance: "#8b5cf6", policy: "#3b82f6", standard: "#10b981",
  adr: "#a855f7", rfc: "#06b6d4", release: "#f59e0b", content: "#64748b",
};

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = getCollection(id);
  if (!collection) notFound();

  const documents = collection.documentIds.map((docId) => getDocument(docId)).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8" }}>
      <header style={{ borderBottom: "1px solid #e5e5e0", padding: "16px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0D503C" }}>Bhavya Library</div>
          </Link>
          <nav style={{ display: "flex", gap: 24, fontSize: 14 }}>
            <Link href="/collections" style={{ color: "#4a4a4a", textDecoration: "none" }}>Collections</Link>
            <Link href="/search" style={{ color: "#4a4a4a", textDecoration: "none" }}>Search</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ marginBottom: 12, fontSize: 13, color: "#888" }}>
          <Link href="/collections" style={{ color: "#0D503C", textDecoration: "none" }}>Collections</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#666" }}>{collection.name}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>{collection.icon}</span>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{collection.name}</h1>
            <p style={{ fontSize: 14, color: "#888", margin: 0 }}>{documents.length} documents</p>
          </div>
        </div>
        <p style={{ fontSize: 15, color: "#666", marginBottom: 36, lineHeight: 1.6 }}>{collection.description}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {documents.map((doc) => (
            <Link
              key={doc!.id}
              href={`/read/${doc!.id}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", background: "#fff", border: "1px solid #e5e5e0",
                borderRadius: 10, textDecoration: "none", transition: "border-color 0.15s",
              }}
            >
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px 0" }}>{doc!.title}</h3>
                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                  {doc!.readingTime} min read
                  {doc!.status ? ` \u00b7 ${doc!.status}` : ""}
                </p>
              </div>
              <span
                style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 12,
                  background: `${CATEGORY_COLORS[doc!.category] || "#888"}15`,
                  color: CATEGORY_COLORS[doc!.category] || "#888",
                }}
              >
                {doc!.category}
              </span>
            </Link>
          ))}
          {documents.length === 0 && (
            <p style={{ padding: 40, textAlign: "center", color: "#888" }}>No documents in this collection yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
