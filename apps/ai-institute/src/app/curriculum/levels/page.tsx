import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { curriculum } from "@/data/curriculum-levels";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Academy Levels — 13 Levels of AI Mastery — Bhavya Foundation",
  description:
    "Explore all 13 levels of the Bhavya Academy curriculum — from Digital Foundations through AI, Prompt Engineering, Agents, Research, and Institution Building.",
};

export default function LevelsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-brand-forest)]/5 to-transparent pt-24 pb-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <span className="inline-block rounded-full bg-[var(--color-brand-forest)]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-6">
              Academy / Levels
            </span>
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--color-brand-forest)] mb-6">
              13 Levels, One Transformation
            </h1>
            <p className="text-lg text-[var(--color-earth)] max-w-2xl mx-auto">
              Each level is a complete learning unit — mission, duration,
              hands-on percentage, outcome, and modules. Progress through all 13
              to become an Institution Builder.
            </p>
          </div>
        </section>

        {/* Levels Grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-2">
              Complete Curriculum
            </p>
            <h2 className="text-2xl font-bold text-[var(--color-brand-forest)]">
              All Levels
            </h2>
            <p className="text-[var(--color-earth)] mt-2 max-w-2xl">
              Click any level to explore its mission, modules, and hands-on
              components.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculum.map((level) => (
              <a
                key={level.level}
                href={`/curriculum/levels/${level.level}`}
                className="group block rounded-xl border border-[var(--color-earth)]/10 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[var(--color-brand-forest)]/20"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-brand-forest)]/10 flex items-center justify-center text-sm font-bold text-[var(--color-brand-forest)]">
                    L{level.level}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[var(--color-brand-forest)]">
                      Level {level.level}: {level.name}
                    </h3>
                    <p className="text-sm text-[var(--color-earth)] mt-1">
                      {level.mission}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Summary Table */}
        <section className="mx-auto max-w-6xl px-6 py-16 border-t border-[var(--color-earth)]/10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-2">
              Quick Reference
            </p>
            <h2 className="text-2xl font-bold text-[var(--color-brand-forest)]">
              Level Summary
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {curriculum.map((level) => (
              <div
                key={level.level}
                className="flex items-center justify-between rounded-lg border border-[var(--color-earth)]/10 bg-white p-4"
              >
                <div>
                  <div className="font-medium text-sm text-[var(--color-brand-forest)]">
                    Level {level.level}: {level.name}
                  </div>
                  <div className="text-xs text-[var(--color-earth)]">
                    {level.duration} · {level.moduleCount} modules ·{" "}
                    {level.handsOnPercent}% hands-on
                  </div>
                </div>
                <a
                  href={`/curriculum/levels/${level.level}`}
                  aria-label={`Go to Level ${level.level}: ${level.name}`}
                  className="flex-shrink-0 text-[var(--color-brand-forest)] hover:text-[var(--color-brand-forest)]/80"
                >
                  <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
