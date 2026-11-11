import { test, expect, type Page } from "@playwright/test";
async function activate(page: Page, label: string) {
  await page.getByRole("button", { name: label, exact: true }).click();
}
test("garden chain, notebook and saved house survive reload", async ({
  page,
}) => {
  await page.goto("/");
  await activate(page, "Luống đất 1");
  await activate(page, "Mây tưới nước");
  await activate(page, "Mặt trời");
  await activate(page, "Bướm");
  await activate(page, "Đá có bọ rùa");
  await activate(page, "Ao nước");
  await activate(page, "Sổ khám phá");
  await expect(
    page.getByText("Hoa hướng dương", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Bọ rùa dưới đá", { exact: true })).toBeVisible();
  await activate(page, "Trở về vườn");
  await activate(page, "Ngôi Nhà Sắc Màu");
  await activate(page, "Màu hồng");
  await page.locator(".house-canvas").click({ position: { x: 60, y: 200 } });
  await expect(
    page.getByRole("button", { name: "Di chuyển đồ trang trí" }),
  ).toHaveCount(1);
  await activate(page, "Trở về vườn");
  await page.reload();
  await activate(page, "Ngôi Nhà Sắc Màu");
  await expect(
    page.getByRole("button", { name: "Di chuyển đồ trang trí" }),
  ).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Màu hồng" })).toHaveClass(
    /selected/,
  );
});
test("rabbit gently rejects a wrong food and counts three carrots", async ({
  page,
}) => {
  await page.goto("/");
  await activate(page, "Bữa Trưa Của Thỏ");
  await activate(page, "Dâu");
  await activate(page, "Giỏ thức ăn");
  await expect(
    page.getByText("Thỏ muốn cà rốt màu cam. Con thử lại nhé!"),
  ).toBeVisible();
  await activate(page, "Cà rốt");
  for (let i = 0; i < 3; i++) await activate(page, "Giỏ thức ăn");
  await expect(
    page.getByText("Bữa ăn sắc màu! Con chọn ba món bất kỳ nhé!"),
  ).toBeVisible();
  await activate(page, "Trở về vườn");
  await activate(page, "Sổ khám phá");
  await expect(page.getByText("Bữa trưa đủ ba")).toBeVisible();
});
test("drag seed and cloud into soil with real pointer input", async ({
  page,
}) => {
  await page.goto("/");
  const soil = page.getByRole("button", { name: "Luống đất 2" });
  async function drag(label: string) {
    const source = await page
      .getByRole("button", { name: label })
      .boundingBox();
    const target = await soil.boundingBox();
    if (!source || !target) throw Error("missing target");
    await page.mouse.move(
      source.x + source.width / 2,
      source.y + source.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      target.x + target.width / 2,
      target.y + target.height / 2,
      { steps: 12 },
    );
    await page.mouse.up();
  }
  await drag("Hạt Cà rốt");
  await expect(soil.locator(".plant")).toHaveCount(1);
  await drag("Mây tưới nước");
  await expect(soil.locator(".water-dot")).toBeVisible();
});
test("cached garden survives offline navigation and stores new discoveries", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await activate(page, "Chim trên cành");
  await page.reload();
  await activate(page, "Sổ khám phá");
  await expect(page.getByText("Chim trên cành", { exact: true })).toBeVisible();
});

test("touch controls grow a plant without mouse or reading, with reduced motion", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 1194, height: 834 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173");
  for (const name of ["Luống đất 1", "Mây tưới nước", "Mặt trời"])
    await page.getByRole("button", { name, exact: true }).tap();
  await expect(
    page.getByRole("button", { name: "Luống đất 1" }).locator(".plant"),
  ).toHaveClass(/grown/);
  expect(
    await page
      .locator(".cloud>.art")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await context.close();
});

test("garden touch targets stay inside the scene at iPad and wide desktop sizes", async ({
  page,
}) => {
  for (const size of [
    { width: 1024, height: 768 },
    { width: 1366, height: 1024 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    const scene = await page.locator(".garden").boundingBox();
    if (!scene) throw Error("scene missing");
    for (const object of await page.locator(".garden>.object").all()) {
      const b = await object.boundingBox();
      if (!b) throw Error("object missing");
      expect(b.x).toBeGreaterThanOrEqual(scene.x - 1);
      expect(b.x + b.width).toBeLessThanOrEqual(scene.x + scene.width + 1);
      expect(b.y + b.height).toBeLessThanOrEqual(scene.y + scene.height + 1);
    }
  }
});
