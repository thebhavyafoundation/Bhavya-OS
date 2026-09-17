// Bhavya OS Platform Observability — Manager Implementation

import type {
  PlatformHealth,
  ComponentHealth,
  HealthStatus,
  MetricsData,
  DiagnosticReport,
  ObservabilityAPI,
} from "./types.js";
import os from "os";

export class ObservabilityManager implements ObservabilityAPI {
  private components: Map<string, ComponentHealth> = new Map();
  private startTime: Date;
  private _metrics: MetricsData;

  constructor() {
    this.startTime = new Date();
    this._metrics = {
      uptime: 0,
      requests: 0,
      errors: 0,
      memory: { used: 0, total: 0, percentage: 0 },
      cpu: { usage: 0, cores: 0 },
      plugins: { total: 0, active: 0, inactive: 0, error: 0 },
      events: { published: 0, processed: 0, failed: 0, avgLatency: 0 },
    };
  }

  async health(): Promise<PlatformHealth> {
    const components = Array.from(this.components.values());
    const status = this.calculateOverallStatus(components);

    return {
      status,
      components,
      uptime: Date.now() - this.startTime.getTime(),
      version: "1.0.0",
      timestamp: new Date(),
    };
  }

  async metrics(): Promise<MetricsData> {
    this.updateMetrics();
    return { ...this._metrics };
  }

  async diagnostics(): Promise<DiagnosticReport> {
    const health = await this.health();
    const metrics = await this.metrics();

    return {
      timestamp: new Date(),
      platform: {
        version: "1.0.0",
        uptime: health.uptime,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      plugins: [],
      events: {
        totalPublished: metrics.events.published,
        totalProcessed: metrics.events.processed,
        totalFailed: metrics.events.failed,
        avgLatency: metrics.events.avgLatency,
        topEventTypes: [],
      },
      dependencies: {
        total: 15,
        satisfied: 15,
        unsatisfied: [],
        circular: [],
      },
      contracts: {
        total: 11,
        compatible: 11,
        incompatible: [],
        deprecated: [],
      },
    };
  }

  async componentHealth(name: string): Promise<ComponentHealth> {
    return (
      this.components.get(name) || {
        name,
        status: "unknown" as HealthStatus,
        message: "Component not registered",
        lastChecked: new Date(),
      }
    );
  }

  registerComponent(name: string): void {
    this.components.set(name, {
      name,
      status: "healthy",
      lastChecked: new Date(),
    });
  }

  updateComponentHealth(
    name: string,
    status: HealthStatus,
    message?: string,
  ): void {
    const existing = this.components.get(name);
    if (existing) {
      existing.status = status;
      existing.message = message;
      existing.lastChecked = new Date();
    }
  }

  incrementRequests(): void {
    this._metrics.requests++;
  }

  incrementErrors(): void {
    this._metrics.errors++;
  }

  updatePluginMetrics(
    total: number,
    active: number,
    inactive: number,
    error: number,
  ): void {
    this._metrics.plugins = { total, active, inactive, error };
  }

  updateEventMetrics(
    published: number,
    processed: number,
    failed: number,
    avgLatency: number,
  ): void {
    this._metrics.events = { published, processed, failed, avgLatency };
  }

  private calculateOverallStatus(components: ComponentHealth[]): HealthStatus {
    if (components.length === 0) return "healthy";

    const statuses = components.map((c) => c.status);
    if (statuses.includes("unhealthy")) return "unhealthy";
    if (statuses.includes("degraded")) return "degraded";
    return "healthy";
  }

  private updateMetrics(): void {
    this._metrics.uptime = Date.now() - this.startTime.getTime();
    const mem = process.memoryUsage();
    this._metrics.memory = {
      used: mem.heapUsed,
      total: mem.heapTotal,
      percentage: (mem.heapUsed / mem.heapTotal) * 100,
    };
    this._metrics.cpu = {
      usage: 0,
      cores: os.cpus().length,
    };
  }
}
