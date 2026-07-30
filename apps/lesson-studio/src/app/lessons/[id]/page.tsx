'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import BuilderStatus from '@/components/builder-status';
import BuilderCard from '@/components/builder-card';
import {
  getLesson,
  getLessonArtifacts,
  requestCapability,
  getExecutionStatus,
  generateAssessment,
  generateTeacherGuide,
  generateWorkbook,
} from '@/lib/runtime-client';
import type { Lesson, Assessment, TeacherGuide, Workbook, BuildStatus } from '@/lib/types';

const tabs = [
  { id: 'content', label: 'Lesson Content' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'guide', label: 'Teacher Guide' },
  { id: 'workbook', label: 'Workbook' },
  { id: 'preview', label: 'Preview' },
  { id: 'publish', label: 'Publish' },
  { id: 'animation', label: 'Animation Studio' },
];

export default function LessonPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('content');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [teacherGuide, setTeacherGuide] = useState<TeacherGuide | null>(null);
  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLesson();
  }, [params.id]);

  const loadLesson = async () => {
    setLoading(true);
    try {
      const l = await getLesson(params.id);
      if (l) {
        setLesson(l);
        // Load artifacts in parallel
        getLessonArtifacts(params.id).then(artifacts => {
          if (artifacts.assessment) setAssessment(artifacts.assessment);
          if (artifacts.teacherGuide) setTeacherGuide(artifacts.teacherGuide);
          if (artifacts.workbook) setWorkbook(artifacts.workbook);
        }).catch(() => {});
      } else {
        setError('Lesson not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lesson');
    }
    setLoading(false);
  };

  const runBuilder = async (capability: string, builderName: string) => {
    if (!lesson) return;
    setBuildStatus({
      id: 'starting',
      capability,
      builder: builderName,
      status: 'queued',
      progress: 0,
      steps: [],
      qualityGates: [],
    });

    try {
      let result: BuildStatus;

      if (capability === 'quiz_generation') {
        result = await generateAssessment({ ...lesson }, {});
      } else if (capability === 'lesson_generation' && builderName === 'teacher-guide') {
        result = await generateTeacherGuide({ ...lesson }, {});
      } else if (capability === 'lesson_generation' && builderName === 'workbook') {
        result = await generateWorkbook({ ...lesson }, {});
      } else {
        result = await requestCapability(capability, { lesson });
      }

      setBuildStatus(result);

      // Reload artifacts on success
      if (result.status === 'completed') {
        const artifacts = await getLessonArtifacts(params.id).catch(() => null);
        if (artifacts) {
          if (artifacts.assessment) setAssessment(artifacts.assessment);
          if (artifacts.teacherGuide) setTeacherGuide(artifacts.teacherGuide);
          if (artifacts.workbook) setWorkbook(artifacts.workbook);
        }
      }
    } catch (err) {
      setBuildStatus({
        id: 'error',
        capability,
        builder: builderName,
        status: 'failed',
        progress: 0,
        steps: [],
        qualityGates: [],
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center py-12 text-gray-500">Loading lesson...</div>
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
              <p className="text-4xl mb-4">⚠️</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lesson not found</h3>
              <p className="text-gray-500">{error || 'The lesson could not be loaded.'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <a href="/lessons" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
                ← Back to Lessons
              </a>
              <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>{lesson.subject} · Grade {lesson.grade}</span>
                <span>{lesson.duration} min</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700 capitalize">
                  {lesson.status}
                </span>
                <span>v{lesson.version}</span>
              </div>
            </div>
          </div>

          {buildStatus && (
            <div className="mb-6">
              <BuilderStatus status={buildStatus as any} />
            </div>
          )}

          <div className="flex gap-4 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Learning Outcomes</h3>
                {lesson.learningOutcomes?.length > 0 ? (
                  <div className="space-y-2">
                    {lesson.learningOutcomes.map((lo, i) => (
                      <div key={lo.id || i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium uppercase">
                          {lo.bloomLevel}
                        </span>
                        <p className="text-sm text-gray-700">{lo.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No learning outcomes defined.</p>
                )}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Lesson Sections</h3>
                {lesson.sections?.length > 0 ? (
                  <div className="space-y-3">
                    {lesson.sections.map((section, i) => (
                      <div key={section.id || i} className="p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {section.type?.replace('-', ' ') || 'section'}
                          </span>
                          <h4 className="font-medium text-gray-900">{section.title}</h4>
                          <span className="text-xs text-gray-400 ml-auto">Section {section.order}</span>
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{section.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No sections defined.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Generate assessment questions from lesson content</p>
                <button
                  onClick={() => runBuilder('quiz_generation', 'assessment')}
                  disabled={buildStatus?.status === 'running'}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {buildStatus?.status === 'running' ? 'Generating...' : 'Run Assessment Builder'}
                </button>
              </div>
              {assessment?.questions && assessment.questions.length > 0 ? (
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {assessment.title || 'Assessment'}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {assessment.questions.length} questions · {assessment.totalPoints} points · Pass: {assessment.passingScore}
                      </span>
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
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-3xl mb-4">✅</p>
                  <p className="text-gray-500">No assessment generated yet. Click "Run Assessment Builder" to create one.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Generate teacher guide with objectives, vocabulary, discussion prompts, and timing</p>
                <button
                  onClick={() => runBuilder('lesson_generation', 'teacher-guide')}
                  disabled={buildStatus?.status === 'running'}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {buildStatus?.status === 'running' ? 'Generating...' : 'Run Teacher Guide Builder'}
                </button>
              </div>
              {teacherGuide ? (
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{teacherGuide.title || 'Teacher Guide'}</h3>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Objectives ({teacherGuide.objectives?.length || 0})</h4>
                      <ul className="space-y-1">
                        {teacherGuide.objectives?.map((obj, i) => (
                          <li key={i} className="text-sm text-gray-600">• {obj}</li>
                        ))}
                      </ul>
                    </div>

                    {teacherGuide.vocabulary?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Vocabulary ({teacherGuide.vocabulary.length})</h4>
                        <div className="flex flex-wrap gap-1">
                          {teacherGuide.vocabulary.map((v, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{v}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {teacherGuide.timingGuide?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Timing Guide ({teacherGuide.totalDuration} min total)</h4>
                        <div className="space-y-1">
                          {teacherGuide.timingGuide.map((t, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{t.section}</span>
                              <span className="text-gray-400">{t.duration} min</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {teacherGuide.discussionPrompts?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Discussion Prompts</h4>
                        <ul className="space-y-1">
                          {teacherGuide.discussionPrompts.map((p, i) => (
                            <li key={i} className="text-sm text-gray-600">• {p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-3xl mb-4">🎓</p>
                  <p className="text-gray-500">No teacher guide generated yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'workbook' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Generate printable student workbook with exercises and activities</p>
                <button
                  onClick={() => runBuilder('lesson_generation', 'workbook')}
                  disabled={buildStatus?.status === 'running'}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {buildStatus?.status === 'running' ? 'Generating...' : 'Run Workbook Builder'}
                </button>
              </div>
              {workbook?.pages && workbook.pages.length > 0 ? (
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{workbook.title || 'Workbook'}</h3>
                      <span className="text-sm text-gray-500">{workbook.totalPages} pages · {workbook.totalPoints} points</span>
                    </div>
                    {workbook.pages.map((page, i) => (
                      <div key={i} className="p-3 border border-gray-100 rounded-lg mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded capitalize">{page.type}</span>
                          <h4 className="text-sm font-medium text-gray-700">{page.title}</h4>
                        </div>
                        {page.questions && (
                          <div className="mt-2 space-y-1">
                            {page.questions.map((q, qi) => (
                              <p key={qi} className="text-xs text-gray-600">{qi + 1}. {typeof q === 'string' ? q : q.prompt}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-3xl mb-4">📄</p>
                  <p className="text-gray-500">No workbook generated yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Preview visual specifications and animation for this lesson.</p>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Visual Specification</h3>
                    <button
                      onClick={() => runBuilder('visual_spec_generation', 'visual-spec')}
                      disabled={buildStatus?.status === 'running'}
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 disabled:opacity-50"
                    >
                      Generate Visual Spec
                    </button>
                  </div>
                  {buildStatus?.result?.output?.visualSpec ? (
                    <div className="space-y-3">
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-500">Scenes: <strong>{buildStatus.result.output.visualSpec.totalScenes}</strong></span>
                        <span className="text-gray-500">Duration: <strong>{(buildStatus.result.output.visualSpec.totalDuration / 1000).toFixed(0)}s</strong></span>
                        <span className="text-gray-500">Version: <strong>{buildStatus.result.output.visualSpec.version}</strong></span>
                      </div>
                      <div className="flex gap-2">
                        {Object.entries(buildStatus.result.output.visualSpec.colors || {}).map(([k, v]) => (
                          <div key={k} className="flex items-center gap-1 text-xs text-gray-500">
                            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: v as string }}></span>
                            {k}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {(buildStatus.result.output.visualSpec.scenes || []).map((scene: any, i: number) => (
                          <div key={scene.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Scene {i + 1}: {scene.type}</span>
                              <span className="text-xs text-gray-400">{(scene.duration / 1000).toFixed(0)}s</span>
                            </div>
                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                              {(scene.elements || []).map((el: any, j: number) => (
                                <span key={j} className="px-2 py-0.5 bg-white rounded border border-gray-200">{el.type}:{el.animation}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Click "Generate Visual Spec" to create a visual specification from the lesson content.</p>
                  )}
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Animation Preview</h3>
                    <button
                      onClick={() => runBuilder('video_generation', 'video')}
                      disabled={buildStatus?.status === 'running'}
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 disabled:opacity-50"
                    >
                      Generate Animation
                    </button>
                  </div>
                  {buildStatus?.result?.output?.video ? (
                    <div className="space-y-3">
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-500">Compositions: <strong>{buildStatus.result.output.video.compositions}</strong></span>
                        <span className="text-gray-500">Duration: <strong>{buildStatus.result.output.video.durationSeconds}s</strong></span>
                        <span className="text-gray-500">Resolution: <strong>{buildStatus.result.output.video.width}x{buildStatus.result.output.video.height}</strong></span>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-sm">
                          🎬 Preview not available — render via Remotion CLI
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {buildStatus.result.output.video.compositions} compositions, {buildStatus.result.output.video.totalFrames} frames at {buildStatus.result.output.video.fps}fps
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Generate a visual spec first, then click to create the animation preview.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'publish' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Publish lesson materials to website, PDF, or offline package</p>
              <div className="grid grid-cols-2 gap-4">
                <BuilderCard builderId="website" onInvoke={() => runBuilder('website_generation', 'website')} disabled={buildStatus?.status === 'running'} />
                <BuilderCard builderId="video" onInvoke={() => runBuilder('video_generation', 'video')} disabled={buildStatus?.status === 'running'} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <BuilderCard builderId="slides" disabled />
                <BuilderCard builderId="pdf" disabled />
              </div>
            </div>
          )}

          {activeTab === 'animation' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Open the Animation Studio to build a scene timeline, element animation chart, and video spec.</p>
              <Link href={`/animation/${params.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                <span>🎬</span>
                Open Animation Studio
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
