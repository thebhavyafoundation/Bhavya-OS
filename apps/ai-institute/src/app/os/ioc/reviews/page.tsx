import { requirePolicy } from "@/lib/require-role";
import { getIOCReviews } from "@/lib/os-data";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Weekly Reviews | Bhavya Foundation",
  description: "Institute of Compliance — weekly review summaries",
};

export default async function IOCReviewsPage() {
  await requirePolicy("/os/ioc");
  const reviews = getIOCReviews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/os/ioc"
          className="text-xs text-accent-gold hover:underline mb-2 inline-block"
        >
          _back to IOC
        </Link>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Weekly Reviews
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          {reviews.length} reviews recorded
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => {
          let summary: Record<string, string> = {};
          let metrics: string[] = [];
          let risks: string[] = [];
          let nextWeek: string[] = [];
          try {
            summary = JSON.parse(review.summary || "{}");
            metrics = JSON.parse(review.metrics || "[]");
            risks = JSON.parse(review.risks || "[]");
            nextWeek = JSON.parse(review.next_week_plan || "[]");
          } catch {
            /* ignore */
          }

          return (
            <div
              key={review.id}
              className="bg-bg-secondary border border-border-primary rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-accent-gold" />
                  <span className="text-sm font-semibold text-text-primary">
                    Week of {review.week_start} — {review.week_end}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    review.status === "completed"
                      ? "bg-green-500/10 text-green-400"
                      : review.status === "draft"
                        ? "bg-text-muted/10 text-text-muted"
                        : "bg-accent-gold/10 text-accent-gold"
                  }`}
                >
                  {review.status}
                </span>
              </div>

              {/* Summary */}
              {Object.keys(summary).length > 0 && (
                <div className="mb-3">
                  <span className="text-[11px] text-text-tertiary block mb-1">
                    Summary
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(summary).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-text-muted">{key}:</span>{" "}
                        <span className="text-text-primary">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {metrics.length > 0 && (
                <div className="mb-3">
                  <span className="text-[11px] text-text-tertiary block mb-1">
                    Metrics
                  </span>
                  <ul className="space-y-0.5">
                    {metrics.map((m, i) => (
                      <li key={i} className="text-xs text-text-secondary">
                        {typeof m === "string" ? m : JSON.stringify(m)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risks */}
              {risks.length > 0 && (
                <div className="mb-3">
                  <span className="text-[11px] text-text-tertiary block mb-1">
                    Risks
                  </span>
                  <ul className="space-y-0.5">
                    {risks.map((r, i) => (
                      <li key={i} className="text-xs text-text-secondary">
                        {typeof r === "string" ? r : JSON.stringify(r)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next week */}
              {nextWeek.length > 0 && (
                <div>
                  <span className="text-[11px] text-text-tertiary block mb-1">
                    Next Week Plan
                  </span>
                  <ul className="space-y-0.5">
                    {nextWeek.map((n, i) => (
                      <li key={i} className="text-xs text-text-secondary flex items-start gap-1">
                        <Clock className="w-3 h-3 text-accent-gold mt-0.5 flex-shrink-0" />
                        {typeof n === "string" ? n : JSON.stringify(n)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
        {reviews.length === 0 && (
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
            <p className="text-sm text-text-muted">No reviews recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
