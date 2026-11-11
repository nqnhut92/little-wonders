[Tiếng Việt](AGENTS.vi.md)

# Engineering instructions

Use the existing checkout; do not create worktrees unless requested. Use Node 22+, `npm ci`, typecheck, lint, Vitest, docs checks and build. Run Playwright for interaction changes.

Keep child-facing text and speech Vietnamese. README, engineering/product documents and artwork handoffs must have synchronized English/Vietnamese pairs; follow `docs/DOCUMENTATION.md`. Update both and run `npm run docs:sync` after semantic review, then `npm run docs:check`.

Engineering tooling uses English: GitHub Actions workflow, job and step names, test descriptions and commit messages. Vietnamese-only language applies to child-facing gameplay; documentation remains paired EN/VI.

Keep rules in `src/game`, content in `src/data`, assets in `Art.tsx`, and persistence/audio in `src/services`. No database calls in renderers. Validate sessions and ownership server-side. Never log/commit credentials. Preserve pending local progress on API failure. Discoveries merge by union; conflict changes require compatible migrations/tests.

Use stable asset IDs and update both artwork handoffs when assets or animation mappings change. No logic or text baked into art. No advertising, behavioral tracking, penalties, streaks, countdowns or Parent Mode.

Commit identity: Nicholas Nguyen <134213451+nqnhut92@users.noreply.github.com>. Do not sign commits. Push only when authorized in the current conversation, directly to main according to git-main-workflow.
