import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { PageHero } from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { readContentDir, type ContentItem, type ContentEnvelope } from "../../../services/content";

export const metadata: Metadata = buildMetadata({
  title: "Releases — Transparency Portal — Bhavya Foundation",
  description: "Versioned platform release history with changelogs for Bhavya OS.",
  path: "/transparency/releases",
});

interface Release extends ContentItem { version: string; name: string; status: string; date: string; type: string; description: string; highlights: string[]; }

export default function ReleasesPage() {
  const releases = (readContentDir<Release>("releases") as (ContentEnvelope<Release> & { data: Release })[])
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  return (
    <>
      <Header currentPath="/transparency" />
      <main id="main-content">
        <PageHero badge="TRANSPARENCY / RELEASES" title="Platform Release History" lead="Every platform release is versioned with changelog, certification status, and architectural scope." />
        <div className="container">
          <a href="/transparency" className="breadcrumb">← Back to Transparency Portal</a>
          <p className="content-meta" style={{ marginTop: "16px" }}>Registry last updated: {releases.reduce((l, d) => d.lastUpdated > l ? d.lastUpdated : l, "")}</p>
          <div className="timeline" style={{ marginTop: "16px" }}>
            {releases.map((r, i) => (
              <div key={r.data.version} className="timeline-entry">
                <div className="timeline-marker">
                  <span className={`timeline-dot ${r.data.status === "CERTIFIED" || r.data.status === "RELEASED" ? "active" : ""}`} />
                  {i < releases.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <code className="timeline-version">{r.data.version}</code>
                    <span className={`tag ${r.data.status === "CERTIFIED" || r.data.status === "RELEASED" ? "tag-green" : "tag-blue"}`}>{r.data.status}</span>
                    <span className="timeline-date">{r.data.date}</span>
                    <span className="timeline-type">{r.data.type}</span>
                  </div>
                  <h3 className="timeline-name">{r.data.name}</h3>
                  <p className="timeline-desc">{r.data.description}</p>
                  {r.data.highlights && <ul className="timeline-items">{r.data.highlights.map((h, j) => <li key={j}>{h}</li>)}</ul>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
