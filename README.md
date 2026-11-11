# Little Wonders

A Vietnamese, touch-first storybook garden for children aged 4–6. React, strict TypeScript, CSS Modules and Vite render original temporary SVG characters. No paid AI, advertisements, analytics, or continuously running backend is required.

## What works

- A continuous garden: tree/apple, bird, moving cloud/rain, sun, pond/fish, rock/ladybug, grass/worm/cricket, flowers/butterfly and rabbit react differently.
- Three planting beds and three plant types. Drag a seed into soil, add water and sunshine; growth unlocks a butterfly and rainbow.
- Rabbit lunch: drag food or select and tap the basket, identify orange carrots, count to three, then try a creative meal.
- House: recolor walls, place and reposition decorations, restore designs later.
- An illustrated notebook with 18 discoverable entries; discoveries never lock basic activities.
- Immediate local persistence, per-profile backups, batched retry, atomic server merges and offline shell caching.
- Parent-gated Google OpenID Connect, child nicknames, secure session cookies, ownership-checked Neon persistence and profile selection.

Google and Neon require your own free-tier configuration. Local guest play works without credentials; `vite` alone does not run serverless APIs. Actual Google/Neon integration and physical iPad Safari are not claimed as verified. Artwork is temporary authored vector art; see [artwork handoff](docs/ARTWORK_HANDOFF.md).

## Development

Use Node 22+ and npm. Work in this existing checkout; no worktree is needed.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

If Chromium is preinstalled, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --project=chromium` uses it. Set `PLAYWRIGHT_BROWSERS_PATH` to a writable directory if needed. The browser suite serves the production build and tests the service worker.

For full-stack local development, copy `.env.example` to `.env.local`, configure the values, apply `migrations/001_initial.sql` to a development Neon database, then run `npx vercel dev`. Configure the Google callback to match the local origin. Production uses HTTPS; session cookies are always Secure. Do not weaken cookie security for production.

## Deployment

1. Create a free Neon PostgreSQL database. Run `migrations/001_initial.sql` in its SQL editor.
2. Create a Google OAuth web client and allow `https://YOUR_HOST/api/auth/callback`. The app only requests `openid`; no child email is requested or stored.
3. Import this repository into Vercel; use the Vite build settings in `vercel.json`.
4. Set server-only `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (at least 32 random characters), and `APP_URL` (exact HTTPS origin, no trailing slash).
5. Deploy; check Google login, create a nickname, plant a flower, and sign in from a second device. Test session expiry and offline reconnection before releasing to children.

No secrets belong in a `VITE_` variable. Never commit `.env` files. No resources have been created or purchased by this implementation.

## Data/conflicts

Discoveries form a union. Each world field has a logical clock and stable device ID; the greater clock wins, then lexicographically greater device ID breaks ties. Edits advance beyond all observed clocks. Stale snapshots cannot remove discoveries or newer observed values. Concurrent edits to the same field (including the decoration arrangement) choose one complete field deterministically; this is not collaborative editing. Initial device clock skew can influence concurrent winners. Per-profile local backups retain the prior device state. Server row locking makes merge updates atomic, and retrying identical progress leaves the revision unchanged. No individual tap history is stored.

See [architecture](docs/ARCHITECTURE.md), [gameplay](docs/GAMEPLAY.md), [deployment](docs/DEPLOYMENT.md), [testing](docs/TESTING.md), and [future work](docs/TODO.md).

## Screenshots

With the production preview running, execute `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture.mjs`. It uses actual touch controls to collect all 18 discoveries and captures 19 screens, including persistence after reload. Output is an ignored local `artifacts/screenshots/` album; no fixture progress is injected.
