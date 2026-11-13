import { test, expect, type Page } from "@playwright/test";
async function activate(page: Page, label: string) {
  await page.getByRole("button", { name: label, exact: true }).click();
}
async function openGarden(page: Page) {
  await page.goto("/");
  await activate(page, "Vườn nhà");
}
test("garden chain, notebook and saved house survive reload", async ({
  page,
}) => {
  await openGarden(page);
  await activate(page, "Luống đất 1");
  await activate(page, "Mây tưới nước");
  await activate(page, "Mặt trời");
  await activate(page, "Bướm");
  await activate(page, "Đá có bọ rùa");
  await activate(page, "Ao nước");
  await activate(page, "Sổ khám phá");
  await expect(
    page
      .locator(".notebook")
      .getByRole("button", { name: "Hoa hướng dương", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator(".notebook")
      .getByRole("button", { name: "Bọ rùa dưới đá", exact: true }),
  ).toBeVisible();
  await activate(page, "Trở về vườn");
  await activate(page, "Ngôi Nhà Sắc Màu");
  await expect(
    page.getByRole("button", { name: "Trang trí hoa hướng dương chưa mở" }),
  ).toBeDisabled();
  await activate(page, "Màu hồng");
  await page.locator(".house-canvas").click({ position: { x: 60, y: 200 } });
  await expect(
    page.getByRole("button", { name: "Di chuyển đồ trang trí" }),
  ).toHaveCount(1);
  await activate(page, "Trở về vườn");
  await page.reload();
  await activate(page, "Vườn nhà");
  await activate(page, "Ngôi Nhà Sắc Màu");
  await expect(
    page.getByRole("button", { name: "Di chuyển đồ trang trí" }),
  ).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Màu hồng" })).toHaveClass(
    /selected/,
  );
});
test("Lucky accepts any gift, advances wish on watermelon and unlocks story chapters", async ({
  page,
}) => {
  await openGarden(page);
  await activate(page, "Góc Của Lucky");
  await activate(page, "Cà rốt");
  await activate(page, "Giỏ thức ăn");
  await expect(
    page.getByRole("status").filter({ hasText: "Lucky vẫn chờ dưa hấu nhé!" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Đọc chuyện 1 của Lucky" }),
  ).toBeEnabled();
  await activate(page, "Dưa hấu");
  await activate(page, "Giỏ thức ăn");
  await expect(page.getByText("Lucky đang thích táo")).toBeVisible();
  await activate(page, "Trở về vườn");
  await activate(page, "Sổ khám phá");
  await expect(
    page
      .locator(".notebook")
      .getByRole("button", { name: "Bữa trưa đủ ba", exact: true }),
  ).toBeVisible();
});
test("drag seed and cloud into soil with real pointer input", async ({
  page,
}) => {
  await openGarden(page);
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
  await openGarden(page);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await activate(page, "Vườn nhà");
  await activate(page, "Chim trên cành");
  await page.reload();
  await activate(page, "Sổ khám phá");
  await expect(
    page
      .locator(".notebook")
      .getByRole("button", { name: "Chim trên cành", exact: true }),
  ).toBeVisible();
});

test("touch controls grow a plant without mouse or reading, with reduced motion", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 1194, height: 834 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await page.getByRole("button", { name: "Vườn nhà", exact: true }).tap();
  await page.getByRole("button", { name: "Luống đất 1", exact: true }).tap();
  for (let round = 0; round < 3; round++)
    for (const name of ["Mây tưới nước", "Mặt trời"])
      await page.getByRole("button", { name, exact: true }).tap();
  await expect(
    page.getByRole("button", { name: "Luống đất 1" }).locator(".plant"),
  ).toHaveClass(/ripe/);
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
    await openGarden(page);
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

test("dragging rain waters only the target bed", async ({ page }) => {
  await openGarden(page);
  for (const n of [1, 2])
    await page.getByRole("button", { name: `Luống đất ${n}` }).click();
  const a = await page
    .getByRole("button", { name: "Mây tưới nước" })
    .boundingBox();
  const b = await page
    .getByRole("button", { name: "Luống đất 1" })
    .boundingBox();
  if (!a || !b) throw Error("missing targets");
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(
    page.getByRole("button", { name: "Luống đất 1" }).locator(".water-dot"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Luống đất 2" }).locator(".water-dot"),
  ).toHaveCount(0);
});
test.describe("mocked account requests", () => {
  // WebKit may send fetches through the controlling worker, bypassing page.route.
  // Only mocked API tests block workers; the offline tests keep real workers enabled.
  test.use({ serviceWorkers: "block" });
  test("expired session exposes sign-in again behind the parent gate", async ({
    page,
  }) => {
    let expired = false;
    await page.route("**/api/profiles", (route) =>
      route.fulfill({
        status: expired ? 401 : 200,
        contentType: "application/json",
        body: expired ? "{}" : JSON.stringify({ profiles: [] }),
      }),
    );
    await page.goto("/");
    await page.getByRole("button", { name: "Dành cho người lớn" }).click();
    await page.getByRole("button", { name: "12", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Tạo khu vườn cho bé" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Trở về vườn" }).click();
    expired = true;
    await page.getByRole("button", { name: "Dành cho người lớn" }).click();
    await page.getByRole("button", { name: "12", exact: true }).click();
    await expect(
      page.getByRole("link", { name: "Tiếp tục với Google" }),
    ).toBeVisible();
  });

  test("late profile response cannot undo the latest selection", async ({
    page,
  }) => {
    let finishFirst!: () => Promise<void>;
    let firstStarted!: () => void;
    const firstRequest = new Promise<void>((resolve) => {
      firstStarted = resolve;
    });
    await page.route("**/api/profiles", (r) =>
      r.fulfill({
        json: {
          profiles: [
            { id: "first", nickname: "Mây" },
            { id: "second", nickname: "Nắng" },
          ],
        },
      }),
    );
    await page.route("**/api/progress?profile=*", async (r) => {
      const respond = () =>
        r.fulfill({
          json: { world: { schema: 1, discoveries: [], fields: {} } },
        });
      if (r.request().url().endsWith("first")) {
        finishFirst = respond;
        firstStarted();
      } else await respond();
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Dành cho người lớn" }).click();
    await page.getByRole("button", { name: "12", exact: true }).click();
    await page.getByRole("button", { name: "Mây", exact: true }).click();
    await firstRequest;
    await page.getByRole("button", { name: "Nắng", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await finishFirst();
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem("little-wonders-v1")!).profile,
        ),
      )
      .toBe("second");
  });
});

test("unfinished pal wish survives reopening and reload", async ({ page }) => {
  await openGarden(page);
  await activate(page, "Góc Của Lucky");
  await activate(page, "Cà rốt");
  await activate(page, "Giỏ thức ăn");
  await expect(
    page.getByRole("button", { name: "Đọc chuyện 1 của Lucky" }),
  ).toBeEnabled();
  await page.reload();
  await activate(page, "Vườn nhà");
  await activate(page, "Góc Của Lucky");
  await expect(
    page.getByRole("button", { name: "Đọc chuyện 1 của Lucky" }),
  ).toBeEnabled();
  await expect(page.locator(".meal-request .art-watermelon")).toHaveCount(1);
});
test("tabs merge discoveries and keep independent writer identities", async ({
  page,
  context,
}) => {
  await openGarden(page);
  const other = await context.newPage();
  await openGarden(other);
  await page.getByRole("button", { name: "Cây táo" }).click();
  await other.getByRole("button", { name: "Ao nước" }).click();
  for (const p of [page, other]) {
    await p.getByRole("button", { name: "Sổ khám phá" }).click();
    await expect(
      p
        .locator(".notebook")
        .getByRole("button", { name: "Táo rơi", exact: true }),
    ).toBeVisible();
    await expect(
      p
        .locator(".notebook")
        .getByRole("button", { name: "Cá trong ao", exact: true }),
    ).toBeVisible();
  }
  for (const p of [page, other])
    await p.getByRole("button", { name: "Trở về vườn" }).click();
  await page.getByRole("button", { name: "Luống đất 1" }).click();
  await other.getByRole("button", { name: "Luống đất 2" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const fields = JSON.parse(localStorage.getItem("little-wonders-v1")!)
          .world.fields;
        return Boolean(
          fields["plot.garden.0"] &&
          fields["plot.garden.1"] &&
          fields["plot.garden.0"].device !== fields["plot.garden.1"].device,
        );
      }),
    )
    .toBe(true);
});
test("saved decorations appear outside the house", async ({ page }) => {
  await openGarden(page);
  await page.getByRole("button", { name: "Ngôi Nhà Sắc Màu" }).click();
  await page.locator(".house-canvas").click({ position: { x: 40, y: 150 } });
  await page.getByRole("button", { name: "Trở về vườn" }).click();
  await expect(page.locator(".garden-decorations .art-flower")).toHaveCount(1);
  await page.reload();
  await activate(page, "Vườn nhà");
  await expect(page.locator(".garden-decorations .art-flower")).toHaveCount(1);
});

test("an adult clears one region from the adult corner and the notebook stays", async ({
  page,
}) => {
  await openGarden(page);
  await activate(page, "Luống đất 1");
  await activate(page, "Mây tưới nước");
  await activate(page, "Mặt trời");
  // The kid-facing screen no longer has a reset broom.
  await expect(page.getByRole("button", { name: /^Vườn mới/ })).toHaveCount(0);
  await activate(page, "Quay lại bản đồ");
  await activate(page, "Dành cho người lớn");
  await activate(page, "12");
  await page.getByRole("tab", { name: "Dọn khu vườn" }).click();
  // Only opened regions can be cleared.
  await expect(page.getByRole("button", { name: /^Dọn lại / })).toHaveCount(1);
  await activate(page, "Dọn lại Vườn nhà");
  await activate(page, "Giữ nguyên");
  await activate(page, "Dọn lại Vườn nhà");
  await activate(page, "Dọn lại");
  await expect(page.getByText("Đã dọn xong Vườn nhà")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Dọn lại Vườn nhà" }),
  ).toBeDisabled();
  await activate(page, "Trở về vườn");
  await activate(page, "Vườn nhà");
  await expect(
    page.getByRole("button", { name: "Luống đất 1" }).locator(".plant"),
  ).toHaveCount(0);
  await activate(page, "Sổ khám phá");
  await expect(
    page
      .locator(".notebook")
      .getByRole("button", { name: "Hoa hướng dương", exact: true }),
  ).toBeVisible();
});
test("starting over from the adult corner needs a second confirmation", async ({
  page,
}) => {
  await openGarden(page);
  await activate(page, "Luống đất 1");
  await activate(page, "Quay lại bản đồ");
  await activate(page, "Dành cho người lớn");
  await activate(page, "12");
  await page.getByRole("tab", { name: "Dọn khu vườn" }).click();
  await activate(page, "Bắt đầu lại tất cả");
  await activate(page, "Giữ nguyên");
  await activate(page, "Bắt đầu lại tất cả");
  await activate(page, "Xóa hết, bắt đầu lại");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await activate(page, "Vườn nhà");
  await expect(
    page.getByRole("button", { name: "Luống đất 1" }).locator(".plant"),
  ).toHaveCount(0);
});
test("shaking the tree fills the basket and a ripe plant can be harvested", async ({
  page,
}) => {
  await openGarden(page);
  await activate(page, "Cây táo");
  await expect(page.getByLabel("Giỏ của con")).toBeVisible();
  await activate(page, "Luống đất 1");
  for (let round = 0; round < 3; round++) {
    await activate(page, "Mây tưới nước");
    await activate(page, "Mặt trời");
  }
  await activate(page, "Luống đất 1");
  await expect(
    page.getByRole("button", { name: "Luống đất 1" }).locator(".plant"),
  ).toHaveCount(0);
  await expect(page.getByLabel("Giỏ của con")).toContainText("1");
  await expect(page.getByRole("button", { name: "Luống đất 4" })).toBeVisible();
});

test("map is the home screen, shows locked regions in order and keeps them closed", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hud-guide p")).toContainText(
    "Chào con đến Thung lũng nhỏ!",
  );
  await expect(page.getByRole("button", { name: "Nghỉ một chút" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: "Quay lại bản đồ" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Vườn nhà", exact: true }),
  ).toBeVisible();
  const locked = page.getByRole("button", { name: "Ao sen, sắp có" });
  await expect(locked).toBeVisible();
  await locked.click();
  await expect(page.locator(".valley-map")).toBeVisible();
  // Later regions stay covered as coming soon until opened for players (or in Dev mode).
  for (const name of ["Rừng nhỏ", "Bãi biển", "Đồi tuyết", "Núi sao"])
    await expect(
      page.getByRole("button", { name: `${name}, sắp có` }),
    ).toBeVisible();
  await page.getByRole("button", { name: "Rừng nhỏ, sắp có" }).click();
  await expect(page.locator(".valley-map")).toBeVisible();
  await activate(page, "Vườn nhà");
  await expect(page.locator(".garden")).toBeVisible();
  await activate(page, "Quay lại bản đồ");
  await expect(page.locator(".valley-map")).toBeVisible();
});

test("kitchen cooks apples into a surprise dish and records it", async ({
  page,
}) => {
  await openGarden(page);
  await activate(page, "Cây táo");
  await activate(page, "Bếp của vườn");
  await activate(page, "Thêm Táo vào nồi");
  await activate(page, "Nấu");
  await expect(page.locator(".meal-feedback")).toContainText("Món bất ngờ");
  await activate(page, "Trở về vườn");
  await activate(page, "Sổ khám phá");
  await expect(
    page
      .locator(".notebook")
      .getByRole("button", { name: "Món bất ngờ", exact: true }),
  ).toBeVisible();
});

test("first harvest brings the little reindeer and lets the child gift watermelon", async ({
  page,
}) => {
  await openGarden(page);
  await expect(
    page.getByRole("button", { name: "Bạn Tuần Lộc nhỏ" }),
  ).toHaveCount(0);
  await activate(page, "Hạt Dưa hấu");
  await activate(page, "Luống đất 1");
  for (let round = 0; round < 3; round++) {
    await activate(page, "Mây tưới nước");
    await activate(page, "Mặt trời");
  }
  await activate(page, "Luống đất 1");
  await expect(
    page.getByRole("button", { name: "Bạn Tuần Lộc nhỏ" }),
  ).toBeVisible();
  await activate(page, "Bạn Tuần Lộc nhỏ");
  await expect(page.locator(".meal-request .art-watermelon")).toBeVisible();
  await activate(page, "Dưa hấu");
  await activate(page, "Giỏ thức ăn");
  await activate(page, "Đọc chuyện 1 của Tuần Lộc nhỏ");
  await expect(page.locator(".pal-story-text")).toContainText("Tuần Lộc nhỏ");
});

test("day/night toggle, xylophone, audio persistence and Ao sen region work end-to-end", async ({
  page,
}) => {
  await openGarden(page);
  // Audio defaults to off and persists locally per browser.
  const speaker = page.getByRole("button", { name: "Bật âm thanh" });
  await expect(speaker).toHaveAttribute("aria-pressed", "false");
  await speaker.click();
  await expect(
    page.getByRole("button", { name: "Tắt âm thanh" }),
  ).toHaveAttribute("aria-pressed", "true");
  // Background music follows the sound switch; both tracks ship with the app.
  for (const file of ["music-valley.m4a", "music-play.mp3"])
    expect((await page.request.get(`/assets/${file}`)).ok()).toBe(true);
  // Day/Night toggle syncs into world state and renders moon & owl.
  await activate(page, "Chuyển sang ban đêm");
  await expect(page.locator(".garden")).toHaveAttribute("data-time", "night");
  await expect(page.getByRole("button", { name: "Mặt trăng" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cú mèo trên cành" }),
  ).toBeVisible();
  // Xylophone opens and records discovery on bar activation.
  await activate(page, "Đàn gỗ");
  await activate(page, "Thanh đàn Đồ");
  await activate(page, "Thanh đàn Mí");
  await activate(page, "Trở về vườn");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Tắt âm thanh" }),
  ).toHaveAttribute("aria-pressed", "true");
  await activate(page, "Vườn nhà");
  await expect(page.locator(".garden")).toHaveAttribute("data-time", "night");
  // Seed region_pond_open in localStorage to verify entering Ao sen (data-driven P5).
  await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem("little-wonders-v1")!);
    raw.world.discoveries.push("region_pond_open");
    localStorage.setItem("little-wonders-v1", JSON.stringify(raw));
  });
  await page.reload();
  await activate(page, "Ao sen");
  await expect(page.getByRole("button", { name: "Mặt ao sen" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hạt Hoa sen" })).toBeVisible();
});

test("fog clears on the map when a region opens, including under reduced motion", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1194, height: 834 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await page.evaluate(() => {
    // 49 counted discoveries (< 85% of 58), excluding "bird", so tapping bird opens Ao sen.
    const seed = [
      "rain",
      "sun",
      "sunflower",
      "carrot",
      "berry",
      "story_puppy_2",
      "story_puppy_3",
      "story_reindeer_1",
      "story_reindeer_2",
      "night",
      "moon",
      "stars",
      "firefly",
      "owl",
      "xylophone",
      "butterfly",
      "worm",
      "ladybug",
      "puppy",
      "fish",
      "apple",
      "lunch",
      "colors",
      "house",
      "decor",
      "rainbow",
      "grass",
      "harvest_sunflower",
      "harvest_carrot",
      "harvest_berry",
      "harvest_tomato",
      "harvest_pumpkin",
      "harvest_corn",
      "harvest_watermelon",
      "dish_soup",
      "dish_jam",
      "dish_salad",
      "dish_pie",
      "dish_juice",
      "dish_corncake",
      "dish_applesauce",
      "dish_pumpkinsoup",
      "dish_cornsoup",
      "dish_fruitbowl",
      "dish_tea",
      "dish_smoothie",
      "dish_mystery",
      "house_decorated",
      "pal_reindeer",
      "story_puppy_1",
    ];
    localStorage.setItem(
      "little-wonders-v1",
      JSON.stringify({
        world: { schema: 2, epoch: 0, discoveries: seed, fields: {} },
        pending: false,
        nickname: "Bạn nhỏ",
        device: "test",
      }),
    );
  });
  await page.reload();
  await activate(page, "Vườn nhà");
  await activate(page, "Chim trên cành");
  await activate(page, "Quay lại bản đồ");
  const pondSoon = page.getByRole("button", { name: "Ao sen, sắp có" });
  await expect(pondSoon).toHaveAttribute("data-state", "soon");
  await activate(page, "Dành cho người lớn");
  await activate(page, "12");
  await page.getByRole("tab", { name: "Dọn khu vườn" }).click();
  await activate(page, "Bật Dev mode");
  await activate(page, "Trở về vườn");
  const pond = page.getByRole("button", { name: "Ao sen", exact: true });
  await expect(pond).toHaveAttribute("data-state", "open");
  await pond.click();
  await expect(page.getByRole("button", { name: "Mặt ao sen" })).toBeVisible();
  await activate(page, "Bạn Capybara");
  await expect(
    page.getByRole("heading", { name: "Lời mời của Capybara" }),
  ).toBeVisible();
  await activate(page, "Giỏ thức ăn");
  await expect(
    page.getByRole("button", { name: "Đọc chuyện 1 của Capybara" }),
  ).toBeEnabled();
  await activate(page, "Trở về vườn");
  await activate(page, "Quay lại bản đồ");
  await activate(page, "Vườn nhà");
  await expect(
    page.getByRole("button", { name: "Bạn Capybara" }),
  ).toBeVisible();
  await context.close();
});

test("later regions: beach gathering, building a sandcastle and the starry mountain", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    const raw = JSON.parse(
      localStorage.getItem("little-wonders-v1") || "null",
    ) ?? {
      pending: false,
      nickname: "Bạn nhỏ",
      device: "d",
      world: { schema: 2, epoch: 0, discoveries: [], fields: {} },
    };
    raw.world.discoveries.push(
      "region_pond_open",
      "region_forest_open",
      "region_beach_open",
      "region_snow_open",
      "region_stars_open",
    );
    localStorage.setItem("little-wonders-v1", JSON.stringify(raw));
  });
  await page.reload();
  await activate(page, "Bãi biển");
  await expect(page.locator(".garden")).toHaveAttribute(
    "data-variant",
    "beach",
  );
  await expect(page.getByRole("button", { name: "Luống đất 1" })).toBeVisible();
  await activate(page, "Cây dừa");
  await activate(page, "Vỏ sò");
  await expect(page.getByLabel("Giỏ của con")).toContainText("1");
  for (let i = 0; i < 2; i++) await activate(page, "Lâu đài cát");
  await activate(page, "Sổ khám phá");
  const sandcastleCard = page.locator(".notebook").getByRole("button", {
    name: "Lâu đài cát",
    exact: true,
  });
  await expect(sandcastleCard).toBeVisible();
  await expect(sandcastleCard).toHaveText("");
  await expect(
    page
      .locator(".notebook")
      .getByRole("button", { name: "Trái dừa rơi", exact: true }),
  ).toBeVisible();
  await sandcastleCard.click();
  await expect(page.locator(".hud-guide p")).toHaveText(
    "Con đã khám phá lâu đài cát!",
  );
  await activate(page, "Trở về vườn");
  await activate(page, "Quay lại bản đồ");
  await activate(page, "Núi sao");
  await expect(page.locator(".garden")).toHaveAttribute(
    "data-variant",
    "stars",
  );
  await expect(page.getByRole("button", { name: "Mặt trời" })).toHaveCount(0);
  await activate(page, "Ông trăng");
  await expect(page.getByRole("button", { name: "Chòm sao" })).toBeVisible();
});

test("seed tray announces seed name and voice clips are precached", async ({
  page,
}) => {
  await openGarden(page);
  await activate(page, "Bật âm thanh");
  await activate(page, "Hạt Hướng dương");
  await expect(page.locator(".hud-guide p")).toHaveText(
    "Con kéo hạt hướng dương xuống luống đất nhé!",
  );
  const worker = await (await page.request.get("/sw.js")).text();
  expect(worker).toContain("/assets/voice/");
});

test("region story sign, regional pals and seasonal events work end-to-end", async ({
  page,
}) => {
  await page.goto("/?season=tet");
  await page.evaluate(() => {
    localStorage.setItem(
      "little-wonders-v1",
      JSON.stringify({
        pending: false,
        nickname: "Bạn nhỏ",
        device: "d",
        world: {
          schema: 2,
          epoch: 0,
          discoveries: [
            "region_pond_open",
            "region_forest_open",
            "region_beach_open",
            "region_snow_open",
            "region_stars_open",
          ],
          fields: {},
        },
      }),
    );
  });
  await page.reload();
  await activate(page, "Vườn nhà");
  await expect(
    page.getByRole("button", { name: "Hoa mai ngày Tết" }),
  ).toBeVisible();
  await activate(page, "Hoa mai ngày Tết");
  await expect(page.locator(".hud-guide p")).toContainText("Chúc mừng năm mới");
  await activate(page, "Nghe chuyện vùng đất");
  await expect(page.locator(".hud-guide p")).toContainText("Ngày xửa ngày xưa");

  await activate(page, "Quay lại bản đồ");
  await activate(page, "Rừng nhỏ");
  await activate(page, "Bạn Sóc nhỏ");
  await expect(
    page.getByRole("heading", { name: "Lời mời của Sóc nhỏ" }),
  ).toBeVisible();
  await activate(page, "Giỏ thức ăn");
  await expect(
    page.getByRole("button", { name: "Đọc chuyện 1 của Sóc nhỏ" }),
  ).toBeEnabled();
  await activate(page, "Trở về vườn");

  await page.goto("/?season=mid_autumn");
  await activate(page, "Vườn nhà");
  await expect(
    page.getByRole("button", { name: "Đèn ông sao Trung thu" }),
  ).toBeVisible();
  await activate(page, "Đèn ông sao Trung thu");
  await expect(page.locator(".hud-guide p")).toContainText("Tết Trung thu");
});

test("drag ghost tracks pointer, pal story has no modal scrollbar, house supports drag-drop, cloud waters all 6 plots and pinecone falls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");
  await activate(page, "Vườn nhà");

  // Dragging food in Lucky's panel keeps drag ghost centered on pointer and story fits without modal scrollbar
  await activate(page, "Góc Của Lucky");
  const trayBtn = page.locator(".food-tray button").first();
  const tb = (await trayBtn.boundingBox())!;
  const startX = tb.x + tb.width / 2;
  const startY = tb.y + tb.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 40, startY - 60);
  const ghostBox = (await page.locator(".drag-ghost").boundingBox())!;
  expect(
    Math.abs(ghostBox.x + ghostBox.width / 2 - (startX + 40)),
  ).toBeLessThan(6);
  expect(
    Math.abs(ghostBox.y + ghostBox.height / 2 - (startY - 60)),
  ).toBeLessThan(6);
  await page.mouse.up();

  await activate(page, "Giỏ thức ăn");
  await activate(page, "Đọc chuyện 1 của Lucky");
  await expect(page.locator(".pal-story-text")).toContainText("Lucky");
  const overflow = await page.locator(".modal-body").evaluate((el) => ({
    scroll: el.scrollHeight,
    client: el.clientHeight,
  }));
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.client + 2);
  await activate(page, "Trở về vườn");

  // Dragging a decoration from the palette onto the house canvas places it
  await activate(page, "Ngôi Nhà Sắc Màu");
  const decorBtn = page.getByRole("button", {
    name: "Trang trí hoa",
    exact: true,
  });
  const db = (await decorBtn.boundingBox())!;
  const canvasBox = (await page.locator(".house-canvas").boundingBox())!;
  await page.mouse.move(db.x + db.width / 2, db.y + db.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    canvasBox.x + canvasBox.width / 2,
    canvasBox.y + canvasBox.height / 2,
  );
  await page.mouse.up();
  await expect(page.locator(".house-canvas button")).toHaveCount(1);
  await activate(page, "Trở về vườn");

  // Unlock 6 plots via 3 distinct harvests, then verify tapping cloud waters plot 6
  await activate(page, "Hạt Hướng dương");
  await activate(page, "Luống đất 1");
  for (let i = 0; i < 3; i++) {
    await activate(page, "Mây tưới nước");
    await activate(page, "Mặt trời");
  }
  await activate(page, "Luống đất 1");
  await activate(page, "Hạt Cà rốt");
  await activate(page, "Luống đất 1");
  for (let i = 0; i < 3; i++) {
    await activate(page, "Mây tưới nước");
    await activate(page, "Mặt trời");
  }
  await activate(page, "Luống đất 1");
  await activate(page, "Hạt Dâu");
  await activate(page, "Luống đất 1");
  for (let i = 0; i < 3; i++) {
    await activate(page, "Mây tưới nước");
    await activate(page, "Mặt trời");
  }
  await activate(page, "Luống đất 1");
  await expect(page.getByRole("button", { name: "Luống đất 6" })).toBeVisible();
  await activate(page, "Luống đất 6");
  await activate(page, "Mây tưới nước");
  await expect(page.locator("[data-soil='5'] .water-dot")).toBeVisible();

  // Enable dev mode and verify pinecone falling animation in Đồi tuyết
  await activate(page, "Quay lại bản đồ");
  await activate(page, "Dành cho người lớn");
  await activate(page, "12");
  await page.getByRole("tab", { name: "Dọn khu vườn" }).click();
  await activate(page, "Bật Dev mode");
  await activate(page, "Trở về vườn");
  await activate(page, "Đồi tuyết");
  await activate(page, "Cây thông phủ tuyết");
  await expect(page.locator(".fallen-apple")).toBeVisible();
  await expect(page.getByLabel("Quả thông 1")).toBeVisible();
});
