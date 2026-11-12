[Tiếng Việt](ARCHITECTURE.vi.md)

# Architecture

React, strict TypeScript, Vite and CSS Modules render DOM and SVG directly. Native pointer capture handles touch and mouse interactions without a heavyweight game engine or continuous backend.

## Data flow

Garden/Activities → typed Action → `apply` → `World` → immediate `localStorage` → 1.5-second debounce → authenticated serverless API → atomic PostgreSQL `merge_world`.

- `src/game/engine.ts`: plant growth, gifting, cooking, discoveries and field merges; completely independent of the renderer.
- `src/game/lunch.ts`: companion wish status and speech-pronunciation helpers for Lucky, the little reindeer and Capybara.
- `src/game/hints.ts`: contextual hints derived from current plant, basket, companion and discovery state.
- `src/game/visitors.ts` & `src/game/events.ts`: pure selectors for garden visitors and injected-RNG idle surprise events.
- `src/data`: discovery inventory, crops, companions (`pals.ts`), recipes, regions, data-driven region scenes (`scenes.ts`) and interaction rules.
- `src/components`: expressive chibi SVG artwork (`Art.tsx` with drawings in `ArtFlat.tsx` and `ArtFlatMore.tsx`, full-bleed backdrops and valley map in `SceneBackdrop.tsx`, and light-glow definitions in `PaintFilters.tsx`), data-driven scene renderer (`Garden.tsx`), valley map (`ValleyMap.tsx`), kitchen, companions, house, xylophone and notebook.
- `src/services`: local persistence, retry queue and Web Audio / speech synthesis (`little-wonders-audio` stored per browser, off by default). `App.tsx` coordinates profiles, regions and modal panels.
- `src/styles`: design tokens (`tokens.css`) and shared focus/scrollbar styles. `src/ui`: framework-independent scroll-region controller. `src/components/Icons.tsx`: interface icons.
- `api/index.ts` and `api/_lib/security.ts`: Google OAuth, signed sessions, ownership checks and CSRF protection.

## Persistence and conflict resolution

World schema 2 (schema 1 is upgraded on read by the pure, idempotent `upgradeWorld`) stores an `epoch`, discovery IDs and stamped fields `{value, clock, device}`. Discoveries merge by set union. A higher `epoch` (incremented by `resetAll`; missing means 0) replaces the entire world of a lower epoch. Fields prefixed with `n.` are monotonic counters: the larger numeric value wins regardless of logical clock so companion gifts and wishes never regress. `mergeWorld` (TypeScript) and `merge_world` (`migrations/002_world_v2.sql`) implement identical rules verified by `tests/world-v2.test.ts`.

Discovery IDs match `/^[a-z0-9_]{1,32}$/` and are grouped by prefix (`harvest_`, `rare_`, `region_`, `pal_`, `story_`, `dish_`). Identifiers, patterns and limits live in `src/data/ids.ts`. New edits advance a logical clock beyond all observed timestamps using a per-mount random device UUID for tie-breaking.

Cross-tab `storage` events merge updates only for the active profile. Important state changes persist to `localStorage` immediately and batch to the server; network or 401 failures preserve pending local changes and retry on reconnection or every 30 seconds. Server `UPDATE` statements merge atomically under row locks without incrementing the revision on identical retries.

## Storage and security

`parents` stores only the Google subject identifier; `profiles` stores the owner reference, child nickname, versioned `world` JSONB and revision counter. `schema_migrations` tracks applied SQL migrations; `rate_limits` stores short-lived hashed rate-limit buckets.

Parent identity is derived strictly from the signed `HttpOnly`, `Secure`, `SameSite=Lax` session cookie. Every profile read and write filters by `parent_id`. State-changing `POST` requests verify exact `Origin` and custom request headers. OAuth verifies signed state, nonce, Google JWT signature, issuer and audience. Authenticated API responses set `Cache-Control: no-store` and are excluded from service-worker caching.

## Plants, harvest and basket

