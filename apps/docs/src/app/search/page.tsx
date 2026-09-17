import {
  getGovernanceDocs,
  getPolicies,
  getReleases,
  getADRs,
  getRFCs,
  getStandards,
  getApps,
} from "../../lib/data";
import SearchClient from "../../components/SearchClient";

export default async function SearchPage() {
  const govDocs = getGovernanceDocs();
  const policies = getPolicies();
  const releases = getReleases();
  const adrs = getADRs();
  const rfcs = getRFCs();
  const standards = getStandards();
  const apps = getApps();

  // Build unified search index from all content
  const allItems = [
    ...govDocs.map((d) => ({
      id: d.id,
      title: d.title,
      category: "Governance",
      path: "/governance",
      content: d.summary || d.type,
      tags: [d.type, d.status],
      type: "governance",
    })),
    ...policies.map((p) => ({
      id: p.id,
      title: p.title,
      category: "Policy",
      path: "/governance/policies",
      content: p.description || "",
      tags: [p.status],
      type: "policy",
    })),
    ...adrs.map((a) => ({
      id: a.id,
      title: a.title,
      category: "ADR",
      path: `/decisions#${a.id}`,
      content: `Status: ${a.status}${a.date ? ` · Date: ${a.date}` : ""}`,
      tags: [a.status],
      type: "adr",
    })),
    ...rfcs.map((r) => ({
      id: r.id,
      title: r.title,
      category: "RFC",
      path: `/decisions#${r.id}`,
      content: `Status: ${r.status}`,
      tags: [r.status],
      type: "rfc",
    })),
    ...releases.map((r) => ({
      id: r.id,
      title: `${r.version} — ${r.name}`,
      category: "Release",
      path: `/releases#${r.version}`,
      content: r.description,
      tags: [r.status, r.type],
      type: "release",
    })),
    ...standards.map((s) => ({
      id: s.id,
      title: s.id,
      category: "Standard",
      path: "/standards",
      content: `File: ${s.file}`,
      tags: ["standard"],
      type: "standard",
    })),
    ...apps.map((a) => ({
      id: a.id,
      title: a.name,
      category: "Application",
      path: "/",
      content: `Port: ${a.port} · Owner: ${a.owner} · Mission: ${a.mission}`,
      tags: [a.mission, a.visibility],
      type: "app",
    })),
  ];

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
          <a href="/graph">Knowledge Graph</a>
          <a href="/search" className="active">
            Global Search
          </a>
        </nav>
      </aside>

      <main className="main" id="main-content">
        <div className="header">
          <h1>Global Search</h1>
          <p>
            Search across governance documents, policies, ADRs, RFCs, standards,
            releases, and applications
          </p>
        </div>

        <div
          style={{
            padding: 12,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            marginBottom: 24,
            fontSize: 12,
            color: "var(--text-2)",
          }}
        >
          <strong style={{ color: "var(--text)" }}>
            {allItems.length} items indexed
          </strong>
          <span style={{ margin: "0 8px", color: "var(--text-3)" }}>·</span>
          {govDocs.length} governance · {policies.length} policies ·{" "}
          {adrs.length} ADRs · {rfcs.length} RFCs · {releases.length} releases ·{" "}
          {standards.length} standards · {apps.length} apps
        </div>

        <SearchClient items={allItems} />
      </main>
    </div>
  );
}
