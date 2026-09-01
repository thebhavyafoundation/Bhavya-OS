import { redirect } from "next/navigation";
/**
 * /courses/foundations/check → /courses/ai-foundations
 *
 * Legacy redirect: the knowledge check is not part of the canonical course
 * system. Users landing here are redirected to the course detail page.
 */
export default function FoundationsCheckPage() {
  redirect("/courses/ai-foundations");
}
