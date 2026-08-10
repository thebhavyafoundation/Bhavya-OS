import { getKnowledgeGraph } from "@/lib/data";
import GraphClient from "@/components/GraphClient";
import Sidebar from "@/components/Sidebar";

export default function GraphPage() {
  const nodes = getKnowledgeGraph().map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    owner: n.owner,
    status: n.status,
    created: n.created,
    links: n.links,
  }));

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1200 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Knowledge Graph</h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>
            Explore relationships between documents, decisions, standards, and releases.
          </p>
        </div>
        <GraphClient nodes={nodes} />
      </main>
    </div>
  );
}
