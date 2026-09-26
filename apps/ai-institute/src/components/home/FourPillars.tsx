"use client";

import dynamic from "next/dynamic";
import { TreePine, BookOpen, Landmark, Users, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { PILLARS } from "@/data/home-v2";

const LazyMistScene = dynamic(() => import("@/components/three/MistScene"), {
  ssr: false,
  loading: () => null,
});

const iconMap = {
  forest: TreePine,
  knowledge: BookOpen,
  heritage: Landmark,
  community: Users,
} as const;

const accentVar: Record<string, string> = {
  forest: "var(--color-forest-500)",
  knowledge: "var(--color-accent-gold)",
  heritage: "var(--color-accent-earth)",
  community: "var(--color-brand-sage)",
};

/**
 * Four pillars — dark mission grid. The `data-mist-slot` div is filled
 * by the lazy MistScene in T8 (D8); inert until then.
 */
export function FourPillars() {
  return (
    <section
      className="scene scene-dark home-pillars"
      id="pillars"
      aria-label="Our four missions"
    >
      <div className="home-mist-slot" data-mist-slot aria-hidden="true">
        <LazyMistScene />
      </div>
      <div className="container">
        <TextReveal>
          <div style={{ textAlign: "center" }}>
            <span className="dark-label">Our missions</span>
            <h2
              className="dark-heading"
              style={{ marginTop: "var(--space-4)" }}
            >
              Four pillars. A lasting tomorrow.
            </h2>
            <p
              className="dark-desc"
              style={{
                marginTop: "var(--space-4)",
                maxWidth: "640px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Different paths. A shared purpose.
            </p>
          </div>
        </TextReveal>

        <div className="home-pillar-grid">
          {PILLARS.map((p, i) => {
            const Icon = iconMap[p.id];
            return (
              <ScrollReveal key={p.id} direction="up" delay={i * 0.08}>
                <TiltCard intensity={6} className="home-pillar-tilt">
                  <a href={p.href} className="home-pillar-card">
                    <span
                      className="home-pillar-icon"
                      style={{
                        background: `color-mix(in srgb, ${accentVar[p.accent]} 22%, transparent)`,
                        color: accentVar[p.accent],
                      }}
                      aria-hidden="true"
                    >
                      <Icon size={22} />
                    </span>
                    <span className="home-pillar-name">{p.name}</span>
                    <span className="home-pillar-blurb">{p.blurb}</span>
                    <span className="home-pillar-cta">
                      Explore <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </a>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
