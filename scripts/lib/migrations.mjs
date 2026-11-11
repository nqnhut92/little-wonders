import { createHash } from "node:crypto";
export async function runMigrations(db, files) {
  const versions = new Set();
  for (const file of files) {
    if (!/^\d+_[\w-]+\.sql$/.test(file.name))
      throw Error("INVALID_MIGRATION_NAME");
    const version = Number(file.name.split("_")[0]);
    if (!Number.isSafeInteger(version) || versions.has(version))
      throw Error("DUPLICATE_MIGRATION_VERSION");
    versions.add(version);
  }
  const results = [];
  for (const file of [...files].sort(
    (a, b) => Number(a.name.split("_")[0]) - Number(b.name.split("_")[0]),
  )) {
    const version = Number(file.name.split("_")[0]);
    const checksum = createHash("sha256").update(file.sql).digest("hex");
    await db.query("BEGIN");
    try {
      // Transaction-scoped lock also works through Neon's transaction pooler.
      await db.query("SELECT pg_advisory_xact_lock(721145034)");
      await db.query(
        "CREATE TABLE IF NOT EXISTS schema_migrations(version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now(), checksum text)",
      );
      await db.query(
        "ALTER TABLE schema_migrations ADD COLUMN IF NOT EXISTS checksum text",
      );
      const { rows } = await db.query(
        "SELECT checksum FROM schema_migrations WHERE version=$1",
        [version],
      );
      if (rows[0]?.checksum && rows[0].checksum !== checksum)
        throw Error("APPLIED_MIGRATION_CHANGED");
      if (!rows.length) {
        const body = file.sql
          .replace(/^\s*BEGIN\s*;/i, "")
          .replace(/COMMIT\s*;\s*$/i, "");
        await db.query(body);
      }
      await db.query(
        "INSERT INTO schema_migrations(version,checksum) VALUES($1,$2) ON CONFLICT(version) DO UPDATE SET checksum=EXCLUDED.checksum",
        [version, checksum],
      );
      await db.query("COMMIT");
      results.push({
        name: file.name,
        status: rows.length ? "already-applied" : "applied",
      });
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }
  return results;
}
