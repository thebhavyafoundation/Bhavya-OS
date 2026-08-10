import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Forest Mission — Bhavya Foundation",
  description:
    "Restoring ecosystems, protecting biodiversity, increasing native forest cover, and conserving water through community-led ecological stewardship.",
};

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

const programmes = [
  {
    icon: TreePine,
    title: "Forest Restoration",
    desc: "Reforestation, afforestation, and assisted natural regeneration to restore degraded ecosystems and increase native forest cover.",
  },
  {
    icon: Sprout,
    title: "Native Tree Plantation",
    desc: "Preference for indigenous species naturally suited to the local ecosystem. Monoculture plantations avoided unless justified for ecological restoration.",
  },
  {
    icon: Bug,
    title: "Biodiversity Conservation",
    desc: "Habitat restoration, pollinator protection, bird conservation, native grasses and shrubs, wildlife awareness, and invasive species management.",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    desc: "Rainwater harvesting, spring rejuvenation, watershed management, stream restoration, water literacy, and groundwater recharge awareness.",
  },
  {
    icon: Mountain,
    title: "Soil Conservation",
    desc: "Protecting and restoring soil health through sustainable land management, erosion control, and organic practices.",
  },
  {
    icon: Users,
    title: "Community Participation",
    desc: "Conservation succeeds when communities become long-term stewards. Schools, youth groups, Panchayats, farmers, and women's groups participate.",
  },
  {
    icon: BookOpen,
    title: "Environmental Education",
    desc: "School awareness sessions, biodiversity walks, nature camps, teacher training, environmental clubs, and digital learning resources.",
  },
  {
    icon: Leaf,
    title: "Sacred Grove Restoration",
    desc: "Partnering with communities to restore and protect ancient sacred groves that harbor endangered endemic flora and fauna.",
  },
];

export default function NaturePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-3">
            Bhavya Forest Mission
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Restoring Living Forests, Healthy Ecosystems
          </h1>
          <p className="text-base text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Environmental conservation is not merely a programme of the
            Foundation; it is one of its constitutional pillars. Every initiative
            seeks to restore ecological balance, strengthen community stewardship,
            and create measurable environmental benefit for present and future
            generations.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-bold text-text-primary mb-2 text-center">
            Guiding Principles
          </h2>
          <p className="text-sm text-text-secondary text-center mb-8">
            Every environmental programme follows these principles to ensure
            ecological integrity and long-term impact.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {principles.map((p) => (
              <div key={p.title} className="glass rounded-lg p-5">
                <div className="text-sm font-semibold text-text-primary mb-1">
                  {p.title}
                </div>
                <div className="text-xs text-text-tertiary leading-relaxed">
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-bold text-text-primary mb-2 text-center">
            Programme Areas
          </h2>
          <p className="text-sm text-text-secondary text-center mb-8">
            From forest restoration to environmental education, our programmes
            serve ecosystems and communities across India.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programmes.map((p) => (
              <div
                key={p.title}
                className="glass rounded-lg p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-green/20 flex items-center justify-center shrink-0">
                  <p.icon className="w-4.5 h-4.5 text-forest-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary mb-0.5">
                    {p.title}
                  </div>
                  <div className="text-xs text-text-tertiary leading-relaxed">
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-gold rounded-xl p-8 text-center mb-16">
          <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-3">
            Founder&apos;s Principle
          </p>
          <blockquote className="text-base text-text-secondary italic leading-relaxed max-w-2xl mx-auto">
            &ldquo;A tree planted without care is an event. A forest restored
            with patience is a legacy. Bhavya Foundation shall be remembered not
            for campaigns, but for landscapes transformed, communities empowered,
            and ecosystems renewed.&rdquo;
          </blockquote>
          <p className="text-xs text-text-muted mt-3">
            — Shri Manohar Lal, Founder
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary mb-2 text-center">
            Tree Plantation Standards
          </h2>
          <p className="text-sm text-text-secondary text-center mb-8">
            Every plantation project follows rigorous standards to ensure
            long-term ecological success.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass rounded-lg p-5">
              <div className="text-sm font-semibold text-text-primary mb-1">
                Site Assessment
              </div>
              <div className="text-xs text-text-tertiary leading-relaxed">
                Soil suitability, water availability, land ownership
                confirmation, and ecological compatibility assessed before
                planting.
              </div>
            </div>
            <div className="glass rounded-lg p-5">
              <div className="text-sm font-semibold text-text-primary mb-1">
                Species Selection
              </div>
              <div className="text-xs text-text-tertiary leading-relaxed">
                Indigenous trees, climate-resilient species, and
                biodiversity-supporting species preferred. Monoculture avoided.
              </div>
            </div>
            <div className="glass rounded-lg p-5">
              <div className="text-sm font-semibold text-text-primary mb-1">
                Maintenance &amp; Monitoring
              </div>
              <div className="text-xs text-text-tertiary leading-relaxed">
                Watering schedule, weeding, replacement of failed saplings,
                fencing, and periodic monitoring. Plantation is only the
                beginning.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
