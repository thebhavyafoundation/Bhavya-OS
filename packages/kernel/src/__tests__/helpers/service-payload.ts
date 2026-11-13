// Helper for the migrated service specifications.
//
// WHY THIS EXISTS
// ---------------
// The services in `src/services` declare their public `execute()` as
// `Promise<{ success: boolean; result?: unknown }>`, but every implementation
// returns its payload under a *named* field — `person`, `people`, `mission`,
// `resource`, `report`, `summary`, `entries` and so on. The `result` property
// is never populated, so the declared type is narrower than the runtime
// contract.
//
// The legacy harnesses destructured those named fields, and their runtime
// behaviour still holds; only the declared type drifted. Rather than cast at
// every call site, the migrated specifications name the payload fields once
// here.
//
// Nothing in the repository consumes these services today, so the mismatch is
// latent rather than a live defect. Widening ten public service signatures is
// a separate change from migrating the specifications, so it is recorded as a
// finding rather than folded in here.

/**
 * Read the payload of a service `execute()` response.
 *
 * The response always carries `success`; the payload shape is named by the
 * caller because it differs per action.
 */
export function payloadOf<T extends object>(
  response: unknown,
): { success: boolean } & T {
  return response as { success: boolean } & T;
}
