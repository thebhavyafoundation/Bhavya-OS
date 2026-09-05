"use client";

import { useState, useEffect } from "react";
import { Server, CheckCircle, AlertCircle } from "lucide-react";

interface HealthStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  port?: number;
  latency?: number;
}

export function SystemHealth() {
  const [services, setServices] = useState<HealthStatus[]>([]);

  useEffect(() => {
    const defaultServices: HealthStatus[] = [
      { name: "Website", status: "healthy", port: 3000 },
      { name: "Docs", status: "healthy", port: 3002 },
      { name: "Design System", status: "healthy", port: 3001 },
      { name: "Admin", status: "healthy", port: 3003 },
      { name: "Mission Runtime", status: "healthy", port: 4000 },
      { name: "Nginx", status: "healthy", port: 80 },
    ];
    setServices(defaultServices);
  }, []);

  const getStatusIcon = (status: HealthStatus["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "degraded":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: HealthStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-400";
      case "degraded":
        return "text-amber-400";
      default:
        return "text-red-400";
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border-primary">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-accent-gold" />
          <span className="text-sm font-semibold text-text-primary">System Health</span>
        </div>
      </div>
      <div className="divide-y divide-border-primary">
        {services.map((service) => (
          <div key={service.name} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(service.status)}
              <span className="text-sm text-text-primary">{service.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted font-mono">{service.latency}ms</span>
              <span className={`text-xs font-medium ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
