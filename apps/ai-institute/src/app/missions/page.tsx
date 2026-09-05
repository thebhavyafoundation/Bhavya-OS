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
    purpose: "Restore ecosystems, protect biodiversity, and conserve water through long-term ecological stewardship.",
    icon: TreePine,
    color: "#22c55e",
  },
  {
    id: "knowledge",
    name: "Knowledge Mission",
    slug: "/missions/knowledge",
    purpose: "Open education, AI literacy, research, digital libraries, and practical learning for everyone.",
    icon: Brain,
    color: "#3b82f6",
  },
  {
    id: "heritage",
    name: "Heritage Mission",
    slug: "/missions/heritage",
    purpose: "Document, preserve, and promote traditional knowledge, architecture, history, arts, and living heritage.",
    icon: Landmark,
    color: "#f59e0b",
  },
  {
    id: "community",
    name: "Community Mission",
    slug: "/missions/community",
    purpose: "Empower young people, women, schools, and communities through education, leadership, and participation.",
    icon: HeartHandshake,
    color: "#8b5cf6",
  },
];

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Missions</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
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
                className="group block bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: mission.color + "20" }}
                >
                  <Icon size={28} style={{ color: mission.color }} />
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                  {mission.name}
                </h2>
                <p className="text-white/60 leading-relaxed">
                  {mission.purpose}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: mission.color }}>
                  Learn more
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Constitution Reference */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-white/40 text-sm mb-2">
              These four missions are defined in the{" "}
              <span className="text-white/60 font-semibold">
                Bhavya Foundation Constitution
              </span>
              , Article 2.
            </p>
            <p className="text-white/30 text-xs">
              They are permanent. They do not change with trends, funding cycles,
              or leadership transitions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
