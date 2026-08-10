"use client";

import { useState, useEffect } from "react";

interface HeritageStats {
  totalMissions: number;
  totalAssets: number;
  totalAssessments: number;
  totalConservationPlans: number;
}

interface Mission {
  id: string;
  name: string;
  region: string;
  status: string;
  siteIds: string[];
}

export default function HeritageMissionPage() {
  const [stats, setStats] = useState<HeritageStats | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    fetch("/api/heritage/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
    fetch("/api/heritage/missions")
      .then((r) => r.json())
      .then(setMissions)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Heritage Mission
          </h1>
          <p className="text-text-secondary">
            Preserving heritage through structured missions, assessments,
            documentation, and conservation.
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Missions", value: stats.totalMissions, color: "text-yellow-500" },
              { label: "Assets", value: stats.totalAssets, color: "text-cyan-400" },
              { label: "Assessments", value: stats.totalAssessments, color: "text-purple-400" },
              { label: "Conservation Plans", value: stats.totalConservationPlans, color: "text-emerald-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-bg-secondary border border-border-primary rounded-xl p-5"
              >
                <div className="text-xs text-text-secondary mb-1">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Active Missions
          </h2>
          {missions.length === 0 ? (
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
              <p className="text-text-secondary text-sm">
                No missions yet. Data will appear here when available.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="flex justify-between items-center bg-bg-secondary border border-border-primary rounded-xl p-4"
                >
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {mission.name}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {mission.region} &middot; {mission.siteIds.length} sites
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      mission.status === "active"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {mission.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
