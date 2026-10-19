import Link from "next/link";
import { DiagramBlock } from "@/components/editorial/DiagramBlock";
import { TRACKS, getAllModules, getTotalModules } from "@/data/curriculum";
import { getAllLessons, getModuleLessonCounts } from "@/lib/curriculum/lessons";
import styles from "./journeyScenes.module.css";

/**
 * Scene 2 — The learning journey.
 *
 * Server component, and it has to be: every number on this scene is read
 * from the live registries at request time. Hard-coding "86 modules" into
 * marketing copy is exactly how a curriculum page starts lying the day a
 * module is added or retired.
 *
 * What this scene is for: a visitor who has just read four constitutional
 * mandates has not yet been told what the Academy actually *is*. This is the
 * scene that answers "what would I do here, and how does it build up?".
 *
 * The diagram is the authored `curriculum-learning-pathway`, surfaced through
 * the manifest-driven `DiagramBlock`, so its title, alt text and source come
 * from `content/diagrams/manifests/` rather than being restated here.
 *
 * Honesty note: published-lesson coverage is stated as a fact rather than
 * hidden. If only a small number of modules have lessons today, the page says
 * so, and says where to start. That is also why the primary action is "See the
 * pathway" rather than "Start learning" — starting implies more is ready than
 * is.
 */
export function LearningJourney() {
  const modules = getAllModules();
  const moduleCount = modules.length;
  const lessonCounts = getModuleLessonCounts();
  const publishedModules = modules.filter(
    (m) => (lessonCounts.get(m.id) ?? 0) > 0,
  );
  const publishedLessons = getAllLessons().length;
  const trackCount = TRACKS.length;

  return (
    <section
      id="journey"
      className={styles.scene}
      aria-labelledby="journey-heading"
    >
      <div className={styles.split}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>The learning journey</p>
          <h2 id="journey-heading" className={styles.title}>
            Learning here is a structure, not a feed.
          </h2>
          <p className={styles.lede}>
            Bhavya Academy is organised so that difficulty rises with the
            learner rather than at random. A path moves from first principles,
            through guided practice, into independent work, and only then into
            assessment.
          </p>

          {/*
            Counts, not adjectives. Each figure is read live, and the caption
            states exactly what is being counted so a reader is never left
            guessing whether "modules" means catalogued or readable.
          */}
          <dl className={styles.facts}>
            <div>
              <dt>{moduleCount}</dt>
              <dd>modules catalogued</dd>
            </div>
            <div>
              <dt>{trackCount}</dt>
              <dd>learning tracks</dd>
            </div>
            <div>
              <dt>
                {publishedLessons}
                <span className={styles.factNote}>
                  {" "}
                  in {publishedModules.length} module
                  {publishedModules.length === 1 ? "" : "s"}
                </span>
              </dt>
              <dd>lessons published and readable today</dd>
            </div>
          </dl>

          <p className={styles.footnote}>
            The catalogued modules record their objectives, prerequisites and
            standards alignment now, so the shape of the curriculum is published
            even where the lessons are still being written. Only lessons that
            can actually be opened are counted above.
          </p>

          <div className={styles.actions}>
            <Link href="/curriculum" className="btn btn-primary">
              See the pathway
            </Link>
            {publishedModules.length > 0 ? (
              <Link
                href={`/curriculum/modules/${publishedModules[0].id}`}
                className="btn btn-secondary"
              >
                Open a published module
              </Link>
            ) : null}
          </div>
        </div>

        <div className={styles.figure}>
          <DiagramBlock id="curriculum-learning-pathway" />
        </div>
      </div>
    </section>
  );
}
