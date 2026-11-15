/**
 * Build identity, written into the bundle at build time.
 *
 * The preview worker is shared between branches, so a deployment from one pull
 * request replaces the previous one. Without a way to ask which commit is
 * serving, a preview observation describes a build that may have been
 * overwritten minutes earlier.
 *
 * `NEXT_PUBLIC_` variables are not a usable mechanism here: they are inlined
 * into the client bundle and read at runtime on the server, and the preview
 * worker has no such binding. A value that is written into a module before the
 * build is inlined into every bundle by construction, which is why this file
 * exists.
 *
 * The committed content is the placeholder. The preview workflow overwrites it
 * with the real values before the build; see
 * `apps/ai-institute/scripts/write-build-identity.mjs`.
 *
 * It is an object rather than two constants so that a test can describe both
 * the recorded and the unrecorded case without a module mock.
 */
export const BUILD_INFO: { commit: string; builtAt: string } = {
  commit: "unknown",
  builtAt: "unknown",
};
