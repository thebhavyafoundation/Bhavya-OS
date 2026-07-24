import { getADRs, getRFCs, getLinkedNodes } from "../../lib/data";

export default async function DecisionsPage() {
  const adrs = getADRs();
  const rfcs = getRFCs();

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
          <a href="/decisions" className="active">Decision Records</a>
          <a href="/standards">Standards</a>
          <a href="/releases">Releases</a>
          <a href="/graph">Knowledge Graph</a>
          <a href="/search">Global Search</a>
        </nav>
      </aside>

      <main className="main" id="main-content">
        <div className="header">
          <h1>Decision Records</h1>
          <p>Architecture Decision Records and Requests for Comments with full context and cross-links</p>
        </div>

        {/* ADR Section */}
        <div className="header" style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Architecture Decision Records ({adrs.length})</h2>
          <p style={{ fontSize: 12, color: "var(--text-2)" }}>Immutable records of significant architectural and governance decisions</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {adrs.map((adr) => {
            const linked = getLinkedNodes(adr.id);
            return (
              <div key={adr.id} id={adr.id} className="card">
                <div className="card-title">
                  <span>{adr.title}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span className={`badge ${adr.status === "Accepted" ? "badge-green" : adr.status === "Proposed" ? "badge-warn" : "badge-blue"}`}>
                      {adr.status}
                    </span>
                    <span className="link-tag">{adr.id}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-3)", marginBottom: 8 }}>
                  {adr.date && <span>Date: {adr.date}</span>}
                  {adr.approvedBy && <span>Approved by: {adr.approvedBy}</span>}
                </div>

                {/* Cross-links */}
                {linked.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                      Related
                    </div>
                    {linked.map((node) => (
                      <span className="link-tag" key={node.id}>
                        {node.type}: {node.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* ADR Content */}
                <details style={{ marginTop: 12 }}>
                  <summary style={{ fontSize: 12, color: "var(--text-2)", cursor: "pointer", fontWeight: 500 }}>
                    View Full Record
                  </summary>
                  <div style={{
                    marginTop: 8, padding: 16, background: "var(--surface-2)",
                    borderRadius: 6, border: "1px solid var(--border)", fontSize: 12,
                    lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "var(--mono)",
                    color: "var(--text-2)", maxHeight: 400, overflow: "auto"
                  }}>
                    {adr.content}
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        {/* RFC Section */}
        <div className="header" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Requests for Comments ({rfcs.length})</h2>
          <p style={{ fontSize: 12, color: "var(--text-2)" }}>Proposals and discussions for future architectural decisions</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rfcs.map((rfc) => (
            <div key={rfc.id} id={rfc.id} className="card">
              <div className="card-title">
                <span>{rfc.title}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className={`badge ${rfc.status === "Accepted" ? "badge-green" : "badge-warn"}`}>
                    {rfc.status}
                  </span>
                  <span className="link-tag">{rfc.id}</span>
                </div>
              </div>
              <details style={{ marginTop: 8 }}>
                <summary style={{ fontSize: 12, color: "var(--text-2)", cursor: "pointer", fontWeight: 500 }}>
                  View Full RFC
                </summary>
                <div style={{
                  marginTop: 8, padding: 16, background: "var(--surface-2)",
                  borderRadius: 6, border: "1px solid var(--border)", fontSize: 12,
                  lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "var(--mono)",
                  color: "var(--text-2)", maxHeight: 400, overflow: "auto"
                }}>
                  {rfc.content}
                </div>
              </details>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
