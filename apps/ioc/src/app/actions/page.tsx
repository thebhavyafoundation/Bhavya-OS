'use client';

import { useState, useEffect } from 'react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  owner: string;
  dueDate: string;
  completedAt: string;
  result: string;
}

export default function ActionsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'decision', priority: 'medium', owner: '', dueDate: '' });

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [listRes, summaryRes] = await Promise.all([
        fetch('/api/actions').then(r => r.json()),
        fetch('/api/actions?action=summary').then(r => r.json()),
      ]);
      setItems(listRes.items || []);
      setSummary(summaryRes.summary);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  async function createAction(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', ...form }),
    });
    setForm({ title: '', description: '', type: 'decision', priority: 'medium', owner: '', dueDate: '' });
    setShowForm(false);
    load();
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update-status', itemId: id, status }),
    });
    load();
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-sage">Loading actions...</div></div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold">Action Items</h1>
            <p className="text-sage mt-2">Track decisions, tasks, and follow-ups</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-gold text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">+ New Action</button>
        </div>

        {showForm && (
          <form onSubmit={createAction} className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" required />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white">
                <option value="decision">Decision</option>
                <option value="task">Task</option>
                <option value="follow-up">Follow-up</option>
                <option value="review">Review</option>
              </select>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input placeholder="Owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div><div className="text-2xl font-bold text-white">{summary?.total || 0}</div><div className="text-xs text-sage">Total</div></div>
            <div><div className="text-2xl font-bold text-yellow-400">{summary?.pending || 0}</div><div className="text-xs text-sage">Pending</div></div>
            <div><div className="text-2xl font-bold text-blue-400">{summary?.inProgress || 0}</div><div className="text-xs text-sage">In Progress</div></div>
            <div><div className="text-2xl font-bold text-green-400">{summary?.completed || 0}</div><div className="text-xs text-sage">Completed</div></div>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-sage">{item.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded text-sage">{item.type}</span>
                    <span className={`text-xs px-2 py-1 rounded ${item.priority === 'critical' ? 'bg-red-900 text-red-300' : item.priority === 'high' ? 'bg-orange-900 text-orange-300' : 'bg-gray-800 text-gray-300'}`}>{item.priority}</span>
                    {item.owner && <span className="text-xs px-2 py-1 bg-gray-800 rounded text-sage">{item.owner}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.status === 'pending' && <button onClick={() => updateStatus(item.id, 'in-progress')} className="text-xs bg-blue-900 text-blue-300 px-3 py-1 rounded hover:bg-blue-800 transition">Start</button>}
                  {item.status === 'in-progress' && <button onClick={() => updateStatus(item.id, 'completed')} className="text-xs bg-green-900 text-green-300 px-3 py-1 rounded hover:bg-green-800 transition">Complete</button>}
                  <span className={`text-xs px-2 py-1 rounded ${item.status === 'completed' ? 'bg-green-900 text-green-300' : item.status === 'in-progress' ? 'bg-blue-900 text-blue-300' : 'bg-gray-800 text-gray-300'}`}>{item.status}</span>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-center text-sage py-12">No action items yet.</div>}
        </div>
      </div>
    </div>
  );
}
