"use client";

import { useState, useEffect } from "react";
import { Package, FileText, Layers, Tag, Activity } from "lucide-react";

interface OverviewCounts {
  apps: number;
  packages: number;
  content: number;
  releases: number;
  unavailable: boolean;
}

async function fetchCount(type: string): Promise<number> {
  const res = await fetch(`/os/admin/api/data?type=${type}`);
  if (!res.ok) throw new Error(`unavailable: ${type}`);
  const body = (await res.json()) as { data?: unknown };
  const data = body.data as { items?: unknown[] } | unknown[] | undefined;
  if (Array.isArray(data)) return data.length;
  if (data && Array.isArray((data as { items?: unknown[] }).items)) {
    return (data as { items?: unknown[] }).items!.length;
  }
  return 0;
}

export function OverviewCards() {
  const [counts, setCounts] = useState<OverviewCounts>({
    apps: 0,
    packages: 0,
    content: 0,
    releases: 0,
    unavailable: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [apps, packages, content, releases] = await Promise.all([
          fetchCount("apps"),
          fetchCount("packages"),
          fetchCount("content"),
          fetchCount("releases"),
        ]);
        setCounts({ apps, packages, content, releases, unavailable: false });
      } catch {
        // Honest empty: real counts only. Never invented numbers.
        setCounts({
          apps: 0,
          packages: 0,
          content: 0,
          releases: 0,
          unavailable: true,
        });
      }
    };
    load();
  }, []);

  const cards = [
    {
      label: "Applications",
      value: counts.apps,
      icon: Package,
      colorClass: "text-green-400",
    },
    {
      label: "Packages",
      value: counts.packages,
      icon: FileText,
      colorClass: "text-blue-400",
    },
    {
      label: "Content items",
      value: counts.content,
      icon: Layers,
      colorClass: "text-amber-400",
    },
    {
      label: "Releases",
      value: counts.releases,
      icon: Tag,
      colorClass: "text-purple-400",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={card.colorClass}>
                <card.icon className="w-4 h-4" />
              </span>
              <span className="text-xs text-text-tertiary">{card.label}</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">
              {card.value}
            </div>
          </div>
        ))}
      </div>
      {counts.unavailable && (
        <p className="flex items-center gap-2 text-xs text-text-muted mt-3">
          <Activity className="w-3.5 h-3.5" />
          Registry data unavailable — counts show zero rather than estimates.
        </p>
      )}
    </div>
  );
}
