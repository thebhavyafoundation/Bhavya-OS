'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { getWorkbook, requestCapability } from '@/lib/runtime-client';
import type { Workbook, BuildStatus } from '@/lib/types';

export default function WorkbookPage({ params }: { params: { id: string } }) {
  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkbook(params.id).then(setWorkbook).catch(() => {}).finally(() => setLoading(false));
  }, [params.id]);

  const runBuilder = async () => {
    setBuildStatus({
      id: 'starting', capability: 'lesson_generation', builder: 'workbook',
      status: 'queued', progress: 0, steps: [], qualityGates: [],
    });
    const result = await requestCapability('lesson_generation', { lessonId: params.id, _builderHint: 'workbook' });
    setBuildStatus(result);
    if (result.status === 'completed') {
      getWorkbook(params.id).then(setWorkbook).catch(() => {});
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <a href={`/lessons/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back to Lesson</a>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Workbook</h2>
            <button onClick={runBuilder} disabled={buildStatus?.status === 'running'}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors">
              {buildStatus?.status === 'running' ? 'Generating...' : 'Run Workbook Builder'}
            </button>
          </div>
          {workbook?.pages && workbook.pages.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{workbook.title}</h3>
                <span className="text-sm text-gray-500">{workbook.totalPages} pages · {workbook.totalPoints} pts</span>
              </div>
              {workbook.pages.map((page, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-lg mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded capitalize">{page.type}</span>
                    <h4 className="font-medium text-gray-900">{page.title}</h4>
                  </div>
                  {page.questions && (
                    <div className="space-y-2">
                      {page.questions.map((q, qi) => (
                        <div key={qi} className="text-sm text-gray-600">
                          <span className="font-medium">{(typeof q === 'string') ? q : q.prompt}</span>
                          {typeof q !== 'string' && q.points && <span className="text-xs text-gray-400 ml-2">({q.points} pts)</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-4xl mb-4">📄</p>
              <p className="text-gray-500">No workbook generated yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
