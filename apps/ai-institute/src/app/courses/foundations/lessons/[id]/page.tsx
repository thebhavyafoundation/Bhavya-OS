import { redirect } from "next/navigation";
/**
 * /courses/foundations/lessons/:id → /courses/ai-foundations
 *
 * Legacy redirect: numeric lesson IDs (1, 2, 3...) from the old system
 * do not map to canonical string IDs (found-1-1, found-1-2...).
 * Users landing here are redirected to the course detail page.
 */
export default function FoundationsLessonPage() {
  redirect("/courses/ai-foundations");
}
