[Tiếng Việt](DOCUMENTATION.vi.md)

# Bilingual documentation contract

`README.md`, `AGENTS.md`, every `docs/*.md` document and asset provenance have an English base file and a Vietnamese `.vi.md` counterpart. Both contain the same functionality, limitations, commands and decisions; child-facing game content stays Vietnamese only. Each file links to its partner.

For every code/asset change, identify affected documents, update both languages, check links and review meaning. Artwork changes must update both handoff files. Run `npm run docs:sync` only after reviewing both versions; it records paired SHA-256 hashes in `docs/.translations.json`. For an existing pair, updating just one file is rejected. For a deliberate correction in one language, review and adjust the paired document too, documenting the equivalent clarification.

`npm run docs:check` discovers all pairs and fails on missing files, missing partner links, missing records or changed hashes. CI runs it before build. New documents must be paired and registered. Do not update the manifest merely to silence a failure. This detects stale versions; it cannot prove semantic translation accuracy. Human/agent review remains required.
