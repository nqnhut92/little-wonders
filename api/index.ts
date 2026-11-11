import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { randomBytes, createHash } from "node:crypto";
import { z } from "zod";
import {
  cookie,
  sign,
  verify,
  parent,
  csrf,
  setCookie,
} from "./_lib/security.js";
const jwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);
const stamp = <T extends z.ZodType>(schema: T) =>
  z.object({
    value: schema,
    clock: z.number().int().min(0).max(1e15),
    device: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
  });
const plant = stamp(
  z.object({
    kind: z.enum(["sunflower", "carrot", "berry"]),
    water: z.boolean(),
    sun: z.boolean(),
  }),
);
const worldSchema = z.object({
  schema: z.literal(1),
  discoveries: z
    .array(
      z.enum([
        "rain",
        "sun",
        "sunflower",
        "carrot",
        "berry",
        "butterfly",
        "worm",
        "ladybug",
        "bird",
        "rabbit",
        "fish",
        "apple",
        "lunch",
        "colors",
        "house",
        "decor",
        "rainbow",
        "grass",
      ]),
    )
    .max(40),
  fields: z
    .object({
      plant0: plant.optional(),
      plant1: plant.optional(),
      plant2: plant.optional(),
      houseColor: stamp(
        z.enum(["#efcf9d", "#d7a6b5", "#a5bca0", "#a2becb", "#e7bc7b"]),
      ).optional(),
      decorations: stamp(
        z
          .array(
            z.object({
              id: z.enum(["flower", "butterfly", "star"]),
              x: z.number().min(0).max(100),
              y: z.number().min(0).max(100),
            }),
          )
          .max(20),
      ).optional(),
      lastMeal: stamp(
        z.object({ kind: z.enum(["orange", "colors"]), count: z.literal(3) }),
      ).optional(),
    })
    .strict(),
});
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const route = String(req.query.route || "");
  const app = process.env.APP_URL;
  try {
    if (
      !app ||
      !process.env.DATABASE_URL ||
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.SESSION_SECRET
    )
      return res.status(503).json({
        message:
          "Người lớn cần cấu hình kết nối để đăng nhập. Khu vườn trên máy vẫn chơi được.",
      });
    const sql = neon(process.env.DATABASE_URL);
    if (route === "auth/login" || route === "auth/callback") {
      const peer = String(req.headers["x-forwarded-for"] || "unknown").split(
        ",",
      )[0];
      const bucket = createHash("sha256")
        .update(
          process.env.SESSION_SECRET +
            peer +
            new Date().toISOString().slice(0, 16),
        )
        .digest("hex");
      const hits =
        await sql`INSERT INTO rate_limits(bucket,hits,expires_at) VALUES(${bucket},1,now()+interval '2 minutes') ON CONFLICT(bucket) DO UPDATE SET hits=rate_limits.hits+1 RETURNING hits`;
      await sql`DELETE FROM rate_limits WHERE expires_at<now()`;
      if (hits[0].hits > 20) {
        res.setHeader("Retry-After", "60");
        return res
          .status(429)
          .json({ message: "Mình chờ một chút rồi thử đăng nhập lại nhé." });
      }
    }
    if (req.method === "POST" && !csrf(req))
      return res.status(403).json({ message: "Yêu cầu không hợp lệ." });
    if (route === "auth/login" && req.method === "GET") {
      const state = randomBytes(24).toString("hex"),
        nonce = randomBytes(24).toString("hex");
      setCookie(res, "lw_oauth", await sign({ state, nonce }, "10m"), 600);
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.search = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: app + "/api/auth/callback",
        response_type: "code",
        scope: "openid",
        state,
        nonce,
        prompt: "select_account",
      }).toString();
      return res.redirect(302, url.toString());
    }
    if (route === "auth/callback" && req.method === "GET") {
      const state = await verify(cookie(req, "lw_oauth") || "");
      if (state.state !== req.query.state || typeof req.query.code !== "string")
        return res.status(400).json({
          message: "Đăng nhập chưa thành công. Người lớn thử lại nhé.",
        });
      const exchange = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: req.query.code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: app + "/api/auth/callback",
          grant_type: "authorization_code",
        }),
      });
      if (!exchange.ok) throw Error("OAUTH");
      const tokens = await exchange.json();
      const { payload } = await jwtVerify(tokens.id_token, jwks, {
        issuer: ["https://accounts.google.com", "accounts.google.com"],
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      if (payload.nonce !== state.nonce || !payload.sub) throw Error("NONCE");
      const rows =
        await sql`INSERT INTO parents(google_sub) VALUES(${payload.sub}) ON CONFLICT(google_sub) DO UPDATE SET google_sub=EXCLUDED.google_sub RETURNING id`;
      setCookie(res, "lw_session", await sign({ sub: rows[0].id }), 2592000);
      return res.redirect(302, app + "/?connected=1");
    }
    const uid = await parent(req);
    if (!uid)
      return res.status(401).json({
        message:
          "Người lớn cần đăng nhập lại. Tiến trình vẫn được cất trên máy.",
      });
    if (req.method === "POST") {
      const bucket = createHash("sha256")
        .update(uid + route + new Date().toISOString().slice(0, 16))
        .digest("hex");
      const limits =
        await sql`INSERT INTO rate_limits(bucket,hits,expires_at) VALUES(${bucket},1,now()+interval '2 minutes') ON CONFLICT(bucket) DO UPDATE SET hits=rate_limits.hits+1 RETURNING hits`;
      if (limits[0].hits > 60)
        return res
          .status(429)
          .json({ message: "Mình chờ một chút rồi thử lại nhé." });
      await sql`DELETE FROM rate_limits WHERE expires_at<now()`;
    }
    if (route === "auth/logout" && req.method === "POST") {
      setCookie(res, "lw_session", "", 0);
      return res.json({ ok: true });
    }
    if (route === "profiles" && req.method === "GET") {
      const profiles =
        await sql`SELECT id,nickname FROM profiles WHERE parent_id=${uid} ORDER BY created_at`;
      return res.json({ profiles });
    }
    if (route === "profiles" && req.method === "POST") {
      const body = z
        .object({ nickname: z.string().trim().min(1).max(24) })
        .parse(req.body);
      const rows =
        await sql`INSERT INTO profiles(parent_id,nickname) SELECT ${uid},${body.nickname} WHERE (SELECT count(*) FROM profiles WHERE parent_id=${uid})<8 RETURNING id,nickname`;
      if (!rows.length)
        return res.status(409).json({ message: "Tài khoản đã có đủ hồ sơ." });
      return res.status(201).json(rows[0]);
    }
    if (route === "progress") {
      const id = z
        .uuid()
        .parse(req.method === "GET" ? req.query.profile : req.body?.profile);
      if (req.method === "GET") {
        const rows =
          await sql`SELECT world FROM profiles WHERE id=${id} AND parent_id=${uid}`;
        if (!rows.length)
          return res.status(404).json({ message: "Không tìm thấy khu vườn." });
        return res.json(rows[0]);
      }
      if (req.method === "POST") {
        if (JSON.stringify(req.body).length > 64000)
          return res.status(413).json({ message: "Dữ liệu quá lớn." });
        const world = worldSchema.parse(req.body.world);
        if (Object.keys(world.fields).length > 80)
          return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
        const rows =
          await sql`UPDATE profiles SET world=merge_world(world,${JSON.stringify(world)}::jsonb),revision=revision+CASE WHEN world IS DISTINCT FROM merge_world(world,${JSON.stringify(world)}::jsonb) THEN 1 ELSE 0 END,updated_at=now() WHERE id=${id} AND parent_id=${uid} RETURNING world,revision`;
        if (!rows.length)
          return res.status(404).json({ message: "Không tìm thấy khu vườn." });
        return res.json(rows[0]);
      }
    }
    return res.status(404).json({ message: "Không tìm thấy yêu cầu." });
  } catch (e) {
    if (e instanceof z.ZodError)
      return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
    return res.status(500).json({
      message: "Chưa kết nối được. Tiến trình trên máy vẫn được giữ lại.",
    });
  }
}
