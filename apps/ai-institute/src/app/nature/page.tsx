import { redirect } from "next/navigation";

/**
 * /nature → /missions/forest
 *
 * Redirected during Wave M orphan audit. The canonical Forest Mission page
 * is at /missions/forest. This route was unreferenced from navigation.
 */
export default function NaturePage() {
  redirect("/missions/forest");
}
