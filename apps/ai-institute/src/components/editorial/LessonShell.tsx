import Link from "next/link";
import styles from "./LessonShell.module.css";

interface LessonShellProps {
  eyebrow: string;
  title: string;
  /** Module mission, shown as the framing sentence. */
  mission?: string;
  /** Module objectives — what this lesson works toward. */
  objectives?: string[];
  /** Real duration from the lesson registry. */
  durationMin?: number;
  standards?: {
    id: string;
    concept: string;
    source: string;
    gradeBand: string;
  }[];
  previous?: { href: string; title: string };
  next?: { href: string; title: string; isModuleEnd?: boolean };
  /** Sibling lessons for the progress rail. */
  siblings?: { href: string; title: string; current: boolean }[];
  children: React.ReactNode;
}

/**
 * Shared frame for a lesson: where you are, what you are working toward, the
 * lesson body, and a clear way onward.
 *
 * Kept as a server component with no client state. Nothing here animates, so
 * there is nothing to pause, and the whole shell costs zero client JavaScript.
 */
export function LessonShell({
  eyebrow,
  title,
  mission,
  objectives,
  durationMin,
  standards = [],
  previous,
  next,
  siblings,
  children,
}: LessonShellProps) {
  return (
    <article className={styles.lesson}>
      <header className={styles.head}>
        <p className="ai-eyebrow">{eyebrow}</p>
        <h1 className="ai-page-title">{title}</h1>
        {mission ? <p className={styles.mission}>{mission}</p> : null}
        {typeof durationMin === "number" ? (
          <p className={styles.duration}>
            <span className={styles.durationValue}>{durationMin}</span> minutes
          </p>
        ) : null}
      </header>

      {objectives && objectives.length > 0 ? (
        <section
          className={styles.outcomes}
          aria-labelledby="bhv-outcomes-heading"
        >
          <h2 id="bhv-outcomes-heading" className={styles.outcomesHeading}>
            What you will be able to do
          </h2>
          <ul className={styles.outcomesList}>
            {objectives.map((objective) => (
              <li key={objective} className={styles.outcome}>
                <span className={styles.outcomeMark} aria-hidden="true" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {siblings && siblings.length > 1 ? (
        <nav className={styles.rail} aria-label="Lessons in this module">
          <ol className={styles.railList}>
            {siblings.map((sibling) => (
              <li key={sibling.href}>
                {sibling.current ? (
                  <span
                    className={`${styles.railItem} ${styles.railItemCurrent}`}
                    aria-current="step"
                  >
                    {sibling.title}
                  </span>
                ) : (
                  <Link className={styles.railItem} href={sibling.href}>
                    {sibling.title}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className={styles.body}>{children}</div>

      {standards.length > 0 ? (
        <section className="ai-section" aria-labelledby="bhv-standards-heading">
          <h2 id="bhv-standards-heading" className="ai-section-title">
            Standards this lesson works toward
          </h2>
          <ul className="ai-chip-row">
            {standards.map((standard) => (
              <li key={standard.id}>
                <span
                  className="ai-chip"
                  title={`${standard.source} · ${standard.gradeBand}`}
                >
                  {standard.concept}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className={styles.nav} aria-label="Lesson navigation">
        <div>
          {previous ? (
            <Link href={previous.href} className="ai-nav-btn" rel="prev">
              <span className={styles.navDir}>Previous</span>
              <span className={styles.navTitle}>{previous.title}</span>
            </Link>
          ) : null}
        </div>
        <div>
          {next ? (
            <Link
              href={next.href}
              className="ai-nav-btn ai-nav-btn-primary"
              rel="next"
            >
              <span className={styles.navDir}>
                {next.isModuleEnd ? "Finish this module" : "Next lesson"}
              </span>
              <span className={styles.navTitle}>{next.title}</span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
