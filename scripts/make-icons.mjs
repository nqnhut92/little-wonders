// Renders the PNG and ICO app icons from the vector master, public/favicon.svg (flat Lucky with the purple bow).
// Usage: node scripts/make-icons.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
const master = readFileSync("public/favicon.svg", "utf8");
// Full-bleed square for the Apple icon; maskable also shrinks Lucky into the central safe zone.
const square = master.replaceAll('rx="112"', 'rx="0"');
const maskable = square.replace(
  '<g id="art">',
  '<g id="art" transform="translate(51 51) scale(0.8)">',
);
if (maskable === square) throw Error("favicon.svg layout changed");
const browser = await chromium.launch();
async function render(svg, size) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
  });
  await page.setContent(
    `<body style="margin:0">${svg.replace("<svg ", `<svg width="${size}" height="${size}" style="display:block" `)}</body>`,
  );
  const png = await page.screenshot({ omitBackground: true });
  await page.close();
  return png;
}
for (const [file, svg, size] of [
  ["icon-32.png", master, 32],
  ["icon-180.png", square, 180],
  ["icon-192.png", master, 192],
  ["icon-512.png", master, 512],
  ["icon-maskable-192.png", maskable, 192],
  ["icon-maskable-512.png", maskable, 512],
])
  writeFileSync("public/" + file, await render(svg, size));
const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) pngs.push(await render(master, size));
await browser.close();
// PNG entries inside an ICO container.
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(sizes.length, 4);
let offset = head.length;
sizes.forEach((size, i) => {
  const at = 6 + 16 * i;
  head[at] = size;
  head[at + 1] = size;
  head.writeUInt16LE(1, at + 4);
  head.writeUInt16LE(32, at + 6);
  head.writeUInt32LE(pngs[i].length, at + 8);
  head.writeUInt32LE(offset, at + 12);
  offset += pngs[i].length;
});
writeFileSync("public/favicon.ico", Buffer.concat([head, ...pngs]));
