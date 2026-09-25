"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent-gold/20">
              <span className="text-2xl">🧠</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Knowledge Mission
            </h1>
          </div>
          <p className="text-xl text-text-secondary max-w-2xl">
            Open education, AI literacy, research, digital libraries, and
            practical learning for everyone.
          </p>
        </div>
      </section>

      {/* Stats — Real Institutional Metrics */}
      {stats && (
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-accent-gold mb-1">
                  {stats.totalKos}
                </div>
                <div className="text-sm text-text-primary/50">
                  Knowledge Objects
                </div>
              </div>
              <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-accent-gold mb-1">
                  {stats.totalLessons}
                </div>
                <div className="text-sm text-text-primary/50">Lessons</div>
              </div>
              <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-accent-gold mb-1">
                  {stats.totalPublications}
                </div>
                <div className="text-sm text-text-primary/50">Publications</div>
              </div>
              <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-accent-gold mb-1">
                  {stats.koCreatedThisMonth}
                </div>
                <div className="text-sm text-text-primary/50">
                  New This Month
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Purpose */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Purpose</h2>
          <p className="text-text-secondary leading-relaxed">
            The Knowledge Mission exists to make AI education accessible,
            practical, and connected to real-world impact. We build knowledge
            objects, lessons, and courses that bridge theory and practice —
            ensuring every learner can understand and apply AI responsibly.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "AI Literacy Curriculum",
                description:
                  "Structured courses from foundations to advanced topics, designed for Grade 9+ students.",
              },
              {
                title: "Knowledge Objects",
                description:
                  "Modular, reusable units of educational content that feed into lessons, assessments, and guides.",
              },
              {
                title: "Open Education",
                description:
                  "All learning materials are open-source and freely available to educators and students worldwide.",
              },
              {
                title: "Research Integration",
                description:
                  "Connecting learners to foundational AI research papers and practical applications.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-bg-secondary border border-border-primary rounded-xl p-6"
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-primary/50">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence — Real Institutional Activity */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Evidence</h2>
          {stats && stats.recentEvidence.length > 0 ? (
            <div className="space-y-3">
              {stats.recentEvidence.map((e) => (
                <div
                  key={e.id}
                  className="bg-bg-secondary border border-border-primary rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-accent-gold mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-text-primary/80">
                      {e.description}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
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
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
              <p className="text-text-primary/50 text-sm">
                No institutional activity recorded yet. Knowledge objects and
                lessons will appear here once created and published.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Participate */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Participate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/courses"
              className="bg-accent-gold/10 border border-accent-gold/20 rounded-xl p-6 text-center hover:bg-accent-gold/20 transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Learn</div>
              <div className="text-sm text-text-primary/50">
                Start with our foundational courses
              </div>
            </Link>
            <Link
              href="/app/knowledge"
              className="bg-accent-gold/10 border border-accent-gold/20 rounded-xl p-6 text-center hover:bg-accent-gold/20 transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Contribute</div>
              <div className="text-sm text-text-primary/50">
                Create knowledge objects for the community
              </div>
            </Link>
            <Link
              href="/research"
              className="bg-accent-gold/10 border border-accent-gold/20 rounded-xl p-6 text-center hover:bg-accent-gold/20 transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Research</div>
              <div className="text-sm text-text-primary/50">
                Explore foundational AI research
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
