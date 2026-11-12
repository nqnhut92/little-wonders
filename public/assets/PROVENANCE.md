[Tiếng Việt](PROVENANCE.vi.md)

# Asset provenance

All in-game illustrations, characters, crops, cooked dishes, region backdrops, valley-map landmarks and UI controls are original project-authored SVG artwork in `src/components/ArtFlat.tsx`, `src/components/ArtFlatMore.tsx` and `src/components/SceneBackdrop.tsx`. No third-party character or generated raster image is bundled.

`public/favicon.svg` is the project-authored vector master of the app icon (Lucky the white puppy with a small purple bow hugging a slice of watermelon). `scripts/make-icons.mjs` renders `public/favicon.ico`, `public/icon-32.png`, `public/icon-180.png`, `public/icon-192.png`, `public/icon-512.png` and the maskable icons from that master.

The interface font is Nunito, bundled from `@fontsource/nunito` (SIL Open Font License 1.1) with the `latin` and `vietnamese` subsets at weights 400, 600, 700 and 800. Interface icons in `src/components/Icons.tsx` were authored for this project; the Google mark on the sign-in button is Google's logo and is used only to identify that provider.
