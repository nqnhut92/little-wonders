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
- `api/index.ts` and `api/_lib/security.ts`: OAuth, signed sessions, ownership and CSRF.

## Persistence and conflicts

World schema 1 stores discovery IDs and stamped fields `{value,clock,device}`. Discoveries merge by union. New edits use a logical counter beyond all observed clocks, not the wall clock. A random writer ID is generated per app mount so separate tabs cannot create identical writer/clock pairs. Equal clocks use lexicographic writer order. Existing timestamp-sized clocks remain compatible: subsequent edits advance beyond them.

Storage events merge changes from other tabs only for the same profile. Different profiles retain separate backups. Requests for a previously selected profile cannot replace the current selection. Pending meal state, completed meals, planted beds, wall color and decorations are durable. Important changes persist immediately, then batch; network/401 failures retain pending changes. Retry runs on reconnect and every 30 seconds.

Server UPDATE merges under the row lock. Identical retries do not increment revision. A field is the conflict unit: concurrent arrangements select one entire arrangement, not a union of decorations. Logical counters preserve observed ordering, not real-time ordering between disconnected devices. Mixed old/new clients and concurrent edits to the same field still need release testing. No tap history is collected.

## Storage and security

`parents` stores only Google subject; `profiles` stores owner, nickname, versioned world JSONB and revision. Discoveries and creations are compact members of that document. `schema_migrations` tracks migrations; `rate_limits` contains short-lived hashed buckets.

Parent identity comes from a signed session, never a client-supplied user ID. Every profile read/write filters by parent ID. POST requires exact Origin and a custom header. OAuth checks signed state, nonce, Google signature, issuer and audience. Cookies are Secure, HttpOnly, SameSite=Lax. Authenticated API responses are no-store and excluded from service-worker caching.

## Offline and rendering

The service worker precaches the shell and bundled assets. Cache IDs depend on build contents; new workers wait for old tabs to close rather than interrupt play. SVG scales with a bounded scene ratio; reduced-motion disables animations. Audio starts only after user interaction and is throttled. Speech uses a Vietnamese voice when available, otherwise visual feedback and synthesized effects remain usable.
