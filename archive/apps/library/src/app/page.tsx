import Link from "next/link";
import { getDocuments, getCollections } from "@/lib/data";

const CATEGORY_LABELS: Record<string, string> = {
  governance: "Governance",
  policy: "Policies",
  standard: "Standards",
  adr: "Decision Records",
  rfc: "Technical RFCs",
  release: "Releases",
  content: "Content",
};

export default function LibraryHomePage() {
  const docs = getDocuments();
  const collections = getCollections();
  const recentDocs = [...docs].sort((a, b) => (b.created || "").localeCompare(a.created || "")).slice(0, 8);
  const totalReadingTime = docs.reduce((sum, d) => sum + d.readingTime, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #e5e5e0", padding: "16px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0D503C" }}>Bhavya Library</div>
            <div style={{ fontSize: 12, color: "#8B7355" }}>Open Knowledge for Everyone</div>
          </Link>
          <nav style={{ display: "flex", gap: 24, fontSize: 14 }}>
            <Link href="/collections" style={{ color: "#4a4a4a", textDecoration: "none" }}>Collections</Link>
            <Link href="/search" style={{ color: "#4a4a4a", textDecoration: "none" }}>Search</Link>
            <Link href="/browse" style={{ color: "#4a4a4a", textDecoration: "none" }}>Browse All</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 48px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#0D503C", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          Digital Library
        </p>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#1a1a1a", marginBottom: 12, maxWidth: 600, lineHeight: 1.2 }}>
          Knowledge access, AI literacy, and lifelong learning.
        </h1>
        <p style={{ fontSize: 16, color: "#666", maxWidth: 560, lineHeight: 1.6, marginBottom: 32 }}>
          Open access to institutional knowledge, scientific research, governance documents, and educational resources. Free for everyone.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            href="/search"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", background: "#0D503C", color: "#fff",
              borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}
          >
            Search Knowledge
          </Link>
          <Link
            href="/collections"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", background: "#fff", color: "#0D503C",
              border: "1px solid #d4d4d0", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}
          >
            Browse Collections
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Documents", value: docs.length, sublabel: "across all categories" },
            { label: "Collections", value: collections.length, sublabel: "curated topics" },
            { label: "Reading Time", value: `${totalReadingTime} min`, sublabel: "total content" },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "20px 24px", background: "#fff", border: "1px solid #e5e5e0", borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{stat.label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#0D503C" }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: "#aaa" }}>{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1a1a1a" }}>Collections</h2>
          <Link href="/collections" style={{ fontSize: 14, color: "#0D503C", textDecoration: "none" }}>View all &rarr;</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              style={{
                display: "block", padding: "24px", background: "#fff",
                border: "1px solid #e5e5e0", borderRadius: 12, textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{col.icon}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{col.name}</h3>
                  <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{col.documentIds.length} documents</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5 }}>{col.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1a1a1a", marginBottom: 20 }}>Recently Added</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recentDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/read/${doc.id}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 20px", background: "#fff", border: "1px solid #e5e5e0",
                borderRadius: 10, textDecoration: "none", transition: "border-color 0.15s",
              }}
            >
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px 0" }}>{doc.title}</h3>
                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                  {CATEGORY_LABELS[doc.category] || doc.category} &middot; {doc.readingTime} min read
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {doc.tags.slice(0, 2).map((tag) => (
                  <span key={tag} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "#f5f5f0", color: "#888" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e5e0", padding: "24px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, color: "#888" }}>&copy; Bhavya Foundation. Open knowledge for everyone.</p>
          <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
            <Link href="/" style={{ color: "#0D503C", textDecoration: "none" }}>Home</Link>
            <Link href="/search" style={{ color: "#0D503C", textDecoration: "none" }}>Search</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
