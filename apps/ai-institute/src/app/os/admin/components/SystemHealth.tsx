"use client";

import { useState, useEffect } from "react";
import { Server, CheckCircle, AlertCircle } from "lucide-react";

interface HealthStatus {
  name: string;
  status: "healthy" | "down";
  latencyMs?: number;
  detail?: string;
}

/**
 * Live endpoint checks against real same-origin routes.
 * Each entry is measured here, in this browser, right now —
 * never a hardcoded service list.
 */
const CHECKS: { name: string; url: string }[] = [
  { name: "Admin Data API", url: "/os/admin/api/data?type=apps" },
  { name: "Academy API", url: "/api/academy/published" },
  { name: "Admin Health", url: "/os/admin/api/health" },
];

async function checkEndpoint(name: string, url: string): Promise<HealthStatus> {
  const started = performance.now();
  try {
    const res = await fetch(url, { method: "GET" });
    // Any HTTP response (including 401/403) proves the route is served.
    // Only network failure or 5xx counts as down.
    if (res.status >= 500) {
      return { name, status: "down", detail: `HTTP ${res.status}` };
    }
    return {
      name,
      status: "healthy",
      latencyMs: Math.round(performance.now() - started),
      detail: `HTTP ${res.status}`,
    };
  } catch {
    return { name, status: "down", detail: "unreachable" };
  }
}

export function SystemHealth() {
  const [services, setServices] = useState<HealthStatus[] | null>(null);

  useEffect(() => {
    const run = async () => {
      const results = await Promise.all(
        CHECKS.map((c) => checkEndpoint(c.name, c.url)),
      );
      setServices(results);
    };
    run();
  }, []);

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border-primary">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-accent-gold" />
          <span className="text-sm font-semibold text-text-primary">
            System Health
          </span>
        </div>
      </div>
      <div className="divide-y divide-border-primary">
        {services === null ? (
          <div className="px-4 py-3 text-xs text-text-muted">
            Checking endpoints…
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.name}
              className="px-4 py-3 flex items-center gap-3"
            >
              {service.status === "healthy" ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-text-primary">{service.name}</div>
                <div className="text-xs text-text-muted">
                  {service.status}
                  {service.latencyMs !== undefined
                    ? ` · ${service.latencyMs} ms`
                    : ""}
                  {service.detail ? ` · ${service.detail}` : ""}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
