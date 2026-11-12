import { beforeAll, afterAll, it, expect, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sign } from "../api/_lib/security";
const state = vi.hoisted(() => ({ db: null as PGlite | null }));
vi.mock("@neondatabase/serverless", () => ({
  neon:
    () =>
    async (strings: TemplateStringsArray, ...params: unknown[]) => {
      const query = strings.reduce(
        (s, part, i) => s + part + (i < params.length ? "$" + (i + 1) : ""),
        "",
      );
      return (await state.db!.query(query, params)).rows;
    },
}));
import handler from "../api/index";
let owner: string, other: string, id: string;
beforeAll(async () => {
  state.db = new PGlite();
  for (const file of ["001_initial", "002_world_v2"])
    await state.db.exec(readFileSync(`migrations/${file}.sql`, "utf8"));
  process.env.APP_URL = "https://garden.example";
  process.env.SESSION_SECRET = "a".repeat(40);
  process.env.GOOGLE_CLIENT_ID = "test";
  process.env.GOOGLE_CLIENT_SECRET = "test";
  process.env.DATABASE_URL = "test";
  const rows = await state.db.query<{ id: string }>(
    "INSERT INTO parents(google_sub) VALUES('one'),('two') RETURNING id",
  );
  owner = rows.rows[0].id;
  other = rows.rows[1].id;
  const profiles = await state.db.query<{ id: string }>(
    "INSERT INTO profiles(parent_id,nickname) VALUES($1,'Mây') RETURNING id",
    [owner],
  );
  id = profiles.rows[0].id;
});
afterAll(async () => {
  await state.db?.close();
});
async function request(
  route: string,
  uid: string | null,
  method = "GET",
  body?: unknown,
  origin = "https://garden.example",
  query: Record<string, string> = {},
) {
  const token = uid ? await sign({ sub: uid }) : "";
  const req = {
    method,
    query: { route, profile: id, ...query },
    body,
    headers: { cookie: "lw_session=" + token, origin, "x-little-wonders": "1" },
  } as unknown as VercelRequest;
  let code = 200,
    data: any;
  const res = {
    setHeader: vi.fn(),
    status: (n: number) => {
      code = n;
      return res;
    },
    json: (d: unknown) => {
      data = d;
      return res;
    },
    redirect: vi.fn(),
  } as unknown as VercelResponse;
  await handler(req, res);
  return { code, data };
}
it("requires valid sessions and prevents access to another parent garden", async () => {
  expect((await request("progress", null)).code).toBe(401);
  expect((await request("progress", other)).code).toBe(404);
  expect((await request("profiles", other)).data.profiles).toEqual([]);
  expect((await request("progress", owner)).code).toBe(200);
});
it("checks CSRF origin and ownership on writes", async () => {
  const body = {
    profile: id,
    world: { schema: 1, discoveries: ["fish"], fields: {} },
  };
  expect(
    (await request("progress", owner, "POST", body, "https://evil.example"))
      .code,
  ).toBe(403);
  expect((await request("progress", other, "POST", body)).code).toBe(404);
  expect((await request("progress", owner)).data.world.discoveries).toEqual([]);
});
it("atomically unions discoveries, persists creations and retries idempotently", async () => {
  const world = {
    schema: 1,
    discoveries: ["fish"],
    fields: {
      decorations: {
        value: [{ id: "star", x: 20, y: 40 }],
        clock: 2,
        device: "a",
      },
    },
  };
  const one = await request("progress", owner, "POST", { profile: id, world });
  const two = await request("progress", owner, "POST", { profile: id, world });
  expect(one.code).toBe(200);
  expect(two.data.revision).toEqual(one.data.revision);
  const stale = {
    schema: 1,
    discoveries: ["bird"],
    fields: { decorations: { value: [], clock: 1, device: "b" } },
  };
  const merged = await request("progress", owner, "POST", {
    profile: id,
    world: stale,
  });
  expect(merged.data.world.discoveries).toEqual(["bird", "fish"]);
  expect(merged.data.world.fields.decorations.value).toHaveLength(1);
});
it("rejects malformed progress", async () => {
  expect(
    (
      await request("progress", owner, "POST", {
        profile: id,
        world: { schema: 2 },
      })
    ).code,
  ).toBe(400);
});

import { verify, parent, csrf } from "../api/_lib/security";
it("rejects expired and tampered sessions, and cross-site mutations", async () => {
  await expect(verify(await sign({ sub: owner }, "-1s"))).rejects.toThrow();
  expect(
    await parent({
      headers: { cookie: "lw_session=invalid" },
    } as VercelRequest),
  ).toBe(null);
  expect(
    csrf({
      headers: {
        origin: "https://garden.example",
        "x-little-wonders": "1",
        "sec-fetch-site": "cross-site",
      },
    } as unknown as VercelRequest),
  ).toBe(false);
});
it("rejects malformed world fields before they can corrupt a saved garden", async () => {
  const result = await request("progress", owner, "POST", {
    profile: id,
    world: {
      schema: 1,
      discoveries: [],
      fields: { decorations: { value: "invalid", clock: 3, device: "a" } },
    },
  });
  expect(result.code).toBe(400);
  expect(
    (await request("progress", owner)).data.world.fields.decorations.value,
  ).toHaveLength(1);
});

