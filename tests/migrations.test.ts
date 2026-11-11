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

it("upgrades 001 to 002 without losing v1 progress and keeps v1 payloads mergeable", async () => {
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
    const read = (name: string) => ({
      name,
      sql: readFileSync(`migrations/${name}`, "utf8"),
    });
    await runMigrations(adapter, [read("001_initial.sql")]);
    const world = JSON.parse(
      readFileSync("tests/fixtures/world-v1.json", "utf8"),
    );
    const parent = await db.query<{ id: string }>(
      "INSERT INTO parents(google_sub) VALUES('x') RETURNING id",
    );
    await db.query(
      "INSERT INTO profiles(parent_id,nickname,world) VALUES($1,'Mây',$2::jsonb)",
      [parent.rows[0].id, JSON.stringify(world)],
    );
    // The old function is still live while the new API deploys.
    const results = await runMigrations(adapter, [
      read("001_initial.sql"),
      read("002_world_v2.sql"),
    ]);
    expect(results.map((r: { status: string }) => r.status)).toEqual([
      "already-applied",
      "applied",
    ]);
    const stored = (await db.query("SELECT world FROM profiles")).rows[0] as {
      world: typeof world;
    };
    expect(stored.world).toEqual(world);
    const merged = (
      await db.query<{ w: { schema: number; epoch: number; fields: object } }>(
        'SELECT merge_world(world,\'{"schema":1,"discoveries":["fish"],"fields":{}}\'::jsonb) AS w FROM profiles',
      )
    ).rows[0].w;
    expect(merged).toMatchObject({ schema: 1, epoch: 0, fields: world.fields });
    const fresh = await db.query<{ world: { schema: number; epoch: number } }>(
      "INSERT INTO profiles(parent_id,nickname) VALUES($1,'Nắng') RETURNING world",
      [parent.rows[0].id],
    );
    expect(fresh.rows[0].world).toMatchObject({ schema: 2, epoch: 0 });
  } finally {
    await db.close();
  }
});
