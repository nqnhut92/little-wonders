[Tiếng Việt](TESTING.vi.md)

# Testing

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run docs:check`.

Vitest tests rules, lunch variations, logical clocks, persistence/retry, profile backups, expired/tampered sessions, CSRF and ownership. PGlite executes the real PostgreSQL migration and API queries through a substituted Neon adapter; no live Neon connection is implied.

Install browsers with `npx playwright install --with-deps chromium webkit`, then `npm run test:e2e`. Tests use the production preview so service workers are exercised. Chromium covers desktop; the WebKit project uses an iPad viewport with touch. A system browser can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Set `PLAYWRIGHT_BROWSERS_PATH` to a writable location if necessary.

Browser flows cover planting/notebook, house persistence, correct/incorrect meals, dragging, offline reload, reduced motion, scene bounds, targeted watering, expired-session UI, late profile responses, unfinished meals, tab merging and outdoor decorations. Test outcomes are reported after execution; configured projects are not automatically verified.

## Environment evidence and manual checks

The implementation environment has run Chromium, Vitest, typecheck, lint and production builds. WebKit downloads were rejected with `403 Domain forbidden` at `cdn.playwright.dev`; configuration draft saving also failed. Google/Neon credentials and a physical iPad are unavailable. These integrations remain unverified.

Before release, test physical iPad Safari multi-touch, rotation, safe areas, nickname keyboard, reduced motion, Vietnamese voice availability, home-screen installation and offline relaunch. Verify real Google login, two-device conflicts, unrelated-account isolation and session-expiry retry.

`scripts/capture.mjs` drives real touch interactions from an empty garden through all 18 discoveries, captures 19 screens, reloads saved designs and records page errors. It injects no progress fixtures. Output goes to ignored `artifacts/screenshots/`.
