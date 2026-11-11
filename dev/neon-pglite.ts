// Local development only: stands in for @neondatabase/serverless so the real API runs on PGlite.
// vite.config.ts aliases the package to this file during `npm run dev`; builds never include it.
import type { PGlite } from "@electric-sql/pglite";
const holder = globalThis as unknown as { __lwLocalDb?: Promise<PGlite> };
export function neon() {
  return async (strings: TemplateStringsArray, ...params: unknown[]) => {
    const db = await holder.__lwLocalDb!;
    const query = strings.reduce(
      (text, part, i) => text + part + (i < params.length ? "$" + (i + 1) : ""),
      "",
    );
    return (await db.query(query, params)).rows;
  };
}
