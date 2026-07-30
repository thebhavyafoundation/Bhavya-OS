'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { listLessons } from '@/lib/runtime-client';
import type { Lesson } from '@/lib/types';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  ready: 'bg-green-100 text-green-700',
  published: 'bg-blue-100 text-blue-700',
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'ready' | 'published'>('all');

  useEffect(() => {
    listLessons().then(setLessons).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? lessons : lessons.filter(l => l.status === filter);
  const statusCounts = {
    all: lessons.length,
    draft: lessons.filter(l => l.status === 'draft').length,
    ready: lessons.filter(l => l.status === 'ready').length,
    published: lessons.filter(l => l.status === 'published').length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>
              <p className="text-gray-500 mt-1">{lessons.length} lessons total</p>
            </div>
            <a
              href="/lessons/new"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              + New Lesson
            </a>
          </div>

          <div className="flex gap-2 mb-6">
            {(['all', 'draft', 'ready', 'published'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === s
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="ml-1 text-xs opacity-75">({statusCounts[s]})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Loading lessons...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-4xl mb-4">📝</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No lessons yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first lesson from a Knowledge Object.
              </p>
              <a
                href="/lessons/new"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
              >
                Create your first lesson
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((lesson) => (
                <a
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow block"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {lesson.subject} · Grade {lesson.grade} · {lesson.duration}min
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[lesson.status] || 'bg-gray-100 text-gray-700'}`}>
                      {lesson.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span>{(lesson.learningOutcomes || []).length} outcomes</span>
                    <span>{(lesson.sections || []).length} sections</span>
                    <span>v{lesson.version}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
