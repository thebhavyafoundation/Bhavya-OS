"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  GitBranch,
  BookOpen,
  Zap,
  Star,
  Tag,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface TimelineEvent {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  event_date: string;
}

interface Repository {
  id: string;
  name: string;
}

const eventTypeConfig: Record<
  string,
  { color: string; icon: React.ReactNode }
> = {
  release: {
    color: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
    icon: <Tag size={12} />,
  },
  architecture: {
    color: "bg-blue-900/40 text-blue-300 border-blue-800",
    icon: <GitBranch size={12} />,
  },
  adr: {
    color: "bg-violet-900/40 text-violet-300 border-violet-800",
    icon: <BookOpen size={12} />,
  },
  technology: {
    color: "bg-amber-900/40 text-amber-300 border-amber-800",
    icon: <Zap size={12} />,
  },
  milestone: {
    color: "bg-pink-900/40 text-pink-300 border-pink-800",
    icon: <Star size={12} />,
  },
};

export default function TimelinePage() {
  const params = useParams();
  const id = params.id as string;
  const [repository, setRepository] = useState<Repository | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/timeline`);
      const data = await res.json();
      setRepository(data.repository);
      setTimeline(data.timeline || []);
      setLoading(false);
    }
    load();
  }, [id]);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div
              className="h-8 rounded w-1/3 mb-8"
              style={{ background: "var(--color-bg-tertiary)" }}
            />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 mb-8">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{ background: "var(--color-bg-tertiary)" }}
                />
                <div className="flex-1">
                  <div
                    className="h-5 rounded w-1/3 mb-2"
                    style={{ background: "var(--color-bg-tertiary)" }}
                  />
                  <div
                    className="h-4 rounded w-1/2"
                    style={{ background: "var(--color-bg-tertiary)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/repositories/${id}`}
            className="inline-flex items-center gap-2 text-sm transition-colors mb-6 hover:text-[var(--color-text-primary)]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <ArrowLeft size={14} />
            Back to repository
          </Link>

          <div className="mb-8">
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Timeline
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Engineering history of {repository?.name}
            </p>
          </div>

          {timeline.length === 0 ? (
            <div className="text-center py-20">
              <Clock
                size={24}
                className="mx-auto mb-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                No timeline events yet
              </p>
            </div>
          ) : (
            <div className="relative">
              <div
                className="absolute left-[23px] top-0 bottom-0 w-px"
                style={{ background: "var(--color-bg-tertiary)" }}
              />

              <div className="space-y-8">
                {timeline.map((event, i) => {
                  const config = eventTypeConfig[event.event_type] || {
                    color: "bg-zinc-800 text-zinc-400 border-zinc-700",
                    icon: <Clock size={12} />,
                  };

                  return (
                    <div key={event.id} className="flex gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${config.color} border`}
                      >
                        {config.icon}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${config.color}`}
                          >
                            {event.event_type}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {formatDate(event.event_date)}
                          </span>
                        </div>
                        <h3
                          className="text-sm font-medium mb-1"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {event.title}
                        </h3>
                        {event.description && (
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
