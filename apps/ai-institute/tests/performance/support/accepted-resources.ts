/**
 * Resources that are allowed to fail on the remote runner, each with the
 * exact URL and the reason.
 *
 * The rule this file exists to enforce: an exception is a *specific*
 * resource with a stated reason, never a blanket "ignore 404s". If a
 * resource is not listed here, a failure of it fails the run.
 *
 * Nothing is listed by default. Entries are added only after the failure
 * has been diagnosed and the cause shown to be environmental rather than a
 * defect in the candidate.
 */
export interface AcceptedResource {
  /** The exact path (and query, when it carries one) that may fail. */
  path: string;
  /** Why this failure does not indicate a defect in the candidate. */
  reason: string;
  /** The environment the exception applies to. "preview" or "production". */
  appliesTo: "preview" | "production" | "both";
}

export const ACCEPTED_RESOURCES: AcceptedResource[] = [];

export function isAccepted(
  path: string,
  baseUrl: string,
): AcceptedResource | undefined {
  const isPreview = /preview/i.test(baseUrl);
  return ACCEPTED_RESOURCES.find((entry) => {
    if (entry.appliesTo === "both") return entry.path === path;
    if (entry.appliesTo === "preview") return isPreview && entry.path === path;
    return !isPreview && entry.path === path;
  });
}
