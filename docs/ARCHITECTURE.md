[Tiếng Việt](ARCHITECTURE.vi.md)

# Architecture

React, strict TypeScript, Vite and CSS Modules render DOM/SVG. Phaser is unnecessary for this small scene; native pointer capture supports touch and mouse. There is no continuous backend or paid AI service.

## Data flow

Garden/Activities → typed Action → apply → World → immediate localStorage → 1.5-second debounce → authenticated serverless API → atomic PostgreSQL merge_world.

- `src/game/engine.ts`: plant conditions, gifting, discoveries and field merge; renderer independent.
- `src/game/lunch.ts`: pal wish status and speech-pronunciation helpers for Bông and Lucky.
- `src/game/hints.ts`: hints based on the current plant, basket, pal and discovery state.
- `src/game/visitors.ts` & `src/game/events.ts`: pure selectors for garden visitors and injected-RNG surprise events.
- `src/data`: discovery inventory, crops, pals, recipes, regions, data-driven region scenes (`scenes.ts`), and interaction rules.
- `src/components`: SVG artwork (`Art.tsx`), data-driven scene renderer (`Garden.tsx`), valley map (`ValleyMap.tsx`), kitchen, pals, house, xylophone and notebook.
- `src/services`: persistence, retry and audio/polyphony (`little-wonders-audio` stored per browser, off by default). `App.tsx` coordinates profiles and navigation.
- `src/styles`: design tokens (`tokens.css`) and local copies of the shared focus and scrollbar blocks. `src/ui`: framework-independent theme and scroll-region controllers. `src/components/Icons.tsx`: interface icons.
- `api/index.ts` and `api/_lib/security.ts`: OAuth, signed sessions, ownership and CSRF.

## Persistence and conflicts

World schema 2 (schema 1 is still accepted and upgraded on read by the pure, idempotent `upgradeWorld`) stores an `epoch`, discovery IDs and stamped fields `{value,clock,device}`. Discoveries merge by union. A higher `epoch` (raised by the `resetAll` action, a missing value means 0) replaces the whole world of a lower one. Fields named `n.<name>` are counters: the larger value wins whatever the clocks say, so progress never goes backwards. `mergeWorld` (TypeScript) and `merge_world` (migration 002) implement the same rules and `tests/world-v2.test.ts` runs both on shared fixtures. Discovery IDs are lowercase letters, digits and underscores up to 32 characters, with a group prefix; the API checks the pattern instead of a fixed list, allows 200 discoveries and 200 fields, and validates each field by key pattern (`api/index.ts`). Identifiers, patterns and limits live in `src/data/ids.ts`. Migration 001 is never edited. During a deploy the old API may call the new SQL function with v1 payloads, which stays valid; a client from before this release reloading a schema 2 world discards its local copy and refetches from the server. New edits use a logical counter beyond all observed clocks, not the wall clock. A random writer ID is generated per app mount so separate tabs cannot create identical writer/clock pairs. Equal clocks use lexicographic writer order. Existing timestamp-sized clocks remain compatible: subsequent edits advance beyond them.

Storage events merge changes from other tabs only for the same profile. Different profiles retain separate backups. Requests for a previously selected profile cannot replace the current selection. Pending meal state, completed meals, planted beds, wall color and decorations are durable. Important changes persist immediately, then batch; network/401 failures retain pending changes. Retry runs on reconnect and every 30 seconds.

Server UPDATE merges under the row lock. Identical retries do not increment revision. A field is the conflict unit: concurrent arrangements select one entire arrangement, not a union of decorations. Logical counters preserve observed ordering, not real-time ordering between disconnected devices. Mixed old/new clients and concurrent edits to the same field still need release testing. No tap history is collected.

## Storage and security

`parents` stores only Google subject; `profiles` stores owner, nickname, versioned world JSONB and revision. Discoveries and creations are compact members of that document. `schema_migrations` tracks migrations; `rate_limits` contains short-lived hashed buckets.

Parent identity comes from a signed session, never a client-supplied user ID. Every profile read/write filters by parent ID. POST requires exact Origin and a custom header. OAuth checks signed state, nonce, Google signature, issuer and audience. Cookies are Secure, HttpOnly, SameSite=Lax. Authenticated API responses are no-store and excluded from service-worker caching.

## Plants, harvest and basket

