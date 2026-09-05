import { requirePolicy } from "@/lib/require-role";
import { getDecisions } from "@/lib/os-data";
import { Brain } from "lucide-react";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DecisionRecord = Record<string, any>;

export default async function MemoryPage() {
  await requirePolicy("/os/memory");
  const decisionsMeta = await getDecisions();
  const records: DecisionRecord[] = decisionsMeta?.records || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Memory
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          Institutional decision records — {records.length} ADRs
          {decisionsMeta?.update_policy
            ? ` · Policy: ${decisionsMeta.update_policy}`
            : ""}
        </p>
      </div>

      {records.length > 0 ? (
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[100px_1fr_120px_140px_160px] gap-4 px-5 py-3 border-b border-border-primary bg-bg-primary">
            {["ID", "Title", "Status", "Author", "Timestamp"].map((h) => (
              <div
                key={h}
                className="text-[11px] text-text-muted uppercase tracking-wider"
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {records.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-[100px_1fr_120px_140px_160px] gap-4 px-5 py-3.5 border-b border-border-primary last:border-b-0 hover:bg-bg-tertiary transition-colors cursor-pointer"
            >
              <div className="text-sm font-medium text-green-400 font-mono">
                {record.payload?.adr || record.id}
              </div>
              <div className="text-sm text-text-primary">
                {record.payload?.title || record.id}
              </div>
              <div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                    record.payload?.status === "Accepted"
                      ? "bg-green-900/30 text-green-400"
                      : "bg-amber-900/30 text-amber-400"
                  }`}
                >
                  {record.payload?.status || "recorded"}
                </span>
              </div>
              <div className="text-xs text-text-tertiary">{record.author}</div>
              <div className="text-xs text-text-muted font-mono">
                {record.timestamp
                  ? record.timestamp.slice(0, 16).replace("T", " ")
                  : "—"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center text-sm text-text-muted bg-bg-secondary border border-border-primary rounded-xl">
          <Brain className="w-8 h-8 mx-auto mb-3 text-text-muted" />
          No decision records found
        </div>
      )}
    </div>
  );
}
