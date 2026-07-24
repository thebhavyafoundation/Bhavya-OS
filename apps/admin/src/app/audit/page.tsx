import { AuditLog } from "../../components/AuditLog";

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>
          Audit Log
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--admin-text-secondary)" }}>
          Timeline of platform events with search and filtering
        </p>
      </div>
      <AuditLog />
    </div>
  );
}
