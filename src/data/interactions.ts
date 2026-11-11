// Stable IDs connect renderer reactions, contextual dialogue, and discovery triggers.
export const interactions: Record<
  string,
  { lines: string[]; discovery?: string; effect: string }
> = {
  tree: {
    lines: [
      "Lá xào xạc… một quả táo rơi rồi!",
      "Con thấy quả táo đỏ không? Lá cây đang đung đưa đó!",
    ],
    discovery: "apple",
    effect: "shake-and-fall",
  },
  bird: {
    lines: [
      "Chíp chíp! Bạn chim chào con!",
      "Chim nhảy sang bên này. Con nghe tiếng hót không?",
    ],
    discovery: "bird",
    effect: "hop",
  },
  rock: {
    lines: ["Có chấm đỏ dưới đá kìa!", "Kìa, bọ rùa đang trốn dưới đá!"],
    discovery: "ladybug",
    effect: "tilt-and-reveal",
  },
  grass: {
    lines: [
      "Rích rích! Có bạn nhỏ trong cỏ.",
      "Bạn sâu uốn mình, còn bạn dế đang hát!",
    ],
    discovery: "grass",
    effect: "rustle",
  },
  pond: {
    lines: [
      "Tõm! Cá nhỏ bơi dưới làn nước.",
      "Gợn nước tròn lan ra. Cá đang quẫy đuôi đó!",
    ],
    discovery: "fish",
    effect: "ripple",
  },
  butterfly: {
    lines: [
      "Bướm thích những bông hoa con trồng!",
      "Đôi cánh rung rinh, bạn bướm bay thật nhẹ!",
    ],
    discovery: "butterfly",
    effect: "flutter",
  },
  flower: {
    lines: [
      "Hoa rung rinh gọi bướm đến chơi!",
      "Bông hoa đang đón nắng. Con nhìn đôi cánh kia nhé!",
    ],
    effect: "sway",
  },
  fish: {
    lines: ["Cá quẫy đuôi chào con!", "Bạn cá bơi một vòng rồi nghỉ dưới lá."],
    effect: "swim",
  },
  worm: {
    lines: [
      "Bạn sâu uốn mình thật chậm.",
      "Bạn sâu thích nghỉ dưới bóng lá mát.",
    ],
    effect: "crawl",
  },
  bug: {
    lines: [
      "Chấm tròn trên áo bạn bọ rùa!",
      "Bọ rùa giấu đôi cánh dưới chiếc áo đỏ.",
    ],
    effect: "hop",
  },
  windmill: {
    lines: [
      "Vù vù! Chong chóng quay theo làn gió mát!",
      "Gió thổi qua làm hoa lá rung rinh thật thích!",
    ],
    discovery: "windmill",
    effect: "spin",
  },
  xylophone: {
    lines: [
      "Tình tang! Tiếng đàn gỗ vang khắp vườn!",
      "Con gõ hoặc vuốt qua các thanh gỗ để tạo giai điệu nhé!",
    ],
    discovery: "xylophone",
    effect: "hop",
  },
  frog: {
    lines: [
      "Ộp ộp! Bạn ếch nhảy qua bãi cỏ xanh!",
      "Ếch nhỏ chào con rồi trốn sang chỗ mới kìa!",
    ],
    discovery: "frog",
    effect: "hop",
  },
  snail: {
    lines: [
      "Ốc sên mang ngôi nhà nhỏ trên lưng thật chậm rãi.",
      "Chào bạn ốc sên đáng yêu nhé!",
    ],
    discovery: "snail",
    effect: "crawl",
  },
  owl: {
    lines: [
      "Hú hù! Bạn cú thức dậy ngắm sao cùng con!",
      "Đêm yên tĩnh quá, bạn cú chớp đôi mắt tròn.",
    ],
    discovery: "owl",
    effect: "hop",
  },
  duck: {
    lines: [
      "Cạp cạp! Vịt con bơi vòng quanh lá sen!",
      "Vịt nhỏ vẫy cánh làm nước gợn sóng.",
    ],
    discovery: "duck",
    effect: "swim",
  },
  dragonfly: {
    lines: [
      "Chuồn chuồn đậu nhẹ trên nụ sen hồng!",
      "Đôi cánh mỏng lấp lánh dưới nắng.",
    ],
    discovery: "dragonfly",
    effect: "flutter",
  },
  "pond-lantern": {
    lines: [
      "Đèn hoa đăng lung linh trôi trên mặt nước!",
      "Ánh sáng ấm áp soi cả ao sen.",
    ],
    discovery: "pond_lantern",
    effect: "glow",
  },
};
export const discoveryRules = [
  { id: "rainbow", requires: ["rain", "sun"] },
  { id: "firefly", requires: ["night", "rain"] },
  { id: "butterfly_flock", requires: ["wind", "butterfly"] },
  { id: "moon_pond", requires: ["night", "fish"] },
];
