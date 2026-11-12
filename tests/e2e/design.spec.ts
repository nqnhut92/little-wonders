import { test, expect } from "@playwright/test";

test("text and controls keep readable contrast", async ({ page }) => {
  await page.goto("/");
  const ratios = await page.evaluate(() => {
    const probe = document.createElement("canvas").getContext("2d")!;
    const rgb = (token: string) => {
      probe.fillStyle = "#000";
      probe.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue(token)
        .trim();
      const hex = probe.fillStyle as string;
      return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    };
    const luminance = (c: number[]) => {
      const [r, g, b] = c.map((v) =>
        v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
      );
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (a: string, b: string) => {
      const [x, y] = [luminance(rgb(a)), luminance(rgb(b))].sort(
        (m, n) => n - m,
      );
      return (x + 0.05) / (y + 0.05);
    };
    return {
      text: Math.min(
        ratio("--text", "--bg"),
        ratio("--text", "--surface"),
        ratio("--text", "--surface-2"),
        ratio("--text", "--surface-3"),
      ),
      muted: Math.min(
        ratio("--muted", "--bg"),
        ratio("--muted", "--surface"),
        ratio("--muted", "--surface-2"),
      ),
      primary: ratio("--on-accent", "--accent"),
      ring: Math.min(
        ratio("--focus-ring", "--bg"),
        ratio("--focus-ring", "--surface"),
      ),
    };
  });
  expect(ratios.text).toBeGreaterThanOrEqual(4.5);
  expect(ratios.muted).toBeGreaterThanOrEqual(4.5);
  expect(ratios.primary).toBeGreaterThanOrEqual(4.5);
  expect(ratios.ring).toBeGreaterThanOrEqual(3);
});

test("self-hosted Nunito renders Vietnamese and no serif remains", async ({
  page,
}) => {
  const fonts: string[] = [];
  page.on("request", (r) => {
    if (r.resourceType() === "font") fonts.push(r.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Vườn nhà", exact: true }).click();
  const stress = "Cầu ếch ổ nghề ớ ữ ặ Nguyện được tăng lương Tiến Điều Hồn";
  const loaded = await page.evaluate(async (text) => {
    await document.fonts.load("800 20px Nunito", text);
    await document.fonts.ready;
    return {
      check: document.fonts.check("800 20px Nunito", text),
      faces: [...document.fonts].filter(
        (f) => f.family.includes("Nunito") && f.status === "loaded",
      ).length,
      families: ["main", ".garden-sign", ".hud-guide p", ".seed-tray"].map(
        (s) => getComputedStyle(document.querySelector(s)!).fontFamily,
      ),
    };
  }, stress);
  expect(loaded.check).toBe(true);
  expect(loaded.faces).toBeGreaterThan(0);
  for (const family of loaded.families) {
    expect(family).toMatch(/^"?Nunito/);
    expect(family).not.toMatch(/Georgia|(?<!sans-)serif/);
  }
  for (const url of fonts)
    expect(new URL(url).origin).toBe(new URL(page.url()).origin);
  const worker = await (await page.request.get("/sw.js")).text();
  expect(worker).toMatch(/nunito-vietnamese-[^"]+\.woff2/);
  expect(worker).toMatch(/nunito-latin-[^"]+\.woff2/);
});

test("fonts stay available offline from the service-worker cache", async ({
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
  expect(
    await page.evaluate(async () => {
      await document.fonts.load("800 20px Nunito", "Khu Vườn Kỳ Diệu");
      return [...document.fonts].some(
        (f) => f.family.includes("Nunito") && f.status === "loaded",
      );
    }),
  ).toBe(true);
});

test("the scene fills the screen and floating controls stay inside it", async ({
  page,
}) => {
  for (const size of [
    { width: 1024, height: 768 },
    { width: 1180, height: 820 },
    { width: 1440, height: 1000 },
    { width: 2560, height: 1080 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    const gearBox = (await page.locator(".icon-button").boundingBox())!;
    expect(gearBox.width).toBe(44);
    expect(gearBox.y).toBeGreaterThan(size.height / 2);
    expect(gearBox.x).toBeGreaterThan(size.width / 2);
    const guideBox = (await page.locator(".hud-guide").boundingBox())!;
    expect(guideBox.y).toBeGreaterThan(size.height / 2);
    expect(guideBox.x).toBeLessThan(size.width / 2);
    const mapControls = await page
      .locator(".hud")
      .evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().toJSON()),
      );
    for (const node of await page.locator(".map-node").all()) {
      const n = (await node.boundingBox())!;
      for (const c of mapControls)
        expect(
          n.x < c.right &&
            n.x + n.width > c.left &&
            n.y < c.bottom &&
            n.y + n.height > c.top,
          `${await node.getAttribute("aria-label")} at ${size.width}x${size.height}`,
        ).toBe(false);
    }
    await page.getByRole("button", { name: "Vườn nhà", exact: true }).click();
    await expect(page.locator(".hud-adult")).toHaveCount(0);
    const garden = (await page.locator(".garden").boundingBox())!;
    expect(garden).toEqual({ x: 0, y: 0, ...size });
    await expect(page.locator("header, footer")).toHaveCount(0);
    const overflow = await page.evaluate(() => ({
      x: document.documentElement.scrollWidth - innerWidth,
      y: document.documentElement.scrollHeight - innerHeight,
    }));
    expect(overflow).toEqual({ x: 0, y: 0 });
    const backBox = (await page
      .getByRole("button", { name: "Quay lại bản đồ", exact: true })
      .boundingBox())!;
    expect(backBox.x).toBeLessThan(size.width / 2);
    expect(backBox.y).toBeLessThan(size.height / 2);
    const boxes = [gearBox];
    for (const name of [
      "Quay lại bản đồ",
      "Bật âm thanh",
      "Sổ khám phá",
      "Bếp của vườn",
      "Nghe gợi ý",
    ]) {
      const box = (await page
        .getByRole("button", { name, exact: true })
        .boundingBox())!;
      expect(Math.min(box.width, box.height), name).toBeGreaterThanOrEqual(56);
      boxes.push(box);
    }
    for (const box of boxes) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(size.width);
      expect(box.y + box.height).toBeLessThanOrEqual(size.height);
    }
    // Floating controls never cover a tappable scene object.
    const controls = await page
      .locator(".hud")
      .evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().toJSON()),
      );
    for (const object of await page.locator(".garden > .object").all()) {
      const o = (await object.boundingBox())!;
      for (const c of controls)
        expect(
          o.x < c.right &&
            o.x + o.width > c.left &&
            o.y < c.bottom &&
            o.y + o.height > c.top,
          `${await object.getAttribute("aria-label")} at ${size.width}x${size.height}`,
        ).toBe(false);
    }
  }
});

test("focus ring, forced colors and child-sized dialog controls", async ({
  page,
}) => {
  await page.goto("/");
  // WebKit on macOS does not Tab onto buttons by default, so focus one after a key press:
  // that is a keyboard interaction in every engine and shows :focus-visible.
  await page.keyboard.press("Shift");
  await page.getByRole("button", { name: "Sổ khám phá", exact: true }).focus();
  const ring = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement!);
    return [s.outlineStyle, s.outlineWidth, document.activeElement!.tagName];
  });
  expect(ring).toEqual(["solid", "2px", "BUTTON"]);
  await page.getByRole("button", { name: "Sổ khám phá", exact: true }).click();
  const close = (await page
    .getByRole("button", { name: "Trở về vườn" })
    .boundingBox())!;
  expect(Math.min(close.width, close.height)).toBeGreaterThanOrEqual(56);
  await expect(page.locator(".modal-body")).toHaveClass(/fe-scroll-fade/);
  await page.emulateMedia({ forcedColors: "active" });
  expect(
    await page
      .locator(".modal")
      .evaluate((el) => getComputedStyle(el).boxShadow),
  ).toBe("none");
});

test("app icons are public images and the shell shows a splash before scripts run", async ({
  request,
}) => {
  for (const [url, type] of [
    ["/favicon.ico", /icon/],
    ["/favicon.svg", /svg/],
    ["/icon-32.png", /png/],
    ["/icon-180.png", /png/],
    ["/icon-192.png", /png/],
    ["/icon-512.png", /png/],
    ["/icon-maskable-192.png", /png/],
    ["/icon-maskable-512.png", /png/],
  ] as const) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
    expect(response.headers()["content-type"], url).toMatch(type);
  }
  const html = await (await request.get("/")).text();
  expect(html).toContain('class="splash"');
  expect(html).toContain('rel="icon" href="/favicon.svg"');
  expect(html).toContain('rel="apple-touch-icon"');
});

test.describe("pending states", () => {
  test.use({ serviceWorkers: "block" });
  test("profile list shows a labelled skeleton while the request is pending", async ({
    page,
  }) => {
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    let calls = 0;
    await page.route("**/api/profiles", async (route) => {
      if (++calls > 1) await held;
      await route.fulfill({
        json: { profiles: [{ id: "a", nickname: "Mây" }] },
      });
    });
    await page.goto("/");
    await page
      .getByRole("button", { name: "Sổ khám phá", exact: true })
      .waitFor();
    // Sign the session out locally so the gate has to wait for the list again.
    await page.route("**/api/auth/logout", (route) =>
      route.fulfill({ json: {} }),
    );
    await page.getByRole("button", { name: "Dành cho người lớn" }).click();
    await page.getByRole("button", { name: "12", exact: true }).click();
    await page.getByRole("button", { name: "Đăng xuất" }).click();
    await page.getByRole("button", { name: "Trở về vườn" }).click();
    calls = 1;
    await page.getByRole("button", { name: "Dành cho người lớn" }).click();
    await page.getByRole("button", { name: "12", exact: true }).click();
    const pending = page.getByRole("status", {
      name: "Đang mở danh sách khu vườn",
    });
    await expect(pending).toBeVisible();
    await expect(pending).toHaveAttribute("aria-busy", "true");
    release();
    await expect(
      page.getByRole("button", { name: "Mây", exact: true }),
    ).toBeVisible();
    await expect(pending).toHaveCount(0);
  });
});

test("touch screens held upright are asked to turn sideways", async ({
  page,
  hasTouch,
}) => {
  test.skip(!hasTouch, "desktop windows never see the rotate prompt");
  const prompt = page.getByRole("dialog", { name: /Xoay ngang/ });
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto("/");
  await expect(prompt).toBeVisible();
  await page.setViewportSize({ width: 1194, height: 834 });
  await expect(prompt).toBeHidden();
});
