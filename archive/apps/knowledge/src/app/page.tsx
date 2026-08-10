import Link from "next/link";
import { getKnowledgeStats, getCollections } from "@/lib/data";

const CATEGORY_ICONS: Record<string, string> = {
  governance: "\u{1F3DB}",
  policy: "\u{1F4DC}",
  standard: "\u{2696}",
  adr: "\u{1F4CB}",
  rfc: "\u{1F4E1}",
  release: "\u{1F680}",
  research: "\u{1F52C}",
  report: "\u{1F4CA}",
  project: "\u{1F4C2}",
  content: "\u{1F4DD}",
  financial: "\u{1F4B0}",
};

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

export default function KnowledgeDashboard() {
  const stats = getKnowledgeStats();
  const collections = getCollections();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Institutional Knowledge
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Knowledge Platform
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          The institutional memory and content backbone that powers research, governance, and mission applications across Bhavya Foundation.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {[
          { label: "Documents", value: stats.totalDocuments, color: "#10b981" },
          { label: "Graph Nodes", value: stats.totalGraphNodes, color: "#8b5cf6" },
          { label: "Collections", value: stats.totalCollections, color: "#3b82f6" },
          { label: "Search Index", value: stats.totalSearchResults, color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "20px 24px" }}>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{stat.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#f8fafc" }}>By Category</h2>
          <Link href="/documents" style={{ fontSize: 13, color: "#10b981", textDecoration: "none" }}>
            View all documents &rarr;
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {Object.entries(stats.documentsByCategory)
            .filter(([, count]) => count > 0)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => (
              <Link
                key={category}
                href={`/documents?category=${category}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 10,
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
              >
                <span style={{ fontSize: 20 }}>{CATEGORY_ICONS[category] || "\u{1F4C4}"}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", textTransform: "capitalize", margin: 0 }}>{category}</p>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{count} document{count !== 1 ? "s" : ""}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Collections */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#f8fafc" }}>Collections</h2>
          <Link href="/collections" style={{ fontSize: 13, color: "#10b981", textDecoration: "none" }}>
            View all &rarr;
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {collections.slice(0, 6).map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              style={{
                display: "block",
                padding: "20px 24px",
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 12,
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{col.name}</h3>
                <span style={{ fontSize: 12, color: CATEGORY_COLORS[col.category] || "#64748b" }}>
                  {col.documentIds.length} docs
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{col.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#f8fafc", marginBottom: 16 }}>Quick Access</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {[
            { href: "/search", label: "Search Knowledge", desc: "Full-text search across all documents" },
            { href: "/graph", label: "Knowledge Graph", desc: "Explore relationships between entities" },
            { href: "/documents?category=adr", label: "Decision Records", desc: "Architectural Decision Records" },
            { href: "/documents?category=standard", label: "Standards", desc: "Engineering and governance standards" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
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
              <p style={{ fontSize: 14, fontWeight: 600, color: "#10b981", margin: "0 0 4px 0" }}>{link.label}</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
