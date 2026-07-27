import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";
import { PageContent, AnimatedGrid } from "../../components/PageContent";
import {
  TreePine,
  Brain,
  Landmark,
  Heart,
  BookOpen,
  Users,
  Laptop,
  Sprout,
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Programmes — Bhavya Foundation",
  description:
    "Active programmes in forest restoration, AI education, heritage preservation, community development, and the Bhavya Volunteer Corps.",
  path: "/programs",
});

const programmes = [
  {
    icon: <TreePine />,
    title: "Bhavya Forest Mission",
    desc: "Forest restoration, native tree plantation, biodiversity conservation, watershed protection, soil conservation, and community forestry.",
    status: "Active",
  },
  {
    icon: <Brain />,
    title: "Bhavya Knowledge Mission",
    desc: "AI Labs, Digital Libraries, computer education, AI literacy, coding workshops, research support, and community hackathons.",
    status: "Active",
  },
  {
    icon: <Landmark />,
    title: "Bhavya Heritage Mission",
    desc: "Temple documentation, traditional knowledge preservation, yoga programmes, historical records, and sacred grove protection.",
    status: "Active",
  },
  {
    icon: <Heart />,
    title: "Bhavya Community Mission",
    desc: "Youth empowerment, women's leadership, school programmes, village development, health awareness, and disaster relief.",
    status: "Active",
  },
  {
    icon: <Users />,
    title: "Bhavya Volunteer Corps",
    desc: "Structured volunteer programme — recruiting, training, supporting, and recognizing volunteers across India.",
    status: "Active",
  },
  {
    icon: <Laptop />,
    title: "Bhavya AI Labs",
    desc: "Learning centres providing computers, internet, open-source software, coding workshops, mentorship, and innovation challenges.",
    status: "Active",
  },
  {
    icon: <BookOpen />,
    title: "Bhavya Digital Library",
    desc: "Physical and digital libraries, AI learning centres, mobile libraries, community knowledge centres, and village learning hubs.",
    status: "Active",
  },
  {
    icon: <Sprout />,
    title: "Environmental Education",
    desc: "School awareness sessions, biodiversity walks, nature camps, teacher training, environmental clubs, and digital learning resources.",
    status: "Active",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <Header currentPath="/programs" />
      <main id="main-content">
        <PageHero
          badge="ACTIVE PROGRAMMES"
          title="Field Operations & Initiatives"
          lead="Every programme at Bhavya Foundation is governed by constitutional principles, tracked through measurable outcomes, and designed for long-term community impact."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Flagship Programmes"
              title="What We Do"
              description="From forest restoration to AI education, our programmes serve communities and ecosystems across India."
            />
          </PageContent>
          <AnimatedGrid columns={2}>
            {programmes.map((p, i) => (
              <div className="card" key={i}>
                <div className="card-header">
                  <span className="card-icon" aria-hidden="true">
                    {p.icon}
                  </span>
                  <span
                    className="tag tag-green"
                    style={{ marginLeft: "auto" }}
                  >
                    {p.status}
                  </span>
                </div>
                <h3 className="card-title">{p.title}</h3>
                <p className="card-desc">{p.desc}</p>
              </div>
            ))}
          </AnimatedGrid>
        </div>
      </main>
      <Footer />
    </>
  );
}
