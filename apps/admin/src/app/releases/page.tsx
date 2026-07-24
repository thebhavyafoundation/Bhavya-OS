import { ReleaseList } from "../../components/ReleaseList";

export default function ReleasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>
          Release Management
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--admin-text-secondary)" }}>
          View releases, create release notes, manage snapshots
        </p>
      </div>
      <ReleaseList />
    </div>
  );
}