it("stores unfinished meals and accepts completed count variations", async () => {
  const world = {
    schema: 1,
    discoveries: [],
    fields: {
      meal: {
        value: { kind: "berries", count: 1, attempts: 0 },
        clock: 20,
        device: "a",
      },
      lastMeal: { value: { kind: "apples", count: 1 }, clock: 20, device: "a" },
    },
  };
  expect(
    (await request("progress", owner, "POST", { profile: id, world })).code,
  ).toBe(200);
  const saved = await request("progress", owner);
  expect(saved.data.world.fields.meal.value).toEqual({
    kind: "berries",
    count: 1,
    attempts: 0,
  });
  expect(saved.data.world.fields.lastMeal.value.count).toBe(1);
});

it("accepts v1 and v2 payloads, epochs and counters, and keeps counters monotonic", async () => {
  const device = "tablet";
  const post = (world: unknown) =>
    request("progress", owner, "POST", { profile: id, world });
  expect(
    (
      await post({
        schema: 2,
        epoch: 0,
        discoveries: ["harvest_carrot", "region_pond_open"],
        fields: { "n.gift_puppy": { value: 5, clock: 50, device } },
      })
    ).code,
  ).toBe(200);
  const lower = await post({
    schema: 2,
    discoveries: [],
    fields: { "n.gift_puppy": { value: 3, clock: 99, device: "phone" } },
  });
  expect(lower.data.world.fields["n.gift_puppy"].value).toBe(5);
  expect(lower.data.world.schema).toBe(2);
  expect(lower.data.world.discoveries).toContain("region_pond_open");
});
it("lets a higher epoch replace the saved garden and ignores a lower one afterwards", async () => {
  const post = (world: unknown) =>
    request("progress", owner, "POST", { profile: id, world });
  const fresh = await post({
    schema: 2,
    epoch: 1,
    discoveries: ["night"],
    fields: {},
  });
  expect(fresh.data.world).toMatchObject({
    epoch: 1,
    discoveries: ["night"],
    fields: {},
  });
  const stale = await post({ schema: 1, discoveries: ["fish"], fields: {} });
  expect(stale.data.world.discoveries).toEqual(["night"]);
  expect(stale.data.world.epoch).toBe(1);
});
it.each([
  ["unknown field key", { stranger: { value: 1, clock: 1, device: "a" } }],
  [
    "counter with a fractional value",
    { "n.x": { value: 1.5, clock: 1, device: "a" } },
  ],
  [
    "counter key with uppercase",
    { "n.Bad": { value: 1, clock: 1, device: "a" } },
  ],
  [
    "plant slot out of range",
    {
      plant9: {
        value: { kind: "carrot", water: true, sun: true },
        clock: 1,
        device: "a",
      },
    },
  ],
])("rejects %s", async (_name, fields) => {
  const result = await request("progress", owner, "POST", {
    profile: id,
    world: { schema: 2, discoveries: [], fields },
  });
  expect(result.code).toBe(400);
});
it("rejects bad discovery ids, too many discoveries and too many fields", async () => {
  const post = (world: unknown) =>
    request("progress", owner, "POST", { profile: id, world });
  for (const discoveries of [
    ["Has Space"],
    ["x".repeat(33)],
    Array.from({ length: 201 }, (_, i) => `d_${i}`),
  ])
    expect((await post({ schema: 2, discoveries, fields: {} })).code).toBe(400);
  const fields = Object.fromEntries(
    Array.from({ length: 201 }, (_, i) => [
      `n.k${i}`,
      { value: 1, clock: 1, device: "a" },
    ]),
  );
  expect((await post({ schema: 2, discoveries: [], fields })).code).toBe(400);
  expect((await post({ schema: 3, discoveries: [], fields: {} })).code).toBe(
    400,
  );
});
it("deletes only profiles owned by the signed-in parent", async () => {
  const created = await request("profiles", owner, "POST", {
    nickname: "Hồ sơ xóa thử",
  });
  expect(created.code).toBe(201);
  const targetId = created.data.id as string;

  const wrongOwner = await request(
    "profiles",
    other,
    "DELETE",
    undefined,
    "https://garden.example",
    { id: targetId },
  );
  expect(wrongOwner.code).toBe(404);

  const badOrigin = await request(
    "profiles",
    owner,
    "DELETE",
    undefined,
    "https://evil.example",
    { id: targetId },
  );
  expect(badOrigin.code).toBe(403);

  const deleted = await request(
    "profiles",
    owner,
    "DELETE",
    undefined,
    "https://garden.example",
    { id: targetId },
  );
  expect(deleted.code).toBe(200);
  expect(deleted.data).toEqual({ deleted: targetId });

  const again = await request(
    "profiles",
    owner,
    "DELETE",
    undefined,
    "https://garden.example",
    { id: targetId },
  );
  expect(again.code).toBe(404);
});
