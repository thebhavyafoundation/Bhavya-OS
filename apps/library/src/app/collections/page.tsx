import Link from "next/link";
import { getCollections } from "@/lib/data";

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8" }}>
      <header style={{ borderBottom: "1px solid #e5e5e0", padding: "16px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0D503C" }}>Bhavya Library</div>
          </Link>
          <nav style={{ display: "flex", gap: 24, fontSize: 14 }}>
            <Link href="/collections" style={{ color: "#0D503C", fontWeight: 600, textDecoration: "none" }}>Collections</Link>
            <Link href="/search" style={{ color: "#4a4a4a", textDecoration: "none" }}>Search</Link>
            <Link href="/browse" style={{ color: "#4a4a4a", textDecoration: "none" }}>Browse All</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Collections</h1>
        <p style={{ fontSize: 15, color: "#666", marginBottom: 32 }}>Curated groupings of institutional knowledge by topic.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              style={{
                display: "block", padding: "28px", background: "#fff",
                border: "1px solid #e5e5e0", borderRadius: 12, textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{col.icon}</span>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{col.name}</h2>
                  <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{col.documentIds.length} documents</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{col.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
