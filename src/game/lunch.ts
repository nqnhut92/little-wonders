import { pals, giftCounter, fulfilledCounter, type Pal } from "../data/pals";
import { counter, type World } from "./engine";
// Replace displayed pal names with their TTS-friendly pronunciation when speaking.
export const palSpeak = (pal: Pal, text: string) =>
  text.split(pal.name).join(pal.spokenName);
export function palWish(world: World, pal: Pal): string {
  const wishes = counter(world, fulfilledCounter(pal.id));
  return pal.wants[wishes % pal.wants.length];
}
export function palStatus(world: World, palId: string) {
  const pal = pals.find((p) => p.id === palId)!;
  const arrived = !pal.arrives || world.discoveries.includes(pal.arrives);
  const gifts = counter(world, giftCounter(pal.id));
  const wishes = counter(world, fulfilledCounter(pal.id));
  const wish = pal.wants[wishes % pal.wants.length];
  const unlockedChapters = pal.chapters.filter((need) => gifts >= need).length;
  return { pal, arrived, gifts, wishes, wish, unlockedChapters };
}
