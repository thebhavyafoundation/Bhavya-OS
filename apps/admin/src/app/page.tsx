import fs from "fs";
import path from "path";

// ── Read-only data loader (reads exclusively from registry/ and memory/) ──
function loadRegistry(type: string) {
  try {
    const filePath = path.resolve(process.cwd(), `../../registry/${type}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (e) {
    console.error(`Error loading registry/${type}.json:`, e);
  }
  return { items: [], generated_at: null };
}

function loadMemoryDomain(domain: string) {
  try {
    const filePath = path.resolve(process.cwd(), `../../memory/${domain}/_meta.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (e) {
    console.error(`Error loading memory/${domain}/_meta.json:`, e);
  }
  return { records: [], owner: "unknown", update_policy: "unknown" };
}

export default async function EngineeringDashboardV2() {
  const appsReg = loadRegistry("apps");
  const pkgsReg = loadRegistry("packages");
  const agentsReg = loadRegistry("agents");
  const stdsReg = loadRegistry("standards");
  const wfsReg = loadRegistry("workflows");
  const svcsReg = loadRegistry("services");

  const releasesMem = loadMemoryDomain("releases");
  const decisionsMem = loadMemoryDomain("decisions");
  const tasksMem = loadMemoryDomain("tasks");
  const projectsMem = loadMemoryDomain("projects");

  const buildDate = "2026-07-22";

  return (
    <div className="shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-name">Bhavya OS</span>
          <span className="logo-sub">Control Center v2</span>
        </div>

        <nav className="nav">
          <span className="nav-section">Operations</span>
          <a href="#overview" className="active"><span className="nav-dot dot-green" />Overview</a>
          <a href="#health"><span className="nav-dot dot-blue" />Repository Health</a>
          <a href="#releases"><span className="nav-dot dot-purple" />Release Status</a>
          <a href="#agents"><span className="nav-dot dot-warn" />Agents ({agentsReg.items.length})</a>
          <a href="#tasks"><span className="nav-dot dot-green" />Running Tasks</a>

          <span className="nav-section">Governance</span>
          <a href="#architecture"><span className="nav-dot dot-blue" />Architecture (BAR)</a>
          <a href="#cicd"><span className="nav-dot dot-muted" />CI/CD & Quality</a>
          <a href="#docs"><span className="nav-dot dot-muted" />Documentation</a>
          <a href="#memory"><span className="nav-dot dot-purple" />Institutional Memory</a>
          <a href="#standards"><span className="nav-dot dot-warn" />Standards ({stdsReg.items.length})</a>
          <a href="#roadmap"><span className="nav-dot dot-green" />Roadmap (v0.3)</a>
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="main">

        {/* Header */}
        <div className="header">
          <div className="header-top">
            <h1>Engineering Dashboard v2</h1>
            <span className="badge badge-green">
              <span className="pulse" />
              Runtime Active · Read Model
            </span>
          </div>
          <p>Bhavya OS Institutional Control Center · Release v0.3 · Data source: Deterministic Registry & Memory</p>
        </div>

        {/* ── Overview KPIs ── */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Monorepo Apps</div>
            <div className="kpi-value text-green">{appsReg.items.length}</div>
            <div className="kpi-sub">Registry synced · {appsReg.generated_at ? "Live" : "Static"}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Monorepo Packages</div>
            <div className="kpi-value text-blue">{pkgsReg.items.length}</div>
            <div className="kpi-sub">Shared primitives & theme</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Registered Agents</div>
            <div className="kpi-value text-purple">{agentsReg.items.length}</div>
            <div className="kpi-sub">Founder · Docs · Gov · Release</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Release Milestone</div>
            <div className="kpi-value text-warn">v0.3</div>
            <div className="kpi-sub">Institutional Runtime</div>
          </div>
        </div>

        {/* ── 2-Column Panels: Active Services & Running Tasks ── */}
        <div className="panel-grid-2">
          {/* Active Services */}
          <div className="panel">
            <div className="panel-head">
              <span className="panel-head-title">Registered Services ({svcsReg.items.length})</span>
              <span className="badge badge-green" style={{ fontSize: "10px" }}>Registry Derived</span>
            </div>
            <div className="panel-body">
              {svcsReg.items.map((svc: any) => (
                <div className="endpoint-row" key={svc.id}>
                  <span className="method-tag">ACTIVE</span>
                  <span className="endpoint-url"><strong>{svc.name}</strong> — {svc.endpoint}</span>
                  <span className="endpoint-status">✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Running Tasks & Memory */}
          <div className="panel">
            <div className="panel-head">
              <span className="panel-head-title">Active Tasks & Memory Domains</span>
              <span className="badge badge-blue" style={{ fontSize: "10px" }}>Memory Derived</span>
            </div>
            <div className="panel-body">
              {tasksMem.records.map((rec: any) => (
                <div className="status-item" key={rec.id}>
                  <span className="status-label">
                    <span className="status-icon icon-green">⚙️</span>
                    {rec.payload.title}
                  </span>
                  <span className="status-meta">{rec.payload.status}</span>
                </div>
              ))}
              <div className="status-item">
                <span className="status-label">
                  <span className="status-icon icon-purple">🧠</span>
                  Structured Memory Domains
                </span>
                <span className="status-meta">7 active domains</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Registered Departmental Agents ── */}
        <div className="section" id="agents">
          <div className="section-title">Registered Institutional Agents</div>
          <div className="agent-grid">
            {agentsReg.items.map((agent: any) => (
              <div className="agent-card" key={agent.id}>
                <div className="agent-card-head">
                  <span className="agent-name">{agent.name}</span>
                  <span className="badge badge-green" style={{ fontSize: "10px" }}>{agent.role}</span>
                </div>
                <div className="agent-id">{agent.id}</div>
                <div className="agent-desc">File: {agent.file}</div>
                <div className="agent-perms">
                  <span className="perm-tag">schema-validated</span>
                  <span className="perm-tag">event-bus-ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Institutional Workflows & Standards ── */}
        <div className="panel-grid-2" style={{ marginTop: "24px" }}>
          {/* Workflows */}
          <div className="panel">
            <div className="panel-head">
              <span className="panel-head-title">Classified Workflows ({wfsReg.items.length})</span>
              <span className="badge badge-purple" style={{ fontSize: "10px" }}>BOM Compliant</span>
            </div>
            <div className="panel-body">
              {wfsReg.items.map((wf: any) => (
                <div className="status-item" key={wf.id}>
                  <span className="status-label">
                    <span className="status-icon icon-blue">🔄</span>
                    <strong>[{wf.category}]</strong> {wf.name}
                  </span>
                  <span className="status-meta">{wf.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ADR Decisions */}
          <div className="panel">
            <div className="panel-head">
              <span className="panel-head-title">Architecture Decisions ({decisionsMem.records.length})</span>
              <span className="badge badge-warn" style={{ fontSize: "10px" }}>governance/adr/</span>
            </div>
            <div className="panel-body">
              {decisionsMem.records.map((rec: any) => (
                <div className="status-item" key={rec.id}>
                  <span className="status-label">
                    <span className="status-icon icon-warn">⚖️</span>
                    <strong>{rec.payload.adr}:</strong> {rec.payload.title}
                  </span>
                  <span className="status-meta">{rec.payload.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Roadmap Progress ── */}
        <div className="section" id="roadmap" style={{ marginTop: "32px" }}>
          <div className="section-title">Institutional Release Progression</div>
          <div className="panel">
            <div className="panel-body">
              {[
                { version: "v0.1", title: "Foundation Bootstrap", desc: "Monorepo, BDL/BPS/BAR standards, initial configs", state: "done" },
                { version: "v0.2", title: "Platform Integration", desc: "AI Gateway + OpenHuman + Claude Code + Dashboard v1", state: "done" },
                { version: "v0.3", title: "Institutional Runtime", desc: "Memory schemas, classified workflows, event bus, registry generator, Dashboard v2", state: "active" },
                { version: "v0.4", title: "Knowledge & Transparency", desc: "MDX registry, policy manifests, transparency portal", state: "pending" },
                { version: "v0.5", title: "Mission Applications", desc: "Public website, Forest GIS, Digital Library, Volunteer portal", state: "pending" },
                { version: "v1.0", title: "Bhavya OS Stable", desc: "Long-lived institutional platform release", state: "pending" }
              ].map((item, i) => (
                <div className="roadmap-item" key={i}>
                  <div className="roadmap-line">
                    <div className={`roadmap-dot ${item.state}`} />
                    {i < 5 && <div className="roadmap-connector" />}
                  </div>
                  <div className="roadmap-content">
                    <div className="roadmap-version">{item.version}</div>
                    <div className={`roadmap-title ${item.state}`}>{item.title}</div>
                    <div className="roadmap-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <span className="footer-left">Bhavya OS Control Center v2 · Read Model Only · Compliance ✓ BDL ✓ BPS ✓ BAR ✓ BGS ✓ BOM</span>
          <span className="footer-right">Build {buildDate}</span>
        </div>

      </main>
    </div>
  );
}
