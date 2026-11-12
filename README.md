[Tiếng Việt](README.vi.md)

# Little Wonders

A Vietnamese touch-first storybook garden and valley for children aged 4–6, built with React, strict TypeScript, CSS Modules and Vite. Every character, backdrop, dish and prop is original expressive chibi SVG artwork. No paid AI, advertising, behavioral tracking or continuous backend is required.

## Features

- **Six Regions across the Valley**: The game opens on the valley map with **Vườn nhà** (home garden) ready to play. Exploring ~70% of a region's counted discoveries clears the fog over the next one:
  - **Ao sen** (lotus pond): grow pink lotus and purple waterlily on water pads, meet **Capybara** soaking by the bank with a tangerine on its head, and tap the duckling, dragonfly, frog, lotus lantern and lakeside xylophone.
  - **Rừng nhỏ** (small forest): grow blueberries and chestnuts, peek under autumn leaves for the hedgehog, and meet the squirrel, woodpecker, mushroom house and night fireflies.
  - **Bãi biển** (sunny beach): shake the coconut palm, gather singing shells, uncover the crab in the sand, build a three-stage sandcastle, and watch waves, a baby sea turtle and a seagull.
  - **Đồi tuyết** (snowy hill): shake pinecones from the snowy pine, build a three-stage snowman, and play with the polar bear cub, penguin, wooden sled and six-point snowflakes.
  - **Núi sao** (starry mountain): look through the brass telescope, greet the smiling crescent moon, light the four-stage puppy constellation star by star, and float a glowing star lantern.
  - Once a region opens it stays open forever, and chance-based discoveries (`rare_*`, `shooting_star`) never block progression.
- **Gardening & Harvests**: Plant seeds, water with the rain cloud, warm with the sun, and harvest ripe crops into the basket (up to 9 per item). Up to 6 soil beds open as distinct crops are harvested. Shaking the apple tree drops apples into the basket, and holding the broom button for one second (confirmed with a checkmark) clears beds, basket and decorations while keeping the notebook, pals and unlocked regions.
- **Three Companions (`Pals`)**:
  - **Lucky**: a chubby white puppy wearing a small purple bow who loves chilled watermelon, always present in the garden with basic table snacks available even when the basket is empty.
  - **Tuần Lộc nhỏ** (little reindeer): wearing a festive red collar and golden sleigh bell, arriving in the garden after the first harvest.
  - **Capybara**: relaxing by the lotus pond with a tangerine balanced on its head, and visiting the home garden once discovered.
  - Each companion has non-expiring food wishes and three unlockable Vietnamese story chapters. Any gift counts toward stories; matching the current wish rotates to the next one.
- **Garden Kitchen**: Combine one to three basket ingredients in the cooking pot across 14 recipes (soups, jam, salad, pie, juice, corn cake, applesauce, fruit bowl, sunflower tea, smoothie, coconut water and roasted chestnuts, plus an always-edible surprise dish).
- **Color House & Free Play**: Paint the house across five wall colors and place up to 30 decorations. Toggle synced Day/Night (`scene.time`) with moon, stars, interactive fireflies, sleeping flowers and night owl; play the 8-bar pentatonic xylophone with multi-touch; spin the windmill; and discover gentle idle surprise events. Audio and Vietnamese speech synthesis default to off and persist per browser.
- **Child-First Interface & Cloud Sync**: Light, Dark and System appearance (`System → Light → Dark → System`) for UI chrome while keeping scene artwork bright; full-screen responsive layout (`56px+` child buttons, `44px` adult gear corner on the valley map only); self-hosted Nunito with Vietnamese glyphs; immediate `localStorage` persistence with multi-tab and serverless PostgreSQL (`merge_world` schema v2) synchronization via Google OpenID Connect for parents.

See [architecture](docs/ARCHITECTURE.md) and [asset provenance](public/assets/PROVENANCE.md).

## Run and test

Use Node 22+ and the existing checkout:

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

Use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` for a system Chromium, or a writable `PLAYWRIGHT_BROWSERS_PATH`. Browser tests serve the production build.

### Local play without external cloud setup

`npm run dev` serves both the Vite frontend and the real API backed by a local PGlite database in `.local-db/` (ignored by Git; migrations run automatically on startup). In the adult corner on the valley map, "Tiếp tục với Google" signs in a local test parent immediately so profiles and multi-tab/device sync can be tested without configuring Google OAuth or Neon. Open `http://<computer-ip>:5173` on an iPad on the same LAN to test touch interactions. Delete `.local-db/` to reset local database state.

## Deploy

1. Create a Neon PostgreSQL database.
2. Configure a Google OAuth web client with `openid` and callback `https://YOUR_HOST/api/auth/callback`.
3. Import into Vercel using `vercel.json`: install `npm ci`, build `node scripts/migrate.mjs --optional && npm run build`, output `dist`. Numbered SQL files in `migrations/` run automatically during build when `DATABASE_URL` is set (with advisory locking and SHA-256 checksum verification).
4. Set server-only environment variables `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (32+ random characters) and `APP_URL` (exact HTTPS origin, no trailing slash), and enable Vercel Web Analytics in the dashboard.

Never commit secrets or expose them with `VITE_`.

## Documentation and icons

Every markdown document has synchronized English and Vietnamese counterparts linked on line 1 (`README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `public/assets/PROVENANCE.md`). After updating both languages and reviewing semantics, run `npm run docs:sync -- --reviewed` and verify with `npm run docs:check`.

`node scripts/make-icons.mjs` renders all PNG and ICO app icons from the vector master `public/favicon.svg`.