Each soil bed is stored in field `plot.<region>.<slot>` as `{kind, stage, water, sun, rounds?}` where stage `0` is empty and stages `1..4` represent seed, sprout, grown and ripe. Completing both water and sun advances the plant after `care` rounds (`src/data/crops.ts`). `harvest` moves a ripe crop into `basket` (up to 9 per item), clears the bed, unlocks `harvest_<crop>` and `pal_reindeer`, and rolls a `1/8` chance for rare crop variants (`rare_carrot_twin`, `rare_pumpkin_giant`, `rare_berry_heart`).

`shake` gathers scene items (`apple`, `coconut`, `shell`, `pinecone`) into the basket. `resetGarden` clears beds, basket and house decorations while preserving discoveries, unlocked regions and companion progress. The number of garden beds (3 to 6) is derived from distinct `harvest_*` discoveries.

## Kitchen

Recipes live in `src/data/recipes.ts` (14 sorted ingredient combinations plus `dish_mystery`). `cook` consumes 1 to 3 raw ingredients from the basket and adds the cooked dish (`dish_*`, up to 9) to both the basket and the discovery notebook. Unmatched combinations produce `dish_mystery` so experimentation is always rewarded. Each dish has a dedicated SVG illustration in `src/components/ArtFlatMore.tsx`.

## Regions, companions and data-driven scenes

All six regions (`garden`, `pond`, `forest`, `beach`, `snow`, `stars`) are defined in `src/data/regions.ts` (`ready`, `after`, `counted`, unlock ratio `0.7`) with scene layouts and hotspots in `src/data/scenes.ts`. Regions without soil beds (`beach`, `snow`, `stars`) hide the seed tray automatically, and `sky: false` on `stars` omits the daytime sun and rain cloud.

Hotspot kinds include `gather` (adds `coconut`, `shell` or `pinecone` to the basket) and `build` (advances multi-stage sandcastles, snowmen and constellations on each tap and records the discovery on completion). Every region renders a tailored 1600×900 vector backdrop in `src/components/SceneBackdrop.tsx` with day and night palettes and ambient motion (ripples, falling leaves, ocean waves, snowfall, aurora and twinkling stars) that pauses under `prefers-reduced-motion: reduce`.

`regionsToOpen` in `src/game/regions.ts` unlocks the next region once 70% of the previous region's `counted` discoveries are found, recording `region_<id>_open` in `discoveries` so unlocked regions merge by union and never relock. Chance-based discoveries (`rare_*`, `shooting_star`) are excluded from progression counts.

Three companions in `src/data/pals.ts` (`puppy`, `reindeer`, `capybara`) track `n.gift_<id>` and `n.wish_<id>` counters to unlock three story chapters each (`[1, 3, 6]` gifts) and rotate non-expiring food wishes.

## Interface design language

Design tokens live in `src/styles/tokens.css` with a bright storybook Light palette across both UI chrome and scenes, while scene backdrops switch between daylight and nighttime palettes via `scene.time`.

The active scene fills `100dvh` with floating glass controls: the Lucky guide and hint button at the bottom left, a top-left Back button inside regions (next to the basket counter), child action buttons (`56px+`) along the top right, and a single adult-corner gear button (`44px`) at the bottom right of the valley map only. Scene objects size proportionally with `--u: min(1cqw, 1.9cqh)`, verified by Playwright layout tests across iPad, desktop and ultra-wide viewports.

## Offline and rendering

The service worker precaches the application shell and bundled assets, including self-hosted Nunito `.woff2` font files (`latin` and `vietnamese` subsets). Audio synthesizes gentle pentatonic notes and speaks Vietnamese phrases only after user interaction when sound is enabled. After a deploy the page picks up the new version by itself: `src/services/update.ts` asks for a fresh `sw.js` every 30 minutes while visible and whenever the tab returns to the front, lets the new worker take over (`SKIP_WAITING`) and reloads only while the tab is hidden, with no dialog, countdown or button; progress waiting in local storage is kept. Background music loops one CC0 track on the valley map and another inside a region (`public/assets/music-*.{m4a,mp3}`, precached for offline play), cross-fades between them, lowers itself while a phrase is spoken and pauses when the tab is hidden.
