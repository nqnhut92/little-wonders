import { it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)],
  );
}
const sources = [...files("src"), "index.html", "scripts/capture.mjs"];
it("uses no system serif as an interface font", () => {
  for (const file of sources) {
    const text = readFileSync(file, "utf8");
    expect(text, file).not.toMatch(/Georgia|Times New Roman|Palatino/i);
    expect(text, file).not.toMatch(/(?<!sans-)\bserif\b/);
  }
});
it("keeps colors in the token file instead of component styles", () => {
  const css = readFileSync("src/style.module.css", "utf8");
  // Neutral shadow alpha and the white provider chip are the only literals left.
  const literals = (css.match(/#[0-9a-f]{3,8}\b/gi) ?? []).filter(
    (c) => c.toLowerCase() !== "#fff",
  );
  expect(literals).toEqual([]);
});
it("keeps the pre-paint theme script aligned with the runtime controller", () => {
  const html = readFileSync("index.html", "utf8");
  const toggle = readFileSync("src/components/ThemeToggle.tsx", "utf8");
  const key = /themeStorageKey = "([^"]+)"/.exec(toggle)![1];
  expect(html).toContain(`localStorage.getItem("${key}")`);
  for (const color of toggle.match(/#[0-9a-f]{6}/g)!)
    expect(html).toContain(color);
});
it("declares dedicated maskable artwork and precaches every icon", () => {
  const manifest = JSON.parse(
    readFileSync("public/manifest.webmanifest", "utf8"),
  );
  const any = manifest.icons.filter((i: any) => i.purpose === "any");
  const maskable = manifest.icons.filter((i: any) => i.purpose === "maskable");
  expect(maskable.map((i: any) => i.sizes).sort()).toEqual([
    "192x192",
    "512x512",
  ]);
  for (const icon of maskable)
    expect(any.map((i: any) => i.src)).not.toContain(icon.src);
  const sw = readFileSync("public/sw.js", "utf8");
  for (const icon of manifest.icons) expect(sw).toContain(`"${icon.src}"`);
  expect(sw).toContain('"/favicon.svg"');
  expect(sw).toContain("/*__BUNDLED__*/");
});
it("packs 16, 32 and 48 pixel images into the ICO", () => {
  const ico = readFileSync("public/favicon.ico");
  const count = ico.readUInt16LE(4);
  const sizes = Array.from({ length: count }, (_, i) => ico[6 + i * 16]);
  expect(sizes.sort((a, b) => a - b)).toEqual([16, 32, 48]);
});
