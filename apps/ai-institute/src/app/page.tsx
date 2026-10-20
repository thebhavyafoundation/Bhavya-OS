import { SplitHero } from "@/components/home/SplitHero";
import { FourPillars } from "@/components/home/FourPillars";
import { PublicStoryShell } from "@/components/site/PublicStoryShell";
import { LearningJourney } from "@/components/home/LearningJourney";
import { ActiveLearning } from "@/components/home/ActiveLearning";
import { SmallTiles } from "@/components/home/SmallTiles";
import { QuoteBand } from "@/components/home/QuoteBand";
import { FinalCta } from "@/components/home/FinalCta";
import { Preloader } from "@/components/motion/Preloader";

/**
 * Homepage — the five-scene narrative spine.
 *
 *   1. Orientation      SplitHero        photographic hero, what Bhavya is
 *   2. The mandates     FourPillars      overview of the four constitutional mandates
 *                      PublicStoryShell each mandate in depth, as chapters
 *   3. Learning journey LearningJourney   how the curriculum is structured
 *   4. Inside a lesson  ActiveLearning    what a learner actually does
 *   5. Invitation       FinalCta         one clear next action
 *
 * The three-card mission spotlight this page used to carry was replaced by
 * `PublicStoryShell`. A card grid said "here are three things"; four chapters
 * say "here is the shape of the institution". Forest previously appeared only
 * as the hero photograph and now has its own chapter, because it is a
 * constitutional mission like the other three.
 *
 * `LearningJourney` and `ActiveLearning` are server components reading the
 * live registries. This page itself is therefore a server component too: it
 * no longer holds state, so the directive was removed and the educational
 * scenes can be rendered from live data rather than from values frozen into a
 * client bundle. Interactive children carry their own directive.
 *
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
        <LearningJourney />
        <ActiveLearning />
        <SmallTiles />
        <QuoteBand />
        <FinalCta />
      </main>
    </div>
  );
}
