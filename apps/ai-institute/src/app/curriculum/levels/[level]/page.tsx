import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { curriculum, getLevelByNumber } from "@/data/curriculum-levels";
import { ArrowRight, BookOpen } from "lucide-react";

interface LevelPageProps {
  params: Promise<{ level: string }>;
}

export function generateStaticParams() {
  return curriculum.map((l) => ({ level: String(l.level) }));
}

export async function generateMetadata({
  params,
}: LevelPageProps): Promise<Metadata> {
  const { level: levelStr } = await params;
  const levelNum = Number(levelStr);
  const level = getLevelByNumber(levelNum);
  if (!level) return {};
  return {
    title: `Level ${level.level}: ${level.name} — Bhavya Academy`,
    description: `${level.mission} — ${level.duration} course with ${level.moduleCount} modules and ${level.handsOnPercent}% hands-on practice.`,
  };
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level: levelStr } = await params;
  const levelNum = Number(levelStr);
  const level = getLevelByNumber(levelNum);
  if (!level) notFound();

  const prevLevel = getLevelByNumber(levelNum - 1);
  const nextLevel = getLevelByNumber(levelNum + 1);

  return (
    <>
      <div id="main-content" className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-brand-forest)]/5 to-transparent pt-24 pb-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <span className="inline-block rounded-full bg-[var(--color-brand-forest)]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-6">
              Level {level.level}
            </span>
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--color-brand-forest)] mb-6">
              {level.name}
            </h1>
            <p className="text-lg text-[var(--color-earth)] max-w-2xl mx-auto">
              {level.mission}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[var(--color-earth)]/10 bg-white p-5 text-center">
              <div className="text-2xl font-bold text-[var(--color-brand-forest)]">
                {level.duration}
              </div>
              <div className="text-xs text-[var(--color-earth)] mt-1">
                Duration
              </div>
            </div>
            <div className="rounded-xl border border-[var(--color-earth)]/10 bg-white p-5 text-center">
              <div className="text-2xl font-bold text-[var(--color-brand-forest)]">
                {level.moduleCount}
              </div>
              <div className="text-xs text-[var(--color-earth)] mt-1">
                Modules
              </div>
            </div>
            <div className="rounded-xl border border-[var(--color-earth)]/10 bg-white p-5 text-center">
              <div className="text-2xl font-bold text-[var(--color-brand-forest)]">
                {level.handsOnPercent}%
              </div>
              <div className="text-xs text-[var(--color-earth)] mt-1">
                Hands-On
              </div>
            </div>
            <div className="rounded-xl border border-[var(--color-earth)]/10 bg-white p-5 text-center">
              <div className="text-sm font-bold text-[var(--color-brand-forest)]">
                {level.outcome}
              </div>
              <div className="text-xs text-[var(--color-earth)] mt-1">
                Outcome
              </div>
            </div>
          </div>
        </section>

        {/* Mission Detail */}
        <section className="mx-auto max-w-4xl px-6 py-12 border-t border-[var(--color-earth)]/10">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-2">
              Mission
            </p>
            <h2 className="text-2xl font-bold text-[var(--color-brand-forest)]">
              What You Will Learn
            </h2>
          </div>
          <div className="rounded-xl border border-[var(--color-earth)]/10 bg-white p-6">
            <p className="text-[var(--color-earth)] leading-relaxed">
              This level includes {level.moduleCount} modules with a focus on
              practical, hands-on learning ({level.handsOnPercent}% of the
              curriculum). By the end of this level, you will have achieved:
            </p>
            <div className="mt-4 rounded-lg bg-[var(--color-brand-forest)]/5 px-4 py-3 text-sm font-semibold text-[var(--color-brand-forest)]">
              {level.outcome}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="mx-auto max-w-4xl px-6 py-12 border-t border-[var(--color-earth)]/10">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider text-[var(--color-brand-forest)] uppercase mb-2">
              Navigation
            </p>
            <h2 className="text-2xl font-bold text-[var(--color-brand-forest)]">
              Continue Your Journey
            </h2>
          </div>
          <div className="flex gap-4 flex-wrap">
            {prevLevel && (
              <a
                href={`/curriculum/levels/${prevLevel.level}`}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-earth)]/20 px-5 py-2.5 text-sm font-medium text-[var(--color-brand-forest)] hover:bg-[var(--color-earth)]/5 transition-colors"
              >
                ← Level {prevLevel.level}: {prevLevel.name}
              </a>
            )}
            {nextLevel && (
              <a
                href={`/curriculum/levels/${nextLevel.level}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand-forest)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-forest)]/90 transition-colors"
              >
                Level {nextLevel.level}: {nextLevel.name}
                <ArrowRight size={16} />
              </a>
            )}
          </div>
        </section>

        {/* Back */}
        <section className="mx-auto max-w-4xl px-6 py-12 border-t border-[var(--color-earth)]/10">
          <a
            href="/curriculum"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-earth)]/20 px-5 py-2.5 text-sm font-medium text-[var(--color-brand-forest)] hover:bg-[var(--color-earth)]/5 transition-colors"
          >
            <BookOpen size={16} />
            Back to Curriculum Overview
          </a>
        </section>
      </div>
    </>
  );
}
