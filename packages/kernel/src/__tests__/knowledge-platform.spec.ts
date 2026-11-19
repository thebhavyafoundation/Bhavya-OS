import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  KnowledgePlatformService,
  type KnowledgeDocument,
} from "../services/knowledge-platform.js";

import { payloadOf } from "./helpers/service-payload.js";

// The knowledge workflow, migrated from the legacy `knowledge-platform.test.ts`
// harness.
//
// The harness caught its own assertion errors and printed them, so no test
// runner ever saw a failure. Each case below is a real test. The scenarios
// and the expectations are the harness's own.
//
// The service keeps its documents under `<root>/docs/research`, so each run
// gets a temporary root and removes it afterwards.

// The service keeps its documents in the instance, and the harness shared one
// instance across the whole run, so the setup is done once: each test sees the
// documents uploaded by the tests before it.

describe("knowledge platform", () => {
  let root: string;
  let service: KnowledgePlatformService;

  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), "bhavya-kernel-knowledge-"));
    service = new KnowledgePlatformService(root);
    await service.initialize();
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("uploads a document and classifies it", async () => {
    const response = payloadOf<{ document?: KnowledgeDocument }>(
      await service.execute({
        action: "upload",
        title: "Bhavya Foundation Research Report",
        content:
          "This is a comprehensive research report on environmental conservation efforts. The Bhavya Foundation has been working to restore forests and empower communities. Our education programs have reached over 10,000 students across 50 schools.",
        format: "markdown",
        topic: "environment",
        type: "report",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.document).toBeDefined();
    expect(response.document!.topic).toBe("environment");
    expect(response.document!.summary.length).toBeGreaterThan(0);
  });

  it("classifies a guide by its content", async () => {
    const response = payloadOf<{ document?: KnowledgeDocument }>(
      await service.execute({
        action: "upload",
        title: "Volunteer Onboarding Guide",
        content:
          "Welcome to Bhavya Foundation! This guide will help you get started as a volunteer. You will learn about our mission, values, and how you can contribute to our goals.",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.document).toBeDefined();
    expect(response.document!.type).toBe("guide");
  });

  it("extracts entities from an uploaded document", async () => {
    const response = payloadOf<{ document?: KnowledgeDocument }>(
      await service.execute({
        action: "upload",
        title: "Partnership with UNESCO",
        content:
          "Bhavya Foundation has partnered with UNESCO to preserve heritage sites. The collaboration will focus on temple restoration and cultural preservation.",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.document).toBeDefined();
    expect(response.document!.entities.length).toBeGreaterThan(0);
  });

  it("generates a summary", async () => {
    const response = payloadOf<{ summary?: string; keyPoints?: string[] }>(
      await service.execute({
        action: "summary",
        content:
          "The Bhavya Foundation was established in 2024. Our mission is to restore nature, empower humanity, and preserve heritage. We operate across three verticals: environment, education, and heritage. Our impact includes restoring 1000 hectares of forest, educating 10,000 students, and preserving 50 heritage sites.",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.summary!.length).toBeGreaterThan(0);
  });

  it("searches the indexed documents", async () => {
    const response = payloadOf<{ results?: unknown[] }>(
      await service.execute({
        action: "search",
        query: "environment forest",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.results!.length).toBeGreaterThan(0);
  });

  it("finds related documents", async () => {
    const docs = service.getAllDocuments();
    expect(docs.length).toBeGreaterThanOrEqual(2);

    const response = await service.execute({
      action: "related",
      documentId: docs[0].id,
    });
    expect(response.success).toBe(true);
  });

  it("tracks provenance for a document", async () => {
    const docs = service.getAllDocuments();
    const doc = docs[0];
    expect(doc).toBeDefined();

    expect(doc!.provenance.version).toBe(1);
    expect(doc!.provenance.history.length).toBeGreaterThan(0);
  });

  it("records an audit trail", async () => {
    const auditLog = service.getAuditLog();
    expect(auditLog.length).toBeGreaterThan(0);
  });
});
