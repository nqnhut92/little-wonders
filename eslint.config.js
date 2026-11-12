import js from "@eslint/js";
import ts from "typescript-eslint";
export default ts.config(
  {
    ignores: [
      "dist",
      "dist-e2e*",
      "node_modules",
      "playwright-report",
      "test-results",
      "artifacts",
    ],
  },
  js.configs.recommended,
  {
    files: ["scripts/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        localStorage: "readonly",
        document: "readonly",
        Image: "readonly",
        Buffer: "readonly",
      },
    },
  },
  {
    files: ["src/ui/*.js"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
      },
    },
  },
  {
    files: ["tests/*.mjs"],
    languageOptions: {
      globals: { EventTarget: "readonly", Event: "readonly" },
    },
  },
  {
    files: ["public/sw.js"],
    languageOptions: {
      globals: {
        self: "readonly",
        caches: "readonly",
        fetch: "readonly",
        Response: "readonly",
        URL: "readonly",
        location: "readonly",
      },
    },
  },
  ...ts.configs.recommended,
  { rules: { "@typescript-eslint/no-explicit-any": "off" } },
);
