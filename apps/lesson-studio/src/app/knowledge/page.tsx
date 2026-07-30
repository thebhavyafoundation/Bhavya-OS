'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { listKnowledgeObjects, deleteKnowledgeObject, createKnowledgeObject } from '@/lib/runtime-client';
import type { KnowledgeObject } from '@/lib/types';

export default function KnowledgePage() {
  const [kos, setKos] = useState<({ id: string; title: string; domain: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [koDetail, setKoDetail] = useState<KnowledgeObject | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadKos = () => {
    setLoading(true);
    listKnowledgeObjects().then(setKos).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadKos(); }, []);

  const filtered = kos.filter(k =>
    k.title.toLowerCase().includes(search.toLowerCase()) ||
    k.domain.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Delete this Knowledge Object? This cannot be undone.')) {
      await deleteKnowledgeObject(id);
      if (koDetail?.id === id) setKoDetail(null);
      loadKos();
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const ko = await createKnowledgeObject({
      title: newTitle.trim(),
      domain: newDomain.trim() || 'General',
      concepts: [{ name: newTitle.trim(), description: '', difficulty: 'beginner' }],
      definitions: [],
      examples: [],
      misconceptions: [],
      exercises: [],
      references: [],
      prerequisites: [],
    });
    if (ko) {
      setShowNewForm(false);
      setNewTitle('');
      setNewDomain('');
      loadKos();
    }
  };

  const handleViewDetail = async (id: string) => {
    setDetailLoading(true);
    setEditingId(null);
    try {
      const { getKnowledgeObject } = await import('@/lib/runtime-client');
      const ko = await getKnowledgeObject(id);
      setKoDetail(ko);
    } catch { setKoDetail(null); }
    setDetailLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Knowledge Objects</h2>
              <p className="text-gray-500 mt-1">{kos.length} objects</p>
            </div>
            <div className="flex gap-2">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search knowledge objects..."
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-48" />
              <button onClick={() => setShowNewForm(true)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                + New Knowledge Object
              </button>
            </div>
          </div>

          {showNewForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Create Knowledge Object</h3>
              <div className="space-y-3">
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="Title (e.g. What is Artificial Intelligence?)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <input type="text" value={newDomain} onChange={e => setNewDomain(e.target.value)}
                  placeholder="Domain (e.g. Artificial Intelligence)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <div className="flex gap-2">
                  <button onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Create
                  </button>
                  <button onClick={() => setShowNewForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-6">
            <div className="flex-1">
              {loading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 mb-4">No knowledge objects found</p>
                  <button onClick={() => setShowNewForm(true)}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
                    Create your first Knowledge Object
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((ko) => (
                    <div key={ko.id}
                      className={`bg-white rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow ${
                        koDetail?.id === ko.id ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-200'
                      }`}
                      onClick={() => handleViewDetail(ko.id)}>
                      <h3 className="font-medium text-gray-900">{ko.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{ko.domain}</p>
                      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-400">{ko.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {koDetail && (
              <div className="w-80 bg-white rounded-lg border border-gray-200 p-4 h-fit sticky top-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{koDetail.title}</h3>
                  <button onClick={() => setKoDetail(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <p className="text-xs text-gray-500 mb-3">Domain: {koDetail.domain}</p>
                <p className="text-xs text-gray-500 mb-3">Id: {koDetail.id}</p>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Concepts ({koDetail.concepts?.length || 0})</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {(koDetail.concepts || []).map((c, i) => (
                        <li key={i}>{c.name} — {c.difficulty}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Definitions ({koDetail.definitions?.length || 0})</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Examples ({koDetail.examples?.length || 0})</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Misconceptions ({koDetail.misconceptions?.length || 0})</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Exercises ({koDetail.exercises?.length || 0})</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <a href={`/knowledge/${koDetail.id}/edit`}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                    Edit
                  </a>
                  <button onClick={() => handleDelete(koDetail.id)}
                    className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
