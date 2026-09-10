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
  ArrowRight,
  Users,
  Code,
  Lightbulb,
  Building,
} from "lucide-react";
import { curriculum } from "../../data/curriculum";

export const metadata: Metadata = buildMetadata({
  title: "Bhavya Academy Curriculum — 13 Levels of AI Mastery",
  description:
    "Explore the Bhavya Academy curriculum: 13 progressive levels from Digital Foundations to Institution Building, designed to transform learners into builders and leaders.",
  path: "/curriculum",
});

const journeyStages = [
  {
    icon: <Users />,
    title: "Visitor",
    description:
      "Begin your journey. Explore AI, understand its potential, and discover how technology can serve communities.",
  },
  {
    icon: <Code />,
    title: "Builder",
    description:
      "Create AI-powered applications, agents, and automation systems. Develop practical skills through hands-on projects.",
  },
  {
    icon: <Lightbulb />,
    title: "Contributor",
    description:
      "Contribute to open source, conduct research, and build products that solve real-world problems.",
  },
  {
    icon: <BookOpen />,
    title: "Mentor",
    description:
      "Guide and teach others. Share knowledge, lead workshops, and help the next generation of learners.",
  },
  {
    icon: <Building />,
    title: "Institution Builder",
    description:
      "Build and lead educational institutions. Create self-sustaining learning ecosystems that serve communities for generations.",
  },
];

export default function CurriculumPage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/curriculum" />
      <main id="main-content">
        <PageHero
          badge="ACADEMY / CURRICULUM"
          title="A Curriculum Designed for Transformation"
          lead="The Bhavya Academy curriculum is a structured, progressive learning path — from digital foundations to institution building. 13 levels. 70 modules. One transformation journey."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="All Levels"
              title="13 Levels of Progressive Learning"
              description="Each level builds on the previous, combining theoretical understanding with hands-on practice. Complete the journey from digital literacy to institution building."
            />
          </PageContent>
          <AnimatedGrid columns={3}>
            {curriculum.map((level) => (
              <FeatureCard
                key={level.level}
                icon={<span style={{ fontSize: 20, fontWeight: 700 }}>L{level.level}</span>}
                title={`Level ${level.level}: ${level.name}`}
                description={`${level.mission} — ${level.duration}, ${level.moduleCount} modules, ${level.handsOnPercent}% hands-on.`}
                href={`/curriculum/levels/${level.level}`}
              />
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="The Transformation Journey"
                title="From Visitor to Institution Builder"
                description="The curriculum is designed not just to teach skills, but to transform learners into leaders who can build institutions that serve communities."
              />
            </PageContent>
            <AnimatedGrid columns={3}>
              {journeyStages.map((stage, i) => (
                <FeatureCard
                  key={i}
                  icon={stage.icon}
                  title={stage.title}
                  description={stage.description}
                />
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Start Your Journey"
                title="Begin With Level 0"
                description="No prior experience required. The curriculum starts with digital foundations and progressively builds to advanced AI skills."
              />
            </PageContent>
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <a href="/curriculum/levels/0" className="btn btn-primary">
                <BookOpen size={16} aria-hidden="true" />
                Start Level 0
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="/curriculum/levels" className="btn btn-secondary">
                View All Levels
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
