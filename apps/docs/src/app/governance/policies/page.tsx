import { getPolicies } from "../../../lib/data";

export default async function PoliciesPage() {
  const policies = getPolicies();

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
          <a href="/governance/policies" className="active">Policies</a>
          <a href="/decisions">Decision Records</a>
          <a href="/standards">Standards</a>
          <a href="/releases">Releases</a>
          <a href="/graph">Knowledge Graph</a>
          <a href="/search">Global Search</a>
        </nav>
      </aside>

      <main className="main">
        <div className="header">
          <h1>Policies</h1>
          <p>Institutional policies governing data, privacy, security, operations, and conduct</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {policies.map((policy) => (
            <div key={policy.id} className="card">
              <div className="card-title">
                <span>{policy.title}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className={`badge ${policy.status === "Active" ? "badge-green" : "badge-warn"}`}>{policy.status}</span>
                  <span className="link-tag">{policy.id}</span>
                </div>
              </div>
              {policy.description && <div className="card-desc">{policy.description}</div>}
              {policy.sections && policy.sections.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {policy.sections.map((section, i) => (
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
      </main>
    </div>
  );
}
