import { redirect } from "next/navigation";

/**
 * Legacy profile route. The canonical profile lives at /app/profile,
 * rendered server-side from the authenticated session.
 * This redirect preserves bookmarks without duplicating the surface.
 */
export default function ProfileLegacyRedirect() {
  redirect("/app/profile");
}
