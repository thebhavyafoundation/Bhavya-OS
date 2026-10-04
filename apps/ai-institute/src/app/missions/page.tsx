import type { Metadata } from "next";
import Link from "next/link";
import { TreePine, Brain, Landmark, HeartHandshake } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { ParticleField } from "@/components/motion/ParticleField";
import { MISSION_PROFILES, type MissionId } from "@/data/mission-profiles";

export const metadata: Metadata = {
  title: "Missions — Bhavya Foundation",
  description:
    "Four permanent missions driving ecological restoration, knowledge creation, cultural preservation, and community empowerment.",
};

const MISSION_PRESENTATION: Record<
  MissionId,
  { icon: typeof TreePine; color: string }
> = {
  forest: { icon: TreePine, color: "var(--color-forest-500)" },
  knowledge: { icon: Brain, color: "var(--color-accent-gold)" },
  heritage: { icon: Landmark, color: "var(--color-accent-earth)" },
  community: { icon: HeartHandshake, color: "var(--color-brand-sage)" },
};

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <ParticleField density={40} speed={0.3} />
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, var(--color-forest-500) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, var(--color-accent-gold) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <TextReveal>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Missions</h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Four permanent missions. One institution. Every action connects to
              something larger.
            </p>
          </TextReveal>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {MISSION_PROFILES.map((mission, i) => {
            const presentation = MISSION_PRESENTATION[mission.id];
            const Icon = presentation.icon;
            return (
              <ScrollReveal key={mission.id} direction="up" delay={i * 0.1}>
                <TiltCard intensity={6} className="h-full">
                  <Link
                    href={`/missions/${mission.id}`}
                    className="group block glass border border-border-primary rounded-2xl p-8 hover:border-border-focus transition-all h-full"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${presentation.color} 15%, transparent)`,
                      }}
                    >
                      <Icon size={28} style={{ color: presentation.color }} />
                    </div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-text-primary group-hover:text-accent-gold transition-colors">
                        {mission.name}
                      </h2>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                        {mission.statusLabel}
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {mission.oneLiner}
                    </p>
                    <div
                      className="mt-6 flex items-center gap-2 text-sm font-semibold"
                      style={{ color: presentation.color }}
                    >
                      Learn more
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="glass border border-border-primary rounded-2xl p-8 text-center">
              <p className="text-text-tertiary text-sm mb-2">
                These four missions are defined in the{" "}
                <span className="text-text-secondary font-semibold">
                  Bhavya Brand Constitution, Chapter 6 — Our Four Missions
                </span>
                , within the three constitutional pillars of The Constitution,
                §13.1.
              </p>
              <p className="text-text-muted text-xs">
                They are permanent. They do not change with trends, funding
                cycles, or leadership transitions.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
