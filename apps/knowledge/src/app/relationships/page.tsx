import { getDocuments } from "@/lib/data";
import RelationshipExplorer from "@/components/RelationshipExplorer";
import Sidebar from "@/components/Sidebar";

export default function RelationshipsPage() {
  const documents = getDocuments().map((d) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    links: d.links,
    tags: d.tags,
    status: d.status,
  }));

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Relationship Explorer</h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>
            Discover how documents connect through citations, categories, and shared tags.
          </p>
        </div>
        <RelationshipExplorer documents={documents} />
      </main>
    </div>
  );
}
