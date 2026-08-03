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
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 bg-[#27272a] rounded w-1/3 mb-8" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 mb-8">
                <div className="w-12 h-12 bg-[#27272a] rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-[#27272a] rounded w-1/3 mb-2" />
                  <div className="h-4 bg-[#27272a] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/repositories/${id}`}
            className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-[#fafafa] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to repository
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#fafafa]">Timeline</h1>
            <p className="text-sm text-[#71717a] mt-1">
              Engineering history of {repository?.name}
            </p>
          </div>

          {timeline.length === 0 ? (
            <div className="text-center py-20">
              <Clock size={24} className="mx-auto text-[#52525b] mb-3" />
              <p className="text-sm text-[#71717a]">No timeline events yet</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[23px] top-0 bottom-0 w-px bg-[#27272a]" />

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
                          <span className="text-xs text-[#52525b]">
                            {formatDate(event.event_date)}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-[#fafafa] mb-1">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-xs text-[#71717a]">
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
