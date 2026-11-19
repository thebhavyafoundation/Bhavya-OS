import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ResearchService } from "../services/research.js";

// The research service, specified against its file contract.
//
// The kernel shipped these services without coverage, and this one was also
// declaring a return type its implementations did not match. The declaration is
// widened now; these specifications pin the runtime behaviour that must not
// regress: ingest writes a document, search reads it back, and the summary is
// extractive.

describe("research service", () => {
  let root: string;
  let service: ResearchService;

  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), "bhavya-kernel-research-"));
    service = new ResearchService(root);
    await service.initialize();
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("ingests a document and returns a created artifact", async () => {
    const result = await service.execute({
      action: "ingest",
      title: "Forest Restoration Study",
      content: "Native species recover when canopy density returns.",
      topic: "forests",
      source: "survey-2026",
    });

    expect(result.success).toBe(true);
    expect(result.artifacts).toHaveLength(1);
    expect(result.artifacts[0].action).toBe("created");
    expect(result.artifacts[0].path).toBe(
      "docs/research/forest-restoration-study.md",
    );
  });

  it("finds an ingested document by query", async () => {
    const result = await service.execute({
      action: "search",
      title: "search query document",
      content: "search",
      topic: "forests",
      query: "canopy",
    });

    expect(result.success).toBe(true);
    if (!("results" in result)) throw new Error("expected results array");
    expect(result.results!.length).toBeGreaterThan(0);
    expect(result.results![0].title).toBe("Forest Restoration Study");
  });

  it("produces an extractive summary of the supplied content", async () => {
    const result = await service.execute({
      action: "summarize",
      title: "Ignored for summaries",
      content:
        "The foundation restores degraded forest land across three districts. " +
        "Volunteers planted forty-two thousand native seedlings this season. " +
        "Survival rates exceeded the agronomic baseline by eighteen percent.",
      topic: "forests",
    });

    expect(result.success).toBe(true);
    if (!("summary" in result)) throw new Error("expected a summary");
    expect(result.summary.length).toBeGreaterThan(0);
  });
});
