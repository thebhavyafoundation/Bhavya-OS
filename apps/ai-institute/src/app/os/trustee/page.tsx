import { Scale, FileText, Inbox } from "lucide-react";
import { requirePolicy } from "@/lib/require-role";
import { getGovernanceDocs, getPolicies } from "@/lib/os-data";
import { EmptyState } from "@bhavya/platform-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trustee Workspace | Bhavya Foundation",
  description: "Governance documents, policies, and pending approvals.",
};

export default async function TrusteeWorkspacePage() {
  const user = await requirePolicy("/os/trustee");
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
            Trustee Workspace
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          {user.name} · {governanceDocs.length} governance documents ·{" "}
          {policies.length} policies
        </p>
      </div>

      <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Inbox className="w-4 h-4 text-accent-gold" />
        Pending approvals
      </h2>
      <div className="mb-8">
        <EmptyState
          title="No pending approvals"
          description="Approval requests from programs and operations will appear here for trustee review."
        />
      </div>

      <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-accent-gold" />
        Governance library
      </h2>
      {governanceDocs.length > 0 || policies.length > 0 ? (
        <div className="flex flex-col gap-3">
          {governanceDocs.map((doc) => (
            <div key={doc.id} className="glass rounded-xl p-5">
              <div className="text-sm font-semibold text-text-primary">
                {doc.title}
              </div>
              <div className="text-xs text-text-tertiary mt-1">
                {doc.type}
                {doc.status ? ` · ${doc.status}` : ""}
              </div>
              {doc.summary && (
                <p className="text-xs text-text-secondary leading-relaxed mt-2">
                  {doc.summary}
                </p>
              )}
            </div>
          ))}
          {policies.map((pol) => (
            <div key={pol.id} className="glass rounded-xl p-5">
              <div className="text-sm font-semibold text-text-primary">
                {pol.title}
              </div>
              {pol.description && (
                <p className="text-xs text-text-secondary leading-relaxed mt-2">
                  {pol.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No governance records found" />
      )}
    </div>
  );
}
