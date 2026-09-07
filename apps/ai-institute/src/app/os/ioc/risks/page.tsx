import { requirePolicy } from "@/lib/require-role";
import { getIOCRisks } from "@/lib/os-data";
import { AlertTriangle, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Risk Register | Bhavya Foundation",
  description: "Institute of Compliance — risk management",
};

export default async function IOCRisksPage() {
  await requirePolicy("/os/ioc");
  const risks = getIOCRisks();

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
          Risk Register
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          {risks.length} risks tracked ·{" "}
          {risks.filter((r) => r.status === "open").length} open
        </p>
      </div>

      <div className="space-y-3">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="bg-bg-secondary border border-border-primary rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle
                    className={`w-4 h-4 flex-shrink-0 ${
                      risk.severity === "critical"
                        ? "text-red-400"
                        : risk.severity === "high"
                          ? "text-orange-400"
                          : "text-accent-gold"
                    }`}
                  />
                  <span className="text-sm font-semibold text-text-primary">
                    {risk.title}
                  </span>
                </div>
                {risk.description && (
                  <p className="text-xs text-text-muted ml-6">
                    {risk.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-text-muted">
                  {risk.category}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    risk.severity === "critical"
                      ? "bg-red-500/10 text-red-400"
                      : risk.severity === "high"
                        ? "bg-orange-500/10 text-orange-400"
                        : risk.severity === "medium"
                          ? "bg-accent-gold/10 text-accent-gold"
                          : "bg-text-muted/10 text-text-muted"
                  }`}
                >
                  {risk.severity}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    risk.status === "open"
                      ? "bg-red-500/10 text-red-400"
                      : risk.status === "mitigated"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-text-muted/10 text-text-muted"
                  }`}
                >
                  {risk.status}
                </span>
              </div>
            </div>
            {risk.mitigation && (
              <div className="mt-2 ml-6 flex items-start gap-2">
                <Shield className="w-3 h-3 text-accent-gold mt-0.5 flex-shrink-0" />
                <span className="text-xs text-text-secondary">
                  {risk.mitigation}
                </span>
              </div>
            )}
            {risk.owner && (
              <p className="text-[10px] text-text-muted ml-6 mt-1">
                Owner: {risk.owner}
              </p>
            )}
          </div>
        ))}
        {risks.length === 0 && (
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
            <p className="text-sm text-text-muted">No risks registered</p>
          </div>
        )}
      </div>
    </div>
  );
}
