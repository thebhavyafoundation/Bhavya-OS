'use client';

import { useState, useEffect } from 'react';

interface KP {
  id: string;
  title: string;
  level: string;
  domain: string;
  status: string;
  stage: string;
  assignee?: string;
  dueDate?: string;
  publishedAt?: string;
  concepts: number;
  createdAt: string;
  updatedAt: string;
}

const STAGE_ORDER = ['research', 'writing', 'review', 'design', 'media', 'publishing'];
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-700 text-gray-300',
  'in-review': 'bg-yellow-900 text-yellow-300',
  approved: 'bg-green-900 text-green-300',
  published: 'bg-blue-900 text-blue-300',
};

export default function KPTrackerPage() {
  const [kps, setKps] = useState<KP[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', level: '' });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', level: 'L1', domain: 'general', assignee: '', dueDate: '', concepts: '0' });

  useEffect(() => { load(); }, [filter]);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ action: 'list' });
    if (filter.status) params.set('status', filter.status);
    if (filter.level) params.set('level', filter.level);
    try {
      const res = await fetch(`/api/production?${params}`).then(r => r.json());
      setKps(res.kps || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function createKP(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/production', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create-kp', ...form, concepts: parseInt(form.concepts) || 0 }),
    });
    setForm({ title: '', level: 'L1', domain: 'general', assignee: '', dueDate: '', concepts: '0' });
    setShowForm(false);
    load();
  }

  async function advanceKP(id: string) {
    await fetch('/api/production', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'advance', kpId: id }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold">Knowledge Package Tracker</h1>
            <p className="text-sage mt-2">Track individual KPs through the production pipeline</p>
          </div>
          <div className="flex gap-3">
            <a href="/production" className="bg-gray-800 text-sage px-4 py-2 rounded hover:bg-gray-700 transition">← Dashboard</a>
            <button onClick={() => setShowForm(!showForm)} className="bg-gold text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">
              + New KP
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={createKP} className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" required />
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white">
                <option value="L1">L1 — Foundations</option>
                <option value="L2">L2 — Core</option>
                <option value="L3">L3 — Applied</option>
                <option value="L4">L4 — Advanced</option>
                <option value="L5">L5 — Mastery</option>
              </select>
              <input placeholder="Domain" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" />
              <input placeholder="Assignee" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" />
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" />
              <input type="number" placeholder="Concepts" value={form.concepts} onChange={e => setForm({ ...form, concepts: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancel</button>
            </div>
          </form>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-sage">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in-review">In Review</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
          </select>
          <select value={filter.level} onChange={e => setFilter({ ...filter, level: e.target.value })} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-sage">
            <option value="">All Levels</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="L4">L4</option>
            <option value="L5">L5</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-sage py-12">Loading KPs...</div>
        ) : kps.length === 0 ? (
          <div className="text-center text-sage py-12">No Knowledge Packages found. Create your first one.</div>
        ) : (
          <div className="space-y-3">
            {kps.map(kp => (
              <div key={kp.id} className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{kp.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[kp.status] || 'bg-gray-700 text-gray-400'}`}>
                        {kp.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-sage">
                      <span>{kp.level}</span>
                      <span>&middot;</span>
                      <span className="capitalize">{kp.domain}</span>
                      {kp.assignee && <><span>&middot;</span><span>{kp.assignee}</span></>}
                      {kp.dueDate && <><span>&middot;</span><span>Due {new Date(kp.dueDate).toLocaleDateString()}</span></>}
                    </div>
                  </div>
                  <button
                    onClick={() => advanceKP(kp.id)}
                    disabled={kp.status === 'published'}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Advance →
                  </button>
                </div>

                {/* Stage Pipeline */}
                <div className="mt-4 flex items-center gap-1">
                  {STAGE_ORDER.map((stage, idx) => {
                    const currentIdx = STAGE_ORDER.indexOf(kp.stage);
                    const isComplete = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div key={stage} className="flex items-center gap-1 flex-1">
                        <div className={`h-2 flex-1 rounded-full ${isComplete ? 'bg-gold' : isCurrent ? 'bg-gold/50' : 'bg-gray-800'}`} />
                        {idx === STAGE_ORDER.length - 1 && (
                          <span className="text-xs text-sage capitalize ml-1">{kp.stage}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
