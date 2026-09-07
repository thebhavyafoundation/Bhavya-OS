import { requirePolicy } from "@/lib/require-role";
import { getIOCObjectives } from "@/lib/os-data";
import { Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "OKRs | Bhavya Foundation",
  description: "Institute of Compliance — objectives and key results",
};

export default async function IOCOKRPage() {
  await requirePolicy("/os/ioc");
  const objectives = getIOCObjectives();

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
          Objectives & Key Results
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          {objectives.length} objectives tracked
        </p>
      </div>

      <div className="space-y-4">
        {objectives.map((obj) => {
          let keyResults: string[] = [];
          try {
            keyResults = JSON.parse(obj.key_results || "[]");
          } catch {
            /* ignore */
          }

          return (
            <div
              key={obj.id}
              className="bg-bg-secondary border border-border-primary rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-accent-gold flex-shrink-0" />
                    <span className="text-sm font-semibold text-text-primary">
                      {obj.title}
                    </span>
                  </div>
                  {obj.description && (
                    <p className="text-xs text-text-muted ml-6">
                      {obj.description}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      obj.status === "in_progress"
                        ? "bg-accent-gold/10 text-accent-gold"
                        : obj.status === "completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    {obj.status}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-text-muted">Progress</span>
                  <span className="text-[11px] text-text-primary">
                    {obj.progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-gold rounded-full transition-all"
                    style={{ width: `${Math.min(100, obj.progress)}%` }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-[11px] text-text-muted">
                {obj.department && <span>{obj.department}</span>}
                {obj.quarter && <span>{obj.quarter}</span>}
              </div>

              {/* Key results */}
              {keyResults.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border-primary">
                  <span className="text-[11px] text-text-tertiary mb-2 block">
                    Key Results
                  </span>
                  <ul className="space-y-1">
                    {keyResults.map((kr, i) => (
                      <li
                        key={i}
                        className="text-xs text-text-secondary flex items-start gap-2"
                      >
                        <TrendingUp className="w-3 h-3 text-accent-gold mt-0.5 flex-shrink-0" />
                        {typeof kr === "string" ? kr : JSON.stringify(kr)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
        {objectives.length === 0 && (
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
            <p className="text-sm text-text-muted">No objectives defined yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
