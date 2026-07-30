'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { listCourses, listLessons, listRuntimeCapabilities, getRuntimeMetrics } from '@/lib/runtime-client';
import { capabilityNames } from '@/lib/builders';
import { getGatesForBuilder } from '@/lib/quality-gates';
import { builders } from '@/lib/builders';
import type { Course, Lesson } from '@/lib/types';

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [capabilities, setCapabilities] = useState<{ name: string; builder: string | null }[]>([]);
  const [runtimeAvailable, setRuntimeAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      listCourses().catch(() => { setRuntimeAvailable(false); return []; }),
      listLessons().catch(() => []),
      listRuntimeCapabilities().catch(() => []),
      getRuntimeMetrics().catch(() => null),
    ]).then(([c, l, caps]) => {
      setCourses(c as Course[]);
      setLessons(l as Lesson[]);
      setCapabilities(caps as { name: string; builder: string | null }[]);
      setRuntimeAvailable(true);
    }).catch((err) => {
      setError(err.message);
      setRuntimeAvailable(false);
    });
  }, []);

  const activeCapabilities = capabilities.length > 0 ? capabilities : [];

  const stats = [
    { label: 'Courses', value: String(courses.length), href: '/courses', color: 'bg-blue-500' },
    { label: 'Lessons', value: String(lessons.length), href: '/lessons', color: 'bg-green-500' },
    { label: 'Capabilities', value: String(activeCapabilities.length || Object.keys(capabilityNames).length), color: 'bg-purple-500' },
    { label: 'Builders', value: String(builders.length), color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-500 mt-1">
                  Bhavya AI Lab OS — Mission Application 001
                </p>
              </div>
              {runtimeAvailable === false && (
                <div className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                  ⚡ Runtime offline
                </div>
              )}
              {runtimeAvailable === true && (
                <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  ● Runtime connected
                </div>
              )}
            </div>
          </div>

          {error && runtimeAvailable === false && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">Runtime not available</p>
              <p className="text-xs text-yellow-600 mt-1">
                Start the runtime to enable full functionality: <code className="bg-yellow-100 px-1 rounded">pnpm run bhavya:api</code>
              </p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                {stat.href && (
                  <a href={stat.href} className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    View all →
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Builders</h3>
              <span className="text-sm text-gray-500">{builders.length} builders</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {builders.map((builder) => (
                <div key={builder.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900">{builder.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{builder.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {capabilityNames[builder.capability] || builder.capability}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {builder.outputType}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Gates: {getGatesForBuilder(builder.id).length}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
              <a
                href="/courses/new"
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors text-center"
              >
                <p className="text-2xl mb-1">📚</p>
                <p className="font-medium text-gray-900">Create Course</p>
                <p className="text-sm text-gray-500">Build a new course from scratch</p>
              </a>
              <a
                href="/lessons/new"
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors text-center"
              >
                <p className="text-2xl mb-1">📝</p>
                <p className="font-medium text-gray-900">New Lesson</p>
                <p className="text-sm text-gray-500">Create a lesson from a Knowledge Object</p>
              </a>
              <a
                href="/lessons"
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors text-center"
              >
                <p className="text-2xl mb-1">📋</p>
                <p className="font-medium text-gray-900">View All Lessons</p>
                <p className="text-sm text-gray-500">Browse and manage existing lessons</p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
