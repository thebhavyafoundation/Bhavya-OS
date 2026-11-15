/**
 * Build identity.
 *
 * The preview worker is shared: a deployment from any branch replaces the one
 * before it, so "which commit is the preview serving?" cannot be answered by
 * looking at the site. Without that answer, a verification is worthless — it
 * may be describing a build that was overwritten minutes later.
 *
 * The commit is recorded at build time through `NEXT_PUBLIC_BUILD_COMMIT`,
 * which Next.js inlines into the bundle. It is the same convention the app
 * already uses for `NEXT_PUBLIC_SUPABASE_URL` and friends, and the value is
 * public by nature: it is the head commit of a pull request.
 *
 * Nothing here is a secret and nothing here describes the infrastructure: a
 * commit SHA and the moment the bundle was produced.
 */

export interface BuildIdentity {
  /** Full commit SHA of the source the bundle was produced from. */
  commit: string;
  /** Short form of the commit, for reading in a terminal. */
  shortCommit: string;
  /** ISO-8601 timestamp of the build. */
  builtAt: string;
  /** Human-readable identifier: the short commit and the build moment. */
  buildId: string;
}

const COMMIT_ENV = "NEXT_PUBLIC_BUILD_COMMIT";
const TIME_ENV = "NEXT_PUBLIC_BUILD_TIME";

/**
 * The identity of the running build.
 *
 * Returns null when the build did not record one — a production build that
 * never had the variables set, or a development server. Callers should treat
 * null as "identity unknown" rather than inventing one.
 *
 * The environment is read on each call rather than at module load, so a test
 * can exercise both the recorded and the unrecorded case.
 */
export function buildIdentity(): BuildIdentity | null {
  const commit = (process.env[COMMIT_ENV] ?? "").trim();
  if (!commit) return null;

  const builtAt = (process.env[TIME_ENV] ?? "").trim() || null;
  const shortCommit = commit.slice(0, 12);

  return {
    commit,
    shortCommit,
    builtAt: builtAt ?? "unknown",
    buildId: builtAt ? `${shortCommit}-${builtAt}` : shortCommit,
  };
}
