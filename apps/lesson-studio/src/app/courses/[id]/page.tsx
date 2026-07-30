'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { getCourse, deleteCourse, updateCourse, listLessons } from '@/lib/runtime-client';
import type { Course, Lesson } from '@/lib/types';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    const c = await getCourse(params.id);
    if (c) {
      setCourse(c);
      setTitle(c.title);
      const allLessons = await listLessons({ courseId: params.id }).catch(() => []);
      setLessons(allLessons);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm('Delete this course?')) {
      await deleteCourse(params.id);
      router.push('/courses');
    }
  };

  const handleSave = async () => {
    const updated = await updateCourse(params.id, { title });
    if (updated) {
      setCourse(updated);
      setEditing(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen bg-gray-50"><Sidebar /><main className="flex-1 p-8"><div className="text-center py-12 text-gray-500">Loading...</div></main></div>;
  }

  if (!course) {
    return <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <a href="/courses" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back to Courses</a>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center"><p className="text-4xl mb-4">⚠️</p><h3 className="text-lg font-semibold text-gray-900 mb-2">Course not found</h3></div>
      </main>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <a href="/courses" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back to Courses</a>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {editing ? (
              <div className="space-y-4">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-bold" />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Save</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                    <p className="text-gray-500 mt-1">{course.subject} · Grade {course.grade} · {course.status}</p>
                    {course.description && <p className="text-sm text-gray-600 mt-2">{course.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(true)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Edit</button>
                    <button onClick={handleDelete} className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Lessons ({lessons.length})</h3>
              <a href={`/lessons/new?courseId=${params.id}`} className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">+ Add Lesson</a>
            </div>
            {lessons.length > 0 ? (
              <div className="space-y-2">
                {lessons.map((lesson, i) => (
                  <a key={lesson.id} href={`/lessons/${lesson.id}`}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-6">{i + 1}.</span>
                      <span className="text-sm text-gray-900">{lesson.title}</span>
                    </div>
                    <span className="text-xs text-gray-400">{lesson.duration}min</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No lessons in this course yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
