import { SplitHero } from "@/components/home/SplitHero";
import { FourPillars } from "@/components/home/FourPillars";
import { CurriculumGrid } from "@/components/site/CurriculumGrid";
import { InfographicCard } from "@/components/site/InfographicCard";
import { PublicStoryShell } from "@/components/site/PublicStoryShell";
import { LearningJourney } from "@/components/home/LearningJourney";
import { ActiveLearning } from "@/components/home/ActiveLearning";
import { SmallTiles } from "@/components/home/SmallTiles";
import { QuoteBand } from "@/components/home/QuoteBand";
import { FinalCta } from "@/components/home/FinalCta";
import { WhereWeStand } from "@/components/home/WhereWeStand";
import type { DiagramSpec } from "@/data/curriculum";

/** Token-driven diagram spec for the curriculum spotlight — bespoke SVG,
 * rendered by DiagramRenderer with no hardcoded ink. */
const PATHWAY_SPEC: DiagramSpec = {
  kind: "pipeline",
  title: "How a lesson builds",
  steps: ["Foundations", "Guided practice", "Independent work", "Assessment"],
};

/**
 * Homepage — the narrative spine.
 *
 *   1. Orientation       SplitHero       photographic hero, what Bhavya is
 *   2. The mandates      FourPillars     overview of the four constitutional mandates
 *                       PublicStoryShell each mandate in depth, as chapters
 *   3. Curriculum        (inline)        the pathway at a glance
 *   4. Honest state      WhereWeStand    what is built, published and reviewed today
 *   5. Learning journey  LearningJourney how the curriculum is structured
 *   6. Inside a lesson   ActiveLearning  what a learner actually does
 *   7. Invitation        FinalCta        one clear next action
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
 * There is no blocking preloader. The full-screen brand curtain used to cover
 * the page for the first ~1.6 seconds. It delayed the hero and the navigation
 * for every first-time visitor, on every connection, for a decoration - which
 * is the wrong trade for a foundation that serves low-bandwidth and rural
 * learners. The brand is stated in the hero itself. The `Preloader` component
 * is still in the codebase for a future use that is not on the critical path;
 * it is simply not mounted on the homepage.
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
      <main id="main-content">
        <SplitHero />
        <FourPillars />
        <section
          id="curriculum-spotlight"
          className="scene"
          aria-labelledby="spotlight-heading"
        >
          <div className="container">
            <div
              style={{ textAlign: "center", marginBottom: "var(--space-12)" }}
            >
              <span className="dark-label">Curriculum</span>
              <h2 id="spotlight-heading" className="dark-heading">
                The pathway at a glance
              </h2>
              <p className="dark-desc">
                Every module moves from first principles through guided practice
                into independent work — and only then into assessment.
              </p>
            </div>
            <div className="home-grid-2" style={{ gap: "var(--space-10)" }}>
              <CurriculumGrid limit={6} cols="grid-cols-1 md:grid-cols-2" />
              <InfographicCard
                spec={PATHWAY_SPEC}
                heading="Lesson anatomy"
                description="Each published lesson moves through the same sequence of block kinds."
                size="md"
              />
            </div>
          </div>
        </section>
        <PublicStoryShell />
        <WhereWeStand />
        <LearningJourney />
        <ActiveLearning />
        <SmallTiles />
        <QuoteBand />
        <FinalCta />
      </main>
    </div>
  );
}
