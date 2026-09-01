import { redirect } from "next/navigation";
/**
 * /courses/foundations/lab → /courses/ai-foundations
 *
 * Legacy redirect: the interactive lab is not part of the canonical course
 * system. Users landing here are redirected to the course detail page.
 */
export default function FoundationsLabPage() {
  redirect("/courses/ai-foundations");
}
