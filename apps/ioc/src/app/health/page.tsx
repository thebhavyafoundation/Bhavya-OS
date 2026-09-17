"use client";

import { useState, useEffect } from "react";

interface HealthStatus {
  overall: string;
  systems: {
    system: string;
    status: string;
    lastChecked: string;
    apiAvailable: boolean;
    dashboardAvailable: boolean;
  }[];
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch("/api/health?action=operational").then((r) =>
        r.json(),
      );
      setHealth(res.health);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function checkAll() {
    setChecking(true);
    try {
      const res = await fetch("/api/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check-all" }),
      }).then((r) => r.json());
      setHealth({ overall: "checking", systems: res.systems || [] });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-sage">Loading health...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold">System Health</h1>
            <p className="text-sage mt-2">
              Real-time health status of all Bhavya systems
            </p>
          </div>
          <button
            onClick={checkAll}
            disabled={checking}
            className="bg-gold text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {checking ? "Checking..." : "Run Health Check"}
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full ${health?.overall === "healthy" ? "bg-green-500" : health?.overall === "degraded" ? "bg-yellow-500" : "bg-gray-500"}`}
            />
            <span className="text-xl font-semibold text-white">
              Overall: {health?.overall || "Unknown"}
            </span>
            <span className="text-sage ml-auto">
              {health?.systems?.length || 0} systems monitored
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {health?.systems?.map((s) => (
            <div
              key={s.system}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white capitalize">
                  {s.system.replace(/_/g, " ")}
                </h3>
                <span
                  className={`px-3 py-1 rounded text-xs font-medium ${s.status === "healthy" ? "bg-green-900 text-green-300" : s.status === "degraded" ? "bg-yellow-900 text-yellow-300" : "bg-red-900 text-red-300"}`}
                >
                  {s.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage">API</span>
                  <span
                    className={
                      s.apiAvailable ? "text-green-400" : "text-red-400"
                    }
                  >
                    {s.apiAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage">Dashboard</span>
                  <span
                    className={
                      s.dashboardAvailable ? "text-green-400" : "text-red-400"
                    }
                  >
                    {s.dashboardAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage">Last Checked</span>
                  <span className="text-gray-400">
                    {s.lastChecked
                      ? new Date(s.lastChecked).toLocaleString()
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(!health?.systems || health.systems.length === 0) && (
            <div className="col-span-full text-center text-sage py-12">
              No health data. Click &quot;Run Health Check&quot; to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
