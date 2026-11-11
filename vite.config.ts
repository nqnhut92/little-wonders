import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
export default defineConfig({
  plugins: [
    react(),
    {
      name: "version-offline-shell",
      closeBundle() {
        const html = readFileSync("dist/index.html", "utf8");
        const sw = readFileSync("public/sw.js", "utf8");
        const hash = createHash("sha256").update(html).update(sw);
        for (const size of [180, 192, 512])
          hash.update(readFileSync(`public/icon-${size}.png`));
        const id = hash.digest("hex").slice(0, 12);
        writeFileSync(
          "dist/sw.js",
          readFileSync("public/sw.js", "utf8").replace("__BUILD_ID__", id),
        );
      },
    },
  ],
});
