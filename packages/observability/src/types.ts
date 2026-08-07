// Bhavya OS Platform Observability — Type Definitions

// ─── Health Status ──────────────────────────────────────────────────

export type HealthStatus = "healthy" | "degraded" | "unhealthy" | "unknown";

export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  message?: string;
  latency?: number;
  lastChecked: Date;
}

export interface PlatformHealth {
  status: HealthStatus;
  components: ComponentHealth[];
  uptime: number;
  version: string;
  timestamp: Date;
}

// ─── Metrics ────────────────────────────────────────────────────────

export interface MetricsData {
  uptime: number;
  requests: number;
  errors: number;
  memory: MemoryMetrics;
  cpu: CPUMetrics;
  plugins: PluginMetrics;
  events: EventMetrics;
}

export interface MemoryMetrics {
  used: number;
  total: number;
  percentage: number;
}

export interface CPUMetrics {
  usage: number;
  cores: number;
}

export interface PluginMetrics {
  total: number;
  active: number;
  inactive: number;
  error: number;
}

export interface EventMetrics {
  published: number;
  processed: number;
  failed: number;
  avgLatency: number;
}

// ─── Diagnostics ────────────────────────────────────────────────────

export interface DiagnosticReport {
  timestamp: Date;
  platform: PlatformDiagnostics;
  plugins: PluginDiagnostics[];
  events: EventDiagnostics;
  dependencies: DependencyDiagnostics;
  contracts: ContractDiagnostics;
}

export interface PlatformDiagnostics {
  version: string;
  uptime: number;
  nodeVersion: string;
  platform: string;
  arch: string;
}

export interface PluginDiagnostics {
  id: string;
  name: string;
  state: string;
  health: HealthStatus;
  memory: number;
  uptime: number;
}

export interface EventDiagnostics {
  totalPublished: number;
  totalProcessed: number;
  totalFailed: number;
  avgLatency: number;
  topEventTypes: EventTypeMetric[];
}

export interface EventTypeMetric {
  type: string;
  count: number;
  avgLatency: number;
}

export interface DependencyDiagnostics {
  total: number;
  satisfied: number;
  unsatisfied: string[];
  circular: string[];
}

export interface ContractDiagnostics {
  total: number;
  compatible: number;
  incompatible: string[];
  deprecated: string[];
}

// ─── Observability API ──────────────────────────────────────────────

export interface ObservabilityAPI {
  health: () => Promise<PlatformHealth>;
  metrics: () => Promise<MetricsData>;
  diagnostics: () => Promise<DiagnosticReport>;
  componentHealth: (name: string) => Promise<ComponentHealth>;
}
