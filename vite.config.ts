import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { localApi } from "./dev/local-api";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
export default defineConfig({
  plugins: [
    react(),
    localApi(),
    {
      name: "version-offline-shell",
      closeBundle() {
        const html = readFileSync("dist/index.html", "utf8");
        const sw = readFileSync("public/sw.js", "utf8");
        // Fonts and public/assets illustrations and music are referenced dynamically or from CSS, so precache them offline.
        const bundled = [
          ...readdirSync("dist/assets")
            .filter((f) => f.endsWith(".woff2"))
            .sort()
            .map((f) => `/assets/${f}`),
          ...readdirSync("public/assets")
            .filter((f) => /\.(png|jpe?g|webp|svg|mp3|m4a)$/i.test(f))
            .sort()
            .map((f) => `/assets/${f}`),
        ];
        const hash = createHash("sha256")
          .update(html)
          .update(sw)
          .update(bundled.join());
        for (const file of readdirSync("public/assets").filter((f) =>
          /\.(png|jpe?g|webp|svg|mp3|m4a)$/i.test(f),
        ))
          hash.update(readFileSync(`public/assets/${file}`));
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
          "dist/sw.js",
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
