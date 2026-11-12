import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { localApi } from "./dev/local-api";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
function collectAssets(dir: string, urlPrefix: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    const url = `${urlPrefix}/${entry.name}`;
    if (entry.isDirectory()) files.push(...collectAssets(full, url));
    else if (/\.(png|jpe?g|webp|svg|mp3|m4a)$/i.test(entry.name))
      files.push(url);
  }
  return files;
}
// Follows --outDir so browser tests can build beside the regular dist folder.
let outDir = "dist";
export default defineConfig({
  plugins: [
    react(),
    localApi(),
    {
      name: "version-offline-shell",
      configResolved(config) {
        outDir = config.build.outDir;
      },
      closeBundle() {
        const html = readFileSync(`${outDir}/index.html`, "utf8");
        const sw = readFileSync("public/sw.js", "utf8");
        // Fonts and public/assets illustrations, music and voice clips are referenced dynamically or from CSS, so precache them offline.
        const assetUrls = collectAssets("public/assets", "/assets");
        const bundled = [
          ...readdirSync(`${outDir}/assets`)
            .filter((f) => f.endsWith(".woff2"))
            .sort()
            .map((f) => `/assets/${f}`),
          ...assetUrls,
        ];
        const hash = createHash("sha256")
          .update(html)
          .update(sw)
          .update(bundled.join());
        for (const url of assetUrls) hash.update(readFileSync(`public${url}`));
        for (const file of [
          "favicon.ico",
          "favicon.svg",
          "icon-32.png",
          "icon-180.png",
          "icon-192.png",
          "icon-512.png",
          "icon-maskable-192.png",
          "icon-maskable-512.png",
          "manifest.webmanifest",
        ])
          hash.update(readFileSync(`public/${file}`));
        const id = hash.digest("hex").slice(0, 12);
        writeFileSync(
          `${outDir}/sw.js`,
          sw
            .replace("__BUILD_ID__", id)
            .replace(
              "/*__BUNDLED__*/",
              bundled.map((f) => JSON.stringify(f)).join(","),
            ),
        );
      },
    },
  ],
});
