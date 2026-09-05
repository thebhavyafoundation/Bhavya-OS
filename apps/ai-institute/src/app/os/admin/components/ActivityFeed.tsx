"use client";

import { Clock } from "lucide-react";
import { EmptyState } from "@bhavya/platform-ui";

/**
 * Recent activity. There is currently no audit-event store, so this
 * surface reports exactly that instead of inventing platform-agent
 * activity with timestamps.
 */
export function ActivityFeed() {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border-primary">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-gold" />
          <span className="text-sm font-semibold text-text-primary">
            Recent Activity
          </span>
        </div>
      </div>
      <EmptyState
        title="No recent activity recorded"
        description="Institutional activity recording is not yet connected. Nothing is shown that did not happen."
      />
    </div>
  );
}
