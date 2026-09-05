"use client";

import { useState, useEffect } from "react";
import {
  TreePine,
  MapPin,
  Leaf,
  ClipboardCheck,
  Activity,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface ForestStats {
  totalMissions: number;
  totalSites: number;
  totalPlantings: number;
  totalSurveys: number;
  totalMonitoring: number;
  totalImpactReports: number;
  testSeedRecords: {
    missions: number;
    sites: number;
    plantings: number;
    surveys: number;
    monitoring: number;
    impactReports: number;
    total: number;
  };
  missionsCreatedThisMonth: number;
  plantingsCreatedThisMonth: number;
  evidenceCounts: Record<string, number>;
  recentEvidence: Array<{
    id: string;
    activityType: string;
    description: string;
    timestamp: string;
  }>;
  lastUpdated: string;
}

interface ForestMission {
  id: string;
  name: string;
  description: string;
  status: string;
  region: string;
  created: string;
  provenance?: string;
}

export default function OsForestPage() {
  const [stats, setStats] = useState<ForestStats | null>(null);
  const [missions, setMissions] = useState<ForestMission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/forest/stats").then((r) => r.json()),
      fetch("/api/forest/missions").then((r) => r.json()),
    ])
      .then(([statsData, missionsData]) => {
        setStats(statsData);
        setMissions(Array.isArray(missionsData) ? missionsData : []);
      })
      .catch(() => {
        setStats(null);
        setMissions([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalInstitutional = stats
    ? stats.totalMissions + stats.totalSites + stats.totalPlantings +
      stats.totalSurveys + stats.totalMonitoring + stats.totalImpactReports
    : 0;

  const totalTestSeed = stats?.testSeedRecords?.total ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            Forest Mission — Institutional View
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-2)",
            }}
          >
            Canonical Forest state, evidence, and metrics.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-xs)",
            color: "var(--text-secondary)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {loading && !stats ? (
        <div
          style={{
            padding: "var(--space-12)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          Loading Forest data...
        </div>
      ) : !stats ? (
        <div
          style={{
            padding: "var(--space-12)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <AlertTriangle size={32} style={{ color: "var(--text-secondary)", margin: "0 auto var(--space-4)" }} />
          <p style={{ color: "var(--text-secondary)" }}>Unable to load Forest data.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "var(--space-4)",
              marginBottom: "var(--space-8)",
            }}
          >
            {[
              { label: "Missions", value: stats.totalMissions, icon: TreePine, color: "var(--forest)" },
              { label: "Sites", value: stats.totalSites, icon: MapPin, color: "var(--earth)" },
              { label: "Plantings", value: stats.totalPlantings, icon: Leaf, color: "var(--forest)" },
              { label: "Surveys", value: stats.totalSurveys, icon: ClipboardCheck, color: "var(--earth)" },
              { label: "Monitoring", value: stats.totalMonitoring, icon: Activity, color: "var(--forest)" },
              { label: "Impact", value: stats.totalImpactReports, icon: TrendingUp, color: "var(--earth)" },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  padding: "var(--space-5)",
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <card.icon size={16} style={{ color: card.color }} />
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{card.label}</span>
                </div>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--text)" }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Provenance Breakdown */}
          <div
            style={{
              padding: "var(--space-6)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              marginBottom: "var(--space-8)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-4)",
              }}
            >
              Provenance Breakdown
            </h2>
            <div style={{ display: "flex", gap: "var(--space-8)" }}>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>
                  Institutional (public-eligible)
                </div>
                <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--forest)" }}>
                  {totalInstitutional}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>
                  Test-seeded (not public)
                </div>
                <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--text-secondary)" }}>
                  {totalTestSeed}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Evidence */}
          <div
            style={{
              padding: "var(--space-6)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              marginBottom: "var(--space-8)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-4)",
              }}
            >
              Recent Evidence
            </h2>
            {stats.recentEvidence.length === 0 ? (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                No evidence recorded yet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {stats.recentEvidence.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-start gap-3"
                    style={{
                      padding: "var(--space-3)",
                      background: "var(--bg)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <CheckCircle size={14} style={{ color: "var(--forest)", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "var(--text-sm)", color: "var(--text)" }}>
                        {e.description}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginTop: 2 }}>
                        {e.activityType} — {new Date(e.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Missions */}
          <div
            style={{
              padding: "var(--space-6)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-4)",
              }}
            >
              Active Missions
            </h2>
            {missions.length === 0 ? (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                No institutional missions yet. Create one from{" "}
                <a href="/app/forest/new" style={{ color: "var(--forest)" }}>Forest Missions</a>.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {missions.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between"
                    style={{
                      padding: "var(--space-4)",
                      background: "var(--bg)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text)" }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                        {m.region} — {m.status} — {new Date(m.created).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        background: m.provenance === "institutional" ? "var(--forest)" : "var(--border)",
                        color: m.provenance === "institutional" ? "#fff" : "var(--text-secondary)",
                      }}
                    >
                      {m.provenance || "test-seed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metric Health */}
          <div
            style={{
              padding: "var(--space-6)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              marginTop: "var(--space-8)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-4)",
              }}
            >
              Metric Health
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Last updated</span>
                <span style={{ color: "var(--text)" }}>{stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : "Never"}</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Missions this month</span>
                <span style={{ color: "var(--text)" }}>{stats.missionsCreatedThisMonth}</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Plantings this month</span>
                <span style={{ color: "var(--text)" }}>{stats.plantingsCreatedThisMonth}</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: "var(--text-sm)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Evidence entries</span>
                <span style={{ color: "var(--text)" }}>{Object.values(stats.evidenceCounts).reduce((a, b) => a + b, 0)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
