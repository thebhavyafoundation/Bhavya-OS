'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { getKnowledgeObject, updateKnowledgeObject } from '@/lib/runtime-client';
import type { KnowledgeObject } from '@/lib/types';

export default function EditKnowledgeObjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [ko, setKo] = useState<KnowledgeObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getKnowledgeObject(id).then(data => {
      if (data) setKo(data);
      else setError('Knowledge Object not found');
    }).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (section: string, index: number | null, field: string, value: unknown) => {
    if (!ko) return;
    const updated = { ...ko };
    if (index !== null && Array.isArray((updated as any)[section])) {
      (updated as any)[section] = [...(updated as any)[section]];
      (updated as any)[section][index] = { ...(updated as any)[section][index], [field]: value };
    } else if (field && index === null) {
      (updated as any)[section] = value;
    }
    setKo(updated);
  };

  const handleSave = async () => {
    if (!ko) return;
    setSaving(true);
    setError(null);
    try {
      const result = await updateKnowledgeObject(id, ko);
      if (result) router.push('/knowledge');
      else setError('Failed to save');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
    setSaving(false);
  };

  const addItem = (section: string, template: Record<string, unknown>) => {
    if (!ko) return;
    setKo({ ...ko, [section]: [...(ko as any)[section], template] });
  };

  const removeItem = (section: string, index: number) => {
    if (!ko) return;
    const arr = [...(ko as any)[section]];
    arr.splice(index, 1);
    setKo({ ...ko, [section]: arr });
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8"><div className="max-w-3xl mx-auto"><p className="text-gray-500">Loading...</p></div></main>
    </div>
  );

  if (error && !ko) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8"><div className="max-w-3xl mx-auto"><p className="text-red-500">{error}</p></div></main>
    </div>
  );

  if (!ko) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <a href="/knowledge" className="text-sm text-gray-500 hover:text-gray-700">← Back to Knowledge</a>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">Edit Knowledge Object</h2>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Basic Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                  <input type="text" value={ko.title} onChange={e => handleChange('title', null, '', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Domain</label>
                  <input type="text" value={ko.domain} onChange={e => handleChange('domain', null, '', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Concepts</h3>
                <button onClick={() => addItem('concepts', { name: '', description: '', difficulty: 'beginner' })}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">+ Add</button>
              </div>
              <div className="space-y-3">
                {(ko.concepts || []).map((c, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <input type="text" value={c.name} onChange={e => handleChange('concepts', i, 'name', e.target.value)}
                        placeholder="Name" className="px-2 py-1 border border-gray-300 rounded text-xs" />
                      <input type="text" value={c.description} onChange={e => handleChange('concepts', i, 'description', e.target.value)}
                        placeholder="Description" className="px-2 py-1 border border-gray-300 rounded text-xs" />
                      <select value={c.difficulty} onChange={e => handleChange('concepts', i, 'difficulty', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <button onClick={() => removeItem('concepts', i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Definitions</h3>
                <button onClick={() => addItem('definitions', { term: '', definition: '' })}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">+ Add</button>
              </div>
              <div className="space-y-3">
                {(ko.definitions || []).map((d, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input type="text" value={d.term} onChange={e => handleChange('definitions', i, 'term', e.target.value)}
                        placeholder="Term" className="px-2 py-1 border border-gray-300 rounded text-xs" />
                      <input type="text" value={d.definition} onChange={e => handleChange('definitions', i, 'definition', e.target.value)}
                        placeholder="Definition" className="px-2 py-1 border border-gray-300 rounded text-xs" />
                    </div>
                    <button onClick={() => removeItem('definitions', i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Examples</h3>
                <button onClick={() => addItem('examples', { title: '', description: '' })}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">+ Add</button>
              </div>
              <div className="space-y-3">
                {(ko.examples || []).map((e, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input type="text" value={e.title} onChange={e => handleChange('examples', i, 'title', (e.target as HTMLInputElement).value)}
                        placeholder="Title" className="px-2 py-1 border border-gray-300 rounded text-xs" />
                      <input type="text" value={e.description} onChange={e => handleChange('examples', i, 'description', (e.target as HTMLInputElement).value)}
                        placeholder="Description" className="px-2 py-1 border border-gray-300 rounded text-xs" />
                    </div>
                    <button onClick={() => removeItem('examples', i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Misconceptions</h3>
                <button onClick={() => addItem('misconceptions', { belief: '', correction: '' })}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">+ Add</button>
              </div>
              <div className="space-y-3">
                {(ko.misconceptions || []).map((m, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input type="text" value={m.belief} onChange={e => handleChange('misconceptions', i, 'belief', e.target.value)}
                        placeholder="Common belief" className="px-2 py-1 border border-gray-300 rounded text-xs" />
                      <input type="text" value={m.correction} onChange={e => handleChange('misconceptions', i, 'correction', e.target.value)}
                        placeholder="Correction" className="px-2 py-1 border border-gray-300 rounded text-xs" />
                    </div>
                    <button onClick={() => removeItem('misconceptions', i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Exercises</h3>
                <button onClick={() => addItem('exercises', { prompt: '', type: 'short-answer', solution: '' })}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">+ Add</button>
              </div>
              <div className="space-y-3">
                {(ko.exercises || []).map((ex, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <input type="text" value={ex.prompt} onChange={e => handleChange('exercises', i, 'prompt', e.target.value)}
                        placeholder="Exercise prompt" className="w-full px-2 py-1 border border-gray-300 rounded text-xs" />
                      <div className="flex gap-2">
                        <select value={ex.type} onChange={e => handleChange('exercises', i, 'type', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs">
                          <option value="mcq">MCQ</option>
                          <option value="short-answer">Short Answer</option>
                          <option value="reflection">Reflection</option>
                          <option value="project">Project</option>
                        </select>
                        <input type="text" value={ex.solution || ''} onChange={e => handleChange('exercises', i, 'solution', e.target.value)}
                          placeholder="Solution (optional)" className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs" />
                      </div>
                    </div>
                    <button onClick={() => removeItem('exercises', i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Prerequisites</h3>
                <button onClick={() => addItem('prerequisites', '')}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">+ Add</button>
              </div>
              <div className="space-y-2">
                {(ko.prerequisites || []).map((p: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={p} onChange={e => {
                      const arr = [...(ko.prerequisites as string[])];
                      arr[i] = e.target.value;
                      setKo({ ...ko, prerequisites: arr });
                    }} placeholder="Prerequisite KO id" className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs" />
                    <button onClick={() => removeItem('prerequisites', i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pb-8">
            <a href="/knowledge" className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</a>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
