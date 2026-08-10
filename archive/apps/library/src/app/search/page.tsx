import Link from "next/link";
import { getDocuments } from "@/lib/data";
import SearchClient from "@/components/SearchClient";

export default function SearchPage() {
  const documents = getDocuments().map((d) => ({
    id: d.id, title: d.title, category: d.category,
    summary: d.summary, tags: d.tags, readingTime: d.readingTime, status: d.status,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8" }}>
      <header style={{ borderBottom: "1px solid #e5e5e0", padding: "16px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0D503C" }}>Bhavya Library</div>
          </Link>
          <nav style={{ display: "flex", gap: 24, fontSize: 14 }}>
            <Link href="/collections" style={{ color: "#4a4a4a", textDecoration: "none" }}>Collections</Link>
            <Link href="/search" style={{ color: "#0D503C", fontWeight: 600, textDecoration: "none" }}>Search</Link>
            <Link href="/browse" style={{ color: "#4a4a4a", textDecoration: "none" }}>Browse All</Link>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Search</h1>
        <p style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>Full-text search across all institutional knowledge.</p>
        <SearchClient documents={documents} />
      </main>
    </div>
  );
}
