'use client';

import { useState, useEffect } from 'react';

interface Risk {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  department: string;
  owner: string;
  mitigationPlan: string;
  mitigationProgress: number;
  createdAt: string;
}

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', severity: 'medium', department: '', owner: '', mitigationPlan: '' });

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [listRes, summaryRes] = await Promise.all([
        fetch('/api/risks').then(r => r.json()),
        fetch('/api/risks?action=summary').then(r => r.json()),
      ]);
      setRisks(listRes.risks || []);
      setSummary(summaryRes.summary);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  async function createRisk(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...form }),
      });
      if (!response.ok) throw new Error("Failed to create");
      setForm({ title: '', description: '', severity: 'medium', department: '', owner: '', mitigationPlan: '' });
      setShowForm(false);
      load();
    } catch (error) {
      console.error("Failed to create:", error);
      alert("Failed to create. Please try again.");
    }
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-sage">Loading risks...</div></div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold">Risk Register</h1>
            <p className="text-sage mt-2">Identify, assess, and mitigate institutional risks</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-gold text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">+ New Risk</button>
        </div>

        {showForm && (
          <form onSubmit={createRisk} className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" required aria-label="Title" />
              <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" aria-label="Severity">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white col-span-2" aria-label="Description" />
              <input placeholder="Owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" aria-label="Owner" />
              <input placeholder="Mitigation Plan" value={form.mitigationPlan} onChange={(e) => setForm({ ...form, mitigationPlan: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" aria-label="Mitigation Plan" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-5 gap-4 text-center">
            <div><div className="text-2xl font-bold text-white">{summary?.total || 0}</div><div className="text-xs text-sage">Total</div></div>
            <div><div className="text-2xl font-bold text-red-400">{summary?.critical || 0}</div><div className="text-xs text-sage">Critical</div></div>
            <div><div className="text-2xl font-bold text-orange-400">{summary?.high || 0}</div><div className="text-xs text-sage">High</div></div>
            <div><div className="text-2xl font-bold text-yellow-400">{summary?.medium || 0}</div><div className="text-xs text-sage">Medium</div></div>
            <div><div className="text-2xl font-bold text-green-400">{summary?.mitigated || 0}</div><div className="text-xs text-sage">Mitigated</div></div>
          </div>
        </div>

        <div className="space-y-4">
          {risks.map((risk) => (
            <div key={risk.id} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{risk.title}</h3>
                  <p className="text-sm text-sage">{risk.description}</p>
                  {risk.owner && <p className="text-xs text-gray-500 mt-1">Owner: {risk.owner}</p>}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${risk.severity === 'critical' ? 'bg-red-900 text-red-300' : risk.severity === 'high' ? 'bg-orange-900 text-orange-300' : risk.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                    {risk.severity}
                  </span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${risk.status === 'mitigated' ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-300'}`}>
                    {risk.status}
                  </span>
                </div>
              </div>
              {risk.mitigationPlan && (
                <div className="mt-3 bg-gray-800 rounded p-3">
                  <div className="text-xs text-sage mb-1">Mitigation Plan</div>
                  <div className="text-sm text-white">{risk.mitigationPlan}</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${risk.mitigationProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
          {risks.length === 0 && <div className="text-center text-sage py-12">No risks registered. Add your first risk.</div>}
        </div>
      </div>
    </div>
  );
}
