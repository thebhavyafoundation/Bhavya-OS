import { getStandards, getStandardContent } from "../../lib/data";

const CATEGORIES = [
  { id: "engineering", label: "Engineering", color: "var(--accent)", files: ["engineering.md", "frontend.md", "backend.md", "testing.md", "performance.md"] },
  { id: "governance", label: "Governance", color: "var(--purple)", files: ["architecture.md", "release.md", "git.md"] },
  { id: "accessibility", label: "Accessibility", color: "var(--blue)", files: ["accessibility.md"] },
  { id: "security", label: "Security", color: "#ef4444", files: ["security.md"] },
  { id: "design", label: "Design", color: "#ec4899", files: ["design.md"] },
  { id: "documentation", label: "Documentation", color: "var(--warn)", files: ["documentation.md"] },
  { id: "operations", label: "Operations", color: "#06b6d4", files: ["observability.md", "api.md", "database.md"] },
];

export default async function StandardsPage() {
  const standards = getStandards();

  const categorized = CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.files
      .map((f) => {
        const std = standards.find((s) => s.file === f);
        if (!std) return null;
        const content = getStandardContent(f);
        const firstLine = content.split("\n").find((l) => l.trim() && !l.startsWith("#"));
        return { ...std, preview: firstLine || "" };
      })
      .filter(Boolean),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Platform navigation">
        <div className="logo">
          <span className="logo-name">Bhavya OS</span>
          <span className="logo-sub">Knowledge Platform</span>
        </div>
        <nav className="nav">
          <span className="nav-section">Browse</span>
          <a href="/">Dashboard</a>
          <a href="/governance">Governance</a>
          <a href="/governance/policies">Policies</a>
          <a href="/decisions">Decision Records</a>
          <a href="/standards" className="active">Standards</a>
          <a href="/releases">Releases</a>
          <a href="/graph">Knowledge Graph</a>
          <a href="/search">Global Search</a>
        </nav>
      </aside>

      <main className="main" id="main-content">
        <div className="header">
          <h1>Standards Explorer</h1>
          <p>Browse institutional standards by category — engineering, governance, accessibility, security, design, documentation, and operations</p>
        </div>

        {categorized.map((cat) => (
          <div key={cat.id} style={{ marginBottom: 40 }}>
            <div className="header">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: cat.color }}>{cat.label}</h2>
              <p style={{ fontSize: 12, color: "var(--text-2)" }}>{cat.items.length} standard{cat.items.length !== 1 ? "s" : ""}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cat.items.map((std) => (
                <div key={std!.file} className="card">
                  <div className="card-title">
                    <span>{std!.file.replace(".md", "").toUpperCase()}</span>
                    <span className="link-tag">{std!.file}</span>
                  </div>
                  {std!.preview && (
                    <div className="card-desc">{std!.preview}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Cross-links to knowledge graph */}
        <div className="header" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Standard References</h2>
          <p style={{ fontSize: 12, color: "var(--text-2)" }}>Standards referenced in the knowledge graph</p>
        </div>

        <div className="grid-2">
          {standards.map((std) => (
            <div key={std.id} className="card">
              <div className="card-title">
                <span>{std.id}</span>
                <span className="badge badge-blue">standard</span>
              </div>
              <div className="card-desc">File: {std.file}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
