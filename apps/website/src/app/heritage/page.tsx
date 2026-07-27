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
import {
  Landmark,
  BookOpen,
  Users,
  TreePine,
  Scroll,
  Heart,
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Bhavya Heritage Mission — Cultural Preservation — Bhavya Foundation",
  description:
    "Preserving traditional knowledge, yoga, temple documentation, architecture, history, and living heritage for future generations.",
  path: "/heritage",
});

const heritageAreas = [
  {
    icon: <Landmark />,
    title: "Temple Documentation",
    desc: "Documenting sacred architecture, historical temples, and heritage structures to preserve their cultural and spiritual significance.",
  },
  {
    icon: <BookOpen />,
    title: "Traditional Knowledge",
    desc: "Preserving indigenous wisdom, folk traditions, ecological knowledge, and cultural practices passed down through generations.",
  },
  {
    icon: <Heart />,
    title: "Yoga & Wellness",
    desc: "Promoting yoga as a living heritage tradition — physical, mental, and spiritual well-being rooted in ancient wisdom.",
  },
  {
    icon: <Scroll />,
    title: "Historical Records",
    desc: "Documenting local history, oral traditions, community narratives, and cultural archives for future generations.",
  },
  {
    icon: <TreePine />,
    title: "Sacred Groves",
    desc: "Protecting and restoring sacred groves — natural heritage sites that hold ecological, cultural, and spiritual value.",
  },
  {
    icon: <Users />,
    title: "Community Awareness",
    desc: "Building awareness about cultural heritage through community programmes, heritage walks, and educational initiatives.",
  },
];

export default function HeritagePage() {
  return (
    <>
      <Header currentPath="/heritage" />
      <main id="main-content">
        <PageHero
          badge="BHAVYA HERITAGE MISSION"
          title="Preserving What Endures"
          lead="Heritage is not merely about the past — it is about preserving the wisdom, traditions, and cultural identity that shape our future. The Bhavya Heritage Mission protects traditional knowledge, yoga, temple architecture, and living heritage for generations to come."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Heritage Programmes"
              title="What We Preserve"
              description="From temple documentation to traditional knowledge, our programmes protect the cultural fabric of communities."
            />
          </PageContent>
          <AnimatedGrid columns={2}>
            {heritageAreas.map((h, i) => (
              <FeatureCard
                key={i}
                icon={h.icon}
                title={h.title}
                description={h.desc}
              />
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Our Approach"
                title="How We Serve Heritage"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              <div className="info-card">
                <div className="info-card-title">Respect for Tradition</div>
                <div className="info-card-desc">
                  Heritage preservation is conducted with deep respect for
                  cultural sensitivities, community consent, and applicable
                  laws.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Documentation & Recording</div>
                <div className="info-card-desc">
                  Systematic documentation of oral traditions, architectural
                  heritage, traditional practices, and cultural knowledge.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Community Partnership</div>
                <div className="info-card-desc">
                  Working with local communities, scholars, and cultural
                  institutions to ensure heritage preservation is community-led.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Living Heritage</div>
                <div className="info-card-desc">
                  Focus on living traditions — yoga, folk arts, ecological
                  knowledge — that continue to shape communities today.
                </div>
              </div>
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Founder's Principle"
                title="Our Commitment to Heritage"
              />
            </PageContent>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
              >
                "Heritage is not a relic of the past. It is the foundation of
                the future. Every temple documented, every tradition preserved,
                every story recorded contributes to a richer, more resilient
                society."
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
