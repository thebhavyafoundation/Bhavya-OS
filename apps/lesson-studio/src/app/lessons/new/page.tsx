'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { requestCapability, createLesson, listKnowledgeObjects, getKnowledgeObject } from '@/lib/runtime-client';

export default function NewLessonPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [selectedKo, setSelectedKo] = useState('');
  const [duration, setDuration] = useState(45);
  const [knowledgeObjects, setKnowledgeObjects] = useState<{ id: string; title: string; domain: string }[]>([]);
  const [koSearch, setKoSearch] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  useEffect(() => {
    listKnowledgeObjects().then(kos => {
      if (kos && kos.length > 0) {
        setKnowledgeObjects(kos);
        setSelectedKo(kos[0].id);
      }
    }).catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!title || !selectedKo) return;
    setGenerating(true);
    setError(null);
    setProgress('Loading Knowledge Object...');

    try {
      const koData = await getKnowledgeObject(selectedKo);
      if (!koData) {
        throw new Error('Knowledge Object not found');
      }

      setProgress('Requesting lesson_generation capability...');
      const result = await requestCapability('lesson_generation', {
        knowledgeObject: koData,
        title,
        duration,
        grade: 9,
      });

      if (result.status === 'completed' && result.builderResult?.output?.lesson) {
        setProgress('Saving lesson...');
        const lessonData = result.builderResult.output.lesson;
        const saved = await createLesson(lessonData);
        router.push(`/lessons/${saved.id}`);
      } else {
        throw new Error(result.error || 'Lesson generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lesson');
      setGenerating(false);
      setProgress('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <a href="/lessons" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
            ← Back to Lessons
          </a>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Lesson</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
              <p className="text-xs mt-1 text-red-500">Make sure the runtime is running: <code>pnpm run bhavya:api</code></p>
            </div>
          )}

          {progress && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              {progress}
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., What is Artificial Intelligence?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Knowledge Object</label>
              <p className="text-xs text-gray-400 mb-2">
                Select a Knowledge Object as the source for lesson generation. The Lesson Builder will compile it into a structured lesson.
              </p>
              {knowledgeObjects.length > 3 && (
                <input type="text" value={koSearch} onChange={e => setKoSearch(e.target.value)}
                  placeholder="Filter knowledge objects..."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mb-2" />
              )}
              {knowledgeObjects.length === 0 && (
                <p className="text-xs text-gray-400 mb-2">No Knowledge Objects found. <a href="/knowledge" className="text-blue-600 underline">Create one first</a>.</p>
              )}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {knowledgeObjects.filter(ko => ko.title.toLowerCase().includes(koSearch.toLowerCase())).map((ko) => (
                  <label
                    key={ko.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedKo === ko.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ko"
                      value={ko.id}
                      checked={selectedKo === ko.id}
                      onChange={e => setSelectedKo(e.target.value)}
                      className="text-blue-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{ko.title}</p>
                      <p className="text-xs text-gray-500">{ko.domain}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration: {duration} minutes
              </label>
              <input
                type="range"
                min={15}
                max={120}
                step={5}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>15 min</span>
                <span>120 min</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!title || !selectedKo || generating}
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? 'Generating Lesson...' : 'Generate Lesson'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
