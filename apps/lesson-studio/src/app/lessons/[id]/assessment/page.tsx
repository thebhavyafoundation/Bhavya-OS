'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { getAssessment, requestCapability, getExecutionStatus } from '@/lib/runtime-client';
import type { Assessment, BuildStatus } from '@/lib/types';

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessment(params.id).then(setAssessment).catch(() => {}).finally(() => setLoading(false));
  }, [params.id]);

  const runBuilder = async () => {
    setBuildStatus({
      id: 'starting', capability: 'quiz_generation', builder: 'assessment',
      status: 'queued', progress: 0, steps: [], qualityGates: [],
    });
    const result = await requestCapability('quiz_generation', { lessonId: params.id });
    setBuildStatus(result);
    if (result.status === 'completed') {
      getAssessment(params.id).then(setAssessment).catch(() => {});
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <a href={`/lessons/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
            ← Back to Lesson
          </a>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Assessment</h2>
            <button
              onClick={runBuilder}
              disabled={buildStatus?.status === 'running'}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {buildStatus?.status === 'running' ? 'Generating...' : 'Run Assessment Builder'}
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : assessment?.questions && assessment.questions.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                <span className="text-sm text-gray-500">{assessment.questions.length} questions · {assessment.totalPoints} pts · Pass: {assessment.passingScore}</span>
              </div>
              {assessment.questions.map((q, i) => (
                <div key={q.id || i} className="p-3 border border-gray-100 rounded-lg mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{q.type}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{q.difficulty}</span>
                    <span className="text-xs text-gray-400">{q.bloomLevel}</span>
                  </div>
                  <p className="text-sm text-gray-700">{q.prompt}</p>
                  {q.options && (
                    <div className="mt-2 space-y-1">
                      {q.options.map((opt, oi) => (
                        <p key={oi} className="text-xs text-gray-500">{String.fromCharCode(65 + oi)}. {opt}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-4xl mb-4">✅</p>
              <p className="text-gray-500">No assessment generated yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
