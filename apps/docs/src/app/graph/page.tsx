import { getKnowledgeGraph } from "../../lib/data";
import GraphClient from "../../components/GraphClient";

export default async function GraphPage() {
  const kg = getKnowledgeGraph();

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
          <a href="/standards">Standards</a>
          <a href="/releases">Releases</a>
          <a href="/graph" className="active">Knowledge Graph</a>
          <a href="/search">Global Search</a>
        </nav>
      </aside>

      <main className="main" id="main-content">
        <div className="header">
          <h1>Knowledge Graph</h1>
          <p>Navigate relationships between policies, standards, ADRs, releases, components, and applications</p>
        </div>

        <div style={{
          padding: 16, background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", marginBottom: 24, fontSize: 12, color: "var(--text-2)"
        }}>
          <strong style={{ color: "var(--text)" }}>Navigation:</strong> Policy → Standard → ADR → Release → Component → Application
          <span style={{ margin: "0 8px", color: "var(--text-3)" }}>|</span>
          Click any node to see its connections. Filter by type to focus on specific domains.
        </div>

        <GraphClient nodes={kg.nodes} />
      </main>
    </div>
  );
}
