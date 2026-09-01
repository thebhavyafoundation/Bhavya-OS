import { redirect } from "next/navigation";
/**
 * /courses/foundations/project → /courses/ai-foundations
 *
 * Legacy redirect: the capstone project is not part of the canonical course
 * system. Users landing here are redirected to the course detail page.
 */
export default function FoundationsProjectPage() {
  redirect("/courses/ai-foundations");
}
