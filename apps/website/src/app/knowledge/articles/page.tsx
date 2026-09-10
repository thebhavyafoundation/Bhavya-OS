import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { SkipNavigation } from "../../../components/SkipNavigation";
import {
  PageHero,
  SectionHeader,
} from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { PageContent } from "../../../components/PageContent";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Knowledge Articles — Bhavya Foundation",
  description:
    "Articles, research papers, and educational content from the Bhavya Knowledge Mission. Expanding access to knowledge through open publishing.",
  path: "/knowledge/articles",
});

export default function ArticlesPage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/knowledge/articles" />
      <main id="main-content">
        <PageHero
          badge="KNOWLEDGE / ARTICLES"
          title="Knowledge Articles"
          lead="Articles, research papers, and educational content from the Bhavya Knowledge Mission. Published as the Knowledge Mission progresses."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Coming Soon"
              title="Articles Will Be Published Here"
              description="The Bhavya Knowledge Mission is developing educational content across AI literacy, digital foundations, heritage documentation, and environmental science. Articles will be published as the mission progresses."
            />
          </PageContent>

          <div style={{ marginTop: 48 }}>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <BookOpen size={20} aria-hidden="true" style={{ color: "var(--primary)" }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", margin: 0 }}>
                  What to Expect
                </h3>
              </div>
              <div className="info-card-desc" style={{ fontSize: 15, lineHeight: 1.7 }}>
                <p style={{ marginBottom: 12 }}>
                  Articles published here will cover:
                </p>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  <li>AI literacy and prompt engineering guides</li>
                  <li>Digital foundations and technology explainers</li>
                  <li>Heritage documentation and cultural research</li>
                  <li>Environmental science and conservation studies</li>
                  <li>Community development case studies</li>
                  <li>Open educational resource collections</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
              >
                "Knowledge should travel farther than roads, faster than
                technology, and deeper than classrooms. Every article published
                is a step toward that vision."
              </div>
              <div className="content-meta" style={{ marginTop: 12 }}>
                — Bhavya Knowledge Mission
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
