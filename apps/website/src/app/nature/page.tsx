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
  TreePine,
  Droplets,
  Bug,
  Sprout,
  Users,
  BookOpen,
  Leaf,
  Mountain,
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title:
    "Bhavya Forest Mission — Environmental Conservation — Bhavya Foundation",
  description:
    "Restoring ecosystems, protecting biodiversity, increasing native forest cover, and conserving water through community-led ecological stewardship.",
  path: "/nature",
});

const programmes = [
  {
    icon: <TreePine />,
    title: "Forest Restoration",
    desc: "Reforestation, afforestation, and assisted natural regeneration to restore degraded ecosystems and increase native forest cover.",
  },
  {
    icon: <Sprout />,
    title: "Native Tree Plantation",
    desc: "Preference for indigenous species naturally suited to the local ecosystem. monoculture plantations avoided unless justified for ecological restoration.",
  },
  {
    icon: <Bug />,
    title: "Biodiversity Conservation",
    desc: "Habitat restoration, pollinator protection, bird conservation, native grasses and shrubs, wildlife awareness, and invasive species management.",
  },
  {
    icon: <Droplets />,
    title: "Water Conservation",
    desc: "Rainwater harvesting, spring rejuvenation, watershed management, stream restoration, water literacy, and groundwater recharge awareness.",
  },
  {
    icon: <Mountain />,
    title: "Soil Conservation",
    desc: "Protecting and restoring soil health through sustainable land management, erosion control, and organic practices.",
  },
  {
    icon: <Users />,
    title: "Community Participation",
    desc: "Conservation succeeds when communities become long-term stewards. Schools, youth groups, Panchayats, farmers, and women's groups participate.",
  },
  {
    icon: <BookOpen />,
    title: "Environmental Education",
    desc: "School awareness sessions, biodiversity walks, nature camps, teacher training, environmental clubs, and digital learning resources.",
  },
  {
    icon: <Leaf />,
    title: "Sacred Grove Restoration",
    desc: "Partnering with communities to restore and protect ancient sacred groves that harbor endangered endemic flora and fauna.",
  },
];

const principles = [
  {
    title: "Ecology Before Optics",
    desc: "Projects prioritize ecological value over publicity.",
  },
  {
    title: "Native Before Exotic",
    desc: "Preference given to indigenous species naturally suited to the local ecosystem.",
  },
  {
    title: "Survival Before Plantation",
    desc: "Success measured by long-term survival, health, and ecological impact — not by the number of saplings planted.",
  },
  {
    title: "Restoration Before Expansion",
    desc: "Existing ecosystems protected and restored before creating new interventions.",
  },
  {
    title: "Science With Community",
    desc: "Scientific knowledge and community participation complement one another.",
  },
  {
    title: "Long-Term Stewardship",
    desc: "Every plantation or restoration project includes a maintenance and monitoring plan.",
  },
];

export default function NaturePage() {
  return (
    <>
      <Header currentPath="/nature" />
      <main id="main-content">
        <PageHero
          badge="BHAVYA FOREST MISSION"
          title="Restoring Living Forests, Healthy Ecosystems"
          lead="Environmental conservation is not merely a programme of the Foundation; it is one of its constitutional pillars. Every initiative seeks to restore ecological balance, strengthen community stewardship, and create measurable environmental benefit for present and future generations."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Guiding Principles"
              title="How We Conserve"
              description="Every environmental programme follows these principles to ensure ecological integrity and long-term impact."
            />
          </PageContent>
          <AnimatedGrid columns={3}>
            {principles.map((p, i) => (
              <div key={i} className="info-card">
                <div className="info-card-title">{p.title}</div>
                <div className="info-card-desc">{p.desc}</div>
              </div>
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Programme Areas"
                title="Environmental Activities"
                description="From forest restoration to environmental education, our programmes serve ecosystems and communities across India."
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              {programmes.map((p, i) => (
                <FeatureCard
                  key={i}
                  icon={p.icon}
                  title={p.title}
                  description={p.desc}
                />
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Founder's Principle"
                title="Our Commitment to Nature"
              />
            </PageContent>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
              >
                "A tree planted without care is an event. A forest restored with
                patience is a legacy. Bhavya Foundation shall be remembered not
                for campaigns, but for landscapes transformed, communities
                empowered, and ecosystems renewed."
              </div>
              <div className="content-meta" style={{ marginTop: 12 }}>
                — Shri Manohar Lal, Founder
              </div>
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Standards"
                title="Tree Plantation Standards"
                description="Every plantation project follows rigorous standards to ensure long-term ecological success."
              />
            </PageContent>
            <AnimatedGrid columns={3}>
              <div className="info-card">
                <div className="info-card-title">Site Assessment</div>
                <div className="info-card-desc">
                  Soil suitability, water availability, land ownership
                  confirmation, and ecological compatibility assessed before
                  planting.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Species Selection</div>
                <div className="info-card-desc">
                  Indigenous trees, climate-resilient species, and
                  biodiversity-supporting species preferred. Monoculture
                  avoided.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Maintenance & Monitoring</div>
                <div className="info-card-desc">
                  Watering schedule, weeding, replacement of failed saplings,
                  fencing, and periodic monitoring. Plantation is only the
                  beginning.
                </div>
              </div>
            </AnimatedGrid>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
