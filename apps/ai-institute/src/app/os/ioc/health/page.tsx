import { requirePolicy } from "@/lib/require-role";
import { getIOCHealth } from "@/lib/os-data";
import { Server, Activity, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "System Health | Bhavya Foundation",
  description: "Institute of Compliance — system health monitoring",
};

export default async function IOCHealthPage() {
  await requirePolicy("/os/ioc");
  const health = getIOCHealth();

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
          System Health
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          {health.length} systems monitored
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {health.map((sys) => (
          <div
            key={sys.system}
            className="bg-bg-secondary border border-border-primary rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <Server
                className={`w-5 h-5 ${
                  sys.status === "healthy"
                    ? "text-green-400"
                    : sys.status === "degraded"
                      ? "text-orange-400"
                      : "text-red-400"
                }`}
              />
              <div>
                <span className="text-sm font-semibold text-text-primary">
                  {sys.system}
                </span>
                <p className="text-[10px] text-text-muted">
                  Last checked: {new Date(sys.last_checked).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Status</span>
                <span
                  className={`text-xs font-medium ${
                    sys.status === "healthy"
                      ? "text-green-400"
                      : sys.status === "degraded"
                        ? "text-orange-400"
                        : "text-red-400"
                  }`}
                >
                  {sys.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">API</span>
                {sys.api_available ? (
                  <Wifi className="w-3 h-3 text-green-400" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-400" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Dashboard</span>
                {sys.dashboard_available ? (
                  <Wifi className="w-3 h-3 text-green-400" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-400" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Events Produced</span>
                <span className="text-xs text-text-primary">
                  {sys.events_produced}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Events Consumed</span>
                <span className="text-xs text-text-primary">
                  {sys.events_consumed}
                </span>
              </div>
            </div>
          </div>
        ))}
        {health.length === 0 && (
          <div className="col-span-full bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
            <p className="text-sm text-text-muted">
              No system health data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
