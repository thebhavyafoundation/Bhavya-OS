"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/apple-springs";
import { ChevronRight, CheckCircle, Clock, BookOpen } from "lucide-react";
import { getLessonsForModule } from "@/lib/curriculum/lessons";

gsap.registerPlugin(ScrollTrigger);

interface PinnedLessonSidebarProps {
  moduleId: string;
  currentLessonId: string;
  syncScroll?: boolean;
  className?: string;
  showProgress?: boolean;
  userId?: string;
}

export function PinnedLessonSidebar({
  moduleId,
  currentLessonId,
  syncScroll = true,
  className = "",
  showProgress = true,
  userId,
}: PinnedLessonSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lessonRefs = useRef<Map<string, HTMLElement>>(new Map<string, HTMLElement>()) as React.MutableRefObject<Map<string, HTMLElement>>;
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [activeLesson, setActiveLesson] = useState(currentLessonId);
  const [lessonProgress, setLessonProgress] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setPrefersReduced(prefersReducedMotion());
  }, []);

  const lessons = getLessonsForModule(moduleId);

  useEffect(() => {
    if (!syncScroll || prefersReduced) return;

    const sidebar = sidebarRef.current;
    const content = contentRef.current;
    if (!sidebar || !content) return;

    const handleScroll = () => {
      let currentVisible: string | null = null;
      let maxVisibility = 0;

      lessonRefs.current.forEach((element, lessonId) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / rect.height;

        if (visibilityRatio > maxVisibility) {
          maxVisibility = visibilityRatio;
          currentVisible = lessonId;
        }
      });

      if (currentVisible && currentVisible !== activeLesson) {
        setActiveLesson(currentVisible);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [syncScroll]);

  useEffect(() => {
    if (!syncScroll || prefersReduced) return;

    const sidebar = sidebarRef.current;
    const activeElement = lessonRefs.current.get(activeLesson);
    if (sidebar && activeElement) {
      sidebar.scrollTo({
        top: activeElement.offsetTop - sidebar.offsetHeight / 2 + activeElement.offsetHeight / 2,
        behavior: "smooth",
      });
    }
  }, [activeLesson, syncScroll]);

  useEffect(() => {
    if (!syncScroll || prefersReduced) return;

    const sidebar = sidebarRef.current;
    const content = contentRef.current;
    if (!sidebar || !content) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: content,
        start: "top top",
        end: "bottom bottom",
        pin: sidebar,
        pinSpacing: false,
        anticipatePin: 1,
        onToggle: (self) => setIsPinned(self.isActive),
      });

      const lessonElements = Array.from(lessonRefs.current.entries());
      lessonElements.forEach(([lessonId, element]) => {
        ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveLesson(lessonId);
          },
        });
      });
    }, sidebar);

    return () => ctx.revert();
  }, [syncScroll, prefersReduced, lessons.length]);

  useEffect(() => {
    if (!userId || !showProgress) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/curriculum/progress?userId=${userId}&moduleId=${moduleId}`);
        if (res.ok) {
          const data = await res.json();
          setLessonProgress(new Map(Object.entries(data.lessons || {})));
        }
      } catch {
        // Ignore errors
      }
    };

    fetchProgress();
  }, [userId, moduleId, showProgress]);

  const _totalLessons = lessons.length;
  const _completedLessons = Array.from(lessonProgress.values()).filter((p) => p >= 100).length;

  return (
    <div
      className={`pinned-lesson-sidebar ${isPinned ? "is-pinned" : ""} ${className}`}
      ref={sidebarRef}
      style={{
        position: "sticky",
        top: "var(--header-h)",
        height: "calc(100vh - var(--header-h))",
        overflowY: "auto",
        padding: "var(--space-6)",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border-primary)",
        transition: "all var(--duration-normal) var(--ease-out)",
        ...(prefersReduced ? { position: "relative", top: "auto", height: "auto" } : {}),
      }}
    >
      <div style={{ marginBottom: "var(--space-6)", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--color-border-primary)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "1.5rem" }} aria-hidden="true">📚</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 400, color: "var(--color-text-primary)" }}>
              {"Module"}
            </h2>
          </div>
          {showProgress && (
            <div style={{ textAlign: "right", minWidth: "60px" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>
                Progress
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 400, color: "var(--color-brand-forest)" }}>
                {lessons.filter((l) => (lessonProgress.get(l.id) || 0) >= 100).length}/{lessons.length}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "var(--space-3)" }}>
          <div className="ai-progress-track" style={{ height: "6px", borderRadius: "var(--radius-full)", background: "var(--color-border-primary)", overflow: "hidden" }}>
            <div
              className="ai-progress-fill"
              style={{
                height: "100%",
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(90deg, var(--color-brand-forest), var(--color-accent-gold))",
                width: `${((lessons.filter((l) => (lessonProgress.get(l.id) || 0) >= 100).length) / lessons.length) * 100}%`,
                transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        </div>
      </div>

      <nav aria-label="Lesson navigation" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {lessons.map((lesson, index) => {
          const isActive = lesson.id === activeLesson;
          const isCurrent = lesson.id === currentLessonId;
          const progress = lessonProgress.get(lesson.id) || 0;
          const isCompleted = progress >= 100;

          return (
            <div
              key={lesson.id}
          ref={(el) => { if (el) lessonRefs.current.set(lesson.id, el as HTMLDivElement); }}
              className={`lesson-nav-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                background: isActive
                  ? "var(--color-surface-forest-light)"
                  : isCompleted
                  ? "var(--color-surface)"
                  : "transparent",
                border: isActive
                  ? "1px solid var(--color-border-gold)"
                  : isCompleted
                  ? "1px solid var(--color-border-gold)"
                  : "1px solid transparent",
                cursor: "pointer",
                transition: "all var(--duration-fast) ease",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() => {
                if (syncScroll) {
                  const element = lessonRefs.current.get(lesson.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isCompleted) {
                  gsap.to(e.currentTarget, { background: "var(--color-surface-hover)", duration: 0.2 });
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !isCompleted) {
                  gsap.to(e.currentTarget, { background: "transparent", duration: 0.2 });
                }
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "28px",
                  height: "28px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="12"
                    fill="none"
                    stroke="var(--color-border-primary)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="12"
                    fill="none"
                    stroke={isCompleted ? "var(--color-brand-forest)" : isActive ? "var(--color-accent-gold)" : "var(--color-border-gold)"}
                    strokeWidth="2"
                    strokeDasharray="75.4"
                    strokeDashoffset={`${75.4 * (1 - (lessonProgress.get(lesson.id) || 0) / 100)}`}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                      transformOrigin: "center",
                    }}
                  />
                </svg>
                {isCompleted && (
                  <CheckCircle
                    style={{
                      position: "absolute",
                      width: "16px",
                      height: "16px",
                      color: "var(--color-brand-forest)",
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      color: isActive ? "var(--color-brand-forest)" : isCompleted ? "var(--color-brand-forest)" : "var(--color-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Lesson {index + 1}
                  </span>
                  {isCurrent && (
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        padding: "1px var(--space-2)",
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-accent-gold)",
                        color: "var(--color-forest-950)",
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>

                <h4
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--color-text-primary)" : isCompleted ? "var(--color-text-secondary)" : "var(--color-text-primary)",
                    lineHeight: 1.4,
                    marginBottom: "var(--space-1)",
                  }}
                >
                  {lesson.title}
                </h4>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  {lesson.durationMin && (
                    <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                      <Clock size={10} />
                      {lesson.durationMin} min
                    </span>
                  )}
                  <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                    <BookOpen size={10} />
                    {lesson.blocks?.length || 0} blocks
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "var(--space-2)",
                    height: "4px",
                    background: "var(--color-border-primary)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "var(--radius-full)",
                      background: "linear-gradient(90deg, var(--color-brand-forest), var(--color-accent-gold))",
                      width: `${lessonProgress.get(lesson.id) || 0}%`,
                      transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                </div>
              </div>

              <ChevronRight
                style={{
                  width: "20px",
                  height: "20px",
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                  transition: "transform var(--duration-fast) ease, color var(--duration-fast) ease",
                }}
              />
            </div>
          );
        })}
      </nav>

      <div style={{ marginTop: "var(--space-6)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-primary)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)", textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 400, color: "var(--color-brand-forest)" }}>
              {lessons.filter((l) => (lessonProgress.get(l.id) || 0) >= 100).length}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Completed</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 400, color: "var(--color-accent-gold)" }}>
              {lessons.filter((l) => (lessonProgress.get(l.id) || 0) > 0 && (lessonProgress.get(l.id) || 0) < 100).length}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>In Progress</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 400, color: "var(--color-text-muted)" }}>
              {lessons.filter((l) => (lessonProgress.get(l.id) || 0) === 0).length}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Not Started</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SyncedLessonContent({
  moduleId,
  currentLessonId,
  className = "",
  children,
}: {
  moduleId: string;
  currentLessonId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const lessonRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [activeLesson, setActiveLesson] = useState(currentLessonId);

  useEffect(() => {
    setPrefersReduced(prefersReducedMotion());
  }, []);

  const lessons = getLessonsForModule(moduleId);

  useEffect(() => {
    if (prefersReduced) return;

    const handleScroll = () => {
      let currentVisible: string | null = null;
      let maxVisibility = 0;

      lessonRefs.current.forEach((element, lessonId) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / rect.height;

        if (visibilityRatio > maxVisibility) {
          maxVisibility = visibilityRatio;
          currentVisible = lessonId;
        }
      });

      if (currentVisible && currentVisible !== activeLesson) {
        setActiveLesson(currentVisible);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReduced, lessons.length]);

  return (
    <div
      ref={contentRef}
      className={`synced-lesson-content ${className}`}
      style={{ padding: "var(--space-8)", maxWidth: "800px", margin: "0 auto" }}
    >
      {children}

      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          ref={(el: HTMLDivElement | null) => { if (el) lessonRefs.current.set(lesson.id, el); }}
          id={`lesson-${lesson.id}`}
          style={{
            minHeight: "400px",
            marginBottom: "var(--space-16)",
            opacity: lesson.id === activeLesson ? 1 : 0.6,
            transition: "opacity 0.3s ease",
          }}
        >
          {lesson.blocks.map((block, index) => (
            <div key={index} style={{ marginBottom: "var(--space-8)" }}>
              {block.kind === "prose" && (
                <div className="ai-prose" style={{ marginBottom: "var(--space-6)" }}>
                  {block.text.split("\n").map((line, i) =>
                    line.startsWith("- ") ? (
                      <ul key={i} style={{ marginLeft: "var(--space-5)" }}>
                        <li style={{ marginBottom: "var(--space-2)" }}>{line.slice(2)}</li>
                      </ul>
                    ) : line.trim() ? (
                      <p key={i} style={{ marginBottom: "var(--space-4)", lineHeight: 1.7 }}>{line}</p>
                    ) : null
                  )}
                </div>
              )}
              {block.kind === "interactive" && (
                <div className="ai-block" style={{ marginBottom: "var(--space-6)" }}>
                  <h3 className="ai-block-title">Try it</h3>
                </div>
              )}
              {block.kind === "experiment" && (
                <div className="ai-block" style={{ marginBottom: "var(--space-6)" }}>
                  <h3 className="ai-block-title">Hands-on Lab: {block.title}</h3>
                  <ol className="ai-steps" style={{ marginLeft: "var(--space-5)" }}>
                    {block.steps.map((step, i) => (
                      <li key={i} style={{ marginBottom: "var(--space-3)" }}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
              {block.kind === "project" && (
                <div className="ai-block" style={{ marginBottom: "var(--space-6)" }}>
                  <h3 className="ai-block-title">Project: {block.brief}</h3>
                  <p className="ai-project-brief">{block.brief}</p>
                  <ol className="ai-steps" style={{ marginLeft: "var(--space-5)" }}>
                    {block.steps.map((step, i) => (
                      <li key={i} style={{ marginBottom: "var(--space-3)" }}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            ))}
      </div>
      ))}
      </div>
    );
  }

export function LessonPageLayout({
  moduleId,
  currentLessonId,
  userId,
  className = "",
  children,
}: {
  moduleId: string;
  currentLessonId: string;
  userId?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`lesson-page-layout ${className}`} style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, minHeight: "100vh" }}>
      <PinnedLessonSidebar
        moduleId={moduleId}
        currentLessonId={currentLessonId}
        userId={userId}
        syncScroll={true}
        showProgress={true}
      />
      <SyncedLessonContent
        moduleId={moduleId}
        currentLessonId={currentLessonId}
      >
        {children}
      </SyncedLessonContent>
    </div>
  );
}