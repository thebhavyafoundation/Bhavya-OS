import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SkipNavigation } from "../../components/SkipNavigation";
import {
  PageHero,
  SectionHeader,
} from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";
import { PageContent, AnimatedGrid } from "../../components/PageContent";
import {
  Heart,
  Users,
  BookOpen,
  Code,
  TreePine,
  Landmark,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Get Involved — Bhavya Foundation",
  description:
    "Ways to participate with Bhavya Foundation — volunteer, donate, learn, contribute, and help build institutions that serve communities for generations.",
  path: "/get-involved",
});

const waysToParticipate = [
  {
    icon: <Users />,
    title: "Volunteer",
    description:
      "Join the Bhavya Volunteer Corps. Support programmes, promote community participation, and develop future leaders through structured service.",
    href: "/community",
  },
  {
    icon: <Heart />,
    title: "Donate",
    description:
      "Support Bhavya Foundation's four permanent missions. Every contribution helps restore forests, expand knowledge, preserve heritage, and empower communities.",
    href: "/donate",
  },
  {
    icon: <BookOpen />,
    title: "Learn",
    description:
      "Enroll in the Bhavya Academy. Start with Level 0 and progress through 13 levels of AI literacy, hands-on projects, and community impact.",
    href: "/curriculum",
  },
  {
    icon: <Code />,
    title: "Contribute",
    description:
      "Contribute to Bhavya Foundation's open source projects. Help build educational tools, AI literacy platforms, and community resources.",
    href: "https://github.com/thebhavyafoundation/Bhavya-OS",
  },
  {
    icon: <TreePine />,
    title: "Support Forest Mission",
    description:
      "Help restore ecosystems, protect biodiversity, and increase native forest cover through tree plantation drives and conservation programmes.",
    href: "/nature",
  },
  {
    icon: <Landmark />,
    title: "Support Heritage Mission",
    description:
      "Contribute to documenting and preserving traditional knowledge, temple architecture, yoga heritage, and living culture.",
    href: "/heritage",
  },
];

const impactAreas = [
  "Restore forests and protect biodiversity",
  "Expand access to AI education and digital literacy",
  "Document and preserve cultural heritage",
  "Empower youth, women, and rural communities",
  "Build open source educational tools",
  "Create self-sustaining learning ecosystems",
];

export default function GetInvolvedPage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/get-involved" />
      <main id="main-content">
        <PageHero
          badge="GET INVOLVED"
          title="Participate in the Mission"
          lead="Bhavya Foundation is built on community participation. Whether you volunteer, donate, learn, or contribute code — every action strengthens the mission."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Ways to Participate"
              title="Choose How You Contribute"
              description="There are many ways to be part of Bhavya Foundation's work. Find the path that fits your skills, time, and interests."
            />
          </PageContent>
          <AnimatedGrid columns={3}>
            {waysToParticipate.map((way, i) => (
              <a
                key={i}
                href={way.href}
                target={way.href.startsWith("http") ? "_blank" : undefined}
                rel={way.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div className="card">
                  <div className="card-icon" aria-hidden="true">{way.icon}</div>
                  <h3 className="card-title">{way.title}</h3>
                  <p className="card-desc">{way.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: "var(--primary)" }}>
                    Learn more
                    <ArrowRight size={12} aria-hidden="true" />
                  </div>
                </div>
              </a>
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Your Impact"
                title="What Your Participation Makes Possible"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              {impactAreas.map((area, i) => (
                <div key={i} className="info-card">
                  <div className="info-card-desc" style={{ fontSize: 14 }}>
                    {area}
                  </div>
                </div>
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Start Today"
                title="Take the First Step"
              />
            </PageContent>
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <a href="/community" className="btn btn-primary">
                <Users size={16} aria-hidden="true" />
                Become a Volunteer
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="/donate" className="btn btn-secondary">
                <Heart size={16} aria-hidden="true" />
                Donate
              </a>
              <a href="/curriculum" className="btn btn-secondary">
                <BookOpen size={16} aria-hidden="true" />
                Start Learning
              </a>
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
              >
                "A volunteer is not someone who gives spare time. A volunteer
                is someone who chooses to share responsibility for the future.
                Every person who participates in this mission makes the
                Foundation stronger."
              </div>
              <div className="content-meta" style={{ marginTop: 12 }}>
                — Shri Manohar Lal, Founder
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
