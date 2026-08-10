"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Layers,
  Rocket,
  Loader2,
  ChevronRight,
  Sparkles,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import {
  getLesson,
  getAssessment,
  generateAssessment,
  getTeacherGuide,
  generateTeacherGuide,
  getWorkbook,
  generateWorkbook,
  publishLesson,
} from "@/lib/studio/runtime-client";
import {
  getGatesForBuilder,
  getGateLabel,
  type GateResult,
} from "@/lib/studio/quality-gates";

const TABS = [
  { id: "content", label: "Content", icon: BookOpen },
  { id: "assessment", label: "Assessment", icon: ClipboardList },
  { id: "teacher-guide", label: "Teacher Guide", icon: FileText },
  { id: "workbook", label: "Workbook", icon: Layers },
  { id: "publish", label: "Publish", icon: Rocket },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface LessonData {
  id: string;
  title: string;
  domain?: string;
  targetAge?: string;
  sections?: { title: string; content: string; duration?: number }[];
  learningOutcomes?: string[];
  vocabulary?: { term: string; definition: string }[];
}

interface AssessmentData {
  questions?: { type: string; question: string; options?: string[]; answer: string }[];
}

interface TeacherGuideData {
  objectives?: string[];
  materials?: string[];
  discussionPrompts?: string[];
  timing?: { segment: string; minutes: number }[];
}

interface WorkbookData {
  pages?: { title: string; content: string }[];
}

const PUBLISH_TARGETS = [
  {
    id: "website",
    title: "Website",
    description: "Publish as a hosted lesson page with navigation and styling",
    status: "ready",
  },
  {
    id: "offline",
    title: "Offline Package",
    description: "Bundle all artifacts into a self-contained folder",
    status: "ready",
  },
  {
    id: "pdf",
    title: "PDF Export",
    description: "Generate printable PDFs for teacher guide and workbook",
    status: "ready",
  },
];

export default function LessonDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [teacherGuide, setTeacherGuide] = useState<TeacherGuideData | null>(null);
  const [workbook, setWorkbook] = useState<WorkbookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [qualityResults, setQualityResults] = useState<GateResult[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ success: boolean; path?: string; message?: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getLesson(id)
      .then((data) => setLesson(data as unknown as LessonData))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || activeTab !== "assessment") return;
    getAssessment(id).then((data) => setAssessment(data as unknown as AssessmentData)).catch(() => {});
  }, [id, activeTab]);

  useEffect(() => {
    if (!id || activeTab !== "teacher-guide") return;
    getTeacherGuide(id).then((data) => setTeacherGuide(data as unknown as TeacherGuideData)).catch(() => {});
  }, [id, activeTab]);

  useEffect(() => {
    if (!id || activeTab !== "workbook") return;
    getWorkbook(id).then((data) => setWorkbook(data as unknown as WorkbookData)).catch(() => {});
  }, [id, activeTab]);

  async function handleGenerateAssessment() {
    if (!lesson) return;
    setGenerating("assessment");
    try {
      const data = await generateAssessment(lesson as unknown as Record<string, unknown>);
      setAssessment(data as unknown as AssessmentData);
    } finally {
      setGenerating(null);
    }
  }

  async function handleGenerateTeacherGuide() {
    if (!lesson) return;
    setGenerating("teacher-guide");
    try {
      const data = await generateTeacherGuide(lesson as unknown as Record<string, unknown>);
      setTeacherGuide(data as unknown as TeacherGuideData);
    } finally {
      setGenerating(null);
    }
  }

  async function handleGenerateWorkbook() {
    if (!lesson) return;
    setGenerating("workbook");
    try {
      const data = await generateWorkbook(lesson as unknown as Record<string, unknown>);
      setWorkbook(data as unknown as WorkbookData);
    } finally {
      setGenerating(null);
    }
  }

  async function handleRunQualityGates() {
    if (!lesson) return;
    setGenerating("quality-gates");
    try {
      const gateIds = getGatesForBuilder("lesson");
      const results: GateResult[] = gateIds.map((gateId) => {
        const checks: { name: string; status: string; message?: string }[] = [];
        if (gateId === "structure") {
          const hasSections = lesson.sections && lesson.sections.length > 0;
          const hasOutcomes = lesson.learningOutcomes && lesson.learningOutcomes.length > 0;
          checks.push({ name: "Sections exist", status: hasSections ? "passed" : "failed", message: hasSections ? undefined : "No sections found" });
          checks.push({ name: "Learning outcomes exist", status: hasOutcomes ? "passed" : "failed", message: hasOutcomes ? undefined : "No learning outcomes" });
        } else if (gateId === "content") {
          const totalWords = (lesson.sections || []).reduce((sum: number, s: { content: string }) => sum + (s.content?.split(/\s+/).length || 0), 0);
          checks.push({ name: "Sufficient content", status: totalWords > 100 ? "passed" : totalWords > 0 ? "warning" : "failed", message: `${totalWords} words` });
        } else if (gateId === "grade-level") {
          checks.push({ name: "Target age specified", status: lesson.targetAge ? "passed" : "warning", message: lesson.targetAge || "Not specified" });
        } else if (gateId === "outcomes") {
          const count = lesson.learningOutcomes?.length || 0;
          checks.push({ name: "Has learning outcomes", status: count >= 3 ? "passed" : count > 0 ? "warning" : "failed", message: `${count} outcomes` });
        } else if (gateId === "integrity") {
          checks.push({ name: "Has title", status: lesson.title ? "passed" : "failed" });
          checks.push({ name: "Has domain", status: lesson.domain ? "passed" : "warning" });
        } else {
          checks.push({ name: getGateLabel(gateId), status: "passed" });
        }
        const failed = checks.some((c) => c.status === "failed");
        const warned = checks.some((c) => c.status === "warning");
        return { id: gateId, status: failed ? "failed" : warned ? "warning" : "passed", checks };
      });
      setQualityResults(results);
    } finally {
      setGenerating(null);
    }
  }

  async function handlePublish(target: string) {
    if (!lesson) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      const result = await publishLesson(lesson.id, target);
      setPublishResult({ success: true, path: result.path, message: `Published to ${target}` });
    } catch (err) {
      setPublishResult({ success: false, message: err instanceof Error ? err.message : "Publish failed" });
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Lesson not found.</p>
        <Link
          href="/studio/lessons"
          className="text-sm font-medium text-accent-gold hover:underline"
        >
          Back to lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-text-secondary">
        <Link href="/studio" className="hover:text-text-primary">
          Studio
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/studio/lessons" className="hover:text-text-primary">
          Lessons
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text-primary">{lesson.title}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">
          {lesson.title}
        </h1>
        <div className="flex flex-wrap gap-2 text-sm text-text-secondary">
          {lesson.domain && (
            <span className="rounded-full bg-surface-secondary px-3 py-0.5 font-medium">
              {lesson.domain}
            </span>
          )}
          {lesson.targetAge && (
            <span className="rounded-full bg-surface-secondary px-3 py-0.5">
              {lesson.targetAge}
            </span>
          )}
        </div>
      </header>

      <div className="flex gap-1 overflow-x-auto border-b border-border-primary">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-accent-gold text-accent-gold"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-6">
        {activeTab === "content" && (
          <div className="space-y-8">
            {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-text-primary">
                  Learning Outcomes
                </h2>
                <ul className="space-y-2">
                  {lesson.learningOutcomes.map((outcome, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {lesson.sections && lesson.sections.length > 0 ? (
              lesson.sections.map((section, i) => (
                <section key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">
                      {section.title}
                    </h2>
                    {section.duration != null && (
                      <span className="text-xs text-text-secondary">
                        {section.duration} min
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                    {section.content}
                  </p>
                </section>
              ))
            ) : (
              <p className="text-sm text-text-secondary">
                No sections available yet.
              </p>
            )}

            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-text-primary">
                  Vocabulary
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {lesson.vocabulary.map((v, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-surface-secondary px-4 py-2"
                    >
                      <span className="text-sm font-medium text-text-primary">
                        {v.term}
                      </span>
                      <p className="text-xs text-text-secondary">
                        {v.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Assessment
              </h2>
              <button
                onClick={handleGenerateAssessment}
                disabled={generating === "assessment"}
                className="flex items-center gap-2 rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {generating === "assessment" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {assessment ? "Regenerate" : "Generate"}
              </button>
            </div>

            {assessment?.questions && assessment.questions.length > 0 ? (
              <div className="space-y-4">
                {assessment.questions.map((q, i) => (
                  <div
                    key={i}
                    className="space-y-2 rounded-xl border border-border-primary bg-surface-primary p-4"
                  >
                    <p className="text-sm font-medium text-text-primary">
                      <span className="text-accent-gold">Q{i + 1}.</span>{" "}
                      {q.question}
                    </p>
                    {q.options && (
                      <ul className="space-y-1 pl-4 text-sm text-text-secondary">
                        {q.options.map((opt, j) => (
                          <li key={j}>{opt}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs text-text-secondary">
                      <span className="font-medium text-text-primary">
                        Answer:
                      </span>{" "}
                      {q.answer}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                No assessment generated yet. Click Generate to create one.
              </p>
            )}
          </div>
        )}

        {activeTab === "teacher-guide" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Teacher Guide
              </h2>
              <button
                onClick={handleGenerateTeacherGuide}
                disabled={generating === "teacher-guide"}
                className="flex items-center gap-2 rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {generating === "teacher-guide" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {teacherGuide ? "Regenerate" : "Generate"}
              </button>
            </div>

            {teacherGuide ? (
              <div className="space-y-6">
                {teacherGuide.objectives &&
                  teacherGuide.objectives.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                        Objectives
                      </h3>
                      <ul className="space-y-1">
                        {teacherGuide.objectives.map((obj, i) => (
                          <li
                            key={i}
                            className="text-sm text-text-secondary"
                          >
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                {teacherGuide.materials &&
                  teacherGuide.materials.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                        Materials
                      </h3>
                      <ul className="space-y-1">
                        {teacherGuide.materials.map((mat, i) => (
                          <li
                            key={i}
                            className="text-sm text-text-secondary"
                          >
                            {mat}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                {teacherGuide.discussionPrompts &&
                  teacherGuide.discussionPrompts.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                        Discussion Prompts
                      </h3>
                      <ul className="space-y-1">
                        {teacherGuide.discussionPrompts.map((dp, i) => (
                          <li
                            key={i}
                            className="text-sm text-text-secondary"
                          >
                            {dp}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                {teacherGuide.timing && teacherGuide.timing.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                      Timing
                    </h3>
                    <div className="space-y-1">
                      {teacherGuide.timing.map((t, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-text-secondary">
                            {t.segment}
                          </span>
                          <span className="font-medium text-text-primary">
                            {t.minutes} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                No teacher guide generated yet. Click Generate to create one.
              </p>
            )}
          </div>
        )}

        {activeTab === "workbook" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Workbook
              </h2>
              <button
                onClick={handleGenerateWorkbook}
                disabled={generating === "workbook"}
                className="flex items-center gap-2 rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {generating === "workbook" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {workbook ? "Regenerate" : "Generate"}
              </button>
            </div>

            {workbook?.pages && workbook.pages.length > 0 ? (
              <div className="space-y-4">
                {workbook.pages.map((page, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border-primary bg-surface-primary p-4"
                  >
                    <h3 className="mb-2 text-sm font-semibold text-text-primary">
                      Page {i + 1}: {page.title}
                    </h3>
                    <p className="whitespace-pre-wrap text-sm text-text-secondary">
                      {page.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                No workbook generated yet. Click Generate to create one.
              </p>
            )}
          </div>
        )}

        {activeTab === "publish" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Publish</h2>
              <button
                onClick={handleRunQualityGates}
                disabled={generating === "quality-gates"}
                className="flex items-center gap-2 rounded-lg border border-border-primary px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-accent-gold disabled:opacity-50"
              >
                {generating === "quality-gates" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="h-3.5 w-3.5" />
                )}
                Run Quality Gates
              </button>
            </div>

            {qualityResults.length > 0 && (
              <div className="space-y-2">
                {qualityResults.map((result) => (
                  <div key={result.id} className="rounded-lg border border-border-primary bg-surface-primary p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {result.status === "passed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {result.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {result.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                      <span className="text-sm font-medium text-text-primary">{getGateLabel(result.id)}</span>
                      <span className={`text-xs font-medium ${result.status === "passed" ? "text-green-500" : result.status === "warning" ? "text-yellow-500" : "text-red-500"}`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-6 space-y-0.5">
                      {result.checks.map((check, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                          {check.status === "passed" ? "✓" : check.status === "warning" ? "⚠" : "✗"}
                          <span>{check.name}</span>
                          {check.message && <span className="text-text-muted">({check.message})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              {PUBLISH_TARGETS.map((target) => (
                <div
                  key={target.id}
                  className="flex flex-col items-start gap-3 rounded-xl border border-border-primary bg-surface-primary p-5 transition-colors hover:border-accent-gold/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-gold/10">
                    <Rocket className="h-5 w-5 text-accent-gold" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {target.title}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {target.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePublish(target.id)}
                    disabled={publishing}
                    className="mt-auto flex items-center gap-1.5 rounded-lg bg-accent-gold px-4 py-1.5 text-xs font-medium text-text-inverse transition-colors hover:bg-accent-gold-hover disabled:opacity-50"
                  >
                    {publishing ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    Export
                  </button>
                </div>
              ))}
            </div>

            {publishResult && (
              <div className={`rounded-lg px-4 py-3 text-sm ${publishResult.success ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {publishResult.success ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>{publishResult.message}</span>
                    {publishResult.path && (
                      <a href={publishResult.path} className="underline hover:text-green-300 ml-2">View</a>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    <span>{publishResult.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
