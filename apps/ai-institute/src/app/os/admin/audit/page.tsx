import { requirePolicy } from "@/lib/require-role";
import { AuditLog } from "../components/AuditLog";

export const metadata = {
  title: "Audit Log | Bhavya Foundation",
  description: "View platform audit trail",
};

export default async function AuditPage() {
  await requirePolicy("/os/admin/audit");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Audit Log
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          View platform audit trail
        </p>
      </div>
      <AuditLog />
    </div>
  );
}
