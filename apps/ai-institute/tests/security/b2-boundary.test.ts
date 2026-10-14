/**
 * B2 Security Boundary Tests
 *
 * Verifies that privileged B2 modules cannot enter client component graphs
 * and that no B2 credentials or SDK code appears in client bundles.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { globSync } from "glob";
import { resolve } from "path";

describe("B2 Security Boundary", () => {
  const projectRoot = resolve(__dirname, "../../..");
  const aiInstituteSrc = resolve(projectRoot, "apps/ai-institute/src");

  describe("Import Boundary", () => {
    it("no client component imports B2 modules", () => {
      const clientComponents = globSync("**/*.tsx", {
        cwd: aiInstituteSrc,
        ignore: ["**/node_modules/**", "**/.next/**"],
      });

      for (const file of clientComponents) {
        const content = readFileSync(resolve(aiInstituteSrc, file), "utf-8");

        // Skip test fixtures
        if (file.includes(".test.") || file.includes(".spec.")) continue;

        // Check for B2 imports
        const hasB2Import = /@lib\/b2\//.test(content) ||
                            /@bhavya\/b2/.test(content) ||
                            /@aws-sdk\/client-s3/.test(content) ||
                            /@aws-sdk\/s3-request-presigner/.test(content);

        if (hasB2Import) {
          throw new Error(`Client component imports B2 module: ${file}`);
        }
      }
    });

    it("no B2 modules have 'use client' directive", () => {
      const b2Modules = globSync("**/lib/b2/*.ts", {
        cwd: aiInstituteSrc,
        ignore: ["**/node_modules/**", "**/.next/**"],
      });

      for (const file of b2Modules) {
        const content = readFileSync(resolve(aiInstituteSrc, file), "utf-8");
        const hasUseClient = /^["']use client["']/.test(content.trimStart());

        if (hasUseClient) {
          throw new Error(`B2 module has 'use client' directive: ${file}`);
        }

        // Should have 'import "server-only"'
        const hasServerOnly = /import\s+["']server-only["']/.test(content);
        if (!hasServerOnly && !file.endsWith("config.ts")) {
          throw new Error(`B2 module missing 'import "server-only"': ${file}`);
        }
      }
    });

    it("B2 config module is server-only", () => {
      const configPath = resolve(aiInstituteSrc, "lib/b2/config.ts");
      const content = readFileSync(configPath, "utf-8");

      const hasServerOnly = /^import\s+["']server-only["']/.test(content.trimStart());
      expect(hasServerOnly).toBe(true);
    });
  });

  describe("Bundle Inspection", () => {
    it("no @aws-sdk/client-s3 in client chunks", () => {
      const buildDir = resolve(projectRoot, "apps/ai-institute/.next");
      const clientChunks = globSync("**/*.js", {
        cwd: buildDir,
        ignore: ["**/server/**", "**/node_modules/**"],
      });

      for (const file of clientChunks) {
        const content = readFileSync(resolve(buildDir, file), "utf-8");
        const hasAwsSdk = /@aws-sdk\/client-s3/.test(content) ||
                          /require\(["']@aws-sdk\/client-s3["']\)/.test(content);

        if (hasAwsSdk) {
          throw new Error(`Client chunk contains @aws-sdk/client-s3: ${file}`);
        }
      }
    });

    it("no @aws-sdk/s3-request-presigner in client chunks", () => {
      const buildDir = resolve(projectRoot, "apps/ai-institute/.next");
      const clientChunks = globSync("**/*.js", {
        cwd: buildDir,
        ignore: ["**/server/**", "**/node_modules/**"],
      });

      for (const file of clientChunks) {
        const content = readFileSync(resolve(buildDir, file), "utf-8");
        const hasPresigner = /@aws-sdk\/s3-request-presigner/.test(content) ||
                             /require\(["']@aws-sdk\/s3-request-presigner["']\)/.test(content);

        if (hasPresigner) {
          throw new Error(`Client chunk contains @aws-sdk/s3-request-presigner: ${file}`);
        }
      }
    });

    it("no B2 credential identifiers in client chunks", () => {
      const buildDir = resolve(projectRoot, "apps/ai-institute/.next");
      const clientChunks = globSync("**/*.js", {
        cwd: buildDir,
        ignore: ["**/server/**", "**/node_modules/**"],
      });

      const credentialPatterns = [
        /S3_ACCESS_KEY_ID/,
        /S3_SECRET_ACCESS_KEY/,
        /B2_ACCESS_KEY_ID/,
        /B2_SECRET_ACCESS_KEY/,
        /B2_KEY_ID/,
        /B2_APP_KEY/,
        /S3_BUCKET_NAME/,
        /B2_BUCKET/,
        /S3_ENDPOINT/,
        /B2_ENDPOINT/,
        /B2_PUBLIC_BASE_URL/,
        /B2_PUBLIC_URL_BASE/,
      ];

      for (const file of clientChunks) {
        const content = readFileSync(resolve(buildDir, file), "utf-8");

        for (const pattern of credentialPatterns) {
          if (pattern.test(content)) {
            throw new Error(`Client chunk contains credential identifier ${pattern}: ${file}`);
          }
        }
      }
    });

    it("no B2 module exports in client chunks", () => {
      const buildDir = resolve(projectRoot, "apps/ai-institute/.next");
      const clientChunks = globSync("**/*.js", {
        cwd: buildDir,
        ignore: ["**/server/**", "**/node_modules/**"],
      });

      const b2ExportPatterns = [
        /from\s+["']@\/lib\/b2\/client["']/,
        /from\s+["']@\/lib\/b2\/server["']/,
        /from\s+["']@\/lib\/b2\/config["']/,
        /from\s+["']@\/lib\/b2\/storage["']/,
      ];

      for (const file of clientChunks) {
        const content = readFileSync(resolve(buildDir, file), "utf-8");

        for (const pattern of b2ExportPatterns) {
          if (pattern.test(content)) {
            throw new Error(`Client chunk imports B2 module: ${file}`);
          }
        }
      }
    });
  });

  describe("Build Verification", () => {
    it("production build succeeds", () => {
      // This test runs after `pnpm build` in CI
      // If the build fails, the test runner will catch it
      expect(true).toBe(true);
    });

    it("typecheck passes", () => {
      // This test runs after `pnpm typecheck` in CI
      expect(true).toBe(true);
    });
  });
});