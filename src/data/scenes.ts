// Region scenes are data: adding a region means adding a scene entry here and its art, not rewriting the renderer.
export type SceneHotspot = {
  id: string;
  art: string;
  x: number;
  y: number;
  w: number;
  label: string;
  kind:
    | "tree"
    | "house"
    | "pal"
    | "reveal"
    | "revealed"
    | "flower"
    | "windmill"
    | "xylophone"
    | "interact";
  palId?: string;
  revealTarget?: string;
  revealedWhen?: string;
  requires?: string;
  line?: string;
  discovery?: string;
  nightOnly?: boolean;
  dayOnly?: boolean;
  shadow?: boolean;
};
export type RegionScene = {
  id: string;
  title: string;
  variant: "garden" | "pond";
  hasHouse: boolean;
  hasCritters: boolean;
  signs: { text: string; className: string }[];
  hotspots: SceneHotspot[];
};
export const scenes: Record<string, RegionScene> = {
  garden: {
    id: "garden",
    title: "Khu Vườn Kỳ Diệu",
    variant: "garden",
    hasHouse: true,
    hasCritters: true,
    signs: [
      { text: "Ao thì thầm", className: "sign-pond" },
      { text: "Nhà của mình", className: "sign-house" },
    ],
    hotspots: [
      {
        id: "tree",
        art: "tree",
        x: 3,
        y: 22,
        w: 25,
        label: "Cây táo",
        kind: "tree",
        line: "Lá xào xạc… một quả táo rơi vào giỏ rồi!",
        discovery: "apple",
      },
      {
        id: "bird",
        art: "bird",
        x: 17,
        y: 29,
        w: 6,
        label: "Chim trên cành",
        kind: "interact",
        line: "Chíp chíp! Bạn chim chào con!",
        discovery: "bird",
        dayOnly: true,
      },
      {
        id: "owl",
        art: "owl",
        x: 17,
        y: 29,
        w: 6,
        label: "Cú mèo trên cành",
        kind: "interact",
        line: "Hú hù! Bạn cú thức dậy ngắm sao cùng con!",
        discovery: "owl",
        nightOnly: true,
      },
      {
        id: "windmill",
        art: "windmill",
        x: 28,
        y: 44,
        w: 8,
        label: "Chong chóng",
        kind: "windmill",
        line: "Vù vù! Chong chóng quay theo làn gió mát!",
        discovery: "windmill",
      },
      {
        id: "house",
        art: "house",
        x: 66,
        y: 37,
        w: 22,
        label: "Ngôi Nhà Sắc Màu",
        kind: "house",
        shadow: true,
      },
      {
        id: "pond",
        art: "pond",
        x: 3,
        y: 50,
        w: 26,
        label: "Ao nước",
        kind: "reveal",
        revealTarget: "fish",
        line: "Tõm! Cá nhỏ bơi dưới làn nước.",
        discovery: "fish",
      },
      {
        id: "fish",
        art: "fish",
        x: 12,
        y: 75,
        w: 7,
        label: "Cá nhỏ",
        kind: "revealed",
        revealedWhen: "fish",
        line: "Cá quẫy đuôi chào con!",
        discovery: "fish",
      },
      {
        id: "rock",
        art: "rock",
        x: 33,
        y: 62,
        w: 9,
        label: "Đá có bọ rùa",
        kind: "reveal",
        revealTarget: "bug",
        line: "Kìa, bọ rùa đang trốn dưới đá!",
        discovery: "ladybug",
      },
      {
        id: "bug",
        art: "bug",
        x: 38,
        y: 69,
        w: 5,
        label: "Bọ rùa",
        kind: "revealed",
        revealedWhen: "bug",
        line: "Chấm tròn trên áo bạn bọ rùa!",
      },
      {
        id: "grass",
        art: "grass",
        x: 27,
        y: 74,
        w: 10,
        label: "Bụi cỏ có tiếng dế",
        kind: "reveal",
        revealTarget: "worm",
        line: "Rích rích! Dế và sâu đang ở trong cỏ.",
        discovery: "grass",
      },
      {
        id: "worm",
        art: "worm",
        x: 32,
        y: 82,
        w: 6,
        label: "Sâu nhỏ",
        kind: "revealed",
        revealedWhen: "worm",
        line: "Bạn sâu uốn mình thật chậm.",
      },
      {
        id: "rabbit",
        art: "rabbit",
        x: 76,
        y: 66,
        w: 10,
        label: "Bữa Trưa Của Thỏ",
        kind: "pal",
        palId: "rabbit",
      },
      {
        id: "puppy",
        art: "puppy",
        x: 68,
        y: 73,
        w: 9,
        label: "Bạn cún Lucky",
        kind: "pal",
        palId: "puppy",
        requires: "pal_puppy",
      },
      {
        id: "flower",
        art: "flower",
        x: 90,
        y: 72,
        w: 7,
        label: "Hoa bên nhà",
        kind: "flower",
        revealTarget: "butterfly",
        line: "Hoa rung rinh gọi bướm đến chơi!",
      },
      {
        id: "butterfly",
        art: "butterfly",
        x: 82,
        y: 32,
        w: 7,
        label: "Bướm",
        kind: "revealed",
        revealedWhen: "butterfly",
        requires: "butterfly",
        line: "Bướm thích những bông hoa con trồng!",
        discovery: "butterfly",
        dayOnly: true,
      },
      {
        id: "xylophone",
        art: "xylophone",
        x: 79,
        y: 82,
        w: 9,
        label: "Đàn gỗ",
        kind: "xylophone",
        line: "Tình tang! Con gõ đàn gỗ nhé!",
        discovery: "xylophone",
      },
    ],
  },
  pond: {
    id: "pond",
    title: "Ao Sen Thì Thầm",
    variant: "pond",
    hasHouse: false,
    hasCritters: false,
    signs: [{ text: "Bờ ao sen", className: "sign-pond" }],
    hotspots: [
      {
        id: "pond",
        art: "pond",
        x: 10,
        y: 48,
        w: 30,
        label: "Mặt ao sen",
        kind: "reveal",
        revealTarget: "fish",
        line: "Tõm! Cá bơi dưới tán sen hồng.",
        discovery: "fish",
      },
      {
        id: "fish",
        art: "fish",
        x: 18,
        y: 74,
        w: 7,
        label: "Cá trong ao sen",
        kind: "revealed",
        revealedWhen: "fish",
        line: "Cá quẫy đuôi chào con!",
      },
      {
        id: "duck",
        art: "duck",
        x: 72,
        y: 62,
        w: 11,
        label: "Vịt con",
        kind: "interact",
        line: "Cạp cạp! Vịt con bơi vòng quanh lá sen!",
        discovery: "duck",
      },
      {
        id: "dragonfly",
        art: "dragonfly",
        x: 82,
        y: 35,
        w: 7,
        label: "Chuồn chuồn",
        kind: "interact",
        line: "Chuồn chuồn đậu nhẹ trên nụ sen hồng!",
        discovery: "dragonfly",
      },
      {
        id: "pond-lantern",
        art: "pond-lantern",
        x: 24,
        y: 35,
        w: 9,
        label: "Đèn hoa đăng",
        kind: "interact",
        line: "Đèn hoa đăng lung linh trên mặt ao!",
        discovery: "pond_lantern",
      },
      {
        id: "frog",
        art: "frog",
        x: 34,
        y: 76,
        w: 7,
        label: "Ếch xanh",
        kind: "interact",
        line: "Ộp ộp! Bạn ếch ngồi trên lá sen xanh!",
        discovery: "frog",
      },
      {
        id: "xylophone",
        art: "xylophone",
        x: 78,
        y: 80,
        w: 9,
        label: "Đàn gỗ bên ao",
        kind: "xylophone",
        line: "Tình tang! Tiếng đàn vang trên mặt ao!",
        discovery: "xylophone",
      },
    ],
  },
};
