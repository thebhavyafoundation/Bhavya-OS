import type { Page, Request, Response } from "playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Network diagnostics for the remote acceptance harness.
 *
 * Why this exists: a console error saying "Failed to load resource: the
 * server responded with a status of 404" tells you that something 404ed and
 * nothing else. It does not tell you which resource, whether it was a
 * script, an image or an API call, whether it happened during hydration or
 * after an interaction, or whether the same request was retried in a storm.
 * A harness that only counts them cannot tell a missing font from a broken
 * route, and cannot tell one unlucky request from a retry loop.
 *
 * So the network layer is recorded on its own, with the facts that make a
 * failure diagnosable:
 *
 *   - the sanitised URL, the method and the resource type
 *   - the status code, or the transport failure reason
 *   - the page the failure happened on
 *   - the test and the last named interaction step
 *   - the redirect chain that produced the final URL
 *   - a timestamp
 *
 * Listeners are registered before the first navigation, because a request
 * that is issued during the very first page load is exactly the kind that
 * gets missed when the listener is attached afterwards.
 *
 * Nothing sensitive is recorded. Query values that carry a signature, a
 * token or a credential are replaced with a marker before the URL is stored,
 * and request bodies, cookies and authorization headers are never read.
 */

export type NetworkCategory =
  | "favicon"
  | "third-party"
  | "script"
  | "stylesheet"
  | "image"
  | "font"
  | "api"
  | "route-or-rsc"
  | "other";

export interface NetworkEvent {
  kind: "response" | "request-failed";
  method: string;
  /** Sanitised: signature-like query values are replaced. */
  url: string;
  resourceType: string;
  status: number | null;
  statusText: string;
  failure: string | null;
  category: NetworkCategory;
  /** The page the failure was observed on. */
  pageUrl: string;
  test: string;
  /** The last named interaction step, so the failure can be placed. */
  step: string;
  /** The redirect chain that led to this URL, oldest first. */
  redirectedFrom: string[];
  timestamp: string;
}

const SENSITIVE_QUERY_KEY =
  /^(sig|signature|token|access[_-]?token|auth|authorization|key|api[_-]?key|secret|password|x-amz-(signature|credential|security-token)|x-goog-signature|se|sp|sr|st)$/i;

/**
 * Replaces signature-like query values with a marker and drops any query
 * string that carries a signature at all. The path and the parameter names
 * are kept, because those are what identify the resource.
 */
export function sanitizeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    for (const key of [...url.searchParams.keys()]) {
      if (SENSITIVE_QUERY_KEY.test(key)) {
        url.searchParams.set(key, "REDACTED");
      }
    }
    if (/[?&][^=]*(sig|signature|token|credential)[^=]*=/i.test(raw)) {
      url.search = url.search ? "?REDACTED" : "";
    }
    return url.toString();
  } catch {
    return raw.split("?")[0];
  }
}

/** Classifies a failure so a report can group them by kind of resource. */
export function classify(
  rawUrl: string,
  resourceType: string,
  pageOrigin: string,
): NetworkCategory {
  let path = rawUrl;
  let origin = "";
  try {
    const url = new URL(rawUrl);
    path = url.pathname;
    origin = url.origin;
  } catch {
    // keep the raw string
  }

  if (
    resourceType === "favicon" ||
    /\/favicon(\.ico|\.svg)?$/i.test(path) ||
    path === "/favicon.ico"
  ) {
    return "favicon";
  }
  if (origin && pageOrigin && origin !== pageOrigin) {
    return "third-party";
  }
  if (resourceType === "script") return "script";
  if (resourceType === "stylesheet") return "stylesheet";
  if (resourceType === "image") return "image";
  if (resourceType === "font") return "font";
  if (path.startsWith("/api/")) return "api";
  if (
    resourceType === "fetch" ||
    resourceType === "xhr" ||
    resourceType === "document" ||
    resourceType === "other"
  ) {
    return "route-or-rsc";
  }
  return "other";
}

function redirectChain(request: Request): string[] {
  const chain: string[] = [];
  let current: Request | null = request.redirectedFrom();
  let guard = 0;
  while (current && guard < 5) {
    chain.unshift(sanitizeUrl(current.url()));
    current = current.redirectedFrom();
    guard += 1;
  }
  return chain;
}

export interface Recorder {
  /** Every recorded failure, in the order it happened. */
  events: NetworkEvent[];
  /** Records the name of the interaction step that is about to happen. */
  step(label: string): void;
  /** The recorded failures, as a one-line-per-event report. */
  report(): string;
  /**
   * Writes the JSON artifact. Called on the way out of a test so the
   * evidence survives a failing assertion.
   */
  writeArtifact(): void;
}

export interface RecorderOptions {
  /** The name of the test, used to place a failure. */
  test: string;
  /** Where the JSON artifact is written. */
  artifactDir: string;
}

/**
 * Attaches the network listeners. Call this before the first navigation.
 */
export function attachNetworkRecorder(
  page: Page,
  options: RecorderOptions,
): Recorder {
  const events: NetworkEvent[] = [];
  let currentStep = "start";
  let pageOrigin = "";

  const record = (
    kind: NetworkEvent["kind"],
    request: Request,
    extra: {
      status: number | null;
      statusText: string;
      failure: string | null;
    },
  ) => {
    const rawUrl = request.url();
    const pageUrl = page.url();
    try {
      pageOrigin = pageOrigin || new URL(pageUrl).origin;
    } catch {
      pageOrigin = pageOrigin || "";
    }
    events.push({
      kind,
      method: request.method(),
      url: sanitizeUrl(rawUrl),
      resourceType: request.resourceType(),
      status: extra.status,
      statusText: extra.statusText,
      failure: extra.failure,
      category: classify(rawUrl, request.resourceType(), pageOrigin),
      pageUrl: sanitizeUrl(pageUrl),
      test: options.test,
      step: currentStep,
      redirectedFrom: redirectChain(request),
      timestamp: new Date().toISOString(),
    });
  };

  page.on("response", (response: Response) => {
    const status = response.status();
    if (status < 400) return;
    record("response", response.request(), {
      status,
      statusText: response.statusText(),
      failure: null,
    });
  });

  page.on("requestfailed", (request: Request) => {
    const failure = request.failure();
    record("request-failed", request, {
      status: null,
      statusText: "",
      failure: failure ? failure.errorText : "unknown",
    });
  });

  const writeArtifact = () => {
    const file = join(options.artifactDir, "network-events.json");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(
      file,
      JSON.stringify(
        {
          test: options.test,
          generatedAt: new Date().toISOString(),
          events,
        },
        null,
        2,
      ),
      "utf-8",
    );
  };

  return {
    events,
    step(label: string) {
      currentStep = label;
    },
    writeArtifact,
    report() {
      if (events.length === 0) {
        writeArtifact();
        return `[network] ${options.test}: no failed requests recorded`;
      }
      const lines = events.map(
        (event) =>
          `[network] ${event.category} ${event.method} ${event.url} -> ` +
          `${event.status ?? event.failure} (type=${event.resourceType}, ` +
          `page=${event.pageUrl}, step=${event.step}, test=${event.test})`,
      );
      writeArtifact();
      return lines.join("\n");
    },
  };
}

/**
 * Counts repeated identical failing requests. A single failure and a retry
 * storm are different defects and must not be reported as the same thing.
 */
export function countRepeats(events: NetworkEvent[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const event of events) {
    const key = `${event.method} ${event.url}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}
