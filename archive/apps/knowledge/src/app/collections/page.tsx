import Link from "next/link";
import { getCollections } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const CATEGORY_COLORS: Record<string, string> = {
  governance: "#8b5cf6",
  policy: "#3b82f6",
  standard: "#10b981",
  adr: "#a855f7",
  rfc: "#06b6d4",
  release: "#f59e0b",
};

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Collections</h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>
            Organized groupings of related documents by domain.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              style={{
                display: "block",
                padding: "24px",
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 12,
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{col.name}</h2>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "2px 10px",
                    borderRadius: 12,
                    background: `${CATEGORY_COLORS[col.category] || "#64748b"}22`,
                    color: CATEGORY_COLORS[col.category] || "#64748b",
                  }}
                >
                  {col.documentIds.length} docs
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{col.description}</p>
              <p style={{ fontSize: 11, color: "#475569", marginTop: 12 }}>Created: {col.created}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
