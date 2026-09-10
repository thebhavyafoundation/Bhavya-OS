import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { SkipNavigation } from "../../../components/SkipNavigation";
import {
  PageHero,
  SectionHeader,
  FeatureCard,
} from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { PageContent, AnimatedGrid } from "../../../components/PageContent";
import { ArrowRight } from "lucide-react";
import { curriculum } from "../../../data/curriculum";

export const metadata: Metadata = buildMetadata({
  title: "Academy Levels — 13 Levels of AI Mastery — Bhavya Foundation",
  description:
    "Explore all 13 levels of the Bhavya Academy curriculum — from Digital Foundations through AI, Prompt Engineering, Agents, Research, and Institution Building.",
  path: "/curriculum/levels",
});

export default function LevelsPage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/curriculum/levels" />
      <main id="main-content">
        <PageHero
          badge="ACADEMY / LEVELS"
          title="13 Levels, One Transformation"
          lead="Each level is a complete learning unit — mission, duration, hands-on percentage, outcome, and modules. Progress through all 13 to become an Institution Builder."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Complete Curriculum"
              title="All Levels"
              description="Click any level to explore its mission, modules, and hands-on components."
            />
          </PageContent>
          <AnimatedGrid columns={3}>
            {curriculum.map((level) => (
              <FeatureCard
                key={level.level}
                icon={<span style={{ fontSize: 20, fontWeight: 700 }}>L{level.level}</span>}
                title={`Level ${level.level}: ${level.name}`}
                description={level.mission}
                href={`/curriculum/levels/${level.level}`}
              />
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Quick Reference"
                title="Level Summary"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              {curriculum.map((level) => (
                <div key={level.level} className="info-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div className="info-card-title" style={{ fontSize: 14 }}>
                      Level {level.level}: {level.name}
                    </div>
                    <div className="info-card-desc" style={{ fontSize: 12 }}>
                      {level.duration} · {level.moduleCount} modules · {level.handsOnPercent}% hands-on
                    </div>
                  </div>
                   <a href={`/curriculum/levels/${level.level}`} aria-label={`Go to Level ${level.level}: ${level.name}`} style={{ color: "var(--primary)", flexShrink: 0 }}>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              ))}
            </AnimatedGrid>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
