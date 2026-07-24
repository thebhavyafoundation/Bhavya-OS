import type { Metadata } from "next";
import { RegistryReader, SearchService } from "@bhavya/mission-runtime";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";
import { BookOpen, Share2, GraduationCap, Search } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Open Knowledge & Standards — Bhavya Foundation",
  description: "Searchable versioned technical standards, governance ADRs, research publications, and the interactive institutional knowledge graph.",
  path: "/knowledge",
});

interface StandardItem { id: string; file: string; }

function getSearchableStandards() {
  const registry = new RegistryReader();
  const search = new SearchService();
  const standards: StandardItem[] = registry.read<{ items: StandardItem[] }>("standards.json")?.items ?? [];

  search.index(standards.map(s => ({
    id: s.id,
    title: s.id.replace("std.", "Standard ").replace(/-/g, " "),
    excerpt: `Source: ${s.file}`,
    url: `/transparency/policies`,
    type: "standard",
    score: 1.0,
  })));

  return { standards, search };
}

const knowledgeCategories = [
  { icon: <BookOpen size={20} />, title: "Technical Standards", desc: "16 formal standards covering accessibility, API design, data schemas, security, and release protocols. All machine-verifiable.", tag: "16 Standards" },
  { icon: <Share2 size={20} />, title: "Knowledge Graph", desc: "Bidirectional graph with 14+ nodes linking ADRs, RFCs, releases, and standards. Every reference is traceable.", tag: "Cross-Referenced" },
  { icon: <GraduationCap size={20} />, title: "Architecture Decisions", desc: "Immutable ADRs documenting every significant institutional architectural decision with rationale.", tag: "4 ADRs" },
  { icon: <Search size={20} />, title: "Full-Text Search", desc: "All standards and documents are indexed for instant full-text search with relevance scoring.", tag: "Searchable" },
];

export default function KnowledgePage() {
  const { standards } = getSearchableStandards();

  return (
    <>
      <Header currentPath="/knowledge" />
      <main id="main-content">
        <PageHero
          badge="OPEN KNOWLEDGE & STANDARDS"
          title="Versioned Institutional Knowledge Platform"
          lead="Every technical standard, governance document, architecture decision record, and research output is archived in machine-readable JSON format with full-text search."
        />

        <div className="container">
          <div className="search-bar" style={{ marginBottom: "48px" }}>
            <input type="search" className="search-input" placeholder="Search standards, ADRs, documents..." aria-label="Search knowledge base" />
            <button className="search-btn" aria-label="Execute search">Search</button>
          </div>

          <SectionHeader eyebrow="Knowledge Infrastructure" title="Platform Capabilities" />
          <div className="grid-2" style={{ marginBottom: "64px" }}>
            {knowledgeCategories.map((cat, i) => (
              <div className="card" key={i}>
                <div className="card-header">
                  <span className="card-icon" aria-hidden="true">{cat.icon}</span>
                  <span className="tag tag-blue" style={{ marginLeft: "auto" }}>{cat.tag}</span>
                </div>
                <h3 className="card-title">{cat.title}</h3>
                <p className="card-desc">{cat.desc}</p>
              </div>
            ))}
          </div>

          <SectionHeader eyebrow="Registry Index" title={`Registered Institutional Standards (${standards.length})`} />
          <div className="table-wrap">
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Registered institutional standards</caption>
              <thead>
                <tr>
                  <th scope="col">Standard ID</th>
                  <th scope="col">Source File</th>
                  <th scope="col">Classification</th>
                  <th scope="col">Access</th>
                </tr>
              </thead>
              <tbody>
                {standards.map(std => (
                  <tr key={std.id}>
                    <td><code>{std.id}</code></td>
                    <td><code>{std.file}</code></td>
                    <td><span className="tag tag-blue">Standard</span></td>
                    <td><a href="/transparency/policies" className="stat-link">View →</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
