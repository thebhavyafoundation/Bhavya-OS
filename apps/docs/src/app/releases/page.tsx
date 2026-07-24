import { getReleases, getNodesByType, getLinkedNodes } from "../../lib/data";

export default async function ReleasesPage() {
  const releases = getReleases();
  const releaseNodes = getNodesByType("release");

  return (
    <div className="shell">
      <aside className="sidebar">
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
          <a href="/standards">Standards</a>
          <a href="/releases" className="active">Releases</a>
          <a href="/graph">Knowledge Graph</a>
          <a href="/search">Global Search</a>
        </nav>
      </aside>

      <main className="main">
        <div className="header">
          <h1>Release Explorer</h1>
          <p>Version history with highlights, breaking changes, related ADRs, and affected components</p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: 24 }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 7, top: 0, bottom: 0,
            width: 2, background: "var(--border)"
          }} />

          {releases.map((rel, i) => {
            const relNode = releaseNodes.find((n) => n.id === `Release-${rel.version}`);
            const linked = relNode ? getLinkedNodes(relNode.id) : [];
            const isLatest = i === 0;

            return (
              <div key={rel.id} id={rel.version} style={{ position: "relative", marginBottom: 32 }}>
                {/* Timeline dot */}
                <div style={{
                  position: "absolute", left: -24, top: 16,
                  width: 16, height: 16, borderRadius: "50%",
                  background: isLatest ? "var(--accent)" : rel.status === "CERTIFIED" ? "var(--blue)" : "var(--surface-2)",
                  border: `2px solid ${isLatest ? "var(--accent)" : "var(--border)"}`,
                  zIndex: 1,
                }} />

                <div className="card" style={{ marginLeft: 8 }}>
                  <div className="card-title">
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>{rel.version}</span>
                      <span style={{ fontSize: 14, marginLeft: 8 }}>{rel.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span className={`badge ${rel.status === "CERTIFIED" ? "badge-green" : rel.status === "Released" ? "badge-blue" : "badge-warn"}`}>
                        {rel.status}
                      </span>
                      <span className="link-tag">{rel.type}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 8 }}>{rel.date}</div>
                  <div className="card-desc">{rel.description}</div>

                  {/* Highlights */}
                  {rel.highlights && rel.highlights.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", marginBottom: 6 }}>
                        Highlights
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--text-2)" }}>
                        {rel.highlights.map((h, j) => (
                          <li key={j} style={{ marginBottom: 2 }}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Breaking Changes */}
                  {rel.breaking && rel.breaking.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#ef4444", textTransform: "uppercase", marginBottom: 6 }}>
                        Breaking Changes
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--text-2)" }}>
                        {rel.breaking.map((b, j) => (
                          <li key={j} style={{ marginBottom: 2 }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cross-links */}
                  {linked.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", marginBottom: 6 }}>
                        Related
                      </div>
                      {linked.map((node) => (
                        <span className="link-tag" key={node.id}>
                          {node.type}: {node.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
