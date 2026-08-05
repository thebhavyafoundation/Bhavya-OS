'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  weekStart: string;
  weekEnd: string;
  summary: { knowledgeProduction: string; publishing: string; community: string; technical: string; mission: string };
  status: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await fetch('/api/reviews?action=list').then(r => r.json());
      setReviews(res.reviews || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  async function generate() {
    setGenerating(true);
    try {
      await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate' }) });
      load();
    } catch (err) { console.error(err); } finally { setGenerating(false); }
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-sage">Loading reviews...</div></div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold">Weekly Reviews</h1>
            <p className="text-sage mt-2">Automated executive summaries and next-week plans</p>
          </div>
          <button onClick={generate} disabled={generating} className="bg-gold text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50">
            {generating ? 'Generating...' : 'Generate Review'}
          </button>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{review.weekStart} — {review.weekEnd}</h3>
                <span className={`px-2 py-1 rounded text-xs ${review.status === 'approved' ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-300'}`}>{review.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-xs text-gold mb-1">Knowledge Production</div>
                  <div className="text-sm text-white">{review.summary?.knowledgeProduction || 'N/A'}</div>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-xs text-gold mb-1">Publishing</div>
                  <div className="text-sm text-white">{review.summary?.publishing || 'N/A'}</div>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-xs text-gold mb-1">Community</div>
                  <div className="text-sm text-white">{review.summary?.community || 'N/A'}</div>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-xs text-gold mb-1">Technical</div>
                  <div className="text-sm text-white">{review.summary?.technical || 'N/A'}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-3">Generated: {new Date(review.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {reviews.length === 0 && <div className="text-center text-sage py-12">No reviews yet. Click "Generate Review" to create one.</div>}
        </div>
      </div>
    </div>
  );
}
