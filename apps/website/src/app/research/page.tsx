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
  TreePine,
  BookOpen,
  Landmark,
  Users,
  Brain,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Research — Bhavya Foundation",
  description:
    "Bhavya Foundation's research mission — contributing to knowledge across environmental science, AI literacy, heritage documentation, and community development.",
  path: "/research",
});

const researchAreas = [
  {
    icon: <TreePine />,
    title: "Environmental Research",
    description:
      "Forest ecosystem monitoring, biodiversity assessment, native species documentation, water conservation studies, and climate impact analysis.",
  },
  {
    icon: <Brain />,
    title: "AI & Technology Research",
    description:
      "AI literacy frameworks, responsible AI practices, open-source AI tools, digital inclusion strategies, and technology accessibility research.",
  },
  {
    icon: <Landmark />,
    title: "Heritage Documentation",
    description:
      "Traditional knowledge documentation, architectural surveys, cultural preservation research, oral history collection, and heritage site studies.",
  },
  {
    icon: <Users />,
    title: "Community Development Research",
    description:
      "Rural education models, youth empowerment frameworks, volunteer programme effectiveness, community resilience studies, and social impact assessment.",
  },
  {
    icon: <BookOpen />,
    title: "Open Education Research",
    description:
      "Open educational resource effectiveness, digital literacy measurement, learning outcome assessment, and pedagogical innovation for underserved communities.",
  },
  {
    icon: <Lightbulb />,
    title: "Innovation & Applied Research",
    description:
      "Village-level innovation, sustainable technology solutions, community-driven problem solving, and grassroots entrepreneurship research.",
  },
];

const principles = [
  "Research serves the public interest",
  "Methods are transparent and reproducible",
  "Data is open where lawful and ethical",
  "Communities participate in research that affects them",
  "Findings are published openly",
  "Traditional knowledge is documented respectfully",
];

export default function ResearchPage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/research" />
      <main id="main-content">
        <PageHero
          badge="RESEARCH"
          title="Research for Public Good"
          lead="Bhavya Foundation contributes to knowledge through transparent, ethical research across environmental science, AI literacy, heritage documentation, and community development."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Research Areas"
              title="Where We Research"
              description="Research at Bhavya Foundation is driven by real community needs — from forest ecosystems to digital literacy, from heritage preservation to grassroots innovation."
            />
          </PageContent>
          <AnimatedGrid columns={3}>
            {researchAreas.map((area, i) => (
              <FeatureCard
                key={i}
                icon={area.icon}
                title={area.title}
                description={area.description}
              />
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Research Principles"
                title="How We Conduct Research"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              {principles.map((p, i) => (
                <div key={i} className="info-card">
                  <div className="info-card-desc" style={{ fontSize: 14 }}>
                    {p}
                  </div>
                </div>
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Open Research"
                title="Contributing to Global Knowledge"
                description="Bhavya Foundation is committed to open research practices. Where lawful and ethical, research findings, methodologies, and data are published openly for the benefit of communities worldwide."
              />
            </PageContent>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
              >
                "Research should serve the people who need it most. Every study
                we conduct, every finding we publish, every methodology we share
                — it all comes back to one purpose: building knowledge that
                serves communities."
              </div>
              <div className="content-meta" style={{ marginTop: 12 }}>
                — Bhavya Research Mission
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
