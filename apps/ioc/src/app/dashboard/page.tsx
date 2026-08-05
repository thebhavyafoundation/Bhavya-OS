'use client';

import { useState, useEffect } from 'react';

interface OKRSummary {
  totalObjectives: number;
  completedObjectives: number;
  onTrackObjectives: number;
  atRiskObjectives: number;
  totalKeyResults: number;
  completedKeyResults: number;
  overallProgress: number;
}

interface RiskSummary {
  total: number;
  open: number;
  mitigated: number;
  closed: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface ActionSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byPriority: Record<string, number>;
}

interface EventSummary {
  total: number;
  unprocessed: number;
  bySource: Record<string, number>;
  byType: Record<string, number>;
}

interface HealthStatus {
  overall: string;
  systems: { system: string; status: string; lastChecked: string; apiAvailable: boolean; dashboardAvailable: boolean }[];
}

export default function ExecutiveDashboard() {
  const [okrSummary, setOkrSummary] = useState<OKRSummary | null>(null);
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
  const [actionSummary, setActionSummary] = useState<ActionSummary | null>(null);
  const [eventSummary, setEventSummary] = useState<EventSummary | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [okrRes, riskRes, actionRes, eventRes, healthRes] = await Promise.all([
          fetch('/api/okr?action=summary').then(r => r.json()),
          fetch('/api/risks?action=summary').then(r => r.json()),
          fetch('/api/actions?action=summary').then(r => r.json()),
          fetch('/api/events?action=summary').then(r => r.json()),
          fetch('/api/health?action=operational').then(r => r.json()),
        ]);
        setOkrSummary(okrRes.summary);
        setRiskSummary(riskRes.summary);
        setActionSummary(actionRes.summary);
        setEventSummary(eventRes.summary);
        setHealth(healthRes.health);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏛️</div>
          <div className="text-lg text-sage">Loading IOC...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gold">Institution Operations Center</h1>
          <p className="text-sage mt-2">Executive Command Center — Real-time institutional intelligence</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="OKR Progress" value={`${okrSummary?.overallProgress || 0}%`} subtitle={`${okrSummary?.completedObjectives || 0}/${okrSummary?.totalObjectives || 0} objectives`} color="green" />
          <StatCard title="Open Risks" value={`${riskSummary?.open || 0}`} subtitle={`${riskSummary?.critical || 0} critical`} color={riskSummary?.critical ? 'red' : 'yellow'} />
          <StatCard title="Pending Actions" value={`${actionSummary?.pending || 0}`} subtitle={`${actionSummary?.overdue || 0} overdue`} color={actionSummary?.overdue ? 'red' : 'green'} />
          <StatCard title="Events" value={`${eventSummary?.total || 0}`} subtitle={`${eventSummary?.unprocessed || 0} unprocessed`} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="OKR Overview">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sage">On Track</span><span className="text-green-400">{okrSummary?.onTrackObjectives || 0}</span></div>
              <div className="flex justify-between"><span className="text-sage">At Risk</span><span className="text-yellow-400">{okrSummary?.atRiskObjectives || 0}</span></div>
              <div className="flex justify-between"><span className="text-sage">Key Results</span><span className="text-white">{okrSummary?.completedKeyResults || 0}/{okrSummary?.totalKeyResults || 0}</span></div>
              <div className="w-full bg-gray-800 rounded-full h-3 mt-2">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${okrSummary?.overallProgress || 0}%` }} />
              </div>
            </div>
          </Card>

          <Card title="Risk Distribution">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-red-400">Critical</span><span>{riskSummary?.critical || 0}</span></div>
              <div className="flex justify-between"><span className="text-orange-400">High</span><span>{riskSummary?.high || 0}</span></div>
              <div className="flex justify-between"><span className="text-yellow-400">Medium</span><span>{riskSummary?.medium || 0}</span></div>
              <div className="flex justify-between"><span className="text-green-400">Low</span><span>{riskSummary?.low || 0}</span></div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="System Health">
            <div className="space-y-2">
              {health?.systems.map((s) => (
                <div key={s.system} className="flex items-center justify-between">
                  <span className="text-sage capitalize">{s.system.replace(/_/g, ' ')}</span>
                  <span className={`px-2 py-1 rounded text-xs ${s.status === 'healthy' ? 'bg-green-900 text-green-300' : s.status === 'degraded' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
              {(!health?.systems || health.systems.length === 0) && (
                <div className="text-sage text-sm">No systems checked yet. Visit /health to run checks.</div>
              )}
            </div>
          </Card>

          <Card title="Event Sources">
            <div className="space-y-2">
              {eventSummary?.bySource && Object.entries(eventSummary.bySource).map(([source, count]) => (
                <div key={source} className="flex justify-between">
                  <span className="text-sage capitalize">{source.replace(/_/g, ' ')}</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
              {(!eventSummary?.bySource || Object.keys(eventSummary.bySource).length === 0) && (
                <div className="text-sage text-sm">No events recorded yet.</div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Action Items by Priority">
            <div className="space-y-2">
              {actionSummary?.byPriority && Object.entries(actionSummary.byPriority).map(([priority, count]) => (
                <div key={priority} className="flex justify-between">
                  <span className="text-sage capitalize">{priority}</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
              {(!actionSummary?.byPriority || Object.keys(actionSummary.byPriority).length === 0) && (
                <div className="text-sage text-sm">No action items yet.</div>
              )}
            </div>
          </Card>

          <Card title="Quick Actions">
            <div className="space-y-2">
              <a href="/okr" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded transition">📊 View OKRs</a>
              <a href="/risks" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded transition">⚠️ View Risks</a>
              <a href="/actions" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded transition">✅ View Action Items</a>
              <a href="/reviews" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded transition">📝 Weekly Reviews</a>
              <a href="/health" className="block p-3 bg-gray-800 hover:bg-gray-700 rounded transition">🏥 System Health</a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: { title: string; value: string; subtitle: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    blue: 'border-blue-500',
  };
  return (
    <div className={`bg-gray-900 border ${colorMap[color] || 'border-gray-700'} rounded-lg p-6`}>
      <div className="text-sm text-sage">{title}</div>
      <div className="text-3xl font-bold text-white mt-1">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gold mb-4">{title}</h2>
      {children}
    </div>
  );
}
