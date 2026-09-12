import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { curriculum, getTotalModules } from "@/data/curriculum-levels";
import {
  BookOpen,
  ArrowRight,
  Users,
  Code,
  Lightbulb,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bhavya Academy Curriculum — 13 Levels of AI Mastery",
  description:
    "Explore the Bhavya Academy curriculum: 13 progressive levels from Digital Foundations to Institution Building, designed to transform learners into builders and leaders.",
};

const journeyStages = [
  {
    icon: Users,
    title: "Visitor",
    description:
      "Begin your journey. Explore AI, understand its potential, and discover how technology can serve communities.",
  },
  {
    icon: Code,
    title: "Builder",
    description:
      "Create AI-powered applications, agents, and automation systems. Develop practical skills through hands-on projects.",
  },
  {
    icon: Lightbulb,
    title: "Contributor",
    description:
      "Contribute to open source, conduct research, and build products that solve real-world problems.",
  },
  {
    icon: BookOpen,
    title: "Mentor",
    description:
      "Guide and teach others. Share knowledge, lead workshops, and help the next generation of learners.",
  },
  {
    icon: Building,
    title: "Institution Builder",
    description:
      "Build and lead educational institutions. Create self-sustaining learning ecosystems that serve communities for generations.",
  },
];

export default function CurriculumPage() {
  const totalModules = getTotalModules();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-brand-forest)]/5 to-transparent pt-24 pb-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <span className="inline-block rounded-full bg-[var(--color-brand-forest)]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-6">
              Academy / Curriculum
            </span>
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--color-brand-forest)] mb-6">
              A Curriculum Designed for Transformation
            </h1>
            <p className="text-lg text-[var(--color-earth)] max-w-2xl mx-auto">
              The Bhavya Academy curriculum is a structured, progressive
              learning path — from digital foundations to institution building.{" "}
              <strong>13 levels. {totalModules} modules.</strong> One
              transformation journey.
            </p>
          </div>
        </section>

        {/* All Levels */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-2">
              All Levels
            </p>
            <h2 className="text-2xl font-bold text-[var(--color-brand-forest)]">
              13 Levels of Progressive Learning
            </h2>
            <p className="text-[var(--color-earth)] mt-2 max-w-2xl">
              Each level builds on the previous, combining theoretical
              understanding with hands-on practice.
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
                    <h3 className="font-semibold text-[var(--color-brand-forest)] group-hover:text-[var(--color-brand-forest)]">
                      Level {level.level}: {level.name}
                    </h3>
                    <p className="text-sm text-[var(--color-earth)] mt-1 line-clamp-2">
                      {level.mission}
                    </p>
                    <p className="text-xs text-[var(--color-earth)]/60 mt-2">
                      {level.duration} · {level.moduleCount} modules ·{" "}
                      {level.handsOnPercent}% hands-on
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-brand-forest)]"
                />
              </a>
            ))}
          </div>
        </section>

        {/* Transformation Journey */}
        <section className="mx-auto max-w-6xl px-6 py-16 border-t border-[var(--color-earth)]/10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-2">
              The Transformation Journey
            </p>
            <h2 className="text-2xl font-bold text-[var(--color-brand-forest)]">
              From Visitor to Institution Builder
            </h2>
            <p className="text-[var(--color-earth)] mt-2 max-w-2xl">
              The curriculum is designed not just to teach skills, but to
              transform learners into leaders who can build institutions that
              serve communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {journeyStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.title}
                  className="rounded-xl border border-[var(--color-earth)]/10 bg-white p-5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-forest)]/10 flex items-center justify-center mb-3">
                    <Icon
                      size={20}
                      className="text-[var(--color-brand-forest)]"
                    />
                  </div>
                  <h3 className="font-semibold text-[var(--color-brand-forest)]">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-[var(--color-earth)] mt-1">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-16 border-t border-[var(--color-earth)]/10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-2">
              Start Your Journey
            </p>
            <h2 className="text-2xl font-bold text-[var(--color-brand-forest)]">
              Begin With Level 0
            </h2>
            <p className="text-[var(--color-earth)] mt-2 max-w-2xl">
              No prior experience required. The curriculum starts with digital
              foundations and progressively builds to advanced AI skills.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <a
              href="/curriculum/levels/0"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand-forest)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-forest)]/90 transition-colors"
            >
              <BookOpen size={16} />
              Start Level 0
              <ArrowRight size={16} />
            </a>
            <a
              href="/curriculum/levels"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-earth)]/20 px-5 py-2.5 text-sm font-medium text-[var(--color-brand-forest)] hover:bg-[var(--color-earth)]/5 transition-colors"
            >
              View All Levels
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
