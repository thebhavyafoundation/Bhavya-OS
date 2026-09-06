"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TreePine, Plus, MapPin, Calendar } from "lucide-react";

interface ForestMission {
  id: string;
  name: string;
  description: string;
  status: string;
  region: string;
  startDate: string;
  siteIds: string[];
  provenance?: string;
  created: string;
  updated: string;
}

export default function ForestMissionsPage() {
  const [missions, setMissions] = useState<ForestMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forest/missions")
      .then((r) => r.json())
      .then((data) => setMissions(Array.isArray(data) ? data : []))
      .catch(() => setMissions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12 flex items-start justify-between">
          <div>
            <h1
              style={{
                fontSize: "var(--text-3xl)",
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.03em",
              }}
            >
              Forest Missions
            </h1>
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--text-secondary)",
                marginTop: "var(--space-3)",
              }}
            >
              Create and manage forest restoration missions.
            </p>
          </div>
          <Link
            href="/app/forest/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-3) var(--space-5)",
              background: "var(--forest)",
              color: "var(--color-text-inverse, #fff)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Plus size={16} />
            New Mission
          </Link>
        </header>

        {loading ? (
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
            Loading missions...
          </div>
        ) : missions.length === 0 ? (
          <div
            style={{
              padding: "var(--space-12)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto var(--space-4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <TreePine size={32} style={{ color: "var(--forest)" }} />
            </div>
            <h3
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-2)",
              }}
            >
              No forest missions yet
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              Create your first forest mission to start tracking restoration
              activity, sites, and impact.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {missions.map((mission) => (
              <Link
                key={mission.id}
                href={`/os/forest`}
                style={{
                  display: "block",
                  padding: "var(--space-6)",
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {mission.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      background:
                        mission.status === "active"
                          ? "var(--forest)"
                          : "var(--border)",
                      color:
                        mission.status === "active"
                          ? "var(--color-text-inverse, #fff)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {mission.status}
                  </span>
                </div>
                {mission.description && (
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    {mission.description}
                  </p>
                )}
                <div
                  className="flex items-center gap-4"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {mission.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(mission.created).toLocaleDateString()}
                  </span>
                  {mission.siteIds && mission.siteIds.length > 0 && (
                    <span>
                      {mission.siteIds.length} site
                      {mission.siteIds.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
