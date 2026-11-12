import Link from "next/link";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import { BAND_META } from "@/lib/curriculum/bands";
import { getModuleLessonCounts } from "@/lib/curriculum/lessons";

/**
 * WhereWeStand — the honest state of the curriculum, on the homepage.
 *
 * The homepage tells the reader what the Foundation is for. This section is
 * the other half of that promise: it says what is actually built and
 * readable today, and what is not.
 *
 * Every number here is derived at render time from the live registries. None
 * is written down by hand, so none can drift from the curriculum it
 * describes. The vocabulary is stated explicitly, because "86 modules" and
 * "5 lessons" are different things and the difference matters:
 *
 *   catalogued   — the module's outcomes and prerequisites are recorded
 *   published    — a learner can open and read its lessons today
 *   reviewed     — a human subject-matter reviewer has signed it off
 *
 * The chart is a stacked bar per age band: how much of that band is
 * catalogued, and how much of it is published. The numbers are printed next
 * to the bars, so the chart is never the only way to read it.
 */
export function WhereWeStand() {
  const lessonCounts = getModuleLessonCounts();

  const bands = BAND_META.map((band) => {
    const all = aiModules.filter((module) => module.band === band.id);
    const published = all.filter(
      (module) => (lessonCounts.get(module.id) ?? 0) > 0,
    );
    const lessons = published.reduce(
      (total, module) => total + (lessonCounts.get(module.id) ?? 0),
      0,
    );
    return {
      id: band.id,
      name: band.name,
      ages: band.ages,
      catalogued: all.length,
      publishedModules: published.length,
      lessons,
    };
  });

  const cataloguedTotal = bands.reduce((n, b) => n + b.catalogued, 0);
  const publishedModules = bands.reduce((n, b) => n + b.publishedModules, 0);
  const publishedLessons = bands.reduce((n, b) => n + b.lessons, 0);

  return (
    <section
      id="where-we-stand"
      className="scene"
      aria-labelledby="where-we-stand-heading"
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
          <span className="dark-label">Where Bhavya stands today</span>
          <h2 id="where-we-stand-heading" className="dark-heading">
            What is built, and what is still being written
          </h2>
          <p className="dark-desc">
            The curriculum is catalogued module by module. Lessons are written
            and published one set at a time. These numbers are read from the
            live registry on every page load, so they cannot drift from the
            curriculum.
          </p>
        </div>

        <div className="home-grid-2" style={{ gap: "var(--space-10)" }}>
          <div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "grid",
                gap: "var(--space-5)",
              }}
            >
              {bands.map((band) => {
                const ratio =
                  band.catalogued > 0
                    ? band.publishedModules / band.catalogued
                    : 0;
                return (
                  <li key={band.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "var(--space-3)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-primary)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      <span>
                        <strong>{band.name}</strong> · {band.ages}
                      </span>
                      <span>
                        {band.publishedModules} of {band.catalogued} modules
                        published · {band.lessons}{" "}
                        {band.lessons === 1 ? "lesson" : "lessons"}
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      style={{
                        height: "10px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-surface-3)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.round(ratio * 100)}%`,
                          height: "100%",
                          background: "var(--color-accent-gold)",
                          borderRadius: "var(--radius-full)",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <dl
              style={{
                margin: 0,
                display: "grid",
                gap: "var(--space-4)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <div
                style={{
                  borderLeft: "2px solid var(--color-accent-gold)",
                  paddingLeft: "var(--space-4)",
                }}
              >
                <dt
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Catalogued
                </dt>
                <dd style={{ margin: 0, fontSize: "var(--text-sm)" }}>
                  {cataloguedTotal} modules across {bands.length} age bands.
                  Each one records its outcomes, topics and prerequisites.
                </dd>
              </div>
              <div
                style={{
                  borderLeft: "2px solid var(--color-accent-gold)",
                  paddingLeft: "var(--space-4)",
                }}
              >
                <dt
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Published
                </dt>
                <dd style={{ margin: 0, fontSize: "var(--text-sm)" }}>
                  {publishedLessons} lessons across {publishedModules} modules,
                  readable now without an account.
                </dd>
              </div>
              <div
                style={{
                  borderLeft: "2px solid var(--color-surface-3)",
                  paddingLeft: "var(--space-4)",
                }}
              >
                <dt
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Reviewed
                </dt>
                <dd style={{ margin: 0, fontSize: "var(--text-sm)" }}>
                  Accessibility of the published lessons has been checked.
                  Subject-matter review by a human reviewer has not yet
                  happened, and each lesson says so on its own page.
                </dd>
              </div>
            </dl>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-6)",
              }}
            >
              A module with no published lessons is a real state, not a broken
              link. Nothing is hidden, and nothing is counted twice.
            </p>

            <div style={{ marginTop: "var(--space-6)" }}>
              <Link href="/curriculum" className="btn btn-gold">
                See the curriculum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
