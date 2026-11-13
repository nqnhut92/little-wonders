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
  "lilypad-reveal": {
    lines: [
      "Lá sen rung rinh… có bạn nhỏ nào đang bơi dưới lá kìa!",
      "Chiếc lá xanh tròn xoe như chiếc ô che nắng cho ao.",
    ],
    effect: "sway",
  },
  tadpole: {
    lines: [
      "Nòng nọc vẫy đuôi tí xíu chào con!",
      "Mai mốt lớn lên nòng nọc sẽ thành bạn ếch xanh đấy.",
    ],
    discovery: "tadpole",
    effect: "swim",
  },
  kingfisher: {
    lines: [
      "Bói cá xanh biếc đậu trên cành trúc ngắm mặt ao!",
      "Bộ lông xanh lấp lánh của bạn ấy đẹp quá!",
    ],
    discovery: "kingfisher",
    effect: "hop",
  },
  "pond-firefly": {
    lines: [
      "Đom đóm bay là là trên những đóa sen đêm!",
      "Ánh đèn xanh dịu dàng soi sáng mặt ao yên tĩnh.",
    ],
    discovery: "firefly_pond",
    effect: "glow",
  },
  "hollow-log": {
    lines: [
      "Trong khúc gỗ rỗng có đôi tai nhọn nhô ra kìa!",
      "Lớp rêu xanh phủ mềm trên thân gỗ mát rượi.",
    ],
    effect: "rustle",
  },
  fox: {
    lines: [
      "Bạn cáo nhỏ vẫy chiếc đuôi bông xù chào con!",
      "Cáo nhỏ thích chạy nhảy giữa thảm lá vàng trong rừng.",
    ],
    discovery: "fox_forest",
    effect: "hop",
  },
  "night-deer": {
    lines: [
      "Hươu sao dạo bước nhẹ nhàng dưới ánh trăng trong rừng!",
      "Những đốm sao trên lưng bạn ấy sáng lấp lánh.",
    ],
    discovery: "night_deer",
    effect: "hop",
  },
  "tidal-pool": {
    lines: [
      "Trong vũng nước trong veo có gì năm cánh kìa!",
      "Nước biển mát lạnh đọng lại giữa những viên đá cuội.",
    ],
    effect: "ripple",
  },
  starfish: {
    lines: [
      "Bạn sao biển màu cam nằm phơi mình thật êm!",
      "Sao biển có năm cánh xinh như ngôi sao dưới biển.",
    ],
    discovery: "starfish",
    effect: "sway",
  },
  dolphin: {
    lines: [
      "Cá heo nhảy vọt lên khỏi mặt biển xanh biếc!",
      "Tõm! Bọt nước tung trắng xóa vui mắt quá!",
    ],
    discovery: "dolphin",
    effect: "hop",
  },
  lighthouse: {
    lines: [
      "Ngọn hải đăng xoay đèn sáng dẫn đường cho thuyền về bờ!",
      "Ánh đèn vàng ấm áp vươn xa trên mặt biển đêm.",
    ],
    discovery: "lighthouse",
    effect: "glow",
  },
  "snow-drift": {
    lines: [
      "Đụn tuyết khẽ rung… có đôi mắt tròn đang ngó ra!",
      "Tuyết trắng mềm xốp như bông gòn vậy!",
    ],
    effect: "rustle",
  },
  "arctic-fox": {
    lines: [
      "Bạn cáo tuyết trắng muốt như cục bông vẫy đuôi chào con!",
      "Bộ lông dày giúp bạn ấy giữ ấm suốt mùa đông.",
    ],
    discovery: "arctic_fox",
    effect: "hop",
  },
  "hot-spring": {
    lines: [
      "Hơi ấm bốc lên nghi ngút từ suối nước nóng giữa trời tuyết!",
      "Ngâm chân gần suối ấm áp dễ chịu quá!",
    ],
    discovery: "hot_spring",
    effect: "ripple",
  },
  aurora: {
    lines: [
      "Dải cực quang xanh tím nhảy múa trên bầu trời đêm tuyết!",
      "Bầu trời đêm bỗng biến thành dải lụa bảy sắc.",
    ],
    discovery: "aurora",
    effect: "glow",
  },
  "star-cloud": {
    lines: [
      "Trên đám mây mềm có đôi tai dài đang vẫy kìa!",
      "Đám mây trôi bồng bềnh dưới ánh sao đêm.",
    ],
    effect: "sway",
  },
  "moon-rabbit": {
    lines: [
      "Thỏ ngọc mỉm cười vẫy tay chào con từ đám mây!",
      "Thỏ ngọc thích ngắm trăng tròn cùng bạn Cú mèo.",
    ],
    discovery: "moon_rabbit",
    effect: "hop",
  },
  "meteor-rock": {
    lines: [
      "Viên đá thiên thạch phát sáng lấp lánh đủ bảy sắc!",
      "Chạm nhẹ vào đá thấy ấm áp như giữ ánh sao.",
    ],
    discovery: "meteor_rock",
    effect: "glow",
  },
  comet: {
    lines: [
      "Sao chổi kéo đuôi ánh sáng dài bay ngang đỉnh núi!",
      "Vệt sáng bạc lấp lánh vắt ngang bầu trời sao.",
    ],
    discovery: "comet",
    effect: "flutter",
  },
};
export const discoveryRules = [
  { id: "rainbow", requires: ["rain", "sun"] },
  { id: "firefly", requires: ["night", "rain"] },
  { id: "butterfly_flock", requires: ["wind", "butterfly"] },
  { id: "moon_pond", requires: ["night", "fish"] },
];
