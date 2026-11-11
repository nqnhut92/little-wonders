import {
  value,
  plotKey,
  plotCount,
  basketOf,
  type World,
  type Plot,
} from "./engine";
export function contextualHint(world: World): string {
  const plants = Array.from({ length: plotCount(world) }, (_, i) =>
    value<Plot | undefined>(world, plotKey(i), undefined),
  ).filter((p) => p && p.stage > 0);
  if (plants.some((p) => p && p.stage === 4))
    return "Có cây chín rồi! Con chạm vào cây để hái vào giỏ nhé!";
  if (plants.some((p) => p && !p.water))
    return "Mầm cây khát nước. Con đưa mây tới luống cây nhé!";
  if (plants.some((p) => p && !p.sun))
    return "Mầm đã uống nước rồi. Con đưa mặt trời tới sưởi ấm nhé!";
  const basket = basketOf(world);
  const totalBasket = Object.values(basket).reduce((a, b) => a + b, 0);
  if (
    totalBasket > 0 &&
    !world.discoveries.some((d) => d.startsWith("dish_"))
  )
    return "Giỏ có món ngon rồi! Con mở Bếp của vườn để nấu ăn nhé!";
  if (
    world.discoveries.includes("pal_reindeer") &&
    !world.discoveries.includes("story_reindeer_1") &&
    totalBasket > 0
  )
    return "Bạn Tuần Lộc nhỏ vừa tới vườn kìa! Con chạm để tặng quà cho bạn nhé!";
  if (plants.length === 0) return "Con chọn một hạt rồi chạm luống đất nhé!";
  if (!world.discoveries.includes("apple"))
    return "Con thử lắc cây táo xem có quả rơi vào giỏ không nhé!";
  if (!world.discoveries.includes("fish"))
    return "Có gì dưới lá sen nhỉ? Con thử chạm mặt nước nhé!";
  if (!world.discoveries.includes("ladybug"))
    return "Dưới hòn đá có tiếng sột soạt. Bạn nào trốn ở đó ta?";
  if (!world.discoveries.includes("lunch"))
    return "Cún Lucky đang chờ dưa hấu ngon. Con chạm vào Lucky nhé!";
  if (!world.discoveries.includes("house"))
    return "Ngôi nhà thích màu gì nhỉ? Con chạm vào nhà để thử nhé!";
  return "Mình ngắm khu vườn con đã chăm, rồi nghỉ một chút cũng được nhé!";
}
