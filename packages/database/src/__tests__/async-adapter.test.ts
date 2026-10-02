import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TursoAdapter } from "../async-adapter";

const MULTI_STATEMENT_SQL = `
CREATE TABLE IF NOT EXISTS exec_probe (id TEXT PRIMARY KEY);
CREATE INDEX IF NOT EXISTS idx_exec_probe ON exec_probe(id);
`;

const SQL_MANY_STATEMENTS =
  "SQL_MANY_STATEMENTS: SQL string contains more than one statement";

/**
 * Mimics the real @libsql/client server contract: execute() rejects any
 * SQL string containing more than one statement (verified against Turso:
 * SQL_MANY_STATEMENTS), while executeMultiple() accepts them.
 */
function makeClient(options: { withExecuteMultiple: boolean }) {
  const calls: string[] = [];
  const execute = vi.fn(async ({ sql }: { sql: string; args: unknown[] }) => {
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    if (statements.length > 1) throw new Error(SQL_MANY_STATEMENTS);
    calls.push(`execute:${sql}`);
    return { rows: [] as Record<string, unknown>[], rowsAffected: 0 };
  });
  const executeMultiple = vi.fn(async (sql: string) => {
    calls.push(`executeMultiple:${sql}`);
  });
  const client = options.withExecuteMultiple
    ? { execute, executeMultiple }
    : { execute };
  return { client, calls, execute, executeMultiple };
}

type AdapterClient = ConstructorParameters<typeof TursoAdapter>[0];

describe("TursoAdapter", () => {
  it("exec routes multi-statement SQL through executeMultiple", async () => {
    const { client, calls, execute, executeMultiple } = makeClient({
      withExecuteMultiple: true,
    });
    const adapter = new TursoAdapter(client as AdapterClient);

    await expect(adapter.exec(MULTI_STATEMENT_SQL)).resolves.toBeUndefined();

    expect(executeMultiple).toHaveBeenCalledTimes(1);
    expect(executeMultiple).toHaveBeenCalledWith(MULTI_STATEMENT_SQL);
    expect(execute).not.toHaveBeenCalled();
    expect(calls[0]?.startsWith("executeMultiple:")).toBe(true);
  });

  it("exec falls back to execute when executeMultiple is unavailable", async () => {
    const { client, calls, execute } = makeClient({
      withExecuteMultiple: false,
    });
    const adapter = new TursoAdapter(client as AdapterClient);

    await expect(adapter.exec("SELECT 1")).resolves.toBeUndefined();

    expect(execute).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(["execute:SELECT 1"]);
  });

  it("all/get/run keep using single-statement execute with args", async () => {
    const { client, execute } = makeClient({ withExecuteMultiple: true });
    const adapter = new TursoAdapter(client as AdapterClient);

    await adapter.run("INSERT INTO t (id) VALUES (?)", "a");
    await adapter.get<{ id: string }>("SELECT id FROM t WHERE id = ?", "a");
    await adapter.all("SELECT id FROM t");

    expect(execute).toHaveBeenCalledTimes(3);
    expect(execute.mock.calls[0]?.[0]).toEqual({
      sql: "INSERT INTO t (id) VALUES (?)",
      args: ["a"],
    });
  });

  it("loads @libsql/client via its web entry (no native addon in Workers)", () => {
    // The root entry (lib-cjs/node.js) eagerly requires the native `libsql`
    // NAPI addon. In workerd that throws "Neon: unsupported Linux
    // architecture" at require time, failing every DB route before
    // createClient runs. The ./web entry is fetch-based and portable.
    const here = dirname(fileURLToPath(import.meta.url));
    const src = readFileSync(resolve(here, "../async-adapter.ts"), "utf8");
    expect(src).toContain('require("@libsql/client/web")');
    expect(src).not.toMatch(/require\("@libsql\/client"\)/);
  });
});
