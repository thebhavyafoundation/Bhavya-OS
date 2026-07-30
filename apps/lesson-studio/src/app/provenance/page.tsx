'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { listProvenanceRecords, getProvenanceGraph, listBuildManifests } from '@/lib/runtime-client';

export default function ProvenancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [manifests, setManifests] = useState<any[]>([]);
  const [graph, setGraph] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'records' | 'graph' | 'manifests'>('records');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
      listProvenanceRecords().catch(() => []),
      listBuildManifests().catch(() => []),
    ]).then(([r, m]) => {
      setRecords(r);
      setManifests(m);
      getProvenanceGraph().then(setGraph).catch(() => {});
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Provenance</h2>
              <p className="text-gray-500 mt-1">{records.length} artifacts tracked</p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(['records', 'graph', 'manifests'] as const).map(v => (
                <button key={v} onClick={() => { setView(v); setSelectedRecord(null); }}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${view === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  {v === 'records' ? 'Records' : v === 'graph' ? 'Graph' : 'Manifests'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <div className={`${selectedRecord ? 'w-1/2' : 'w-full'}`}>
              {loading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : view === 'records' ? (
                <div className="space-y-2">
                  {records.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                      <p className="text-gray-500">No provenance records yet. Run a pipeline to generate artifacts.</p>
                    </div>
                  ) : (
                    records.map((r: any) => (
                      <div key={r.artifactId}
                        className={`bg-white rounded-lg border p-3 cursor-pointer hover:shadow-sm transition-shadow ${
                          selectedRecord?.artifactId === r.artifactId ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedRecord(r)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-mono text-gray-400">{r.artifactId.slice(0, 24)}...</span>
                            <span className="ml-2 text-sm font-medium text-gray-900">{r.builder}</span>
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${r.qualityGate === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {r.qualityGate}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">{r.generatedAt ? new Date(r.generatedAt).toLocaleString() : ''}</span>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          {r.capability && <span>Cap: {r.capability}</span>}
                          {r.sourceKnowledgeObject && <span>KO: {r.sourceKnowledgeObject}</span>}
                          {r.parentArtifactIds?.length > 0 && <span>Parents: {r.parentArtifactIds.length}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : view === 'graph' ? (
                <div className="space-y-3">
                  {graph.length === 0 ? (
                    <div className="bg-white rounded-lg border p-12 text-center text-gray-500">No graph data</div>
                  ) : (
                    graph.map((node: any) => (
                      <div key={node.artifactId} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-mono text-xs text-gray-400">{node.artifactId.slice(0, 20)}...</span>
                          <span className="font-medium">{node.builder}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${node.qualityGate === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {node.qualityGate}
                          </span>
                        </div>
                        {node.children?.length > 0 && (
                          <div className="ml-6 mt-2 pl-3 border-l-2 border-blue-200 space-y-1">
                            {node.children.map((childId: string) => {
                              const child = graph.find((n: any) => n.artifactId === childId);
                              return child ? (
                                <div key={childId} className="text-xs text-gray-600">
                                  └ {child.builder} ({child.artifactId.slice(0, 16)}...)
                                </div>
                              ) : (
                                <div key={childId} className="text-xs text-gray-400">└ {childId.slice(0, 20)}...</div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {manifests.length === 0 ? (
                    <div className="bg-white rounded-lg border p-12 text-center text-gray-500">No build manifests yet.</div>
                  ) : (
                    manifests.map((m: any) => (
                      <div key={m.buildId} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-mono text-xs text-gray-400">{m.buildId.slice(0, 24)}...</span>
                          <span className="text-xs text-gray-400">{m.completedAt ? new Date(m.completedAt).toLocaleString() : ''}</span>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-gray-600">
                          <span>Runtime: v{m.runtimeVersion}</span>
                          <span>Artifacts: {m.artifacts?.length || 0}</span>
                          <span>Gates: {m.qualityGates?.passed || 0} passed / {m.qualityGates?.failed || 0} failed</span>
                          <span>{m.durationMs}ms</span>
                        </div>
                        {m.artifacts?.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {m.artifacts.map((a: any, i: number) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded">{a.stage}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {selectedRecord && view === 'records' && (
              <div className="w-1/2 bg-white rounded-lg border border-gray-200 p-4 h-fit sticky top-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-900">Artifact Detail</h3>
                  <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {Object.entries(selectedRecord).map(([k, v]) => (
                    <div key={k} className="flex">
                      <span className="text-gray-400 w-28 shrink-0">{k}:</span>
                      <span className="text-gray-800 break-all">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
