import { emptyWorld, mergeWorld, type World } from "../game/engine";
export type Local = {
  world: World;
  pending: boolean;
  profile?: string;
  nickname: string;
  device: string;
};
const key = "little-wonders-v1";
export function load(): Local {
  try {
    const l = JSON.parse(localStorage.getItem(key) || "null");
    if (l?.world?.schema === 1) return l;
  } catch {
    /* local fallback */
  }
  return {
    world: emptyWorld(),
    pending: false,
    nickname: "Bạn nhỏ",
    device: crypto.randomUUID(),
  };
}
export function stash(l: Local) {
  if (!l.profile) return;
  const previous = cachedProfile(l.profile);
  const world = previous ? mergeWorld(previous.world, l.world) : l.world;
  const pending =
    l.pending || JSON.stringify(world) !== JSON.stringify(l.world);
  localStorage.setItem(
    key + "-" + l.profile,
    JSON.stringify({ ...l, world, pending }),
  );
}
export function cachedProfile(id: string): Local | undefined {
  try {
    return (
      JSON.parse(localStorage.getItem(key + "-" + id) || "null") ?? undefined
    );
  } catch {
    return undefined;
  }
}
export function persist(l: Local) {
  stash(l);
  localStorage.setItem(key, JSON.stringify(l));
}
export async function synchronize(
  l: Local,
  fetcher: typeof fetch = fetch,
): Promise<Local> {
  if (!l.profile) return l;
  const r = await fetcher("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Little-Wonders": "1" },
    body: JSON.stringify({ profile: l.profile, world: l.world }),
  });
  if (!r.ok) throw Error(r.status === 401 ? "AUTH" : "RETRY");
  const remote = (await r.json()) as { world: World };
  return { ...l, world: mergeWorld(l.world, remote.world), pending: false };
}
