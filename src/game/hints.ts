import { value, plotKey, plotCount, type World, type Plot } from "./engine";
export function contextualHint(world: World): string {
  const plants = Array.from({ length: plotCount(world) }, (_, i) =>
    value<Plot | undefined>(world, plotKey(i), undefined),
  ).filter((p) => p && p.stage > 0);
  if (plants.length === 0) return "Con chọn một hạt rồi chạm luống đất nhé!";
  if (plants.some((p) => p && p.stage === 4))
    return "Có cây chín rồi! Con chạm vào cây để hái nhé!";
  if (plants.some((p) => p && !p.water))
    return "Mầm cây khát nước. Con đưa mây tới luống cây nhé!";
  if (plants.some((p) => p && !p.sun))
    return "Mầm đã uống nước rồi. Con đưa mặt trời tới sưởi ấm nhé!";
  if (!world.discoveries.includes("fish"))
    return "Có gì dưới lá sen nhỉ? Con thử chạm mặt nước nhé!";
  if (!world.discoveries.includes("ladybug"))
    return "Dưới hòn đá có tiếng sột soạt. Bạn nào trốn ở đó ta?";
  if (!world.discoveries.includes("lunch"))
    return "Thỏ đang đói. Con chạm vào thỏ để cùng chuẩn bị bữa trưa nhé!";
  if (!world.discoveries.includes("house"))
    return "Ngôi nhà thích màu gì nhỉ? Con chạm vào nhà để thử nhé!";
  return "Mình ngắm khu vườn con đã chăm, rồi nghỉ một chút cũng được nhé!";
}
