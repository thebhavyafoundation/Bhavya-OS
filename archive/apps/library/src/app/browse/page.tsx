import Link from "next/link";
import { getDocuments } from "@/lib/data";

const CATEGORY_COLORS: Record<string, string> = {
  governance: "#8b5cf6", policy: "#3b82f6", standard: "#10b981",
  adr: "#a855f7", rfc: "#06b6d4", release: "#f59e0b", content: "#64748b",
};

export default function BrowsePage() {
  const docs = getDocuments();

  const grouped = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

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
            <Link href="/browse" style={{ color: "#0D503C", fontWeight: 600, textDecoration: "none" }}>Browse All</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Browse All</h1>
        <p style={{ fontSize: 15, color: "#666", marginBottom: 36 }}>{docs.length} documents across all categories.</p>

        {Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length).map(([category, categoryDocs]) => (
          <section key={category} style={{ marginBottom: 36 }}>
            <h2 style={{
              fontSize: 18, fontWeight: 600, color: CATEGORY_COLORS[category] || "#1a1a1a",
              marginBottom: 14, textTransform: "capitalize",
            }}>
              {category} ({categoryDocs.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {categoryDocs.map((doc) => (
                <Link key={doc.id} href={`/read/${doc.id}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", background: "#fff", border: "1px solid #e5e5e0",
                    borderRadius: 8, textDecoration: "none",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a", margin: 0 }}>{doc.title}</h3>
                    <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{doc.readingTime} min read</p>
                  </div>
                  {doc.status && (
                    <span style={{ fontSize: 11, color: "#888" }}>{doc.status}</span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
