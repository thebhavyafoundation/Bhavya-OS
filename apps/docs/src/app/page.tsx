import {
  getKnowledgeGraph,
  getGovernanceDocs,
  getPolicies,
  getReleases,
  getADRs,
  getRFCs,
  getStandards,
  getApps,
  getSearchIndex,
} from "../lib/data";

export default async function HomePage() {
  const kg = getKnowledgeGraph();
  const govDocs = getGovernanceDocs();
  const policies = getPolicies();
  const releases = getReleases();
  const adrs = getADRs();
  const rfcs = getRFCs();
  const standards = getStandards();
  const apps = getApps();
  const searchIndex = getSearchIndex();

  const stats = [
    { label: "Governance Docs", value: govDocs.length, color: "var(--accent)" },
    { label: "Policies", value: policies.length, color: "var(--blue)" },
    { label: "ADRs", value: adrs.length, color: "var(--purple)" },
    { label: "RFCs", value: rfcs.length, color: "var(--blue)" },
    { label: "Standards", value: standards.length, color: "var(--accent)" },
    { label: "Releases", value: releases.length, color: "var(--warn)" },
    { label: "Applications", value: apps.length, color: "#ec4899" },
    {
      label: "Knowledge Nodes",
      value: kg.nodes.length,
      color: "var(--purple)",
    },
  ];

  const recentReleases = releases.slice(0, 3);
  const recentADRs = adrs.slice(0, 4);

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Platform navigation">
        <div className="logo">
          <span className="logo-name">Bhavya OS</span>
          <span className="logo-sub">Knowledge Platform</span>
        </div>
        <nav className="nav">
          <span className="nav-section">Browse</span>
          <a href="/" className="active">
            Dashboard
          </a>
          <a href="/governance">Governance ({govDocs.length})</a>
          <a href="/governance/policies">Policies ({policies.length})</a>
          <a href="/decisions">Decision Records ({adrs.length})</a>
          <a href="/standards">Standards ({standards.length})</a>
          <a href="/releases">Releases ({releases.length})</a>
          <a href="/graph">Knowledge Graph ({kg.nodes.length})</a>
          <a href="/search">Global Search</a>
        </nav>
        <div style={{ marginTop: "auto", padding: "0 8px" }}>
          <div
            style={{
              fontSize: 10,
              color: "var(--text-3)",
              fontFamily: "var(--mono)",
            }}
          >
            Platform v0.9.0 · Runtime v3.0
          </div>
        </div>
      </aside>

      <main className="main" id="main-content">
        <div className="header">
          <h1>Institutional Knowledge Platform</h1>
          <p>
            Canonical source for governance, decisions, standards, and releases
            across Bhavya Foundation
          </p>
        </div>

        {/* Stats Grid */}
        <div
          className="grid-3"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card"
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  fontFamily: "var(--mono)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Entry Points */}
        <div className="header" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Quick Access</h2>
        </div>
        <div className="grid-3">
          <a
            href="/governance"
            className="card"
            style={{ textDecoration: "none", color: "var(--text)" }}
          >
            <div className="card-title">
              <span>Governance Library</span>
              <span className="badge badge-green">
                Constitution · Trust Deed · Policies
              </span>
            </div>
            <div className="card-desc">
              Browse founding documents, governance manual, board charter, and
              all institutional policies.
            </div>
          </a>
          <a
            href="/decisions"
            className="card"
            style={{ textDecoration: "none", color: "var(--text)" }}
          >
            <div className="card-title">
              <span>Decision Records</span>
              <span className="badge badge-purple">
                {adrs.length} ADRs · {rfcs.length} RFCs
              </span>
            </div>
            <div className="card-desc">
              Architecture Decision Records with context, alternatives,
              consequences, and cross-links.
            </div>
          </a>
          <a
            href="/standards"
            className="card"
            style={{ textDecoration: "none", color: "var(--text)" }}
          >
            <div className="card-title">
              <span>Standards Explorer</span>
              <span className="badge badge-blue">
                {standards.length} Standards
              </span>
            </div>
            <div className="card-desc">
              Browse engineering, governance, accessibility, security, and
              design standards.
            </div>
          </a>
          <a
            href="/releases"
            className="card"
            style={{ textDecoration: "none", color: "var(--text)" }}
          >
            <div className="card-title">
              <span>Release Explorer</span>
              <span className="badge badge-warn">
                {releases.length} Releases
              </span>
            </div>
            <div className="card-desc">
              Version history with highlights, breaking changes, related ADRs,
              and affected components.
            </div>
          </a>
          <a
            href="/graph"
            className="card"
            style={{ textDecoration: "none", color: "var(--text)" }}
          >
            <div className="card-title">
              <span>Knowledge Graph</span>
              <span className="badge badge-warn">{kg.nodes.length} Nodes</span>
            </div>
            <div className="card-desc">
              Navigate relationships: Policy → Standard → ADR → Release →
              Component → Application.
            </div>
          </a>
          <a
            href="/search"
            className="card"
            style={{ textDecoration: "none", color: "var(--text)" }}
          >
            <div className="card-title">
              <span>Global Search</span>
              <span className="badge badge-green">
                {searchIndex.length} Indexed
              </span>
            </div>
            <div className="card-desc">
              Search across documents, standards, releases, policies, projects,
              and components.
            </div>
          </a>
        </div>

        {/* Recent Releases */}
        <div className="header" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Releases</h2>
        </div>
        <div className="grid-3">
          {recentReleases.map((rel) => (
            <a
              key={rel.id}
              href={`/releases#${rel.version}`}
              className="card"
              style={{ textDecoration: "none", color: "var(--text)" }}
            >
              <div className="card-title">
                <span>
                  {rel.version} — {rel.name}
                </span>
                <span
                  className={`badge ${rel.status === "CERTIFIED" ? "badge-green" : "badge-warn"}`}
                >
                  {rel.status}
                </span>
              </div>
              <div className="card-desc">{rel.description}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                {rel.date} · {rel.type}
              </div>
            </a>
          ))}
        </div>

        {/* Recent ADRs */}
        <div className="header" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Decisions</h2>
        </div>
        <div className="grid-2">
          {recentADRs.map((adr) => (
            <a
              key={adr.id}
              href={`/decisions#${adr.id}`}
              className="card"
              style={{ textDecoration: "none", color: "var(--text)" }}
            >
              <div className="card-title">
                <span>{adr.title}</span>
                <span className="badge badge-purple">{adr.status}</span>
              </div>
              <div className="card-desc">
                {adr.date ? `Decided: ${adr.date}` : ""}{" "}
                {adr.approvedBy ? `· Approved by: ${adr.approvedBy}` : ""}
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
