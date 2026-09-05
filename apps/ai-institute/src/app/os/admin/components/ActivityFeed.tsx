"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Activity {
  id: string;
  type: "success" | "warning" | "info" | "error";
  message: string;
  user: string;
  timestamp: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const defaultActivities: Activity[] = [
      { id: "1", type: "success", message: "Tagged v1.0.0-rc2", user: "Governance Agent", timestamp: "2 min ago" },
      { id: "2", type: "info", message: "Added ADR-0003: Release Train", user: "Governance Agent", timestamp: "15 min ago" },
      { id: "3", type: "warning", message: "Fixed CSP headers", user: "Platform Agent", timestamp: "1 hour ago" },
      { id: "4", type: "info", message: "Added docs accessibility fixes", user: "Platform Agent", timestamp: "2 hours ago" },
      { id: "5", type: "info", message: "Updated pnpm-lock.yaml", user: "Platform Agent", timestamp: "3 hours ago" },
      { id: "6", type: "info", message: "Created APP-002 Docs Platform", user: "Platform Agent", timestamp: "5 hours ago" },
    ];
    setActivities(defaultActivities);
  }, []);

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border-primary">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-gold" />
          <span className="text-sm font-semibold text-text-primary">Recent Activity</span>
        </div>
      </div>
      <div className="divide-y divide-border-primary">
        {activities.map((activity) => (
          <div key={activity.id} className="px-4 py-3 flex items-start gap-3">
            <span className="mt-0.5">{getIcon(activity.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">{activity.message}</p>
              <p className="text-xs text-text-muted mt-0.5">{activity.user} · {activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
