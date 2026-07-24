import { getGovernanceDocs, getPolicies, getKnowledgeGraph } from "../../lib/data";

export default async function GovernancePage() {
  const govDocs = getGovernanceDocs();
  const policies = getPolicies();
  const kg = getKnowledgeGraph();
  const govNodes = kg.nodes.filter((n) => n.type === "adr" || n.type === "standard");

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
          <a href="/governance" className="active">Governance</a>
          <a href="/governance/policies">Policies</a>
          <a href="/decisions">Decision Records</a>
          <a href="/standards">Standards</a>
          <a href="/releases">Releases</a>
          <a href="/graph">Knowledge Graph</a>
          <a href="/search">Global Search</a>
        </nav>
      </aside>

      <main className="main">
        <div className="header">
          <h1>Governance Library</h1>
          <p>Founding documents, governance manual, board charter, and institutional policies</p>
        </div>

        {/* Governing Documents */}
        <div className="header">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Governing Documents</h2>
          <p style={{ fontSize: 12, color: "var(--text-2)" }}>Core institutional documents that define the Foundation</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {govDocs.map((doc) => (
            <div key={doc.id} className="card">
              <div className="card-title">
                <span>{doc.title}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className="badge badge-green">{doc.status}</span>
                  <span className="link-tag">{doc.type}</span>
                </div>
              </div>
              {doc.summary && <div className="card-desc">{doc.summary}</div>}
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-3)" }}>
                {doc.ratified && <span>Ratified: {doc.ratified}</span>}
                {doc.owner && <span>Owner: {doc.owner}</span>}
              </div>
              {doc.sections && doc.sections.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {doc.sections.map((section, i) => (
                    <div key={i} style={{ background: "var(--surface-2)", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{section.heading}</div>
                      <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{section.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Related Knowledge Graph Nodes */}
        <div className="header">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Related Standards & ADRs</h2>
          <p style={{ fontSize: 12, color: "var(--text-2)" }}>Cross-linked governance references from the knowledge graph</p>
        </div>

        <div className="grid-2">
          {govNodes.map((node) => (
            <div key={node.id} className="card">
              <div className="card-title">
                <span>{node.title}</span>
                <span className={`badge ${node.type === "adr" ? "badge-purple" : "badge-blue"}`}>{node.type}</span>
              </div>
              <div className="card-desc">ID: {node.id} · Owner: {node.owner || "System"} · Status: {node.status}</div>
              {node.links && node.links.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {node.links.map((linkId) => (
                    <span className="link-tag" key={linkId}>→ {linkId}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
