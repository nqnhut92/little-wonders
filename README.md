[Tiếng Việt](README.vi.md)

# Little Wonders

A Vietnamese touch-first storybook garden for children aged 4–6, built with React, strict TypeScript, CSS Modules and Vite. Artwork is original temporary SVG/vector work. No paid AI, advertising, behavioral tracking or continuous backend is required.

## Implemented

- The game opens on the valley map: the home garden is lit, **Ao sen** (lotus pond) unlocks with a fog-clearing animation once about 70% of the garden's counted discoveries are found, and each later region opens the same way after the one before it: **Rừng nhỏ** (small forest: blueberries and chestnuts to grow, a hedgehog in the leaves, a squirrel, a woodpecker, a mushroom house to look at, fireflies at night), **Bãi biển** (beach: shake the coconut palm, collect shells, find the crab under the sand, build a sandcastle step by step, waves, a baby turtle, gulls), **Đồi tuyết** (snowy hill: build a snowman, a polar bear cub, a penguin, a sled, snowflakes, pinecones) and **Núi sao** (starry mountain: a telescope, the smiling moon, a constellation shaped like Lucky the puppy lit star by star, a star lantern, shooting stars). Coconuts make coconut water and two chestnuts make roasted chestnuts in the kitchen. A region stays open once unlocked, and chance-based discoveries (`rare_*`, `shooting_star`) never count toward the threshold.
- Crops grow through seed, sprout, grown and ripe stages with water and sunshine rounds, then harvest into a basket (up to 9 per item). Seven garden crops (sunflower, carrot, strawberry, tomato, pumpkin, corn, and watermelon unlocked by Lucky) plus two lotus-pond crops (lotus, waterlily) grow across beds (3 to 6 beds as crops are harvested). Shaking the apple tree drops apples into the basket, and holding the broom for one second (confirmed with a yes icon) clears beds, basket and decorations while keeping the notebook and unlocked friends/regions.
- Two pals with non-expiring wishes and story chapters: **Lucky** (main character, a cute rounded white cartoon puppy who loves watermelon, always present with basic table snacks available) and **Tuần Lộc nhỏ** (little baby reindeer companion who arrives on the first harvest and also loves watermelon; spoken with natural Vietnamese phrasing). Any gift counts toward story chapters; matching the wish rotates to the next wish.
- A kitchen (pot button) cooks one to three basket items across 12 recipes (plus a surprise dish that is always edible).
- House decorating supports five wall colors and up to 30 decorations, including sunflower and pumpkin-lamp items unlocked by harvests (shown as dimmed silhouettes before unlock, without counts or percentages).
- Free-play layer: synced Day/Night (`scene.time`) with moon, stars, interactive fireflies, sleeping flowers and night owl; an 8-bar pentatonic xylophone supporting multi-touch; a spinning windmill; shifting frog and snail critters; crop/time-based visitors; surprise combo rules; and gentle idle surprise events (every 45–90s when idle). Voice/audio is off by default and stored per browser.
- An interface in the owner's design language: Light, Dark and System appearance (System → Light → Dark → System), a full-screen responsive scene with controls floating over it instead of header and footer bars, self-hosted Nunito with the Vietnamese subset, one focus ring, thin scrollbars, a splash and skeleton loading states. Child-facing buttons are at least 56px. Appearance themes the interface only; scene artwork is unchanged.
- Immediate local persistence, per-profile backups, same-profile multi-tab merge, batched retries and offline shell caching.
- Google OpenID Connect for parents, nicknames for children, ownership-checked Neon APIs, CSRF and secure session cookies.

Google/Neon need external configuration. Guest play works locally; Vite alone does not run APIs. Real OAuth, live Neon, Vercel routing and physical iPad Safari are not verified. See [artwork handoff](docs/ARTWORK_HANDOFF.md) and [architecture](docs/ARCHITECTURE.md).

## Run and test

Use Node 22+ and the existing checkout; no worktree is necessary.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run docs:check
npm run build
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

Use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` for a system Chromium, or a writable `PLAYWRIGHT_BROWSERS_PATH`. Browser tests serve the production build. For full-stack local work, copy `.env.example` to `.env.local`, configure a development Neon database and Google callback, apply `migrations/001_initial.sql`, then run `npx vercel dev`. Secure cookies require a compatible secure context.

### Local play without sign-in

`npm run dev` also serves the real API on a local PGlite database in `.local-db/` (ignored; migrations apply on start). In the adult corner, "Tiếp tục với Google" signs in a local test parent without opening Google, so profiles and sync between tabs or devices can be tried without Neon or Google. Open `http://<computer-ip>:5173` on an iPad on the same network to test with real touch. Delete `.local-db/` to start over. This only exists in the dev server; production builds use the real Google sign-in.

## Deploy

1. Create a free-tier Neon PostgreSQL database.
2. Configure a Google OAuth web client with `openid` and the exact callback `https://YOUR_HOST/api/auth/callback`.
3. Import into Vercel using `vercel.json`: install `npm ci`, build `node scripts/migrate.mjs --optional && npm run build`, output `dist`. When `DATABASE_URL` is set on Vercel, numbered files in `migrations/` run automatically during build with advisory locking and checksum verification (or run `npm run db:migrate` manually).
4. Set server-only `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (32+ random characters) and `APP_URL` (exact HTTPS origin, no trailing slash), then enable Vercel Web Analytics in the project dashboard (`@vercel/analytics/react` is wired into `src/main.tsx`).
5. Test sign-in, nickname creation, two-device restoration, session expiry and offline reconnection before release.

Never commit secrets or use `VITE_` for them. No cloud resources were created or purchased.

## Data policy

Discoveries merge by union (world schema 2 adds an `epoch` and monotonic `n.*` counters; see architecture). Stamped fields use logical counters beyond all observed edits, with a unique writer ID per app mount for tie-breaking. New edits do not read wall time; legacy clocks remain compatible. Concurrent edits to the same field select one whole value, including a decoration arrangement. This is not collaborative per-object editing. Server merges are atomic and identical retries do not change revision. No per-tap history is stored. See [architecture](docs/ARCHITECTURE.md).

## Documentation and screenshots

Every README/document has EN/VI counterparts linked at the top. Update both whenever behavior or instructions change; review their meaning, then run `npm run docs:sync` to record hashes. `npm run docs:check` runs in CI and rejects missing, unrecorded or changed translations. Hash checks detect version drift, not semantic mistranslation.

With production preview running, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture.mjs` uses real touch actions to discover all 18 entries and capture 19 screens, including reload persistence. It injects no progress fixtures. Files go to ignored `artifacts/screenshots/`. Set `CAPTURE_THEME=light|dark`, `CAPTURE_VIEWPORT=1180x820` and `CAPTURE_DIR` to capture one appearance and size into another folder for before/after review.

`npm test` also runs the theme controller contract with `node --test`. `node scripts/make-icons.mjs` regenerates `public/favicon.svg` and the maskable icons from `public/icon-512.png`.
