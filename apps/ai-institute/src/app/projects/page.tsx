import { redirect } from "next/navigation";

/**
 * /projects is a public duplicate with empty data.
 * The canonical route is /app/projects (authenticated, registered).
 */
export default function ProjectsPage() {
  redirect("/app/projects");
}
