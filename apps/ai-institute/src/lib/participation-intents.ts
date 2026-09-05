/**
 * Participation intents — how a person wants to take part in Bhavya.
 *
 * Intents shape onboarding messaging and the post-onboarding destination.
 * They never grant roles: privileged roles (trustee, admin, instructor)
 * are assigned only through approved paths, never self-selected.
 * Client-safe: pure data, no database reachability.
 */

export interface ParticipationIntent {
  id: string;
  label: string;
  headline: string;
  sub: string;
  destination: string;
}

export const PARTICIPATION_INTENTS: ParticipationIntent[] = [
  {
    id: "learn",
    label: "Learn",
    headline: "Start your AI learning journey",
    sub: "Create one account, then pick a learning path.",
    destination: "/dashboard",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    headline: "Volunteer with Bhavya",
    sub: "Create one account, then choose a mission to serve.",
    destination: "/app/missions",
  },
  {
    id: "donate",
    label: "Donate",
    headline: "Support the mission",
    sub: "Create one account to keep your giving record in one place.",
    destination: "/donate",
  },
  {
    id: "community",
    label: "Community",
    headline: "Join the community",
    sub: "Create one account and introduce yourself.",
    destination: "/community",
  },
];

export function getIntent(id: string | null): ParticipationIntent {
  return (
    PARTICIPATION_INTENTS.find((i) => i.id === id) ?? PARTICIPATION_INTENTS[0]
  );
}

/**
 * Returns true only for same-origin in-app paths ("/app/learn").
 * Never trust URL parameters for open redirects: absolute URLs,
 * protocol-relative URLs, and backslash tricks are rejected.
 */
export function safeRedirect(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/")) return null;
  if (raw.startsWith("//")) return null;
  if (raw.includes("\\")) return null;
  return raw;
}
