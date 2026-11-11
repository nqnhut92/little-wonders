import { SignJWT, jwtVerify } from "jose";
import type { VercelRequest, VercelResponse } from "@vercel/node";
export const cookie = (req: VercelRequest, name: string) => {
  const raw = (req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(name + "="));
  return raw ? decodeURIComponent(raw.slice(name.length + 1)) : undefined;
};
const key = () => {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
    throw Error("SESSION_CONFIGURATION");
  return new TextEncoder().encode(process.env.SESSION_SECRET);
};
export async function sign(payload: Record<string, unknown>, expiry = "30d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(key());
}
export async function verify(token: string) {
  return (await jwtVerify(token, key(), { algorithms: ["HS256"] })).payload;
}
export async function parent(req: VercelRequest) {
  try {
    const p = await verify(cookie(req, "lw_session") || "");
    return typeof p.sub === "string" ? p.sub : null;
  } catch {
    return null;
  }
}
export function csrf(req: VercelRequest) {
  return (
    req.headers["x-little-wonders"] === "1" &&
    req.headers.origin === process.env.APP_URL &&
    req.headers["sec-fetch-site"] !== "cross-site"
  );
}
export function setCookie(
  res: VercelResponse,
  name: string,
  value: string,
  maxAge: number,
) {
  res.setHeader(
    "Set-Cookie",
    `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
  );
}
export function owns(parentId: string, ownerId: string) {
  return parentId === ownerId;
}
