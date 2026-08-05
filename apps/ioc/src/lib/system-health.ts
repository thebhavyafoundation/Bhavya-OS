import { getDb } from '../lib/db';
import type { SystemHealth, SystemName, HealthStatus } from '../lib/types';

const SYSTEM_CONFIGS: Record<SystemName, {
  name: string;
  dashboard: string;
  api?: string;
  eventsProduced: number;
  eventsConsumed: number;
}> = {
  github_os: { name: 'GitHub OS', dashboard: 'http://localhost:3070', api: 'http://localhost:3070/api/health', eventsProduced: 0, eventsConsumed: 0 },
  knowledge_studio: { name: 'Knowledge Studio', dashboard: 'http://localhost:3050', api: 'http://localhost:3100/health', eventsProduced: 0, eventsConsumed: 0 },
  ai_institute: { name: 'AI Institute', dashboard: 'http://localhost:3060', eventsProduced: 0, eventsConsumed: 0 },
  website: { name: 'Website', dashboard: 'https://website-ten-vert-90.vercel.app', api: 'https://website-ten-vert-90.vercel.app/api/health', eventsProduced: 0, eventsConsumed: 0 },
  social_os: { name: 'Social OS', dashboard: 'http://localhost:3080', api: 'http://localhost:3080/api/health', eventsProduced: 7, eventsConsumed: 3 },
  constitution_sdk: { name: 'Constitution SDK', eventsProduced: 0, eventsConsumed: 0, dashboard: 'N/A' },
  content_factory: { name: 'Content Factory', api: 'http://localhost:3100/health', eventsProduced: 3, eventsConsumed: 0, dashboard: 'N/A' },
  curriculum_intelligence: { name: 'Curriculum Intelligence', eventsProduced: 0, eventsConsumed: 0, dashboard: 'N/A' },
  institution_os: { name: 'Institution OS', eventsProduced: 0, eventsConsumed: 0, dashboard: 'N/A' },
};

export async function checkSystemHealth(system: SystemName): Promise<SystemHealth> {
  const config = SYSTEM_CONFIGS[system];
  const now = new Date().toISOString();
  let status: HealthStatus = 'unknown';
  let apiAvailable = false;
  let dashboardAvailable = false;

  if (config.api) {
    try {
      const response = await fetch(config.api, { signal: AbortSignal.timeout(5000) });
      apiAvailable = response.ok;
      status = apiAvailable ? 'healthy' : 'degraded';
    } catch {
      apiAvailable = false;
      status = 'down';
    }
  } else {
    status = 'healthy';
    apiAvailable = true;
  }

  if (config.dashboard && config.dashboard !== 'N/A') {
    try {
      const response = await fetch(config.dashboard, { signal: AbortSignal.timeout(5000) });
      dashboardAvailable = response.ok;
    } catch {
      dashboardAvailable = false;
    }
  }

  const health: SystemHealth = {
    system,
    status,
    lastChecked: now,
    apiAvailable,
    dashboardAvailable,
    metricsAvailable: apiAvailable,
    eventsProduced: config.eventsProduced,
    eventsConsumed: config.eventsConsumed,
  };

  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO system_health (system, status, last_checked, api_available, dashboard_available, metrics_available, events_produced, events_consumed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(system, status, now, apiAvailable ? 1 : 0, dashboardAvailable ? 1 : 0, apiAvailable ? 1 : 0, config.eventsProduced, config.eventsConsumed);

  return health;
}

export async function checkAllSystems(): Promise<SystemHealth[]> {
  const systems = Object.keys(SYSTEM_CONFIGS) as SystemName[];
  const results: SystemHealth[] = [];

  for (const system of systems) {
    const health = await checkSystemHealth(system);
    results.push(health);
  }

  return results;
}

export function getSystemHealthFromDb(): SystemHealth[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM system_health').all() as any[];
  return rows.map((r) => ({
    system: r.system as SystemName,
    status: r.status as HealthStatus,
    lastChecked: r.last_checked,
    apiAvailable: r.api_available === 1,
    dashboardAvailable: r.dashboard_available === 1,
    metricsAvailable: r.metrics_available === 1,
    eventsProduced: r.events_produced,
    eventsConsumed: r.events_consumed,
    notes: r.notes,
  }));
}

export function getOperationalHealth(): { overall: HealthStatus; systems: SystemHealth[] } {
  const systems = getSystemHealthFromDb();
  const downSystems = systems.filter((s) => s.status === 'down');
  const degradedSystems = systems.filter((s) => s.status === 'degraded');

  let overall: HealthStatus = 'healthy';
  if (downSystems.length > 0) overall = 'down';
  else if (degradedSystems.length > 0) overall = 'degraded';
  else if (systems.length === 0) overall = 'unknown';

  return { overall, systems };
}
