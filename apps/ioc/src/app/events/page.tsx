'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: string;
  type: string;
  source: string;
  payload: Record<string, any>;
  createdAt: string;
  aggregated: boolean;
}

interface EventSummary {
  total: number;
  unprocessed: number;
  bySource: Record<string, number>;
  byType: Record<string, number>;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [summary, setSummary] = useState<EventSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [listRes, summaryRes] = await Promise.all([
        fetch('/api/events').then(r => r.json()),
        fetch('/api/events?action=summary').then(r => r.json()),
      ]);
      setEvents(listRes.events || []);
      setSummary(summaryRes.summary);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-sage">Loading events...</div></div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gold">Institutional Events</h1>
          <p className="text-sage mt-2">Cross-system event stream and intelligence</p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div><div className="text-2xl font-bold text-white">{summary?.total || 0}</div><div className="text-xs text-sage">Total Events</div></div>
            <div><div className="text-2xl font-bold text-yellow-400">{summary?.unprocessed || 0}</div><div className="text-xs text-sage">Unprocessed</div></div>
            <div><div className="text-2xl font-bold text-blue-400">{Object.keys(summary?.bySource || {}).length}</div><div className="text-xs text-sage">Sources</div></div>
            <div><div className="text-2xl font-bold text-green-400">{Object.keys(summary?.byType || {}).length}</div><div className="text-xs text-sage">Event Types</div></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gold mb-4">By Source</h2>
            <div className="space-y-2">
              {summary?.bySource && Object.entries(summary.bySource).map(([source, count]) => (
                <div key={source} className="flex justify-between"><span className="text-sage capitalize">{source.replace(/_/g, ' ')}</span><span className="text-white">{count}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gold mb-4">By Type</h2>
            <div className="space-y-2">
              {summary?.byType && Object.entries(summary.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between"><span className="text-sage">{type}</span><span className="text-white">{count}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${event.aggregated ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-white font-medium">{event.type}</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded text-sage">{event.source}</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(event.createdAt).toLocaleString()}</span>
              </div>
              {Object.keys(event.payload || {}).length > 0 && (
                <pre className="mt-2 text-xs text-sage bg-gray-800 rounded p-2 overflow-x-auto">{JSON.stringify(event.payload, null, 2)}</pre>
              )}
            </div>
          ))}
          {events.length === 0 && <div className="text-center text-sage py-12">No events recorded yet.</div>}
        </div>
      </div>
    </div>
  );
}
