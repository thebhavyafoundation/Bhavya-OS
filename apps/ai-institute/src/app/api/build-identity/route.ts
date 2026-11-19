import { NextResponse } from "next/server";

import { buildIdentity } from "@/lib/build-identity";

/**
 * The identity of the running build.
 *
 * The preview worker is shared between branches, so a deployment from one
 * pull request replaces the previous one. This endpoint is the trustworthy way
 * to answer "which commit is this deployment serving?" before trusting any
 * header, page or behaviour observed on it.
 *
 * It exposes a commit SHA and a build timestamp. Both are public facts about a
 * pull request, and no secret, environment variable or infrastructure detail
 * is disclosed.
 *
 * The response is never cached: a cached identity would be the one thing that
 * could report a stale answer.
 */
export async function GET() {
  const identity = buildIdentity();

  if (!identity) {
    // The build did not record an identity. Answering 404 rather than a
    // fabricated one keeps "unknown" unambiguous: a caller that gets a 404
    // knows it cannot trust this endpoint for this deployment.
    return NextResponse.json(
      { error: "Build identity is not recorded for this deployment." },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(identity, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
