import fs from "fs";
import path from "path";

interface KnowledgeNode {
  id: string;
  type: string;
  title: string;
  owner?: string;
  status?: string;
  links?: string[];
}

interface SearchDocument {
  id: string;
  title: string;
  category: string;
  path: string;
  content: string;
  tags?: string[];
}

interface RegistryData {
  nodes?: KnowledgeNode[];
  documents?: SearchDocument[];
  items?: { id: string; file: string }[];
}

function loadRegistry(file: string): RegistryData {
  try {
    const filePath = path.resolve(process.cwd(), `../../registry/${file}`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (e) {
    console.error(`Error loading registry/${file}:`, e);
  }
  return { nodes: [], documents: [], items: [] };
}

export default async function KnowledgePlatformPage() {
  const kg = loadRegistry("knowledge-graph.json");
  const searchIndex = loadRegistry("search-index.json");
  const stds = loadRegistry("standards.json");

  return (
    <div className="shell">
      {/* ── Sidebar Navigation ── */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-name">Bhavya OS</span>
          <span className="logo-sub">Knowledge Platform v0.4</span>
        </div>

        <nav className="nav">
          <span className="nav-section">Entry Points</span>
          <a href="#standards" className="active">📜 Standards ({stds.items?.length || 0})</a>
          <a href="#governance">⚖️ Governance</a>
          <a href="#adr">🏗️ ADR Explorer</a>
          <a href="#rfc">📄 RFC Explorer</a>
          <a href="#releases">🚀 Releases</a>
          <a href="#agents">🤖 Agents</a>
          <a href="#workflows">🔄 Workflows</a>
          <a href="#policies">📋 Policies</a>
          <a href="#graph">🕸️ Knowledge Graph ({kg.nodes?.length || 0})</a>
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="main">
        {/* Header */}
        <div className="header">
          <h1>Institutional Knowledge Platform</h1>
          <p>Navigable, versioned institutional truth for humans & AI agents · Deterministic Index Source</p>
        </div>

        {/* ── Multi-Entry Points Grid ── */}
        <div className="grid-3">
          <div className="card">
            <div className="card-title">
              <span>ADR Explorer</span>
              <span className="badge badge-purple">ADRs</span>
            </div>
            <div className="card-desc">Architectural Decision Records with immutable history and tradeoff evaluations.</div>
            <span className="badge badge-green">{kg.nodes?.filter((n: KnowledgeNode) => n.type === 'adr').length || 0} Registered</span>
          </div>

          <div className="card">
            <div className="card-title">
              <span>Standards Browser</span>
              <span className="badge badge-blue">Standards</span>
            </div>
            <div className="card-desc">Bhavya standards: BDL, BPS, BAR, BGS, BOM, MPS.</div>
            <span className="badge badge-green">{stds.items?.length || 0} Standards</span>
          </div>

          <div className="card">
            <div className="card-title">
              <span>Knowledge Graph</span>
              <span className="badge badge-warn">Graph</span>
            </div>
            <div className="card-desc">Deterministic relationships: Standard ← ADR ← RFC ← Release ← Workflow.</div>
            <span className="badge badge-green">{kg.nodes?.length || 0} Nodes</span>
          </div>
        </div>

        {/* ── Knowledge Graph Nodes with Traceability ── */}
        <div className="header" id="graph" style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Knowledge Graph Traceability Nodes</h2>
          <p>Links, owner agents, and bidirectional traceability references.</p>
        </div>

        <div className="grid-2">
          {kg.nodes?.map((node: KnowledgeNode) => (
            <div className="card" key={node.id}>
              <div className="card-title">
                <span>{node.title}</span>
                <span className="badge badge-blue">{node.type}</span>
              </div>
              <div className="card-desc">ID: {node.id} · Owner: {node.owner || 'System'} · Status: {node.status || 'Active'}</div>

              {/* Traceability Component */}
              <div className="traceability">
                <div className="trace-label">References / Linked Nodes</div>
                <div>
                  {node.links && node.links.length > 0 ? (
                    node.links.map((link: string) => (
                      <span className="link-tag" key={link}>→ {link}</span>
                    ))
                  ) : (
                    <span className="link-tag">Root Node</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pre-Indexed Search Entries ── */}
        <div className="header" id="search" style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Pre-Indexed Knowledge Search Registry</h2>
          <p>Exclusively served from registry/search-index.json</p>
        </div>

        <div className="grid-2">
          {searchIndex.documents?.map((doc: SearchDocument) => (
            <div className="card" key={doc.id}>
              <div className="card-title">
                <span>{doc.title}</span>
                <span className="badge badge-green">{doc.category}</span>
              </div>
              <div className="card-desc">{doc.content}</div>
              <div>
                {doc.tags?.map((tag: string) => (
                  <span className="link-tag" key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
