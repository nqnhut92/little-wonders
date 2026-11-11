import { value, type World } from "./engine";
export type SurpriseEvent = {
  id: string;
  kind: "rainbow" | "butterflies" | "shooting_star" | "pal_wave";
  message: string;
  discovery?: string;
};
// Pure surprise selector; takes an injected random function so tests stay deterministic.
export function pickSurpriseEvent(
  world: World,
  random: () => number = Math.random,
): SurpriseEvent | null {
  const time = value<string>(world, "scene.time", "day");
  const candidates: SurpriseEvent[] = [];
  if (
    world.discoveries.includes("rain") &&
    world.discoveries.includes("sun")
  )
    candidates.push({
      id: "rainbow",
      kind: "rainbow",
      message: "Kìa! Cầu vồng bảy sắc đang lung linh trên bầu trời!",
    });
  if (time === "night") {
    candidates.push({
      id: "shooting_star",
      kind: "shooting_star",
      message: "Ồ! Một ngôi sao băng vừa lướt qua bầu trời đêm!",
      discovery: "shooting_star",
    });
  } else {
    candidates.push({
      id: "butterflies",
      kind: "butterflies",
      message: "Đàn bướm rực rỡ vừa bay ngang qua vườn!",
    });
  }
  candidates.push({
    id: "pal_wave",
    kind: "pal_wave",
    message: "Bạn Bông vẫy tai chào con thật vui!",
  });
  return candidates[Math.floor(random() * candidates.length)] ?? null;
}
export function nextSurpriseDelayMs(random: () => number = Math.random): number {
  return 45_000 + Math.floor(random() * 45_000);
}
