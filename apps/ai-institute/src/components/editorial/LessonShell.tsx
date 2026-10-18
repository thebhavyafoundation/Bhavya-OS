import Link from "next/link";

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
    <article className="bhv-lesson">
      <header className="bhv-lesson-head">
        <p className="ai-eyebrow">{eyebrow}</p>
        <h1 className="ai-page-title">{title}</h1>
        {mission ? <p className="bhv-lesson-mission">{mission}</p> : null}
        {typeof durationMin === "number" ? (
          <p className="bhv-lesson-duration">
            <span className="bhv-duration-value">{durationMin}</span> minutes
          </p>
        ) : null}
      </header>

      {objectives && objectives.length > 0 ? (
        <section
          className="bhv-outcomes"
          aria-labelledby="bhv-outcomes-heading"
        >
          <h2 id="bhv-outcomes-heading" className="bhv-outcomes-heading">
            What you will be able to do
          </h2>
          <ul className="bhv-outcomes-list">
            {objectives.map((objective) => (
              <li key={objective} className="bhv-outcome">
                <span className="bhv-outcome-mark" aria-hidden="true" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {siblings && siblings.length > 1 ? (
        <nav className="bhv-lesson-rail" aria-label="Lessons in this module">
          <ol className="bhv-lesson-rail-list">
            {siblings.map((sibling) => (
              <li key={sibling.href}>
                {sibling.current ? (
                  <span
                    className="bhv-rail-item bhv-rail-item-current"
                    aria-current="step"
                  >
                    {sibling.title}
                  </span>
                ) : (
                  <Link className="bhv-rail-item" href={sibling.href}>
                    {sibling.title}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="bhv-lesson-body">{children}</div>

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

      <nav className="ai-lesson-nav" aria-label="Lesson navigation">
        <div>
          {previous ? (
            <Link href={previous.href} className="ai-nav-btn" rel="prev">
              <span className="ai-nav-dir">Previous</span>
              <span className="ai-nav-title">{previous.title}</span>
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
              <span className="ai-nav-dir">
                {next.isModuleEnd ? "Finish this module" : "Next lesson"}
              </span>
              <span className="ai-nav-title">{next.title}</span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
