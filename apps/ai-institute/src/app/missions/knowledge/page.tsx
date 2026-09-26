"use client";

import { useState, useEffect } from "react";
import { getMissionProfile } from "@/data/mission-profiles";
import { MissionPage } from "@/components/site/MissionPage";

interface EvidenceEntry {
  id: string;
  activityType: string;
  description: string;
  timestamp: string;
}

interface KnowledgeStats {
  totalKos: number;
  totalLessons: number;
  totalPublications: number;
  koCreatedThisMonth: number;
  lessonsPublishedThisMonth: number;
  evidenceCounts: Record<string, number>;
  recentEvidence: EvidenceEntry[];
  lastUpdated: string | null;
}

export default function KnowledgeMissionPage() {
  const [stats, setStats] = useState<KnowledgeStats | null>(null);

  useEffect(() => {
    fetch("/api/knowledge/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          totalKos: data.totalKos || 0,
          totalLessons: data.totalLessons || 0,
          totalPublications: data.totalPublications || 0,
          koCreatedThisMonth: data.koCreatedThisMonth || 0,
          lessonsPublishedThisMonth: data.lessonsPublishedThisMonth || 0,
          evidenceCounts: data.evidenceCounts || {},
          recentEvidence: data.recentEvidence || [],
          lastUpdated: data.lastUpdated,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <MissionPage
      profile={getMissionProfile("knowledge")}
      activity={
        stats ? (
          <>
            <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Knowledge Objects", value: stats.totalKos },
                { label: "Lessons", value: stats.totalLessons },
                { label: "Publications", value: stats.totalPublications },
                { label: "New This Month", value: stats.koCreatedThisMonth },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border-primary bg-bg-secondary p-5 text-center"
                >
                  <div className="mb-1 text-3xl font-bold text-accent-gold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            {stats.recentEvidence.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEvidence.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-start gap-3 rounded-xl border border-border-primary bg-bg-secondary p-4"
                  >
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-gold" />
                    <div>
                      <p className="text-sm text-text-primary/80">
                        {e.description}
                      </p>
                      <p className="mt-1 text-xs text-text-tertiary">
                        {new Date(e.timestamp).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border-primary bg-bg-secondary p-6">
                <p className="text-sm text-text-secondary">
                  No institutional activity recorded yet. Knowledge objects and
                  lessons will appear here with dates once published.
                </p>
              </div>
            )}
          </>
        ) : null
      }
    />
  );
}
