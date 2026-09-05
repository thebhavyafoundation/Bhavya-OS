"use client";

import { useState, useEffect } from "react";
import { Package, FileText, Zap, Activity } from "lucide-react";

interface OverviewData {
  apps: { name: string; status: string; version: string }[];
  packages: { name: string; version: string }[];
  lastRelease: string;
  auditEvents: number;
}

export function OverviewCards() {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appsRes, pkgsRes] = await Promise.all([
          fetch("/api/data?type=apps"),
          fetch("/api/data?type=packages"),
        ]);
        const apps = await appsRes.json();
        const pkgs = await pkgsRes.json();
        setData({
          apps: apps.data?.slice(0, 3) || [],
          packages: pkgs.data || [],
          lastRelease: "v1.0.0-rc2",
          auditEvents: 47,
        });
      } catch {
        setData({
          apps: [
            { name: "Website", status: "frozen", version: "v0.9.0-rc1" },
            { name: "Design System", status: "active", version: "v0.1.0" },
            { name: "Docs", status: "active", version: "v0.9.0" },
          ],
          packages: [
            { name: "mission-runtime", version: "0.6.0" },
            { name: "sdk", version: "0.1.0" },
            { name: "runtime", version: "3.0.0" },
          ],
          lastRelease: "v1.0.0-rc2",
          auditEvents: 47,
        });
      }
    };
    loadData();
  }, []);

  const cards = [
    { label: "Applications", value: data?.apps.length || 3, icon: Package, colorClass: "text-green-400" },
    { label: "Packages", value: data?.packages.length || 3, icon: FileText, colorClass: "text-blue-400" },
    { label: "Last Release", value: data?.lastRelease || "v1.0.0-rc2", icon: Zap, colorClass: "text-amber-400" },
    { label: "Audit Events", value: data?.auditEvents || 0, icon: Activity, colorClass: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={card.colorClass}>
              <card.icon className="w-4 h-4" />
            </span>
            <span className="text-xs text-text-tertiary">{card.label}</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
