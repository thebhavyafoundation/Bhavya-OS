'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/sidebar';
import { getLesson, requestCapability } from '@/lib/runtime-client';
import type { Lesson, VisualSpec, Video, VisualScene } from '@/lib/types';

function msToSec(ms: number) { return (ms / 1000).toFixed(1); }

const ANIMATION_LABELS: Record<string, string> = {
  'fade-in': 'Fade In', 'slide-up': 'Slide Up', 'scale-in': 'Scale In',
  'slide-in-left': 'Slide Left', 'slide-in-right': 'Slide Right', 'grow': 'Grow',
};

const ANIMATION_COLORS: Record<string, string> = {
  'fade-in': '#6366f1', 'slide-up': '#f59e0b', 'scale-in': '#10b981',
  'slide-in-left': '#3b82f6', 'slide-in-right': '#8b5cf6', 'grow': '#ef4444',
};

function SceneTimelineBar({ scene, index, palette, selected, onClick }: {
  scene: VisualScene; index: number; palette: Record<string, string>;
  selected: boolean; onClick: () => void;
}) {
  return (
    <div
      className={`rounded-lg border cursor-pointer transition-all ${selected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:shadow-sm'}`}
      onClick={onClick}
      style={{ borderLeft: `4px solid ${palette?.primary || '#2563eb'}` }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">S{index + 1}</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{scene.type.replace(/-/g, ' ')}</span>
            {scene.transition && (
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                {scene.transition.type}{scene.transition.direction ? `→${scene.transition.direction}` : ''}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">{msToSec(scene.duration)}s</span>
        </div>
        <div className="relative mt-2 h-6 bg-gray-100 rounded overflow-hidden">
          <div className="absolute inset-0 flex">
            {scene.elements.map((el, i) => {
              const startPct = ((el.timing?.start || 0) / scene.duration) * 100;
              const endPct = ((el.timing?.end || scene.duration) / scene.duration) * 100;
              const width = endPct - startPct;
              return (
                <div key={i} title={`${el.animation || 'none'} — ${msToSec(el.timing?.start || 0)}s–${msToSec(el.timing?.end || scene.duration)}s`}
                  className="absolute top-0 h-full rounded-sm opacity-80 hover:opacity-100 transition-opacity"
                  style={{ left: `${startPct}%`, width: `${Math.max(width, 2)}%`, backgroundColor: ANIMATION_COLORS[el.animation || 'fade-in'] || '#94a3b8' }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {scene.elements.map((el, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100 text-gray-500">
              {el.type}{el.animation ? `:${ANIMATION_LABELS[el.animation] || el.animation}` : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ElementTimeline({ scene, palette }: { scene: VisualScene; palette: Record<string, string> }) {
  if (!scene?.elements?.length) return <p className="text-sm text-gray-400 italic">No elements in this scene.</p>;
  const maxTime = scene.elements.reduce((m, e) => Math.max(m, e.timing?.end || scene.duration), 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>0s</span>
        <span>{msToSec(maxTime)}s</span>
      </div>
      <div className="relative h-[1px] bg-gray-200 mb-3">
        {[0, 0.25, 0.5, 0.75].map(t => (
          <div key={t} className="absolute top-[-3px]" style={{ left: `${t * 100}%` }}>
            <div className="w-[1px] h-[7px] bg-gray-300" />
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {scene.elements.map((el, i) => {
          const start = el.timing?.start || 0;
          const end = el.timing?.end || scene.duration;
          const leftPct = (start / maxTime) * 100;
          const widthPct = Math.max(((end - start) / maxTime) * 100, 3);
          const color = ANIMATION_COLORS[el.animation || 'fade-in'] || '#94a3b8';
          return (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="w-20 text-right text-gray-500 truncate shrink-0">{el.type}</span>
              <div className="flex-1 relative h-7 bg-gray-50 rounded overflow-hidden">
                <div className="absolute h-full rounded-sm opacity-80 flex items-center px-1.5 text-[9px] text-white font-medium truncate"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: color }}>
                  {el.animation ? ANIMATION_LABELS[el.animation] || el.animation : ''}
                </div>
              </div>
              <span className="w-16 text-gray-400 shrink-0 text-right">{msToSec(start)}–{msToSec(end)}s</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnimationStudioPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [visualSpec, setVisualSpec] = useState<VisualSpec | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [buildStatus, setBuildStatus] = useState<any>(null);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLesson(params.id).then(l => {
      if (l) setLesson(l);
      else setError('Lesson not found');
    }).catch(() => setError('Failed to load lesson')).finally(() => setLoading(false));
  }, [params.id]);

  const runBuilder = async (capability: string) => {
    if (!lesson) return;
    setBuildStatus({ id: 'starting', capability, status: 'running', progress: 0, steps: [], qualityGates: [] });
    try {
      const result = await requestCapability(capability, { lesson });
      setBuildStatus(result);
      if (result.status === 'completed' && result.result?.output) {
        if (result.result.output.visualSpec) {
          setVisualSpec(result.result.output.visualSpec as any);
          setSelectedSceneIndex(0);
        }
        if (result.result.output.video) setVideo(result.result.output.video as any);
      }
    } catch {
      setBuildStatus({ id: 'error', capability, status: 'failed' });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p className="text-gray-500">Loading lesson...</p>
        </main>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <a href="/lessons" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back to Lessons</a>
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lesson not found</h3>
              <p className="text-gray-500">{error || 'Could not load lesson.'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const selectedScene = visualSpec?.scenes?.[selectedSceneIndex];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <a href={`/lessons/${params.id}`} className="text-xs text-gray-400 hover:text-gray-600 mb-1 inline-block">← Back to Lesson</a>
              <h2 className="text-xl font-bold text-gray-900">Animation Studio</h2>
              <p className="text-sm text-gray-500">{lesson.title} · {lesson.subject}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => runBuilder('visual_spec_generation')}
                disabled={buildStatus?.status === 'running'}
                className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 disabled:opacity-50 transition-opacity">
                Generate Visual Spec
              </button>
              <button onClick={() => runBuilder('video_generation')}
                disabled={buildStatus?.status === 'running' || !visualSpec}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-500 disabled:opacity-50 transition-opacity">
                Generate Video
              </button>
            </div>
          </div>
        </div>

        {buildStatus && buildStatus.status === 'running' && (
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-2 text-sm text-blue-700">
            Building: {buildStatus.capability} — {buildStatus.progress}%
          </div>
        )}

        {!visualSpec && !video && !buildStatus ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <p className="text-4xl mb-3">🎬</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Animation Data Yet</h3>
              <p className="text-sm text-gray-500 mb-4">Generate a visual specification to start building your animation timeline.</p>
              <button onClick={() => runBuilder('visual_spec_generation')}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
                Generate Visual Spec
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex" style={{ height: 'calc(100vh - 140px)' }}>
            <div className="w-96 border-r border-gray-200 bg-white overflow-y-auto p-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Scenes</h3>
                {visualSpec && <span className="text-xs text-gray-400">{visualSpec.scenes.length} scenes · {visualSpec.totalDuration ? msToSec(visualSpec.totalDuration) : '?'}s</span>}
              </div>
              {visualSpec?.scenes.map((scene, i) => (
                <SceneTimelineBar key={scene.id} scene={scene} index={i} palette={visualSpec.colors}
                  selected={selectedSceneIndex === i} onClick={() => setSelectedSceneIndex(i)} />
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedScene ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">{selectedScene.type.replace(/-/g, ' ')}</h3>
                        <p className="text-xs text-gray-400">{msToSec(selectedScene.duration)}s · {selectedScene.elements.length} elements{selectedScene.transition ? ` · transition: ${selectedScene.transition.type}${selectedScene.transition.direction ? ` → ${selectedScene.transition.direction}` : ''}` : ''}</p>
                      </div>
                    </div>
                    <ElementTimeline scene={selectedScene} palette={visualSpec?.colors || {}} />
                  </div>

                  {visualSpec?.colors && Object.keys(visualSpec.colors).length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Color Palette</h4>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(visualSpec.colors).map(([k, v]) => (
                          <div key={k} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: v as string }} />
                            <div className="text-xs">
                              <p className="text-gray-700 font-medium">{k}</p>
                              <p className="text-gray-400 font-mono">{v as string}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {video && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Video Spec</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: 'Compositions', value: video.compositions },
                          { label: 'Duration', value: `${video.durationSeconds}s` },
                          { label: 'Resolution', value: `${video.width}×${video.height}` },
                          { label: 'FPS', value: video.fps },
                          { label: 'Total Frames', value: video.totalFrames },
                          { label: 'Formats', value: video.formats?.join(', ') || 'mp4' },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-gray-50 rounded p-3">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                            <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
                          </div>
                        ))}
                      </div>
                      {video.sceneGraph?.compositions && (
                        <div className="mt-4">
                          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Compositions</h5>
                          <div className="space-y-1">
                            {video.sceneGraph.compositions.map((c: any, i: number) => (
                              <div key={c.id} className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 rounded px-3 py-1.5">
                                <span className="text-gray-400 font-mono">C{i + 1}</span>
                                <span className="font-medium">{c.component}</span>
                                <span className="text-gray-400">{c.durationInFrames}f ({c.props?.transition ? `${c.props.transition.type} in/out` : 'no trans'})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-4 italic">Render via Remotion CLI for final MP4 output.</p>
                    </div>
                  )}
                </div>
              ) : (
                visualSpec ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">Select a scene from the timeline panel.</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
