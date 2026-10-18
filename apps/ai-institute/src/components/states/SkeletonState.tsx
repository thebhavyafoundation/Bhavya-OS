/**
 * SkeletonState — reserved space while data is in flight.
 *
 * Rules this component enforces so callers cannot get it wrong:
 * - Reserves real dimensions so arriving content does not shift the layout.
 * - The shimmer is suppressed entirely under prefers-reduced-motion; the
 *   skeleton stays as a static, still placeholder.
 * - The whole block is aria-hidden and paired with a visible-to-screen-
 *   readers "Loading" label supplied by the caller, so a sighted user gets
 *   a skeleton and a non-sighted user gets a status announcement rather
 *   than a meaningless empty region.
 */
export interface SkeletonStateProps {
  /** Number of placeholder rows to reserve. */
  rows?: number;
  /** Reserve a media block above the rows. */
  withMedia?: boolean;
  /**
   * Text announced to assistive technology while the skeleton is visible.
   * Defaults to "Loading". Pass something specific when the content type
   * is knowable, e.g. "Loading curriculum modules".
   */
  label?: string;
  className?: string;
}

function Shimmer({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded bg-bg-tertiary motion-safe:animate-pulse ${className ?? ""}`.trim()}
    />
  );
}

export function SkeletonState({
  rows = 3,
  withMedia = false,
  label = "Loading",
  className = "",
}: SkeletonStateProps) {
  return (
    <div
      className={`flex flex-col gap-4 ${className}`.trim()}
      style={{ minHeight: withMedia ? "18rem" : "12rem" }}
    >
      <span className="sr-only" role="status" aria-live="polite">
        {label}
      </span>
      <div aria-hidden="true" className="flex flex-col gap-4">
        {withMedia ? <Shimmer className="h-40 w-full rounded-lg" /> : null}
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Shimmer
              className="h-4"
              // Ragged right edge reads as content, not as a loading bar.
            />
            <Shimmer className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
