'use client';

import { useState, useEffect } from 'react';

interface ProductionMetrics {
  completed: number;
  inReview: number;
  velocity: number;
  byLevel: Record<string, number>;
  byStage: Record<string, number>;
  mediaBreakdown: { articles: number; videos: number; carousels: number };
  publishingQueue: number;
  communityRequests: number;
  studentFeedbackAvg: number;
  upcomingReleases: { id: string; title: string; level: string; status: string; stage: string; dueDate?: string }[];
  bottleneck: string;
  missionProgress: number;
}

export default function ProductionDashboard() {
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/production?action=metrics')
      .then(r => r.json())
      .then(data => setMetrics(data.metrics))
      .catch(err => console.error('Failed to load production metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏭</div>
          <div className="text-lg text-sage">Loading production data...</div>
        </div>
      </div>
    );
  }

  const m = metrics!;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gold">Production Dashboard</h1>
          <p className="text-sage mt-2">Knowledge production pipeline — real-time metrics and velocity</p>
        </header>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="KPs Completed" value={m.completed} color="green" />
          <StatCard title="In Review" value={m.inReview} color="yellow" />
          <StatCard title="Velocity" value={`${m.velocity}/wk`} color="blue" subtitle="KPs per week" />
          <StatCard title="Publishing Queue" value={m.publishingQueue} color="purple" subtitle="Ready to publish" />
        </div>

        {/* Second Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Community Requests" value={m.communityRequests} color="teal" />
          <StatCard title="Student Feedback" value={`${m.studentFeedbackAvg}/10`} color="gold" subtitle="Average score" />
          <StatCard title="Articles" value={m.mediaBreakdown.articles} color="indigo" />
          <StatCard title="Videos" value={m.mediaBreakdown.videos} color="rose" />
        </div>

        {/* Mission Progress */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gold">Mission Progress</h2>
            <span className="text-3xl font-bold text-white">{m.missionProgress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4">
            <div
              className="h-4 rounded-full transition-all"
              style={{
                width: `${m.missionProgress}%`,
                background: `linear-gradient(90deg, #1a3a2a, #c9a227)`,
              }}
            />
          </div>
          <p className="text-xs text-sage mt-2">{m.completed} Knowledge Packages published of total produced</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Curriculum Coverage by Level */}
          <Card title="Curriculum Coverage">
            <div className="space-y-3">
              {Object.entries(m.byLevel).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sage text-sm">{level}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full"
                        style={{ width: `${Math.min((count / Math.max(m.completed, 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(m.byLevel).length === 0 && (
                <div className="text-sage text-sm">No KPs tracked yet</div>
              )}
            </div>
          </Card>

          {/* Production Bottleneck */}
          <Card title="Production Bottleneck">
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-sm text-sage mb-1">Slowest Stage</div>
                <div className="text-2xl font-bold text-gold capitalize">{m.bottleneck.replace(/-/g, ' ')}</div>
              </div>
              <div className="space-y-2">
                {Object.entries(m.byStage).map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between">
                    <span className="text-sage text-sm capitalize">{stage.replace(/-/g, ' ')}</span>
                    <span className={`text-sm font-medium ${stage === m.bottleneck ? 'text-red-400' : 'text-white'}`}>{count} items</span>
                  </div>
                ))}
                {Object.keys(m.byStage).length === 0 && (
                  <div className="text-sage text-sm">No active bottleneck</div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Media Production */}
          <Card title="Media Production">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-2xl font-bold text-white">{m.mediaBreakdown.articles}</div>
                <div className="text-xs text-sage">Articles</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl mb-1">🎬</div>
                <div className="text-2xl font-bold text-white">{m.mediaBreakdown.videos}</div>
                <div className="text-xs text-sage">Videos</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl mb-1">🎨</div>
                <div className="text-2xl font-bold text-white">{m.mediaBreakdown.carousels}</div>
                <div className="text-xs text-sage">Carousels</div>
              </div>
            </div>
          </Card>

          {/* Upcoming Releases */}
          <Card title="Upcoming Releases">
            <div className="space-y-2">
              {m.upcomingReleases.map((kp) => (
                <div key={kp.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-sm text-white font-medium">{kp.title}</div>
                    <div className="text-xs text-sage">{kp.level} &middot; {kp.stage.replace(/-/g, ' ')}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    kp.status === 'approved' ? 'bg-green-900 text-green-300' :
                    kp.status === 'in-review' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {kp.status.replace(/-/g, ' ')}
                  </span>
                </div>
              ))}
              {m.upcomingReleases.length === 0 && (
                <div className="text-sage text-sm">No upcoming releases</div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <Card title="Production Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/production/kp" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
              <div className="text-xl mb-1">📦</div>
              <div className="text-sm text-white">KP Tracker</div>
            </a>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
              <div className="text-xl mb-1">➕</div>
              <div className="text-sm text-white">New KP</div>
            </button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
              <div className="text-xl mb-1">📊</div>
              <div className="text-sm text-white">Velocity Report</div>
            </button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
              <div className="text-xl mb-1">🔔</div>
              <div className="text-sm text-white">Community Requests</div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, subtitle }: { title: string; value: string | number; color: string; subtitle?: string }) {
  const borderColors: Record<string, string> = {
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    teal: 'border-teal-500',
    gold: 'border-gold',
    indigo: 'border-indigo-500',
    rose: 'border-rose-500',
  };
  return (
    <div className={`bg-gray-900 border ${borderColors[color] || 'border-gray-700'} rounded-lg p-5`}>
      <div className="text-sm text-sage">{title}</div>
      <div className="text-3xl font-bold text-white mt-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
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
