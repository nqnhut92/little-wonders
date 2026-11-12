[Tiếng Việt](PROVENANCE.vi.md)

# Asset provenance

All in-game illustrations, characters, crops, cooked dishes, region backdrops, valley-map landmarks and UI controls are original project-authored SVG artwork in `src/components/ArtFlat.tsx`, `src/components/ArtFlatMore.tsx` and `src/components/SceneBackdrop.tsx`. No third-party character or generated raster image is bundled.

`public/favicon.svg` is the project-authored vector master of the app icon (Lucky the white puppy with a small purple bow hugging a slice of watermelon). `scripts/make-icons.mjs` renders `public/favicon.ico`, `public/icon-32.png`, `public/icon-180.png`, `public/icon-192.png`, `public/icon-512.png` and the maskable icons from that master.

The interface font is Nunito, bundled from `@fontsource/nunito` (SIL Open Font License 1.1) with the `latin` and `vietnamese` subsets at weights 400, 600, 700 and 800. Interface icons in `src/components/Icons.tsx` were authored for this project; the Google mark on the sign-in button is Google's logo and is used only to identify that provider.

Background music is third-party and dedicated to the public domain under Creative Commons Zero (CC0 1.0), downloaded from OpenGameArt.org on 2026-11-12:

- `public/assets/music-valley.m4a` (valley map): "Children's March Theme" by Cleyton Kauffman, <https://opengameart.org/content/childrens-march-theme>. Re-encoded from the author's WAV to mono AAC at 80 kbps.
- `public/assets/music-play.mp3` (inside a region): "Happy Lullaby (song17)" by cynicmusic (cynicmusic.com, pixelsphere.org), <https://opengameart.org/content/happy-lullaby-song17>. The author's MP3, unmodified.

Spoken Vietnamese narration clips in `public/assets/voice/*.m4a` are pre-generated locally via `scripts/generate-voice.mjs` using [VietVoice-TTS](https://github.com/nguyenvulebinh/VietVoice-TTS) (MIT License), Southern female conversational preset `#170` (`0.85x` speed, 48 kbps mono AAC), mapped in `src/data/voiceManifest.ts`.
