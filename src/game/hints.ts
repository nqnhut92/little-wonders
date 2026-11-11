import { value, type World, type Plant } from "./engine";
export function contextualHint(world: World): string {
  const plants = [0, 1, 2].map((i) =>
    value<Plant | undefined>(world, `plant${i}`, undefined),
  );
  if (plants.every((p) => !p))
    return "Con chọn một hạt rồi chạm luống đất nhé!";
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
