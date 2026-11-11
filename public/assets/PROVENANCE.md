[Tiếng Việt](PROVENANCE.vi.md)

# Asset provenance

Current temporary in-game vector artwork was authored directly in `src/components/Art.tsx`; backgrounds use `src/style.module.css`. No third-party copyrighted character was intentionally incorporated. The repository owner must choose a distribution license before broad release.

App icons (`public/favicon.ico`, `public/icon-32.png`, `public/icon-180.png`, `public/icon-192.png`, `public/icon-512.png`) were exported on 2026-11-11 from a Gemini-generated 1:1 storybook illustration (cream baby rabbit with pink cheeks and moss outlines hugging a golden sunflower on a full-bleed sunlit meadow background, no text/borders, resized cleanly with `sips` and packed to ICO). For future Gemini replacements of in-game artwork, record model, date, prompt, reference sources, applicable usage terms and subsequent edits. Do not assume generated content automatically has unrestricted rights. Follow the bilingual artwork handoff in `docs`.

`public/favicon.svg`, `public/icon-maskable-192.png` and `public/icon-maskable-512.png` are derived from `public/icon-512.png` by `scripts/make-icons.mjs` (2026-11-11): the SVG wraps a 128px copy with rounded corners; the maskable icons place the illustration at 78% over a blurred copy of itself. No new generated content was added.

The interface font is Nunito, bundled from the `@fontsource/nunito` package (SIL Open Font License 1.1) with the `latin` and `vietnamese` subsets at weights 400, 600, 700 and 800. Interface icons in `src/components/Icons.tsx` were authored for this project; the Google mark on the sign-in button is Google's logo and is used only to identify that provider.