A bed is the field `plot.<region>.<slot>` with `{kind, stage, water, sun, rounds?}`: stage 0 is empty, then seed, sprout, grown and ripe. A full water and sun round advances the stage and clears both flags; crops are data in `src/data/crops.ts` (`care` is the number of rounds per stage). `harvest` moves a ripe plant into the `basket` field (at most 9 per crop), empties the bed and records `harvest_<crop>`. `shake` adds an apple to the basket, `feed` uses one basket item (the lunch table always offers basic foods, so an empty basket never blocks) and `resetGarden` empties beds, basket and decorations while discoveries, house color and meal state stay. The number of beds is derived from the distinct `harvest_*` discoveries (3 to 6) and is never stored. `upgradeWorld` turns early `plant0..2` fields into `plot.garden.N`: a plant with both water and sun becomes ripe, any other keeps its seed and flags, and an existing plot is never overwritten.

## Kitchen

Recipes are data in `src/data/recipes.ts` (12 sorted ingredient recipes plus `dish_mystery`). `cook` takes one to three items that are all in the basket, uses them up and adds the dish (`dish_*`, at most 9) to the basket and the notebook; a mix that matches no recipe makes `dish_mystery`. Invalid requests (empty pot, items not held, dishes as ingredients, a full dish stack) change nothing. Dishes are basket kinds drawn with the `dish-*` placeholder bowls.

## Regions, pals and data-driven scenes

Regions are rows in `src/data/regions.ts` (`ready`, `after`, `counted`, ratio 0.7). `garden` and `pond` (Ao sen) are ready, and their layouts, crops, and hotspots live in `src/data/scenes.ts` so adding a region requires only data and art. `regionsToOpen` in `src/game/regions.ts` is pure: a ready region opens when the previous region is open and enough of its counted discoveries are found, and `apply` records `region_<id>_open` as an ordinary discovery, so the state is derived, merges by union and never locks again. Chance-based discoveries (`rare_*`, `shooting_star`) are excluded from the count. `apply` takes an injected random function; a harvest of carrot, pumpkin or strawberry records the rare discovery with probability 1/8. `ValleyMap.tsx` is the entry screen and plays a reduced-motion-safe fog-clearing animation when a region newly opens. Pals (`src/data/pals.ts`) track `n.gift_<id>` and `n.wish_<id>` monotonic counters, unlocking story chapters and rotating non-expiring wishes; Day/Night is synced via `scene.time`.

## Interface design language

Colors, radii and fonts are CSS variables in `src/styles/tokens.css`; `src/style.module.css` holds no color literals. Light is the default token set and `:root[data-theme="dark"]` overrides it. Scene containers (`.garden`, `.house-canvas`, `.lunch-scene`) repeat the light tokens and use the theme-independent `--scene-*` palette, so artwork looks the same in every appearance; artwork shown on themed panels sits on a light plate. The game's own day and night will be game state, independent of appearance.

The preference (`system`, `light`, `dark`) is stored per browser in localStorage under `little-wonders-theme` and is never synchronized. An inline script in `index.html` resolves it before first paint; `ThemeToggle.tsx` wraps the controller, which follows live system changes only in System mode, keeps an in-memory choice when storage is blocked, synchronizes tabs and updates `theme-color`. The storage key and colors must match in both places (`tests/design.test.ts`).

The game has no header or footer bar. The scene fills the viewport (`100dvh`, safe-area aware) and the controls float over it: the rabbit guide with the hint button at the top left, and a column at the top right (sound, notebook, rest, then the adult corner, appearance and save state). Scene objects keep percentage positions; their size uses one scene unit, `--u: min(1cqw, 1.9cqh)`, so very wide or tall screens never push them off the scene, and a browser test checks that no control covers a tappable object at iPad, desktop and ultra-wide sizes. Child-facing buttons are 56px and adult ones 44px. Floating controls, the seed tray and dialogs use the glass material; in Dark mode the controls use a near-opaque fill because the scene stays light. Opaque fallbacks cover missing blur support, reduced transparency and forced colors. Dialogs keep the close button outside the scrolling body. `index.html` ships a splash inside `#root`; the profile list shows a labelled skeleton; the save state is an icon with its text as label and tooltip.

## Offline and rendering

The service worker precaches the shell and bundled assets. Nunito font files are referenced from CSS rather than HTML, so the build lists every bundled `.woff2` in the worker for offline use. Cache IDs depend on build contents; new workers wait for old tabs to close rather than interrupt play. SVG scales with a bounded scene ratio; reduced-motion disables animations. Audio starts only after user interaction and is throttled. Speech uses a Vietnamese voice when available, otherwise visual feedback and synthesized effects remain usable.
