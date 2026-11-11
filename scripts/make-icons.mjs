// Derive the SVG favicon and the maskable icons from public/icon-512.png (see PROVENANCE).
// Usage: node scripts/make-icons.mjs  (uses the Playwright Chromium already required for tests)
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const source = (await readFile("public/icon-512.png")).toString("base64");
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
});
const page = await browser.newPage();
const render = (size, mode) =>
  page.evaluate(
    async ({ source, size, mode }) => {
      const image = new Image();
      image.src = "data:image/png;base64," + source;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const c = canvas.getContext("2d");
      c.imageSmoothingQuality = "high";
      if (mode === "maskable") {
        // Full-bleed backdrop from the artwork's own edges, then the artwork inside the 80% safe zone.
        c.fillStyle = "#f6efd9";
        c.fillRect(0, 0, size, size);
        c.filter = `blur(${size / 12}px)`;
        c.drawImage(image, -size * 0.1, -size * 0.1, size * 1.2, size * 1.2);
        c.filter = "none";
        const inner = size * 0.78;
        const offset = (size - inner) / 2;
        const fade = c.createRadialGradient(
          size / 2,
          size / 2,
          inner * 0.42,
          size / 2,
          size / 2,
          inner * 0.52,
        );
        fade.addColorStop(0, "#000");
        fade.addColorStop(1, "transparent");
        const layer = document.createElement("canvas");
        layer.width = layer.height = size;
        const l = layer.getContext("2d");
        l.imageSmoothingQuality = "high";
        l.drawImage(image, offset, offset, inner, inner);
        l.globalCompositeOperation = "destination-in";
        l.fillStyle = fade;
        l.fillRect(0, 0, size, size);
        c.drawImage(layer, 0, 0);
      } else c.drawImage(image, 0, 0, size, size);
      return canvas.toDataURL("image/png").split(",")[1];
    },
    { source, size, mode },
  );
for (const size of [192, 512])
  await writeFile(
    `public/icon-maskable-${size}.png`,
    Buffer.from(await render(size, "maskable"), "base64"),
  );
// The current mark is a raster illustration, so the SVG favicon wraps a small copy with rounded corners
// until the final vector icon is drawn together with the rest of the artwork.
const small = await render(128, "plain");
await writeFile(
  "public/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><clipPath id="r"><rect width="128" height="128" rx="28"/></clipPath></defs><image width="128" height="128" clip-path="url(#r)" href="data:image/png;base64,${small}"/></svg>\n`,
);
await browser.close();
