import type { LessonDetail } from "@/types/curriculum";

/**
 * LessonProvenance — what the lesson is built on, and how far it has been
 * checked.
 *
 * Two things a learner is entitled to see:
 *
 * 1. **Sources, with attribution.** The citation is printed in full and the
 *    attribution is kept beside it rather than being reduced to a link or a
 *    footnote marker. The attribution is the author-year lead of the citation
 *    itself, so the two can never drift apart.
 *
 * 2. **Review status, stated honestly.** "pending" is not a failure and not
 *    a decoration — it is the accurate description of a lesson no human
 *    subject-matter reviewer has signed off yet. The page says so in words
 *    rather than leaving the learner to guess what "pending" means.
 */
export interface LessonProvenanceProps {
  detail: LessonDetail;
}

function remainderOf(citation: string, attribution: string): string {
  if (!citation.startsWith(attribution)) return citation;
  return citation.slice(attribution.length).replace(/^[.\s]+/, "");
}

export function LessonProvenance({ detail }: LessonProvenanceProps) {
  return (
    <section className="ai-section" aria-labelledby="lesson-sources-heading">
      <h2 id="lesson-sources-heading" className="ai-section-title">
        Sources and review
      </h2>

      {detail.sources.length > 0 ? (
        <ol className="ai-steps">
          {detail.sources.map((source, index) => (
            <li key={`${source.attribution}-${index}`}>
              <strong>{source.attribution}</strong>
              {remainderOf(source.citation, source.attribution)
                ? ` — ${remainderOf(source.citation, source.attribution)}`
                : ""}
            </li>
          ))}
        </ol>
      ) : (
        <p className="ai-prose">No sources are recorded for this lesson yet.</p>
      )}

      <div className="ai-chip-row">
        <span className="ai-chip-label">Review</span>
        <span className="ai-chip">content: {detail.review.content}</span>
        <span className="ai-chip">subject: {detail.review.subject}</span>
        <span className="ai-chip">
          accessibility: {detail.review.accessibility}
        </span>
        {detail.review.reviewedOn ? (
          <span className="ai-chip">
            last reviewed: {detail.review.reviewedOn}
          </span>
        ) : null}
      </div>

      <p className="ai-prose">
        A lesson marked <strong>pending</strong> has not yet been signed off by
        a human subject-matter reviewer. It is published for learners to read,
        and it says so here rather than implying a review that has not happened.
      </p>
    </section>
  );
}
