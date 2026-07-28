// Monitoring & Alerting
// Production observability with alerting.

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  metadata: Record<string, unknown>;
}

export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
}

export interface MonitoringConfig {
  alertThresholds: Record<string, number>;
  sampleRate: number;
  retentionMs: number;
}

export class Monitoring {
  private config: MonitoringConfig;
  private metrics: Metric[] = [];
  private alerts: Alert[] = [];
  private handlers: Array<(alert: Alert) => void> = [];

  constructor(config: MonitoringConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Start metrics cleanup
    setInterval(() => this.cleanupMetrics(), 60000);
  }

  // Record metric
  record(name: string, value: number, tags: Record<string, string> = {}): void {
    // Sampling
    if (Math.random() > this.config.sampleRate) return;

    this.metrics.push({ name, value, timestamp: new Date(), tags });

    // Check thresholds
    const threshold = this.config.alertThresholds[name];
    if (threshold && value > threshold) {
      this.raiseAlert('warning', `${name} exceeded threshold`, `${name}=${value} > ${threshold}`, name);
    }
  }

  // Increment counter
  increment(name: string, tags: Record<string, string> = {}): void {
    this.record(name, 1, tags);
  }

  // Raise alert
  raiseAlert(severity: Alert['severity'], title: string, message: string, source: string): void {
    const alert: Alert = {
      id: `alert:${crypto.randomUUID()}`,
      severity,
      title,
      message,
      source,
      timestamp: new Date(),
      acknowledged: false,
      metadata: {},
    };

    this.alerts.push(alert);

    // Notify handlers
    this.handlers.forEach((h) => h(alert));
  }

  // Subscribe to alerts
  onAlert(handler: (alert: Alert) => void): () => void {
    this.handlers.push(handler);
    return () => {
      const idx = this.handlers.indexOf(handler);
      if (idx >= 0) this.handlers.splice(idx, 1);
    };
  }

  // Acknowledge alert
  acknowledge(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // Get metrics
  getMetrics(name?: string): Metric[] {
    if (name) return this.metrics.filter((m) => m.name === name);
    return [...this.metrics];
  }

  // Get alerts
  getAlerts(severity?: Alert['severity']): Alert[] {
    if (severity) return this.alerts.filter((a) => a.severity === severity);
    return [...this.alerts];
  }

  // Get summary
  getSummary(): Record<string, unknown> {
    return {
      totalMetrics: this.metrics.length,
      totalAlerts: this.alerts.length,
      unacknowledged: this.alerts.filter((a) => !a.acknowledged).length,
      bySeverity: {
        info: this.alerts.filter((a) => a.severity === 'info').length,
        warning: this.alerts.filter((a) => a.severity === 'warning').length,
        error: this.alerts.filter((a) => a.severity === 'error').length,
        critical: this.alerts.filter((a) => a.severity === 'critical').length,
      },
    };
  }

  private cleanupMetrics(): void {
    const cutoff = new Date(Date.now() - this.config.retentionMs);
    this.metrics = this.metrics.filter((m) => m.timestamp > cutoff);
  }

  async shutdown(): Promise<void> {
    this.metrics = [];
    this.alerts = [];
    this.handlers = [];
  }
}
