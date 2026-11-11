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
    id: "puppy",
    name: "Lucky",
    spokenName: "Lắc-ki",
    art: "puppy",
    freeFoods: ["watermelon", "carrot", "apple"],
    wants: ["watermelon", "apple", "carrot", "dish_juice"],
    chapters: [1, 3, 6],
    stories: [
      "Hôm nay Lucky đánh hơi thấy mùi dưa hấu ngọt lịm. Gâu! Lucky thích nhất là dưa hấu mát lạnh.",
      "Lucky chạy quanh các luống đất, vẫy đuôi tít mù khi thấy mầm xanh nhú lên dưới nắng.",
      "Cuối ngày Lucky nằm cạnh bạn Tuần Lộc nhỏ, hai đứa cùng nhìn mặt trời lặn thật êm.",
    ],
    thanks: [
      "Gâu gâu! Lucky cảm ơn con nhiều lắm!",
      "Ngon quá, Lucky vẫy đuôi tít luôn!",
      "Lucky thích lắm, cảm ơn con nhé!",
    ],
  },
  {
    id: "reindeer",
    name: "Tuần Lộc nhỏ",
    spokenName: "bạn Tuần Lộc nhỏ",
    art: "reindeer",
    arrives: "pal_reindeer",
    wants: ["watermelon", "carrot", "apple", "dish_fruitbowl"],
    chapters: [1, 3, 6],
    stories: [
      "Bạn Tuần Lộc nhỏ gõ nhẹ đôi móng nhỏ xíu ngoài cổng vườn rồi mỉm cười chào Lucky.",
      "Bạn Tuần Lộc nhỏ cũng mê vị ngọt mát của dưa hấu đỏ giống hệt Lucky luôn đấy!",
      "Đêm xuống, cặp sừng nhỏ của bạn Tuần Lộc lấp lánh dưới ánh trăng cùng đom đóm.",
    ],
    thanks: [
      "Tuần Lộc nhỏ thích mê! Cảm ơn con nhé!",
      "Ngon tuyệt! Bạn Tuần Lộc nhỏ khẽ lắc đầu vui lắm!",
      "Ấm áp quá, cảm ơn con nhiều!",
    ],
  },
];
export const palDiscovery = (id: string) => `pal_${id}`;
export const storyDiscovery = (id: string, n: number) => `story_${id}_${n}`;
export const giftCounter = (id: string) => `n.gift_${id}`;
export const fulfilledCounter = (id: string) => `n.wish_${id}`;
