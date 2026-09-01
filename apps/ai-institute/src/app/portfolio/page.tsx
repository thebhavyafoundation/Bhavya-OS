import { redirect } from "next/navigation";

/**
 * /portfolio → /app/profile
 *
 * Wave O classification: REDIRECT
 *
 * Rationale:
 * - Overlaps with /app/profile (authenticated personal profile view)
 * - Uses useAuth() — same auth dependency as /app/profile
 * - Contains hardcoded stats (0 Projects, 0 Papers, 0 Badges)
 * - No inbound links from any other page
 * - Canonical destination: /app/profile
 */
export default function PortfolioPage() {
  redirect("/app/profile");
}
