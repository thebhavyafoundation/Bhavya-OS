import { redirect } from "next/navigation";

/**
 * /workspace is a duplicate of /app (authenticated home).
 * Redirect to the canonical route.
 */
export default function WorkspacePage() {
  redirect("/app");
}
