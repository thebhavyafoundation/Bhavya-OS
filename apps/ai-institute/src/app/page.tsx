"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SplitHero } from "@/components/home/SplitHero";
import { FourPillars } from "@/components/home/FourPillars";
import { MissionTiles } from "@/components/home/MissionTiles";
import { SmallTiles } from "@/components/home/SmallTiles";
import { QuoteBand } from "@/components/home/QuoteBand";
import { FinalCta } from "@/components/home/FinalCta";
import { Preloader } from "@/components/motion/Preloader";

/**
 * Homepage — poster-stagger split-hero rebuild per the foundation-v2
 * reference (spec 2026-09-26-foundation-v2-design.md, plan A, task T6;
 * hero revision + credit removal per user feedback 2026-09-26).
 *
 * Client component; interactive sections are client components.
 * Impact numbers: none (D1). No image source/credit text rendered
 * anywhere (D4 superseded by 2026-09-26 user directive).
 */
export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Preloader onComplete={() => setIsLoaded(true)} />
      <main id="main-content">
        <SplitHero />
        <FourPillars />
        <MissionTiles />
        <SmallTiles />
        <QuoteBand />
        <FinalCta />
      </main>
    </div>
  );
}
