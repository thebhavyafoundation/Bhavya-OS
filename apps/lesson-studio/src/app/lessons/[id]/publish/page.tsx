'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import BuilderCard from '@/components/builder-card';

export default function PublishPage({ params }: { params: { id: string } }) {
  const [target] = useState('website');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <a href={`/lessons/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
            ← Back to Lesson
          </a>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Publish</h2>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Publish Target</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'website', label: 'Website', desc: 'Interactive web page', icon: '🌐' },
                { id: 'offline', label: 'Offline', desc: 'Local file bundle', icon: '💾' },
                { id: 'pdf', label: 'PDF Export', desc: 'Printable document', icon: '📑' },
                { id: 'usb', label: 'USB Drive', desc: 'Portable package', icon: '🔌' },
              ].map((t) => (
                <label
                  key={t.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    target === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="target"
                    value={t.id}
                    checked={target === t.id}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <p className="text-2xl mb-2">{t.icon}</p>
                  <p className="font-medium text-gray-900">{t.label}</p>
                  <p className="text-sm text-gray-500">{t.desc}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <BuilderCard builderId="website" disabled />
            <BuilderCard builderId="pdf" disabled />
          </div>

          <button
            disabled
            className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
          >
            Publish Lesson
          </button>
        </div>
      </main>
    </div>
  );
}
