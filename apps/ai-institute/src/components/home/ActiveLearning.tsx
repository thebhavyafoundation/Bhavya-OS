import Link from "next/link";
import { getAllLessons } from "@/lib/curriculum/lessons";
import styles from "./journeyScenes.module.css";

/**
 * Scene 4 — Active learning.
 *
 * The scene answers the question a visitor is really holding after reading
 * the journey: "what does a lesson actually feel like?"
 *
 * Rather than describing a lesson from the outside, this reads a real
 * published lesson out of the registry and names the block kinds it is
 * genuinely composed of. If the corpus changes, this scene changes with it.
 * It cannot drift into describing a lesson that does not exist, because it is
 * reading one.
 *
 * No animation carries meaning here. The sequence is a plain ordered list,
 * so it survives reduced motion, failed JavaScript, and screen readers equally
 * — the motion version only reveals the same list progressively.
 */

const BLOCK_MEANING: Record<BlockKind, { label: string; blurb: string }> = {
  prose: {
    label: "Reading",
    blurb:
      "The idea in words, with the vocabulary a learner will need to discuss it.",
  },
  visual: {
    label: "Seeing",
    blurb:
      "A diagram that carries the structure, so the relationship does not have to be described twice.",
  },
  interactive: {
    label: "Trying",
    blurb:
      "A task with no wrong answer to read off a page — the learner makes a decision and sees the effect.",
  },
  quiz: {
    label: "Checking",
    blurb:
      "A few questions with feedback for every option, including the ones a learner picks by mistake.",
  },
  experiment: {
    label: "Building",
    blurb:
      "A worked procedure with materials and steps, run in the learner's own environment.",
  },
  project: {
    label: "Making",
    blurb:
      "An open brief with a real deliverable, so the work has somewhere to go beyond the lesson.",
  },
};

const ORDER = [
  "prose",
  "visual",
  "interactive",
  "quiz",
  "experiment",
  "project",
] as const;

/** The block kinds this scene can narrate, in the order a lesson uses them. */
type BlockKind = (typeof ORDER)[number];

export function ActiveLearning() {
  const lessons = getAllLessons();
  // Prefer a lesson that is rich enough to show the anatomy. The first
  // published lesson in each module carries the full block sequence.
  const sample =
    lessons.find((lesson) => lesson.blocks.length >= 4) ?? lessons[0];

  if (!sample) return null;

  const present = new Set(sample.blocks.map((block) => block.kind));
  const sequence = ORDER.filter((kind) => present.has(kind)).map((kind) => ({
    kind,
    ...BLOCK_MEANING[kind],
  }));

  return (
    <section
      id="inside-a-lesson"
      className={styles.scene}
      aria-labelledby="inside-heading"
    >
      <div className={styles.narrow}>
        <p className={styles.eyebrow}>Inside a lesson</p>
        <h2 id="inside-heading" className={styles.title}>
          A lesson is a sequence, not a wall of text.
        </h2>
        <p className={styles.lede}>
          Every published lesson moves through the same kinds of step. Here is
          what <em>“{sample.title}”</em> is actually made of.
        </p>

        <ol className={styles.sequence}>
          {sequence.map((step, index) => (
            <li key={step.kind}>
              <span className={styles.stepNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.stepLabel}>{step.label}</h3>
                <p className={styles.stepBlurb}>{step.blurb}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className={styles.footnote}>
          Read from the lesson registry, not written for this page — the list
          above is exactly what that lesson contains.
        </p>

        <div className={styles.actions}>
          <Link
            href={`/curriculum/modules/${sample.moduleId}/lessons/${sample.id}`}
            className="btn btn-primary"
          >
            Read this lesson
          </Link>
          <Link href="/curriculum" className="btn btn-secondary">
            Browse the curriculum
          </Link>
        </div>
      </div>
    </section>
  );
}
