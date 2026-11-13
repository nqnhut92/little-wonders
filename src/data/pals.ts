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
  {
    id: "capybara",
    name: "Capybara",
    spokenName: "bạn Ca-pi-ba-ra",
    art: "capybara",
    arrives: "pal_capybara",
    freeFoods: ["watermelon", "carrot", "apple"],
    wants: ["watermelon", "lotus", "dish_lotus_tea", "dish_lotus_sweet"],
    chapters: [1, 3, 6],
    stories: [
      "Bạn Capybara đội quả quýt cam tròn xoe trên đầu, ngồi thư giãn bên bờ ao sen mát rượi.",
      "Vịt con và bạn ếch xanh thích leo lên lưng Capybara ngồi hóng gió, cả bọn cùng cười tít mắt.",
      "Chiều mát, Capybara mang hương sen về vườn nhà nằm phơi nắng cùng Lucky và Tuần Lộc nhỏ.",
    ],
    thanks: [
      "Măm măm! Capybara thích quá, quả quýt trên đầu rung rinh luôn!",
      "Ngon lành quá! Bạn Capybara híp mắt cảm ơn con nhé!",
      "Thơm mát tuyệt vời! Capybara vui lắm!",
    ],
  },
  {
    id: "squirrel",
    name: "Sóc nhỏ",
    spokenName: "bạn Sóc nhỏ",
    art: "squirrel",
    arrives: "squirrel",
    freeFoods: ["chestnut", "blueberry", "apple"],
    wants: ["chestnut", "blueberry", "dish_berry_tart", "dish_honey_tea"],
    chapters: [1, 3, 6],
    stories: [
      "Sóc nhỏ ôm đầy hai má hạt dẻ thơm lừng, nhảy thoăn thoắt trên cành thông xanh.",
      "Mỗi sáng trong rừng nhỏ, Sóc nhỏ lại đếm xem hôm nay hái được mấy trái việt quất tím.",
      "Sóc nhỏ giấu sẵn vài hạt dẻ ngon nhất để dành mời Lucky và con mỗi khi ghé thăm.",
    ],
    thanks: [
      "Chít chít! Sóc nhỏ mê món này lắm, cảm ơn con nhé!",
      "Ngon quá chừng! Đuôi Sóc nhỏ xù lên vui tít mắt!",
      "Cảm ơn con nha, Sóc nhỏ sẽ cất dành một miếng cho mùa đông!",
    ],
  },
  {
    id: "turtle",
    name: "Rùa con",
    spokenName: "bạn Rùa con",
    art: "turtle",
    arrives: "turtle",
    freeFoods: ["coconut", "watermelon", "apple"],
    wants: [
      "coconut",
      "pineapple",
      "dish_pineapple_juice",
      "dish_tropical_bowl",
    ],
    chapters: [1, 3, 6],
    stories: [
      "Rùa con bò thật chậm trên bãi cát vàng, lắng nghe tiếng sóng biển vỗ rì rào.",
      "Mỗi khi nắng lên, Rùa con thích uống một ngụm nước dừa mát lạnh dưới bóng dừa xanh.",
      "Ban đêm, Rùa con ngắm bọt sóng lấp lánh rồi kể chuyện biển cả cho vỏ sò nghe.",
    ],
    thanks: [
      "Mát rượi luôn! Rùa con vẫy vây cảm ơn con nhé!",
      "Ngon quá! Rùa con thò đầu ra khỏi mai cười tít mắt!",
      "Cảm ơn con nhiều lắm, Rùa con thấy khỏe hẳn ra!",
    ],
  },
  {
    id: "penguin",
    name: "Cánh cụt",
    spokenName: "bạn Cánh cụt",
    art: "penguin",
    arrives: "penguin",
    freeFoods: ["apple", "corn", "carrot"],
    wants: ["dish_pine_tea", "dish_mint_cocoa", "dish_cranberry_pie", "apple"],
    chapters: [1, 3, 6],
    stories: [
      "Bạn Cánh cụt đi lạch bạch trên đồi tuyết trắng, vỗ cánh chào từng bông tuyết rơi.",
      "Trời lạnh mà có một tách trà thông ấm áp thì Cánh cụt thích mê luôn đấy!",
      "Chiều xuống, Cánh cụt cùng gấu bông tuyết trượt vèo trên đồi tuyết cười vang.",
    ],
    thanks: [
      "Ấm bụng quá! Cánh cụt vỗ cánh cảm ơn con nhé!",
      "Ngon tuyệt vời! Cánh cụt nhảy cẫng trên tuyết luôn!",
      "Cảm ơn con nhiều nha, hết lạnh cóng rồi!",
    ],
  },
  {
    id: "owl",
    name: "Cú mèo",
    spokenName: "bạn Cú mèo",
    art: "owl",
    arrives: "owl",
    freeFoods: ["sunflower", "blueberry", "apple"],
    wants: [
      "dish_star_cake",
      "dish_moon_tea",
      "dish_starfruit_juice",
      "sunflower",
    ],
    chapters: [1, 3, 6],
    stories: [
      "Bạn Cú mèo mở to đôi mắt tròn xoe trên đỉnh núi sao, đếm từng ngôi sao sáng.",
      "Đêm yên tĩnh, Cú mèo thích nhâm nhi trà hoa hướng dương và nghe gió hát.",
      "Cú mèo thuộc tên mọi chòm sao trên trời để kể cho con và Lucky nghe mỗi tối.",
    ],
    thanks: [
      "Hú hù! Cú mèo thích mê luôn, cảm ơn con nhé!",
      "Ngon quá! Đôi mắt Cú mèo sáng lấp lánh như sao!",
      "Cảm ơn con nhiều, đêm nay ngắm sao thật là vui!",
    ],
  },
];
export const palDiscovery = (id: string) => `pal_${id}`;
export const storyDiscovery = (id: string, n: number) => `story_${id}_${n}`;
export const giftCounter = (id: string) => `n.gift_${id}`;
export const fulfilledCounter = (id: string) => `n.wish_${id}`;
