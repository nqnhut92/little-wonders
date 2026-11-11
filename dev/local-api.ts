// `npm run dev` serves the real API handler on a local PGlite database, with a pretend sign-in.
// "Tiếp tục với Google" signs in a local test parent instead of opening Google. Nothing here ships in a build.
import type { Plugin, ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const dataDir = ".local-db";
const shim = fileURLToPath(new URL("./neon-pglite.ts", import.meta.url));
async function openDatabase() {
  const { PGlite } = await import("@electric-sql/pglite");
  // @ts-expect-error JavaScript migration runner has no declaration file.
  const { runMigrations } = await import("../scripts/lib/migrations.mjs");
  const db = new PGlite(dataDir);
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
  const files = readdirSync("migrations")
    .filter((f) => f.endsWith(".sql"))
    .map((name) => ({ name, sql: readFileSync(`migrations/${name}`, "utf8") }));
  await runMigrations(adapter, files);
  return db;
}
async function body(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const text = Buffer.concat(chunks).toString("utf8");
  try {
    return text ? JSON.parse(text) : undefined;
  } catch {
    return text;
  }
}
// Plain http on a LAN address rejects Secure cookies (iPad Safari), so drop the flag locally.
const insecure = (value: string | string[]) =>
  ([] as string[]).concat(value).map((v) => v.replace(/;\s*Secure/i, ""));
function response(res: ServerResponse) {
  const api = {
    status(code: number) {
      res.statusCode = code;
      return api;
    },
    setHeader(name: string, value: string | string[]) {
      res.setHeader(
        name,
        name.toLowerCase() === "set-cookie" ? insecure(value) : value,
      );
      return api;
    },
    json(data: unknown) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(data));
      return api;
    },
    redirect(code: number, url: string) {
      res.statusCode = code;
      res.setHeader("Location", url);
      res.end();
      return api;
    },
  };
  return api;
}
export function localApi(): Plugin {
  return {
    name: "little-wonders-local-api",
    apply: "serve",
    config: () => ({
      resolve: { alias: { "@neondatabase/serverless": shim } },
    }),
    configureServer(server: ViteDevServer) {
      const holder = globalThis as unknown as {
        __lwLocalDb?: Promise<unknown>;
      };
      holder.__lwLocalDb ??= openDatabase();
      Object.assign(process.env, {
        DATABASE_URL: "pglite",
        GOOGLE_CLIENT_ID: "local",
        GOOGLE_CLIENT_SECRET: "local",
        SESSION_SECRET: "local-development-only-secret-0123456789",
      });
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || "/", "http://local");
        if (!url.pathname.startsWith("/api/")) return next();
        const origin = `http://${req.headers.host}`;
        process.env.APP_URL = origin;
        try {
          const route = url.pathname.slice(5).replace(/\/$/, "");
          if (route === "auth/login") {
            const db = (await holder.__lwLocalDb) as {
              query: <T>(q: string, p?: unknown[]) => Promise<{ rows: T[] }>;
            };
            const { rows } = await db.query<{ id: string }>(
              "INSERT INTO parents(google_sub) VALUES('local-test-parent') ON CONFLICT(google_sub) DO UPDATE SET google_sub=EXCLUDED.google_sub RETURNING id",
            );
            const { sign, setCookie } = await server.ssrLoadModule(
              "/api/_lib/security.ts",
            );
            setCookie(
              response(res),
              "lw_session",
              await sign({ sub: rows[0].id }),
              60 * 60 * 24 * 30,
            );
            res.statusCode = 302;
            res.setHeader("Location", origin + "/?connected=1");
            return res.end();
          }
          const { default: handler } =
            await server.ssrLoadModule("/api/index.ts");
          const query: Record<string, string> = Object.fromEntries(
            url.searchParams,
          );
          await handler(
            {
              method: req.method,
              headers: req.headers,
              query: { ...query, route },
              body: req.method === "GET" ? undefined : await body(req),
            },
            response(res),
          );
        } catch (error) {
          server.config.logger.error(String(error));
          if (!res.headersSent)
            response(res).status(500).json({ message: "Local API error" });
        }
      });
    },
  };
}
