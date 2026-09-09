'use client';

import { useState, useEffect } from 'react';

interface Objective {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  department: string;
  quarter: string;
  keyResults: { id: string; title: string; metric: string; currentValue: number; targetValue: number; status: string }[];
}

export default function OKRPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', quarter: '2026-Q1', department: 'institution' });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [listRes, summaryRes] = await Promise.all([
        fetch('/api/okr?action=list').then(r => r.json()),
        fetch('/api/okr?action=summary').then(r => r.json()),
      ]);
      setObjectives(listRes.objectives || []);
      setSummary(summaryRes.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createObjective(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/okr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...form }),
      });
      if (!response.ok) throw new Error("Failed to create");
      setForm({ title: '', description: '', quarter: '2026-Q1', department: 'institution' });
      setShowForm(false);
      load();
    } catch (error) {
      console.error("Failed to create:", error);
      alert("Failed to create. Please try again.");
    }
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-sage">Loading OKRs...</div></div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold">Objectives & Key Results</h1>
            <p className="text-sage mt-2">Track institutional goals and measurable outcomes</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-gold text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">
            + New Objective
          </button>
        </div>

        {showForm && (
          <form onSubmit={createObjective} className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" required aria-label="Title" />
              <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" aria-label="Description" />
              <select value={form.quarter} onChange={(e) => setForm({ ...form, quarter: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" aria-label="Quarter">
                <option value="2026-Q1">2026 Q1</option>
                <option value="2026-Q2">2026 Q2</option>
                <option value="2026-Q3">2026 Q3</option>
                <option value="2026-Q4">2026 Q4</option>
              </select>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="bg-gray-800 border border-gray-600 rounded p-3 text-white" aria-label="Department">
                <option value="institution">Institution</option>
                <option value="knowledge_production">Knowledge Production</option>
                <option value="publishing">Publishing</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-sage">Overall Progress</div>
              <div className="text-4xl font-bold text-white">{summary?.overallProgress || 0}%</div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div><div className="text-2xl font-bold text-white">{summary?.totalObjectives || 0}</div><div className="text-xs text-sage">Objectives</div></div>
              <div><div className="text-2xl font-bold text-green-400">{summary?.onTrackObjectives || 0}</div><div className="text-xs text-sage">On Track</div></div>
              <div><div className="text-2xl font-bold text-yellow-400">{summary?.atRiskObjectives || 0}</div><div className="text-xs text-sage">At Risk</div></div>
              <div><div className="text-2xl font-bold text-white">{summary?.completedKeyResults || 0}/{summary?.totalKeyResults || 0}</div><div className="text-xs text-sage">Key Results</div></div>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 mt-4">
            <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${summary?.overallProgress || 0}%` }} />
          </div>
        </div>

        <div className="space-y-4">
          {objectives.map((obj) => (
            <div key={obj.id} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{obj.title}</h3>
                  <p className="text-sm text-sage">{obj.description}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${obj.status === 'completed' ? 'bg-green-900 text-green-300' : obj.status === 'on-track' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {obj.status}
                  </span>
                  <div className="text-2xl font-bold text-white mt-1">{obj.progress}%</div>
                </div>
              </div>
              {obj.keyResults && obj.keyResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {obj.keyResults.map((kr) => (
                    <div key={kr.id} className="flex items-center justify-between bg-gray-800 rounded p-3">
                      <span className="text-sm text-sage">{kr.title}</span>
                      <span className="text-sm text-white">{kr.currentValue}/{kr.targetValue} {kr.metric}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${obj.progress}%` }} />
              </div>
            </div>
          ))}
          {objectives.length === 0 && <div className="text-center text-sage py-12">No objectives yet. Create your first one.</div>}
        </div>
      </div>
    </div>
  );
}
