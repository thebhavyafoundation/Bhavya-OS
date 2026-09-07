"use client";

import { useState, useEffect } from "react";
import { EmptyState } from "@bhavya/platform-ui";

interface Release {
  id: string;
  tag: string;
  title: string;
  channel: "alpha" | "beta" | "rc" | "stable";
}

const channelStyles: Record<string, { bg: string; text: string }> = {
  stable: { bg: "bg-green-900/30", text: "text-green-400" },
  rc: { bg: "bg-forest/30", text: "text-accent-gold" },
  beta: { bg: "bg-amber-900/30", text: "text-amber-400" },
  alpha: { bg: "bg-bg-tertiary", text: "text-text-muted" },
};

/**
 * Real release history, served by /os/admin/api/data?type=releases,
 * which lists docs/releases/*.md. No dates are shown: filenames carry
 * none, and inventing them would be fabrication.
 */
export function ReleaseList() {
  const [releases, setReleases] = useState<Release[] | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/os/admin/api/data?type=releases");
        const body = await res.json();
        setReleases(Array.isArray(body.data) ? body.data : []);
      } catch {
        setReleases([]);
      }
    };
    load();
  }, []);

  if (releases !== null && releases.length === 0) {
    return (
      <EmptyState
        title="No releases found"
        description="Release notes live in docs/releases/. Nothing is listed that does not exist there."
      />
    );
  }

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-tertiary">
              <th className="text-left px-4 py-2 font-medium text-text-secondary">
                Tag
              </th>
              <th className="text-left px-4 py-2 font-medium text-text-secondary">
                Title
              </th>
              <th className="text-left px-4 py-2 font-medium text-text-secondary">
                Channel
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {(releases ?? []).map((release) => (
              <tr
                key={release.tag}
                className="hover:bg-bg-tertiary transition-colors"
              >
                <td className="px-4 py-2 font-mono font-medium text-text-primary">
                  {release.tag}
                </td>
                <td className="px-4 py-2 text-text-secondary">
                  {release.title}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${channelStyles[release.channel]?.bg} ${channelStyles[release.channel]?.text}`}
                  >
                    {release.channel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
