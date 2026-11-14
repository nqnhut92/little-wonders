[Tiếng Việt](AGENTS.vi.md)

# Engineering instructions

Use the existing checkout; do not create worktrees unless requested. Use Node 22+, `npm ci`, typecheck, lint, `npm run format:check`, Vitest, docs checks and build. Format with `npm run format` (Prettier) before committing. Run Playwright for interaction changes.

Keep child-facing text and speech Vietnamese. README and engineering/product documents must have synchronized English/Vietnamese pairs with top-of-file partner links. Update both and run `npm run docs:sync` after semantic review, then `npm run docs:check`.

Engineering tooling uses English: GitHub Actions workflow, job and step names, test descriptions and commit messages. Vietnamese-only language applies to child-facing gameplay; documentation remains paired EN/VI.

Keep rules in `src/game`, content in `src/data`, assets in `Art.tsx`, and persistence/audio in `src/services`. No database calls in renderers. Validate sessions and ownership server-side. Never log/commit credentials. Preserve pending local progress on API failure. Discoveries merge by union; conflict changes require compatible migrations/tests.

Spoken Southern Vietnamese voice clips in `public/assets/voice/*.m4a` are pre-generated locally by `npm run voice:sync` (`scripts/generate-voice.mjs`: incremental content-hashed clips using VietVoice-TTS MIT preset `#170` at `0.85x`, `nfe=32`, `!` normalized to `.`, encoded to 48 kbps mono AAC). Whenever adding or editing child-facing spoken lines, run `npm run voice:sync -- --prune --clean` to generate only missing clips, update `src/data/voiceManifest.ts`, and delete temporary `/tmp` model caches; never commit model checkpoints or Python virtual environments.

Use stable asset IDs across `src/components/Art.tsx`, `src/components/ArtFlat.tsx`, `src/components/ArtFlatMore.tsx` and `src/components/SceneBackdrop.tsx`. No logic or text baked into art. No advertising, behavioral tracking, penalties, streaks, countdowns or Parent Mode.

Keep gameplay scenes responsive and aligned with background artwork across aspect ratios (iPad 4:3, iPad Pro ~1.43, PC 16:9) by encapsulating backdrop SVGs and interactive hotspots/characters within a centered 16:9 stage (`.garden-stage`, height 100vh/100dvh). Keep hotspot coordinates within the visible 4:3 boundary (x between 13% and 87%) so interactive items never clip off-screen. For touch drag-and-drop interactions, enforce `touch-action: none` (CSS and inline styles), prevent default on `pointerdown` to block WebKit gesture scrolling, wrap `setPointerCapture`/`releasePointerCapture` in `try / catch`, and allow boundary touch margins for child fingers.

Commit identity: Nicholas Nguyen <134213451+nqnhut92@users.noreply.github.com>. Do not sign commits. Push only when authorized in the current conversation, directly to main according to git-main-workflow.
