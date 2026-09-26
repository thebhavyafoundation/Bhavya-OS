import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SplitHero } from "@/components/home/SplitHero";
import { FourPillars } from "@/components/home/FourPillars";
import { MissionTiles } from "@/components/home/MissionTiles";
import { SmallTiles } from "@/components/home/SmallTiles";
import { QuoteBand } from "@/components/home/QuoteBand";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Bhavya Foundation — For People. For Nature. For Generations.",
  description:
    "Nature restored. Knowledge opened. Heritage kept. Communities led from within. A public charitable trust building for generations.",
};

/**
 * Homepage — poster-stagger split-hero rebuild per the foundation-v2
 * reference (spec 2026-09-26-foundation-v2-design.md, plan A, task T6;
 * hero revision + credit removal per user feedback 2026-09-26).
 *
 * Server component; interactive sections are client components.
 * Impact numbers: none (D1). No image source/credit text rendered
 * anywhere (D4 superseded by 2026-09-26 user directive).
 */
export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <SiteHeader variant="default" />
      <main id="main-content">
        <SplitHero />
        <FourPillars />
        <MissionTiles />
        <SmallTiles />
        <QuoteBand />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
