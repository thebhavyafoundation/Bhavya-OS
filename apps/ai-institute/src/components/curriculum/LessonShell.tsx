import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./lessonShell.module.css";

/**
 * LessonShell — the calm, predictable outer frame for a lesson.
 *
 * Tier C rules this component is built to enforce:
 * - No scroll-linked motion, no pinning, no autoplay. The shell animates
 *   nothing on scroll.
 * - Body measure is capped so a line of lesson prose stays readable.
 * - Position in the sequence is always stated: breadcrumb, then progress,
 *   then title. A learner must never wonder where they are.
 * - Progress is expressed as a real bar plus real text, because a bar alone
 *   is invisible to a screen reader and text alone is easy to miss.
 * - Previous/next are symmetric and both keyboard-reachable.
 * - Server component. It ships no client JavaScript, which is the single
 *   largest performance lever a lesson page has.
 */
export interface LessonShellProps {
  /** Breadcrumb trail, root first. The final entry is the current page. */
  crumbs: { label: string; href?: string }[];
  /** Position and total, both 1-based. */
  index: number;
  total: number;
  /** Age band or audience line, e.g. "Ages 11–14". */
  audience?: string;
  title: string;
  /** One sentence framing what the learner will be able to do. */
  lede?: string;
  /** The lesson body: prose blocks, interactions, diagrams. */
  children: ReactNode;
  /** Lesson-to-lesson navigation. Either edge may be absent. */
  previous?: { title: string; href: string };
  next?: { title: string; href: string };
  /** Rendered between the body and the navigation, e.g. standards. */
  footer?: ReactNode;
}

export function LessonShell({
  crumbs,
  index,
  total,
  audience,
  title,
  lede,
  children,
  previous,
  next,
  footer,
}: LessonShellProps) {
  const safeTotal = total > 0 ? total : 1;
  const percent = Math.round((Math.min(index, safeTotal) / safeTotal) * 100);
  const current = crumbs[crumbs.length - 1];

  return (
    <div id="main-content" className={styles.shell}>
      <nav aria-label="Breadcrumb" className={styles.crumbs}>
        <ol>
          {crumbs.map((crumb, position) => {
            const isLast = position === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${position}`}>
                {crumb.href && !isLast ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined}>
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <header className={styles.header}>
        <div className={styles.positionRow}>
          <p className={styles.position}>
            Lesson {index} of {total}
            {audience ? ` · ${audience}` : ""}
          </p>
          <p className={styles.percentText}>{percent}%</p>
        </div>

        {/*
          Decorative: the same information is already in the position row
          above, which is what a screen reader reads. aria-hidden prevents
          the bar from being announced twice.
        */}
        <div aria-hidden="true" className={styles.track} role="presentation">
          <div className={styles.fill} style={{ width: `${percent}%` }} />
        </div>

        <h1 className={styles.title}>{title}</h1>
        {lede ? <p className={styles.lede}>{lede}</p> : null}
      </header>

      <div className={styles.body}>{children}</div>

      {footer ? <section className={styles.footer}>{footer}</section> : null}

      <nav aria-label="Lesson navigation" className={styles.nav}>
        <div className={styles.navSide}>
          {previous ? (
            <Link href={previous.href} className={styles.navLink} rel="prev">
              <span className={styles.navDirection}>Previous</span>
              <span className={styles.navTitle}>{previous.title}</span>
            </Link>
          ) : null}
        </div>
        <div className={`${styles.navSide} ${styles.navEnd}`}>
          {next ? (
            <Link
              href={next.href}
              className={`${styles.navLink} ${styles.navLinkPrimary}`}
              rel="next"
            >
              <span className={styles.navDirection}>Next</span>
              <span className={styles.navTitle}>{next.title}</span>
            </Link>
          ) : null}
        </div>
      </nav>

      {current?.href ? (
        <Link href={current.href} className={styles.back}>
          Back to {current.label}
        </Link>
      ) : null}
    </div>
  );
}
