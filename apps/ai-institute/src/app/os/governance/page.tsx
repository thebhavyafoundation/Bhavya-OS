import { getGovernanceDocs, getPolicies } from "@/lib/os-data";
import { requirePolicy } from "@/lib/require-role";
import { Scale, FileText } from "lucide-react";
import { EmptyState } from "@bhavya/platform-ui";

export const dynamic = "force-dynamic";

export default async function GovernancePage() {
  await requirePolicy("/os/governance");
  const [governanceDocs, policies] = await Promise.all([
    getGovernanceDocs(),
    getPolicies(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Governance
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          {governanceDocs.length} governance documents · {policies.length}{" "}
          policies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Governance Documents */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-gold" />
            Governance Documents
          </h2>
          <div className="flex flex-col gap-3">
            {governanceDocs.length > 0 ? (
              governanceDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="glass rounded-xl p-5 hover:border-border-secondary transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {doc.title}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        {doc.type}
                        {doc.ratified ? ` · Ratified ${doc.ratified}` : ""}
                        {doc.owner ? ` · ${doc.owner}` : ""}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                        doc.status === "published"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-amber-900/30 text-amber-400"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-3">
                    {doc.summary}
                  </p>
                  {doc.sections && doc.sections.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {doc.sections.slice(0, 4).map((section) => (
                        <span
                          key={section.heading}
                          className="text-[10px] px-2 py-0.5 rounded bg-bg-tertiary text-text-tertiary border border-border-primary"
                        >
                          {section.heading}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <EmptyState title="No governance documents found" />
            )}
          </div>
        </div>

        {/* Policies */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-gold" />
            Policies
          </h2>
          <div className="flex flex-col gap-3">
            {policies.length > 0 ? (
              policies.map((pol) => (
                <div
                  key={pol.id}
                  className="glass rounded-xl p-5 hover:border-border-secondary transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {pol.icon && <span className="mr-1.5">{pol.icon}</span>}
                        {pol.title}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                        pol.status === "published"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-amber-900/30 text-amber-400"
                      }`}
                    >
                      {pol.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-3">
                    {pol.description}
                  </p>
                  {pol.sections && pol.sections.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {pol.sections.slice(0, 4).map((section) => (
                        <span
                          key={section.heading}
                          className="text-[10px] px-2 py-0.5 rounded bg-bg-tertiary text-text-tertiary border border-border-primary"
                        >
                          {section.heading}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <EmptyState title="No policies found" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
