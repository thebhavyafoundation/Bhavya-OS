import { getServices, getRuntime } from "@/lib/os-data";
import { Activity, Server } from "lucide-react";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default async function ObservabilityPage() {
  const [services, runtime] = await Promise.all([getServices(), getRuntime()]);

  const components: [string, AnyRecord][] = runtime?.components
    ? Object.entries(runtime.components)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Observability
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          Service health and runtime component status
        </p>
      </div>

      {/* Services */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-accent-gold" /> Services (
          {services.length})
        </h2>
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          {services.length > 0 ? (
            (services as AnyRecord[]).map((svc) => (
              <div
                key={svc.id}
                className="px-5 py-3.5 border-b border-border-primary last:border-b-0 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      svc.status === "active"
                        ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]"
                        : svc.status === "configured"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {svc.name}
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      {svc.endpoint}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium ${
                    svc.status === "active"
                      ? "bg-green-900/30 text-green-400"
                      : svc.status === "configured"
                        ? "bg-amber-900/30 text-amber-400"
                        : "bg-red-900/30 text-red-400"
                  }`}
                >
                  {svc.status}
                </span>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-sm text-text-muted">
              No services registered
            </div>
          )}
        </div>
      </div>

      {/* Runtime Components */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-accent-gold" /> Runtime Components (
          {components.length})
        </h2>
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          {components.length > 0 ? (
            components.map(([key, comp]) => (
              <div
                key={key}
                className="px-5 py-3.5 border-b border-border-primary last:border-b-0 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
                  <div>
                    <div className="text-sm font-semibold text-text-primary capitalize">
                      {key.replace(/-/g, " ")}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {comp.description}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-text-muted font-mono">
                  {comp.path}
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-sm text-text-muted">
              No runtime components
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
