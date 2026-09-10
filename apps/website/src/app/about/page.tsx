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
  title: "About — Bhavya Foundation",
  description:
    "Bhavya Foundation is a public charitable trust dedicated to environmental conservation, education, heritage preservation, and community development.",
  path: "/about",
});

const governance = [
  {
    role: "Founder & Managing Trustee",
    name: "Shri Manohar Lal",
    desc: "Leading the Foundation with a vision to restore nature, empower communities, and build institutions worthy of future generations.",
  },
  {
    role: "Trustee",
    name: "Smt. Kanta Devi",
    desc: "Governing the Foundation with integrity, diligence, and a commitment to public service.",
  },
  {
    role: "Trustee",
    name: "Shri Kuldeep Sangal",
    desc: "Contributing to the Board's strategic oversight and institutional stewardship.",
  },
];

const values = [
  "Integrity",
  "Stewardship",
  "Knowledge",
  "Discipline",
  "Humility",
  "Innovation",
  "Excellence",
  "Compassion",
  "Courage",
  "Service",
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
];

export default function AboutPage() {
  return (
    <>
      <Header currentPath="/about" />
      <main id="main-content">
        <PageHero
          badge="ABOUT THE FOUNDATION"
          title="An Institution Designed for Generations"
          lead="Bhavya Foundation is established as an irrevocable Public Charitable Trust, existing exclusively for charitable purposes and for the benefit of the public without distinction."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Our Founders"
              title="Board of Trustees"
              description="The Board is entrusted with the highest responsibility — safeguarding the Foundation's charitable mission, upholding public trust, and ensuring responsible stewardship of resources."
            />
          </PageContent>
          <AnimatedGrid columns={3}>
            {governance.map((g, i) => (
              <div key={i} className="stat-box" style={{ textAlign: "left" }}>
                <div className="stat-eyebrow">{g.role}</div>
                <div
                  className="stat-number primary"
                  style={{ fontSize: "22px" }}
                >
                  {g.name}
                </div>
                <p className="stat-description">{g.desc}</p>
              </div>
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Governance Structure"
                title="How We Are Governed"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              <div className="info-card">
                <div className="info-card-title">
                  Founder & Managing Trustee
                </div>
                <div className="info-card-desc">
                  Supervises administration, implements Trustee decisions,
                  represents the Trust, and coordinates programmes.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Board of Trustees</div>
                <div className="info-card-desc">
                  Governs — does not manage. Establishes direction, approves
                  strategy, budget, and major decisions.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Executive Director</div>
                <div className="info-card-desc">
                  Leads day-to-day operations under the direction of the
                  Managing Trustee and Board.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Programme Directors</div>
                <div className="info-card-desc">
                  Lead specific mission areas — Forest, Knowledge, Heritage, and
                  Community — with operational teams.
                </div>
              </div>
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Our Constitution"
                title="Governing Documents"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              <div className="info-card">
                <div className="info-card-title">The Constitution</div>
                <div className="info-card-desc">
                  Establishes the governance, ethics, and operational framework.
                  Contains 12 Articles across 4 Missions.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">
                  Public Charitable Trust Deed
                </div>
                <div className="info-card-desc">
                  The founding legal document establishing Bhavya Foundation as
                  an irrevocable Public Charitable Trust.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Founders Charter</div>
                <div className="info-card-desc">
                  Shri Manohar Lal's stewardship principles and commitments to
                  the Foundation's mission.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Governance Manual</div>
                <div className="info-card-desc">
                  Philosophy, structure, and principles governing the
                  Foundation's operations and decision-making.
                </div>
              </div>
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader eyebrow="Core Values" title="What Guides Us" />
            </PageContent>
            <AnimatedGrid columns={2}>
              {values.map((v, i) => (
                <div key={i} className="info-card">
                  <div className="info-card-title" style={{ fontSize: "14px" }}>
                    {v}
                  </div>
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
                eyebrow="Our Missions"
                title="Four Permanent Missions"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              <FeatureCard
                icon={<TreePine />}
                title="Bhavya Forest Mission"
                description="Restore ecosystems, protect biodiversity, increase native forest cover, and conserve water."
              />
              <FeatureCard
                icon={<BookOpen />}
                title="Bhavya Knowledge Mission"
                description="AI Labs, Digital Libraries, research, innovation, and digital literacy."
              />
              <FeatureCard
                icon={<Landmark />}
                title="Bhavya Heritage Mission"
                description="Traditional knowledge, yoga, temple documentation, architecture, and living heritage."
              />
              <FeatureCard
                icon={<Heart />}
                title="Bhavya Community Mission"
                description="Youth, women, schools, village development, and the Bhavya Volunteer Corps."
              />
            </AnimatedGrid>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
