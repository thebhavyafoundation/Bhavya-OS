import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { SkipNavigation } from "../../../components/SkipNavigation";
import {
  PageHero,
  SectionHeader,
} from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { PageContent, AnimatedGrid } from "../../../components/PageContent";

export const metadata: Metadata = buildMetadata({
  title: "Glossary — Key Terms — Bhavya Foundation",
  description:
    "Key terms and definitions related to Bhavya Foundation — ICM, Knowledge Package, Content OS, and other institutional concepts.",
  path: "/knowledge/glossary",
});

const terms = [
  {
    term: "ICM (Interpretable Context Methodology)",
    definition:
      "A structured approach to organizing information, knowledge, and workflows into hierarchical, agent-readable folder architectures. Used to design workspaces that AI agents can navigate and operate within.",
  },
  {
    term: "Knowledge Package",
    definition:
      "A complete, self-contained learning unit covering a specific topic. Each Knowledge Package includes concepts, exercises, assessments, and portfolio projects — designed for independent study.",
  },
  {
    term: "Content OS",
    definition:
      "An institutional content management system that treats content as a product — with version control, quality gates, and structured workflows from creation to publication.",
  },
  {
    term: "Bhavya Academy",
    definition:
      "The educational arm of Bhavya Foundation, offering a 13-level progressive curriculum from digital foundations to institution building. Focuses on AI literacy, hands-on learning, and community impact.",
  },
  {
    term: "Bhavya AI Lab",
    definition:
      "A public-interest learning space providing computers, internet, open-source software, mentorship, and community hackathons. Prioritizes learning over commercialization.",
  },
  {
    term: "Bhavya Volunteer Corps (BVC)",
    definition:
      "The Foundation's official volunteer network — a structured programme for recruiting, training, supporting, and recognizing volunteers who serve the Foundation's missions.",
  },
  {
    term: "Four Pillars",
    definition:
      "The four permanent missions of Bhavya Foundation: Forest Mission, Knowledge Mission, Heritage Mission, and Community Mission. Each pillar operates with its own programmes and objectives.",
  },
  {
    term: "Constitution",
    definition:
      "The governing document of Bhavya Foundation — containing 12 Articles across 4 Missions. Establishes the governance, ethics, and operational framework.",
  },
  {
    term: "Digital Library",
    definition:
      "A Bhavya Knowledge Mission initiative providing e-books, audiobooks, digital archives, research databases, and open educational resources through physical and digital platforms.",
  },
  {
    term: "Open Source",
    definition:
      "Software and educational materials released under licenses that allow free use, modification, and distribution. Bhavya Foundation promotes open source as part of its commitment to open knowledge.",
  },
  {
    term: "Prompt Engineering",
    definition:
      "The art and science of crafting effective inputs for AI systems. A core skill in the Bhavya Academy curriculum, taught at Level 2.",
  },
  {
    term: "AI Agent",
    definition:
      "An autonomous AI system that can perceive its environment, make decisions, and take actions to achieve specific goals. Covered in Level 4 of the Academy curriculum.",
  },
  {
    term: "Institution Builder",
    definition:
      "The highest stage of the Bhavya Academy transformation journey — someone who can build and lead educational institutions that serve communities for generations.",
  },
  {
    term: "Knowledge Network",
    definition:
      "Bhavya Foundation's vision for an interconnected network of community knowledge centres across rural and urban India, each integrating digital library, AI lab, computer education, and community innovation space.",
  },
];

export default function GlossaryPage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/knowledge/glossary" />
      <main id="main-content">
        <PageHero
          badge="KNOWLEDGE / GLOSSARY"
          title="Key Terms & Definitions"
          lead="Essential terms and concepts used across Bhavya Foundation — from institutional frameworks to technical vocabulary."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Reference"
              title="Glossary"
              description="Definitions of key terms related to Bhavya Foundation's work, curriculum, and institutional concepts."
            />
          </PageContent>
          <AnimatedGrid columns={2}>
            {terms.map((item, i) => (
              <div key={i} className="info-card">
                <div className="info-card-title" style={{ fontSize: 14 }}>
                  {item.term}
                </div>
                <div className="info-card-desc" style={{ fontSize: 13 }}>
                  {item.definition}
                </div>
              </div>
            ))}
          </AnimatedGrid>
        </div>
      </main>
      <Footer />
    </>
  );
}
