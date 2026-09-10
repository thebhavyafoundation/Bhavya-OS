import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../../../components/Header";
import { Footer } from "../../../../components/Footer";
import { SkipNavigation } from "../../../../components/SkipNavigation";
import {
  PageHero,
  SectionHeader,
} from "../../../../components/ui/PageHero";
import { buildMetadata } from "../../../../lib/metadata";
import { PageContent } from "../../../../components/PageContent";
import { curriculum } from "../../../../data/curriculum";
import { ArrowRight, BookOpen } from "lucide-react";

interface LevelPageProps {
  params: Promise<{ level: string }>;
}

export function generateStaticParams() {
  return curriculum.map((l) => ({ level: String(l.level) }));
}

export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
  const { level: levelStr } = await params;
  const levelNum = Number(levelStr);
  const level = curriculum.find((l) => l.level === levelNum);
  if (!level) return {};
  return buildMetadata({
    title: `Level ${level.level}: ${level.name} — Bhavya Academy`,
    description: `${level.mission} — ${level.duration} course with ${level.moduleCount} modules and ${level.handsOnPercent}% hands-on practice.`,
    path: `/curriculum/levels/${level.level}`,
  });
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level: levelStr } = await params;
  const levelNum = Number(levelStr);
  const level = curriculum.find((l) => l.level === levelNum);
  if (!level) notFound();

  const prevLevel = curriculum.find((l) => l.level === levelNum - 1);
  const nextLevel = curriculum.find((l) => l.level === levelNum + 1);

  return (
    <>
      <SkipNavigation />
      <Header currentPath={`/curriculum/levels/${level.level}`} />
      <main id="main-content">
        <PageHero
          badge={`LEVEL ${level.level}`}
          title={level.name}
          lead={level.mission}
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Level Details"
              title={`Level ${level.level}: ${level.name}`}
            />
          </PageContent>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-6)", marginBottom: "var(--space-12)" }}>
            <div className="stat-box">
              <div className="stat-number primary">{level.duration}</div>
              <div className="stat-label">Duration</div>
            </div>
            <div className="stat-box">
              <div className="stat-number primary">{level.moduleCount}</div>
              <div className="stat-label">Modules</div>
            </div>
            <div className="stat-box">
              <div className="stat-number primary">{level.handsOnPercent}%</div>
              <div className="stat-label">Hands-On</div>
            </div>
            <div className="stat-box">
              <div className="stat-number primary">{level.outcome}</div>
              <div className="stat-label">Outcome</div>
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Mission"
                title="What You Will Learn"
                description={level.mission}
              />
            </PageContent>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div className="info-card-desc" style={{ fontSize: 15, lineHeight: 1.7 }}>
                This level includes {level.moduleCount} modules with a focus on
                practical, hands-on learning ({level.handsOnPercent}% of the
                curriculum). By the end of this level, you will have achieved:
              </div>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--surface)", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>
                {level.outcome}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Navigation"
                title="Continue Your Journey"
              />
            </PageContent>
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              {prevLevel && (
                <a href={`/curriculum/levels/${prevLevel.level}`} className="btn btn-secondary">
                  ← Level {prevLevel.level}: {prevLevel.name}
                </a>
              )}
              {nextLevel && (
                <a href={`/curriculum/levels/${nextLevel.level}`} className="btn btn-primary">
                  Level {nextLevel.level}: {nextLevel.name}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <a href="/curriculum" className="btn btn-secondary">
              <BookOpen size={16} aria-hidden="true" />
              Back to Curriculum Overview
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
