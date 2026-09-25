import type { Metadata } from "next";
import Link from "next/link";
import { TreePine, Brain, Landmark, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Missions — Bhavya Foundation",
  description:
    "Four permanent missions driving ecological restoration, knowledge creation, cultural preservation, and community empowerment.",
};

const missions = [
  {
    id: "forest",
    name: "Forest Mission",
    slug: "/missions/forest",
    purpose:
      "Restore ecosystems, protect biodiversity, and conserve water through long-term ecological stewardship.",
    icon: TreePine,
    color: "var(--color-forest-500)",
    colorBg: "var(--color-forest-500)",
  },
  {
    id: "knowledge",
    name: "Knowledge Mission",
    slug: "/missions/knowledge",
    purpose:
      "Open education, AI literacy, research, digital libraries, and practical learning for everyone.",
    icon: Brain,
    color: "var(--color-accent-gold)",
    colorBg: "var(--color-accent-gold)",
  },
  {
    id: "heritage",
    name: "Heritage Mission",
    slug: "/missions/heritage",
    purpose:
      "Document, preserve, and promote traditional knowledge, architecture, history, arts, and living heritage.",
    icon: Landmark,
    color: "var(--color-accent-earth)",
    colorBg: "var(--color-accent-earth)",
  },
  {
    id: "community",
    name: "Community Mission",
    slug: "/missions/community",
    purpose:
      "Empower young people, women, schools, and communities through education, leadership, and participation.",
    icon: HeartHandshake,
    color: "var(--color-brand-sage)",
    colorBg: "var(--color-brand-sage)",
  },
];

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Missions</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Four permanent missions. One institution. Every action connects to
            something larger.
          </p>
        </div>
      </section>

      {/* Missions Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((mission) => {
            const Icon = mission.icon;
            return (
              <Link
                key={mission.id}
                href={mission.slug}
                className="group block glass border border-border-primary rounded-2xl p-8 hover:border-border-focus transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${mission.colorBg} 15%, transparent)`,
                  }}
                >
                  <Icon size={28} style={{ color: mission.color }} />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-text-primary group-hover:text-accent-gold transition-colors">
                  {mission.name}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {mission.purpose}
                </p>
                <div
                  className="mt-6 flex items-center gap-2 text-sm font-semibold"
                  style={{ color: mission.color }}
                >
                  Learn more
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Constitution Reference */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass border border-border-primary rounded-2xl p-8 text-center">
            <p className="text-text-tertiary text-sm mb-2">
              These four missions are defined in the{" "}
              <span className="text-text-secondary font-semibold">
                Bhavya Foundation Constitution
              </span>
              , Article 2.
            </p>
            <p className="text-text-muted text-xs">
              They are permanent. They do not change with trends, funding
              cycles, or leadership transitions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
