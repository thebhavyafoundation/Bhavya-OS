"use client";

import { SplitHero } from "@/components/home/SplitHero";
import { FourPillars } from "@/components/home/FourPillars";
import { PublicStoryShell } from "@/components/site/PublicStoryShell";
import { SmallTiles } from "@/components/home/SmallTiles";
import { QuoteBand } from "@/components/home/QuoteBand";
import { FinalCta } from "@/components/home/FinalCta";
import { Preloader } from "@/components/motion/Preloader";

/**
 * Homepage — immersive photographic hero, then the four mandates as a
 * narrative spine.
 *
 * The three-card mission spotlight this page used to carry is replaced by
 * `PublicStoryShell`, which renders all four mandates as chapters drawn from
 * the constitutional mission profiles. A card grid said "here are three
 * things"; four chapters say "here is the shape of the institution". Forest
 * was previously represented only by the hero photograph; it now has its own
 * chapter, because it is a constitutional mission like the other three.
 *
 * Client component; interactive sections are client components.
 * Impact numbers: none (D1). No image source/credit text rendered anywhere
 * (D4 superseded by the 2026-09-26 user directive) — credit lines inside
 * `PublicStoryShell` are licence attribution, not editorial sourcing.
 */
export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Preloader />
      <main id="main-content">
        <SplitHero />
        <FourPillars />
        <PublicStoryShell />
        <SmallTiles />
        <QuoteBand />
        <FinalCta />
      </main>
    </div>
  );
}
