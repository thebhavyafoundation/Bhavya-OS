import { redirect } from "next/navigation";
/**
 * /courses/foundations → /courses/ai-foundations
 *
 * Legacy redirect: the canonical course system uses /courses/ai-foundations
 * with string-based lesson IDs (e.g., found-1-1). This route preserves
 * backward compatibility for any bookmarks or external references.
 */
export default function FoundationsPage() {
  redirect("/courses/ai-foundations");
}
