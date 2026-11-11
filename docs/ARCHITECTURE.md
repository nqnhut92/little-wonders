[Tiếng Việt](ARCHITECTURE.vi.md)

# Architecture

React, strict TypeScript, Vite and CSS Modules render DOM/SVG. Phaser is unnecessary for this small scene; native pointer capture supports touch and mouse. There is no continuous backend or paid AI service.

## Data flow

Garden/Activities → typed Action → apply → World → immediate localStorage → 1.5-second debounce → authenticated serverless API → atomic PostgreSQL merge_world.

- `src/game/engine.ts`: plant conditions, discoveries and field merge; renderer independent.
- `src/game/lunch.ts`: four meal variations and acceptance/count rules.
- `src/game/hints.ts`: hints based on the current plant/discovery state.
- `src/data`: discovery inventory and interaction dialogue/conditions.
- `src/components`: SVG artwork, garden, house, lunch and notebook.
- `src/services`: persistence, retry and sound. `App.tsx` coordinates profiles and navigation.
- `src/styles`: design tokens (`tokens.css`) and local copies of the shared header, focus and scrollbar blocks. `src/ui`: framework-independent theme and scroll-region controllers. `src/components/Icons.tsx`: interface icons.
- `api/index.ts` and `api/_lib/security.ts`: OAuth, signed sessions, ownership and CSRF.

## Persistence and conflicts

World schema 2 (schema 1 is still accepted and upgraded on read by the pure, idempotent `upgradeWorld`) stores an `epoch`, discovery IDs and stamped fields `{value,clock,device}`. Discoveries merge by union. A higher `epoch` (raised by the `resetAll` action, a missing value means 0) replaces the whole world of a lower one. Fields named `n.<name>` are counters: the larger value wins whatever the clocks say, so progress never goes backwards. `mergeWorld` (TypeScript) and `merge_world` (migration 002) implement the same rules and `tests/world-v2.test.ts` runs both on shared fixtures. Discovery IDs are lowercase letters, digits and underscores up to 32 characters, with a group prefix; the API checks the pattern instead of a fixed list, allows 200 discoveries and 200 fields, and validates each field by key pattern (`api/index.ts`). Identifiers, patterns and limits live in `src/data/ids.ts`. Migration 001 is never edited. During a deploy the old API may call the new SQL function with v1 payloads, which stays valid; a client from before this release reloading a schema 2 world discards its local copy and refetches from the server. New edits use a logical counter beyond all observed clocks, not the wall clock. A random writer ID is generated per app mount so separate tabs cannot create identical writer/clock pairs. Equal clocks use lexicographic writer order. Existing timestamp-sized clocks remain compatible: subsequent edits advance beyond them.

Storage events merge changes from other tabs only for the same profile. Different profiles retain separate backups. Requests for a previously selected profile cannot replace the current selection. Pending meal state, completed meals, planted beds, wall color and decorations are durable. Important changes persist immediately, then batch; network/401 failures retain pending changes. Retry runs on reconnect and every 30 seconds.

Server UPDATE merges under the row lock. Identical retries do not increment revision. A field is the conflict unit: concurrent arrangements select one entire arrangement, not a union of decorations. Logical counters preserve observed ordering, not real-time ordering between disconnected devices. Mixed old/new clients and concurrent edits to the same field still need release testing. No tap history is collected.

## Storage and security

`parents` stores only Google subject; `profiles` stores owner, nickname, versioned world JSONB and revision. Discoveries and creations are compact members of that document. `schema_migrations` tracks migrations; `rate_limits` contains short-lived hashed buckets.

Parent identity comes from a signed session, never a client-supplied user ID. Every profile read/write filters by parent ID. POST requires exact Origin and a custom header. OAuth checks signed state, nonce, Google signature, issuer and audience. Cookies are Secure, HttpOnly, SameSite=Lax. Authenticated API responses are no-store and excluded from service-worker caching.

## Interface design language

Colors, radii and fonts are CSS variables in `src/styles/tokens.css`; `src/style.module.css` holds no color literals. Light is the default token set and `:root[data-theme="dark"]` overrides it. Scene containers (`.garden`, `.house-canvas`, `.lunch-scene`) repeat the light tokens and use the theme-independent `--scene-*` palette, so artwork looks the same in every appearance; artwork shown on themed panels sits on a light plate. The game's own day and night will be game state, independent of appearance.

The preference (`system`, `light`, `dark`) is stored per browser in localStorage under `little-wonders-theme` and is never synchronized. An inline script in `index.html` resolves it before first paint; `ThemeToggle.tsx` wraps the controller, which follows live system changes only in System mode, keeps an in-memory choice when storage is blocked, synchronizes tabs and updates `theme-color`. The storage key and colors must match in both places (`tests/design.test.ts`).

The header is a floating glass bar: 64px tall, 24px radius, 26px blur, aligned to the scene edges through `--fe-content-width` and `--fe-content-max`. Child-facing buttons are 56px and adult ones 44px, a deliberate exception to the shared 44px size. The bottom dock and the seed tray use the same material. Opaque fallbacks cover missing blur support, reduced transparency and forced colors. Dialogs keep the close button outside the scrolling body. `index.html` ships a splash inside `#root`; the profile list shows a labelled skeleton; the save indicator pairs an icon with text.

## Offline and rendering

The service worker precaches the shell and bundled assets. Nunito font files are referenced from CSS rather than HTML, so the build lists every bundled `.woff2` in the worker for offline use. Cache IDs depend on build contents; new workers wait for old tabs to close rather than interrupt play. SVG scales with a bounded scene ratio; reduced-motion disables animations. Audio starts only after user interaction and is throttled. Speech uses a Vietnamese voice when available, otherwise visual feedback and synthesized effects remain usable.
