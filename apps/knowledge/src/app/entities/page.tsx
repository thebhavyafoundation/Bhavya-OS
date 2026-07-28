import { getEntities, getDocuments } from "@/lib/data";
import EntityExplorer from "@/components/EntityExplorer";
import Sidebar from "@/components/Sidebar";

export default function EntitiesPage() {
  const entities = getEntities().map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    description: e.description,
    documentIds: e.documentIds,
    mentions: e.mentions,
  }));
  const documents = getDocuments().map((d) => ({
    id: d.id,
    title: d.title,
    category: d.category,
  }));

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960 }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#f8fafc",
              marginBottom: 8,
            }}
          >
            Entity Explorer
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>
            People, places, organizations, species, and concepts mentioned
            across the knowledge base.
          </p>
        </div>
        <EntityExplorer entities={entities} documents={documents} />
      </main>
    </div>
  );
}
