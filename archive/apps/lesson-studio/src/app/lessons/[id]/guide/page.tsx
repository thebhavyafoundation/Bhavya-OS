'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { getTeacherGuide, requestCapability } from '@/lib/runtime-client';
import type { TeacherGuide, BuildStatus } from '@/lib/types';

export default function GuidePage({ params }: { params: { id: string } }) {
  const [guide, setGuide] = useState<TeacherGuide | null>(null);
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherGuide(params.id).then(setGuide).catch(() => {}).finally(() => setLoading(false));
  }, [params.id]);

  const runBuilder = async () => {
    setBuildStatus({
      id: 'starting', capability: 'lesson_generation', builder: 'teacher-guide',
      status: 'queued', progress: 0, steps: [], qualityGates: [],
    });
    const result = await requestCapability('lesson_generation', { lessonId: params.id, _builderHint: 'teacher-guide' });
    setBuildStatus(result);
    if (result.status === 'completed') {
      getTeacherGuide(params.id).then(setGuide).catch(() => {});
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <a href={`/lessons/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back to Lesson</a>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Teacher Guide</h2>
            <button onClick={runBuilder} disabled={buildStatus?.status === 'running'}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors">
              {buildStatus?.status === 'running' ? 'Generating...' : 'Run Teacher Guide Builder'}
            </button>
          </div>
          {guide ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">{guide.title}</h3>

              {guide.objectives?.length > 0 && (
                <div><h4 className="text-sm font-medium text-gray-700 mb-2">Objectives</h4>
                  <ul className="space-y-1">{guide.objectives.map((o, i) => <li key={i} className="text-sm text-gray-600">• {o}</li>)}</ul>
                </div>
              )}

              {guide.vocabulary?.length > 0 && (
                <div><h4 className="text-sm font-medium text-gray-700 mb-2">Vocabulary</h4>
                  <div className="flex flex-wrap gap-1">{guide.vocabulary.map((v, i) => <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{v}</span>)}</div>
                </div>
              )}

              {guide.materials?.length > 0 && (
                <div><h4 className="text-sm font-medium text-gray-700 mb-2">Materials</h4>
                  <ul className="space-y-1">{guide.materials.map((m, i) => <li key={i} className="text-sm text-gray-600">• {m}</li>)}</ul>
                </div>
              )}

              {guide.timingGuide?.length > 0 && (
                <div><h4 className="text-sm font-medium text-gray-700 mb-2">Timing ({guide.totalDuration} min)</h4>
                  <div className="space-y-1">{guide.timingGuide.map((t, i) => (
                    <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-600">{t.section}</span><span className="text-gray-400">{t.duration} min · {t.activity}</span></div>
                  ))}</div>
                </div>
              )}

              {guide.discussionPrompts?.length > 0 && (
                <div><h4 className="text-sm font-medium text-gray-700 mb-2">Discussion Prompts</h4>
                  <ul className="space-y-1">{guide.discussionPrompts.map((p, i) => <li key={i} className="text-sm text-gray-600">• {p}</li>)}</ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-4xl mb-4">🎓</p>
              <p className="text-gray-500">No teacher guide generated yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
