// Capture real UI interactions; no progress fixtures or direct storage injection.
import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
// CAPTURE_THEME=light|dark, CAPTURE_VIEWPORT=1180x820 and CAPTURE_DIR select a variant for before/after sheets.
const theme = process.env.CAPTURE_THEME === "dark" ? "dark" : "light";
const [width, height] = (process.env.CAPTURE_VIEWPORT || "1194x834")
  .split("x")
  .map(Number);
const dir = process.env.CAPTURE_DIR || "artifacts/screenshots";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
});
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  hasTouch: true,
  colorScheme: theme,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.CAPTURE_URL || "http://127.0.0.1:4173");
const shots = [];
const tap = async (name) => {
  await page.getByRole("button", { name, exact: true }).tap();
};
await tap("Vườn nhà");
const shot = async (name, title, delay = 250) => {
  await page.waitForTimeout(delay);
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
  shots.push({ name, title });
};
await shot("01-khu-vuon", "Khu vườn khi vừa mở");
await tap("Ao nước");
await shot("02-ban-ca", "Cá nhỏ hiện trong ao");
await tap("Đá có bọ rùa");
await shot("03-bo-rua", "Bọ rùa dưới đá");
await tap("Bụi cỏ có tiếng dế");
await shot("04-ban-sau", "Bạn sâu trong cỏ");
await tap("Cây táo");
await shot("05-tao-roi", "Lá rung và táo rơi", 120);
await tap("Chim trên cành");
await tap("Luống đất 1");
await tap("Hạt Cà rốt");
await tap("Luống đất 2");
await tap("Hạt Dâu");
await tap("Luống đất 3");
await tap("Mây tưới nước");
await shot("06-tuoi-mam", "Mưa tưới ba luống cây", 100);
await tap("Mặt trời");
await page.waitForTimeout(1000);
await tap("Bướm");
await shot("07-vuon-lon", "Ba cây lớn và cầu vồng");
await tap("Góc Của Lucky");
await shot("08-bua-trua", "Góc nhỏ của Lucky");
await tap("Dâu");
await tap("Giỏ thức ăn");
await shot("09-thu-lai", "Lucky gợi ý nhẹ nhàng khi chọn dâu");
await tap("Dưa hấu");
await tap("Giỏ thức ăn");
await shot("10-dem-hai", "Lucky nhận dưa hấu và mở chuyện");
await tap("Giỏ thức ăn");
await shot("11-bua-sac-mau", "Bữa tiếp theo với ba món tự chọn");
for (const food of ["Táo", "Dâu", "Cà rốt"]) {
  await tap(food);
  await tap("Giỏ thức ăn");
}
await tap("Trở về vườn");
await tap("Ngôi Nhà Sắc Màu");
await tap("Màu xanh trời");
for (const [kind, x, y] of [
  ["hoa", 70, 195],
  ["hoa", 440, 210],
  ["bướm", 100, 40],
  ["ngôi sao", 410, 45],
]) {
  await tap("Trang trí " + kind);
  await page.locator(".house-canvas").tap({ position: { x, y } });
}
await shot("12-ngoi-nha", "Ngôi nhà xanh và đồ trang trí đã lưu");
await tap("Trở về vườn");
await tap("Sổ khám phá");
await shot("13-so-tay", "Sổ tay gồm 18 khám phá từ các thao tác thật");
await page.locator(".modal-body").evaluate((el) => {
  el.scrollTop = el.scrollHeight;
});
await shot("13b-so-tay-cuoi", "Cầu vồng và dế ở trang cuối sổ tay");
await tap("Trở về vườn");
await page.reload();
await shot("14-phuc-hoi", "Khu vườn được khôi phục sau tải lại");
await tap("Ngôi Nhà Sắc Màu");
await shot("15-nha-phuc-hoi", "Thiết kế vẫn còn sau tải lại");
await tap("Trở về vườn");
await tap("Nghỉ một chút");
await shot("16-nghi-ngoi", "Kết thúc phiên chơi nhẹ nhàng");
await tap("Trở về vườn");
await tap("Dành cho người lớn");
await shot("17-cong-nguoi-lon", "Cổng dành cho người lớn");
await tap("Trở về vườn");
await page.setViewportSize({ width: 1440, height: 1000 });
await shot("18-desktop", "Khu vườn trên desktop");
await writeFile(
  `${dir}/index.html`,
  `<!doctype html><html lang="vi"><meta charset="utf-8"><title>Ảnh chơi thật — Little Wonders</title><style>body{font:16px Arial;background:#faf8ee;color:#425b45;max-width:1400px;margin:30px auto;padding:20px}h1{font:36px Arial}section{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}figure{margin:0}img{width:100%;border-radius:15px;border:1px solid #d5dfc1}figcaption{margin:10px 0 20px}a{color:inherit}</style><h1>Little Wonders · Chơi trong khu vườn</h1><p>${shots.length} ảnh chụp từ thao tác trên ứng dụng thật. Không dùng mockup hoặc dữ liệu cấy sẵn.</p><section>${shots.map((s) => `<figure><a href="${s.name}.png"><img src="${s.name}.png" alt="${s.title}"></a><figcaption>${s.title}</figcaption></figure>`).join("")}</section></html>`,
);
const overview = await browser.newPage({
  viewport: { width: 1600, height: 900 },
});
const thumbs = await Promise.all(
  shots
    .filter((_, i) => [0, 1, 3, 5, 6, 7, 9, 11, 12].includes(i))
    .map(async (s) => ({
      title: s.title,
      url:
        "data:image/png;base64," +
        (await readFile(`${dir}/${s.name}.png`)).toString("base64"),
    })),
);
await overview.setContent(
  `<html><style>*{box-sizing:border-box}body{margin:0;padding:35px;background:#faf8ee;color:#425b45;font:22px Arial}h1{font:48px Arial;margin:0 0 10px}p{margin:0 0 30px;font-size:20px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}figure{margin:0;background:#eeefdf;padding:10px;border-radius:18px}img{width:100%;display:block;border-radius:12px}figcaption{font-size:17px;padding:14px 0 6px}</style><h1>Little Wonders · Khu Vườn Kỳ Diệu</h1><p>Hình ảnh từ phiên chơi thật — khu vườn, sinh vật, gieo hạt, bữa trưa, ngôi nhà và sổ tay.</p><main>${thumbs.map((s) => `<figure><img src="${s.url}"><figcaption>${s.title}</figcaption></figure>`).join("")}</main></html>`,
);
await overview.locator("img").last().waitFor();
await overview.screenshot({ path: `${dir}/00-tong-quan.png`, fullPage: true });
console.log(
  JSON.stringify(
    {
      screenshots: shots.length,
      errors,
      discoveries: await page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("little-wonders-v1")).world
            .discoveries.length,
      ),
    },
    null,
    2,
  ),
);
await browser.close();
