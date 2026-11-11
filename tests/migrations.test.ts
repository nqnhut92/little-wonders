import { it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
// JS runner is shared with the command executed against Neon.
// @ts-expect-error JavaScript migration runner has no declaration file.
import { runMigrations } from "../scripts/lib/migrations.mjs";
it("applies the real migration once, retains progress and rejects changed history", async () => {
  const db = new PGlite();
  const adapter = {
    query: async (q: string, p?: unknown[]) =>
      q.includes("pg_advisory_xact_lock")
        ? { rows: [] }
        : p
          ? db.query(q, p)
          : q.trim().startsWith("SELECT")
            ? db.query(q)
            : { rows: await db.exec(q) },
  };
  try {
    const file = {
      name: "001_initial.sql",
      sql: readFileSync("migrations/001_initial.sql", "utf8"),
    };
    expect((await runMigrations(adapter, [file]))[0].status).toBe("applied");
    await db.query("INSERT INTO parents(google_sub) VALUES('retained')");
    expect((await runMigrations(adapter, [file]))[0].status).toBe(
      "already-applied",
    );
    expect((await db.query("SELECT * FROM parents")).rows).toHaveLength(1);
    await expect(
      runMigrations(adapter, [{ ...file, sql: file.sql + "\n-- edited" }]),
    ).rejects.toThrow("APPLIED_MIGRATION_CHANGED");
  } finally {
    await db.close();
  }
});
it("rolls back failed migration and version record together", async () => {
  const db = new PGlite();
  const adapter = {
    query: async (q: string, p?: unknown[]) =>
      q.includes("pg_advisory_xact_lock")
        ? { rows: [] }
        : p
          ? db.query(q, p)
          : q.trim().startsWith("SELECT")
            ? db.query(q)
            : { rows: await db.exec(q) },
  };
  try {
    await expect(
      runMigrations(adapter, [
        {
          name: "002_failure.sql",
          sql: "CREATE TABLE must_rollback(id integer); SELECT missing_column FROM must_rollback;",
        },
      ]),
    ).rejects.toThrow();
    expect(
      (await db.query("SELECT to_regclass('must_rollback') AS name")).rows[0],
    ).toEqual({ name: null });
  } finally {
    await db.close();
  }
});
