import { OverviewCards } from "../components/OverviewCards";
import { ActivityFeed } from "../components/ActivityFeed";
import { SystemHealth } from "../components/SystemHealth";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>
          Dashboard
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--admin-text-secondary)" }}>
          Platform overview and operations status
        </p>
      </div>
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <SystemHealth />
      </div>
    </div>
  );
}
