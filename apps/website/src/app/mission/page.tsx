import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
  PageHero,
  SectionHeader,
  FeatureCard,
} from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";
import { PageContent, AnimatedGrid } from "../../components/PageContent";
import { TreePine, BookOpen, Landmark, Heart } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Our Mission — Bhavya Foundation",
  description:
    "Restoring nature, expanding knowledge, preserving heritage, and empowering communities through ethical leadership, innovation, and public service.",
  path: "/mission",
});

const missions = [
  {
    icon: <TreePine />,
    title: "Bhavya Forest Mission",
    desc: "Restore ecosystems, protect biodiversity, increase native forest cover, conserve water, and build climate resilience through community-led conservation.",
  },
  {
    icon: <BookOpen />,
    title: "Bhavya Knowledge Mission",
    desc: "AI Labs, Digital Libraries, research, innovation, and digital literacy — making education accessible to rural and underserved communities.",
  },
  {
    icon: <Landmark />,
    title: "Bhavya Heritage Mission",
    desc: "Traditional knowledge, yoga, temple documentation, architecture, history, and living heritage — preserving what endures for future generations.",
  },
  {
    icon: <Heart />,
    title: "Bhavya Community Mission",
    desc: "Youth empowerment, women's leadership, school programmes, village development, and the Bhavya Volunteer Corps.",
  },
];

const brandValues = [
  {
    title: "Integrity",
    desc: "Acting honestly, speaking truthfully, and maintaining the highest ethical standards in every decision.",
  },
  {
    title: "Stewardship",
    desc: "Leaving the Foundation stronger than we found it. Every decision considers the impact ten years from now.",
  },
  {
    title: "Knowledge",
    desc: "Expanding access to education, research, and innovation — knowledge should travel farther than roads.",
  },
  {
    title: "Discipline",
    desc: "Maintaining professionalism, accountability, and systematic approaches to every programme.",
  },
  {
    title: "Humility",
    desc: "Serving with modesty and respect. We measure success by lives improved, not recognition received.",
  },
  {
    title: "Innovation",
    desc: "Embracing new ideas, technologies, and approaches that advance our charitable mission.",
  },
  {
    title: "Excellence",
    desc: "Pursuing the highest quality in everything — from forest restoration to AI education.",
  },
  {
    title: "Compassion",
    desc: "Approaching every community, individual, and ecosystem with care and empathy.",
  },
  {
    title: "Courage",
    desc: "Making difficult decisions when they serve the public good, regardless of popularity.",
  },
  {
    title: "Service",
    desc: "Dedicated to public benefit. We exist to serve, not to be served.",
  },
];

const commitments = [
  "We serve the public before ourselves",
  "We protect nature responsibly",
  "We expand knowledge ethically",
  "We preserve heritage respectfully",
  "We tell the truth",
  "We manage resources responsibly",
  "We respect every individual",
  "We remain transparent and accountable",
  "We protect children and vulnerable persons",
  "We leave Bhavya Foundation stronger than we found it",
];

export default function MissionPage() {
  return (
    <>
      <Header currentPath="/mission" />
      <main id="main-content">
        <PageHero
          badge="OUR MISSION"
          title="Restoring Nature. Empowering Humanity. Preserving Heritage."
          lead="To restore forests, expand knowledge, preserve heritage, and empower communities through ethical leadership, innovation, and public service."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Four Permanent Missions"
              title="What We Do"
              description="Everything under Bhavya belongs to one of these permanent missions. Projects finish. Institutions endure."
            />
          </PageContent>
          <AnimatedGrid columns={2}>
            {missions.map((m, i) => (
              <FeatureCard
                key={i}
                icon={m.icon}
                title={m.title}
                description={m.desc}
              />
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Brand Vision"
                title="What We Aspire To"
                description="To build one of the world's most trusted public institutions advancing environmental stewardship, education, cultural preservation, and responsible innovation for generations to come."
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              <div className="info-card">
                <div className="info-card-title">Brand Purpose</div>
                <div className="info-card-desc">
                  We exist to build institutions that strengthen nature,
                  knowledge, heritage, and communities.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Brand Promise</div>
                <div className="info-card-desc">
                  Whenever people see Bhavya, they should immediately think:
                  Integrity, Excellence, Innovation, Trust, Long-term Thinking,
                  Professionalism.
                </div>
              </div>
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader eyebrow="Core Values" title="What Guides Us" />
            </PageContent>
            <AnimatedGrid columns={2}>
              {brandValues.map((v, i) => (
                <div key={i} className="info-card">
                  <div className="info-card-title">{v.title}</div>
                  <div className="info-card-desc">{v.desc}</div>
                </div>
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Constitutional Commitments"
                title="What We Promise"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              {commitments.map((c, i) => (
                <div key={i} className="info-card">
                  <div className="info-card-desc" style={{ fontSize: 13 }}>
                    {c}
                  </div>
                </div>
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Guiding Principles"
                title="How We Serve"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              <div className="info-card">
                <div className="info-card-title">Radical Transparency</div>
                <div className="info-card-desc">
                  Every governance decision, financial flow, and operational
                  policy is publicly verifiable.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Long-Term Stewardship</div>
                <div className="info-card-desc">
                  Every decision considers: "What impact will this have ten
                  years from now?"
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Evidence-Based Action</div>
                <div className="info-card-desc">
                  We measure success by outcomes — survival rates, lives
                  improved, ecosystems restored.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Community Ownership</div>
                <div className="info-card-desc">
                  Conservation and education succeed when communities become
                  long-term stewards.
                </div>
              </div>
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Institutional Philosophy"
                title="Bhavya Builds Institutions"
              />
            </PageContent>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7 }}
              >
                Bhavya does not build projects. Bhavya builds institutions.
                Projects finish. Institutions endure. Campaigns end. Culture
                remains. Buildings age. Knowledge grows. People come and go.
                Values remain.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
