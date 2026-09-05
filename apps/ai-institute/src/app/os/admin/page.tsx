import { requirePolicy } from "@/lib/require-role";
import { OverviewCards } from "./components/OverviewCards";
import { ActivityFeed } from "./components/ActivityFeed";
import { SystemHealth } from "./components/SystemHealth";
import { ContentList } from "./components/ContentList";
import { ReleaseList } from "./components/ReleaseList";

export const metadata = {
  title: "Admin Dashboard | Bhavya Foundation",
  description: "Platform overview and operations status",
};

export default async function AdminPage() {
  // Server-side gate: only the admin role may view this workspace.
  // Session presence alone (middleware) is not sufficient.
  await requirePolicy("/os/admin");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Platform overview and operations status
        </p>
      </div>
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ActivityFeed />
        <SystemHealth />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Recent Content
        </h2>
        <ContentList />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Recent Releases
        </h2>
        <ReleaseList />
      </div>
    </div>
  );
}
