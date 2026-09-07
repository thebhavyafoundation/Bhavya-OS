import { requirePolicy } from "@/lib/require-role";
import {
  getIOCData,
  getIOCKpis,
  getIOCAlerts,
  getIOCHealth,
} from "@/lib/os-data";
import {
  BarChart3,
  AlertTriangle,
  Activity,
  Server,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "IOC Dashboard | Bhavya Foundation",
  description: "Institute of Compliance — operational dashboard",
};

export default async function IOCDashboardPage() {
  await requirePolicy("/os/ioc");
  const [data, kpis, alerts, health] = [
    getIOCData(),
    getIOCKpis(),
    getIOCAlerts(),
    getIOCHealth(),
  ];

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
          IOC Dashboard
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Operational overview — OKRs, risks, actions, system health
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <span className="text-xs text-text-tertiary">Active OKRs</span>
          <div className="text-2xl font-bold text-text-primary mt-1">
            {data.activeOKRs}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <span className="text-xs text-text-tertiary">Open Risks</span>
          <div className="text-2xl font-bold text-text-primary mt-1">
            {data.openRisks}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <span className="text-xs text-text-tertiary">Actions This Week</span>
          <div className="text-2xl font-bold text-text-primary mt-1">
            {data.actionsThisWeek}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <span className="text-xs text-text-tertiary">Pending Reviews</span>
          <div className="text-2xl font-bold text-text-primary mt-1">
            {data.pendingReviews}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPIs */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold text-text-primary">
                Key Performance Indicators
              </span>
            </div>
          </div>
          <div className="divide-y divide-border-primary">
            {kpis.slice(0, 8).map((kpi) => (
              <div key={kpi.id} className="px-4 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-sm text-text-primary">{kpi.name}</span>
                  <p className="text-[11px] text-text-muted">
                    {kpi.category} · {kpi.source}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-text-primary">
                    {kpi.value}
                    {kpi.unit}
                  </span>
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingUp
                      className={`w-3 h-3 ${
                        kpi.trend === "up"
                          ? "text-green-400"
                          : kpi.trend === "down"
                            ? "text-red-400"
                            : "text-text-muted"
                      }`}
                    />
                    <span className="text-[10px] text-text-muted">
                      {kpi.change_percent > 0 ? "+" : ""}
                      {kpi.change_percent}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {kpis.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-sm text-text-muted">No KPIs recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold text-text-primary">
                Active Alerts
              </span>
            </div>
          </div>
          <div className="divide-y divide-border-primary">
            {alerts.slice(0, 8).map((alert) => (
              <div key={alert.id} className="px-4 py-2.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm text-text-primary">
                    {alert.title}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      alert.severity === "critical"
                        ? "bg-red-500/10 text-red-400"
                        : alert.severity === "warning"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  {alert.source} · {alert.message}
                </p>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-sm text-text-muted">No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Health */}
      {health.length > 0 && (
        <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold text-text-primary">
                System Health
              </span>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {health.map((sys) => (
              <div
                key={sys.system}
                className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    sys.status === "healthy"
                      ? "bg-green-400"
                      : sys.status === "degraded"
                        ? "bg-orange-400"
                        : "bg-red-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-text-primary">{sys.system}</span>
                  <p className="text-[10px] text-text-muted">
                    {sys.events_produced} produced · {sys.events_consumed}{" "}
                    consumed
                  </p>
                </div>
                <span className="text-[10px] text-text-muted flex-shrink-0">
                  {sys.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
