import { URL } from "node:url";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { Client } from "pg";
import { runMigrations } from "./lib/migrations.mjs";
for (const file of [".env.local", ".env"])
  if (existsSync(file)) process.loadEnvFile(file);
if (!process.env.DATABASE_URL) {
  console.error(
    "Thiếu DATABASE_URL. Đặt connection string Neon trong .env.local hoặc biến môi trường.",
  );
  process.exitCode = 1;
} else {
  const url = new URL(process.env.DATABASE_URL);
  // Enforce certificate validation independently of sslmode URL compatibility settings.
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"])
    url.searchParams.delete(key);
  const client = new Client({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 15000,
  });
  try {
    await client.connect();
    const files = readdirSync("migrations")
      .filter((n) => n.endsWith(".sql"))
      .map((name) => ({
        name,
        sql: readFileSync("migrations/" + name, "utf8"),
      }));
    for (const result of await runMigrations(client, files))
      console.log(result.name + ": " + result.status);
  } catch (error) {
    console.error(
      "Migration chưa hoàn tất. Mã lỗi: " +
        (error.code ||
          (error.message === "APPLIED_MIGRATION_CHANGED" && error.message) ||
          "MIGRATION_FAILED"),
    );
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}
