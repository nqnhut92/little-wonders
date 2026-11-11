// Pals are data. A request never expires: the current wish is derived from how many wishes were granted.
export type Pal = {
  id: string;
  name: string;
  // Pronunciation hint for speech synthesis while displaying `name` in the UI.
  spokenName: string;
  art: string;
  // Discovery that brings the pal to the garden; undefined means present from the start.
  arrives?: string;
  // Basic foods always available on this pal's table even if the basket is empty.
  freeFoods?: string[];
  // Wishes in order; they repeat.
  wants: string[];
  // Gifts needed to unlock each story chapter.
  chapters: number[];
  stories: string[];
  thanks: string[];
};
export const pals: Pal[] = [
  {
    id: "rabbit",
    name: "Bông",
    spokenName: "bạn Bông",
    art: "rabbit",
    freeFoods: ["carrot", "berry", "apple"],
    wants: ["carrot", "berry", "apple", "dish_salad", "dish_pie"],
    chapters: [1, 3, 6],
    stories: [
      "Sáng nay bạn Bông đánh thức cả vườn bằng một cú nhảy thật cao bên luống cà rốt.",
      "Bạn Bông nhặt những cánh hoa vàng xếp thành vòng tròn nhỏ trước cửa nhà.",
      "Chiều mát, bạn Bông ngồi nghe gió hát và chừa sẵn một chỗ êm bên cạnh con.",
    ],
    thanks: [
      "Ngon quá! Bạn Bông nhảy cẫng lên vì vui!",
      "Cảm ơn con nhé! Bạn Bông thích món này lắm!",
      "Tuyệt vời! Bạn Bông vẫy tai chào con nè!",
    ],
  },
  {
    id: "puppy",
    name: "Lucky",
    spokenName: "Lắc-ki",
    art: "puppy",
    arrives: "pal_puppy",
    wants: ["watermelon", "apple", "carrot", "dish_juice"],
    chapters: [1, 3, 6],
    stories: [
      "Hôm nay Lucky đánh hơi thấy mùi dưa hấu ngọt lịm. Gâu! Lucky thích nhất là dưa hấu mát lạnh.",
      "Lucky đào một cái hố nhỏ trong vườn và tìm thấy một hạt dưa đen bóng mang cho con đấy!",
      "Cuối ngày Lucky nằm cạnh bạn Bông, hai đứa cùng nhìn mặt trời lặn thật êm.",
    ],
    thanks: [
      "Gâu gâu! Lucky cảm ơn con nhiều lắm!",
      "Ngon quá, Lucky vẫy đuôi tít luôn!",
      "Lucky thích lắm, cảm ơn con nhé!",
    ],
  },
];
export const palDiscovery = (id: string) => `pal_${id}`;
export const storyDiscovery = (id: string, n: number) => `story_${id}_${n}`;
export const giftCounter = (id: string) => `n.gift_${id}`;
export const fulfilledCounter = (id: string) => `n.wish_${id}`;
