'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { listCourses, deleteCourse, duplicateCourse, archiveCourse } from '@/lib/runtime-client';
import type { Course } from '@/lib/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    listCourses().then(setCourses).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Delete this course?')) {
      await deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const dup = await duplicateCourse(id);
    if (dup) {
      setCourses(prev => [dup, ...prev]);
    }
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const archived = await archiveCourse(id);
    if (archived) {
      setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'archived' } : c));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
              <p className="text-gray-500 mt-1">{courses.length} courses total</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              />
              <a
                href="/courses/new"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
              >
                + New Course
              </a>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Loading courses...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-4xl mb-4">📚</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first course by defining a subject and grade level.
              </p>
              <a
                href="/courses/new"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
              >
                Create your first course
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((course) => (
                <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <a href={`/courses/${course.id}`} className="block">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>{course.subject}</span>
                      <span>Grade {course.grade}</span>
                      <span>{(course.lessons || []).length} lessons</span>
                      <span>v{0.1}</span>
                    </div>
                  </a>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={(e) => handleDuplicate(course.id, e)} className="text-xs text-gray-500 hover:text-gray-700">Duplicate</button>
                    <button onClick={(e) => handleArchive(course.id, e)} className="text-xs text-gray-500 hover:text-gray-700">Archive</button>
                    <button onClick={(e) => handleDelete(course.id, e)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
