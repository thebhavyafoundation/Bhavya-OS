import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SkipNavigation } from "../../components/SkipNavigation";
import {
  PageHero,
  SectionHeader,
  FeatureCard,
} from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";
import { PageContent, AnimatedGrid } from "../../components/PageContent";
import {
  BookOpen,
  Globe,
  Building,
  Code,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Library — Open Educational Resources — Bhavya Foundation",
  description:
    "Open educational resources, open access research, government resources, and open source tools curated by Bhavya Foundation for learners and communities.",
  path: "/library",
});

const resourceCategories = [
  {
    icon: <BookOpen />,
    title: "Open Educational Resources",
    description:
      "Free textbooks, courses, and learning materials from leading open education platforms. Quality content available to everyone.",
    links: [
      { name: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
      { name: "Khan Academy", url: "https://www.khanacademy.org/" },
      { name: "OpenStax", url: "https://openstax.org/" },
      { name: "Coursera for Campus", url: "https://www.coursera.org/" },
    ],
  },
  {
    icon: <Globe />,
    title: "Open Access Research",
    description:
      "Peer-reviewed research papers and academic publications freely accessible to the public.",
    links: [
      { name: "arXiv", url: "https://arxiv.org/" },
      { name: "PubMed Central", url: "https://www.ncbi.nlm.nih.gov/pmc/" },
      { name: "Directory of Open Access Journals", url: "https://doaj.org/" },
      { name: "OpenAlex", url: "https://openalex.org/" },
    ],
  },
  {
    icon: <Building />,
    title: "Government & Institutional Resources",
    description:
      "Publicly funded educational content, government databases, and institutional resources.",
    links: [
      { name: "National Digital Library of India", url: "https://ndl.iitkgp.ac.in/" },
      { name: "SWAYAM", url: "https://swayam.gov.in/" },
      { name: "Digital India", url: "https://digitalindia.gov.in/" },
      { name: "India.gov.in", url: "https://india.gov.in/" },
    ],
  },
  {
    icon: <Code />,
    title: "Open Source Tools",
    description:
      "Free and open source software for learning, development, and community building.",
    links: [
      { name: "GitHub", url: "https://github.com/" },
      { name: "VS Code", url: "https://code.visualstudio.com/" },
      { name: "Python", url: "https://www.python.org/" },
      { name: "Linux", url: "https://www.linux.org/" },
    ],
  },
];

export default function LibraryPage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/library" />
      <main id="main-content">
        <PageHero
          badge="LIBRARY"
          title="Open Educational Resources"
          lead="Curated open resources for learners, educators, and communities. Free access to knowledge, research, tools, and government resources — because education should not be behind a paywall."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Resource Categories"
              title="Open Resources for Everyone"
              description="Bhavya Foundation curates open educational resources across four categories — making quality learning materials accessible to rural and underserved communities."
            />
          </PageContent>
          <AnimatedGrid columns={2}>
            {resourceCategories.map((category, i) => (
              <FeatureCard
                key={i}
                icon={category.icon}
                title={category.title}
                description={category.description}
              />
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Featured Resources"
                title="Recommended Links"
                description="Curated starting points for self-directed learning. All resources listed are free or openly accessible."
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              {resourceCategories.map((category, i) => (
                <div key={i} className="info-card">
                  <div className="info-card-title" style={{ fontSize: 14, marginBottom: 12 }}>
                    {category.title}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {category.links.map((link, j) => (
                      <a
                        key={j}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          color: "var(--primary)",
                          textDecoration: "none",
                        }}
                      >
                        <ExternalLink size={12} aria-hidden="true" />
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: 64 }}>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
              >
                "Open knowledge where lawful. Every resource we curate, every
                link we share, every tool we recommend — it all comes back to
                one principle: knowledge should travel farther than roads."
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
