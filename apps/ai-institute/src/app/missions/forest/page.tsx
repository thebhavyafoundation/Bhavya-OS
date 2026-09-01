"use client";

import { useState, useEffect } from "react";

interface EvidenceEntry {
  id: string;
  activityType: string;
  description: string;
  timestamp: string;
}

interface ForestStats {
  totalMissions: number;
  totalSites: number;
  totalPlantings: number;
  totalSurveys: number;
  totalMonitoring: number;
  totalImpactReports: number;
  missionsCreatedThisMonth: number;
  plantingsCreatedThisMonth: number;
  evidenceCounts: Record<string, number>;
  recentEvidence: EvidenceEntry[];
  lastUpdated: string | null;
}

interface Mission {
  id: string;
  name: string;
  description: string;
  region: string;
  status: string;
  siteIds: string[];
  created: string;
}

export default function ForestMissionPage() {
  const [stats, setStats] = useState<ForestStats | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    fetch("/api/forest/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          totalMissions: data.totalMissions || 0,
          totalSites: data.totalSites || 0,
          totalPlantings: data.totalPlantings || 0,
          totalSurveys: data.totalSurveys || 0,
          totalMonitoring: data.totalMonitoring || 0,
          totalImpactReports: data.totalImpactReports || 0,
          missionsCreatedThisMonth: data.missionsCreatedThisMonth || 0,
          plantingsCreatedThisMonth: data.plantingsCreatedThisMonth || 0,
          evidenceCounts: data.evidenceCounts || {},
          recentEvidence: data.recentEvidence || [],
          lastUpdated: data.lastUpdated,
        });
      })
      .catch(() => {});
    fetch("/api/forest/missions")
      .then((r) => r.json())
      .then(setMissions)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Forest Mission
          </h1>
          <p className="text-text-secondary">
            Restoring nature through structured missions, surveys, planting
            campaigns, and monitoring.
          </p>
        </div>

        {/* Real Institutional Metrics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Missions", value: stats.totalMissions, color: "text-green-400" },
              { label: "Sites", value: stats.totalSites, color: "text-cyan-400" },
              { label: "Plantings", value: stats.totalPlantings, color: "text-yellow-400" },
              { label: "Surveys", value: stats.totalSurveys, color: "text-emerald-400" },
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

        {/* Missions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Missions
          </h2>
          {missions.length === 0 ? (
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
              <p className="text-text-secondary text-sm">
                No missions yet. Data will appear here when forest records are created.
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
                        ? "bg-green-500/10 text-green-400"
                        : mission.status === "planning"
                          ? "bg-yellow-500/10 text-yellow-400"
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

        {/* Evidence — Real Institutional Activity */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Evidence
            </h2>
            {stats.recentEvidence.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEvidence.map((e) => (
                  <div
                    key={e.id}
                    className="bg-bg-secondary border border-border-primary rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-text-primary">{e.description}</p>
                      <p className="text-xs text-text-secondary mt-1">
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
                <p className="text-text-secondary text-sm">
                  No institutional activity recorded yet. Forest missions,
                  plantings, and surveys will appear here once created.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
