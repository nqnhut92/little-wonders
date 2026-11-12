[Tiếng Việt](ARTWORK_HANDOFF.vi.md)

# Artwork handoff for Gemini

## Direction and current status

No production artwork or Gemini images have been generated. The game uses coherent temporary authored vectors and remains playable without an art upgrade. Update both language versions whenever an asset or its interaction changes.

Flat, friendly storybook for Vietnamese children aged 4–6: expressive chibi proportions, simple rounded shapes, bright flat fills, layered soft shade, big sparkling eyes #3b2d28 with dual white highlights, curved eyebrows, cheerful open smiles, sculpted paws with pink pads, and rosy cheeks #ff9ea2. Sky #bfe6f7, grass #8fd083, yellow #ffc93c, red #f0605d, blue #5fb4e0, purple #9b6bd6, cream-white puppy #fff7e8 with a small purple bow #9b6bd6. Avoid harsh contrast, frightening faces, tiny noisy detail, text, logos and watermarks.

## Complete inventory and file specifications

All following object IDs currently live in `src/components/Art.tsx`, using `Art` with viewBox 0 0 120 120. There are no separate current object files. Each target filename is ID.png under `public/assets/`: 512×512, 1:1, transparent PNG RGBA; optional clean SVG master. Keep 7% padding, the established silhouette, and bottom-center anchor near (60,112). Do not crop transparent margins or derive hitboxes from alpha.

| ID / target filename                                                                                                                                                                 | Purpose and interaction                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| tree / tree.png                                                                                                                                                                      | Apple tree: shake canopy, falling apple                           |
| cloud / cloud.png                                                                                                                                                                    | Movable cloud; rain on touch/drop                                 |
| sun / sun.png                                                                                                                                                                        | Sunshine source; touch/drop on beds                               |
| flower / flower.png                                                                                                                                                                  | Sunflower, garden flower, seed selector, decoration, brand        |
| carrot / carrot.png                                                                                                                                                                  | Seed selector, grown crop, lunch food/request                     |
| berry / berry.png                                                                                                                                                                    | Seed selector, grown crop, lunch food/request                     |
| butterfly / butterfly.png                                                                                                                                                            | Garden visitor, decoration, notebook                              |
| worm / worm.png                                                                                                                                                                      | Creature revealed from grass                                      |
| bug / bug.png                                                                                                                                                                        | Ladybug; shared cricket notebook illustration                     |
| bird / bird.png                                                                                                                                                                      | Branch bird; chirp and hop                                        |
| puppy / puppy.png                                                                                                                                                                    | Lucky: garden, guide and meal character; happy/thinking responses |
| reindeer / reindeer.png                                                                                                                                                              | Second friend: wishes, gifts and story chapters                   |
| fish / fish.png                                                                                                                                                                      | Revealed pond fish; swim reaction                                 |
| apple / apple.png                                                                                                                                                                    | Falling fruit, lunch food/request                                 |
| house / house.png                                                                                                                                                                    | Main garden and editor; five wall colors                          |
| rainbow / rainbow.png                                                                                                                                                                | Persistent rain+sun discovery backdrop                            |
| rock / rock.png                                                                                                                                                                      | Tilt to reveal ladybug                                            |
| grass / grass.png                                                                                                                                                                    | Rustling bush and plant sprout proxy                              |
| pond / pond.png                                                                                                                                                                      | Water surface, lily leaf and ripples                              |
| basket / basket.png                                                                                                                                                                  | Lunch drop target; count indicators rendered separately           |
| star / star.png                                                                                                                                                                      | House decoration and positive meal sparkle                        |
| dish-soup, dish-jam, dish-salad, dish-pie, dish-juice, dish-corncake, dish-applesauce, dish-pumpkinsoup, dish-cornsoup, dish-fruitbowl, dish-tea, dish-smoothie, dish-mystery (.png) | Cooked dishes: kitchen result, basket, gifts (temporary bowl)     |
| tomato / tomato.png                                                                                                                                                                  | Crop: seed button, ripe plant, basket (temporary vector)          |
| pumpkin / pumpkin.png                                                                                                                                                                | Crop: seed button, ripe plant, basket (temporary vector)          |
| corn / corn.png                                                                                                                                                                      | Crop: seed button, ripe plant, basket (temporary vector)          |
| watermelon / watermelon.png                                                                                                                                                          | Crop: seed button, ripe plant, basket; the puppy's favorite       |
| puppy / puppy.png                                                                                                                                                                    | Lucky the main chubby white cartoon puppy (loves watermelon)      |
| reindeer / reindeer.png                                                                                                                                                              | Little baby reindeer companion (arrives after first harvest)      |
| decor-sunflower, decor-pumpkin-lamp (.png)                                                                                                                                           | House v2 unlocked decorations (pumpkin lamp glows at night)       |
| owl, frog, snail, duck, dragonfly (.png)                                                                                                                                             | Night owl, shifting critters and lotus pond creatures             |
| windmill, xylophone (.png)                                                                                                                                                           | Interactive garden toys (spinning blades, 8-bar pentatonic)       |
| fx-moon, fx-firefly, fx-shooting-star (.png)                                                                                                                                         | Night scene sky moon, pointer firefly and shooting star           |
| lotus, waterlily, pond-lantern (.png)                                                                                                                                                | Ao sen (region 2) aquatic crops and floating lantern              |

Backgrounds currently live in `src/style.module.css`, colored by the `--scene-*` tokens in `src/styles/tokens.css`; target output is PNG (optional SVG master). These filenames describe future replacement files, not existing files.

| Target         | Size / ratio     | Background  | Purpose / current selector  |
| -------------- | ---------------- | ----------- | --------------------------- |
| sky.png        | 2400×1400 / 12:7 | opaque      | Sky gradient / .garden      |
| hill-back.png  | 2400×1400 / 12:7 | transparent | Distant hill / .hill-back   |
| hill-front.png | 2400×1400 / 12:7 | transparent | Near hill / .hill-front     |
| path.png       | 1200×1400 / 6:7  | transparent | Ground path / .path         |
| soil.png       | 512×256 / 2:1    | transparent | Bed / .soil                 |
| house-yard.png | 1160×560 / 29:14 | opaque      | Editor yard / .house-canvas |

Existing app icons: `public/favicon.ico` (16/32/48), `public/favicon.svg`, `public/icon-32.png`, `public/icon-180.png` (full-bleed opaque), `public/icon-192.png`, `public/icon-512.png` and `public/icon-maskable-192.png`/`-512.png` (artwork inside the central 80% safe zone), rendered by `scripts/make-icons.mjs` from the vector master `public/favicon.svg`: flat Lucky with the purple bow hugging a watermelon, with a sunflower, a carrot and sparkles on a sunburst sky (`PROVENANCE.md`). They have no animation. UI text, settings/audio/notebook controls, dots, plus signs, focus rings and hint arrows are rendered by the app, not generated inside illustrations. The friend's thought bubble reuses food IDs; happy sparkle reuses star. Outdoor decorations reuse the saved flower/butterfly/star IDs.

## One drawn style (current status)

Every in-game picture is now a project-authored vector in `src/components/Art.tsx`, with drawn backdrops and the valley map in `src/components/SceneBackdrop.tsx`, all in one flat style: flat fills, no outlines and no texture filters (`ArtFlat.tsx` and `ArtFlatMore.tsx` hold the drawings; `PaintFilters.tsx` keeps only the glow used by lights). Lucky wears a small purple bow, not a collar. The Gemini illustrations that shipped briefly (backgrounds, valley map, Lucky, reindeer, house, tree, sun, cloud, flower, basket, rock, owl, frog and an unused rabbit) are kept in `art-archive/gemini/` and are not bundled. The app icon uses the same flat Lucky. Replacement art must come as one complete, consistent set; do not mix a few painted images back in.

## Later regions (temporary vectors)

Forest, beach, snowy hill and starry mountain use drawn SVG backdrops (`src/components/SceneBackdrop.tsx`) and vector placeholders in `Art.tsx`. Replacement targets, same object rules as above (512×512 transparent, bottom-center anchor):

| Region          | IDs                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Forest          | blueberry, chestnut, mushroom-house (decorative only, never shown as food), leafpile, hedgehog, squirrel, woodpecker                    |
| Beach           | coconut-tree, coconut, shell, sand, crab, sandcastle-1 (mound with bucket and spade), sandcastle-2, sandcastle-3, wave, turtle, seagull |
| Snowy hill      | pine-snow, pinecone, snowman-1, snowman-2, snowman-3, polar-bear (cub, soft and round), penguin, sled, snowflake                        |
| Starry mountain | telescope, moon-face, constellation-1 to constellation-4 (Lucky the puppy traced star by star; keep the star positions), star-lantern   |
| Kitchen         | dish-coconut, dish-chestnut                                                                                                             |

Backgrounds: bg-forest, bg-beach, bg-snow and bg-stars, 3200×1800 opaque, important shapes in the central 60%, a night version for forest, beach and snow (the starry mountain is always night). Keep the lower-left guide area and the right-hand control column calm.

## Interface frame around the artwork

The interface follows Light, Dark and System appearance; artwork does not. Deliver one version of each asset. It must read well next to both frames.

| Token         | Light   | Dark    | Use                                  |
| ------------- | ------- | ------- | ------------------------------------ |
| `--bg`        | #faf8ee | #131b1a | Page behind the scene                |
| `--surface`   | #fffbee | #1d2826 | Dialogs and panels                   |
| `--surface-2` | #f2f1df | #27342f | Tiles and quiet buttons              |
| `--text`      | #3b523f | #e8eedd | Interface text                       |
| `--muted`     | #5a6f5b | #adbcaa | Secondary text                       |
| `--accent`    | #52684e | #a8cf8f | Primary action, focus ring           |
| `--plate`     | #fff9e9 | #e9ecd9 | Light plate behind artwork on panels |

- The scene fills the whole screen, from about 4:3 (iPad) to 21:9 (ultra-wide desktop). Backgrounds must extend to every edge and survive cropping; objects scale with the smaller of the width and 1.9 x the height. Controls float at the top left (guide, about 460×72px) and down the top right (a 70px column); keep important background detail out of those areas.
- Glass panels float on the scene (seed tray, guide). Artwork behind them is blurred and lightened; do not rely on detail there.
- On dialogs, artwork sits on the light plate in both appearances, so pale shapes stay visible. Do not add your own backing shape or shadow.
- A night version of the scene backgrounds and the dimmed map areas for regions marked as coming soon will be specified here when those features are built.
- Interface icons (speaker, notebook, settings, hint, close, save state, appearance) are repository vectors in `src/components/Icons.tsx` and are not part of this handoff.
- The app icon follows the game art: `public/favicon.svg` is the vector master, the 180px Apple icon is full-bleed opaque, and the maskable versions keep Lucky inside the central 80%. Edit the master, then run `node scripts/make-icons.mjs`.

## Character consistency

Lucky the puppy: small, chubby and cream-white, round head, floppy tan ears, dot eyes with a highlight, small dark nose, pink tongue and pink cheeks, a small purple bow at the neck, short curled tail; a rounded cartoon, not a realistic dog. The little reindeer: warm brown, cream belly and muzzle, two small antlers, a red-brown nose and pink cheeks. No clothing changes between poses. Keep head/ear proportions from the reference SVG. Bird: blue-gray oval body, right-facing yellow beak and short legs. Butterfly: pink upper wings, yellow lower wings, thin moss body and two antennae. Ladybug: terracotta shell with moss spots; worm pale green; fish orange-yellow facing right. Cloud and sun have dot eyes and gentle smiles. Approve a reference sheet first; reuse model references/seeds where supported.

## Animation and layers

Current animation is CSS, not sprite sheets. The required first deliverable is one matching static pose per ID that preserves CSS pivots. Optional future sprites must keep identical canvas/pivots: idle 2–4 frames at 4–6 fps for puppy/reindeer/bird/fish/worm; touch 3–4 frames under 0.8 seconds; butterfly/fish movement 4 frames; discovery 3 gentle frames. Provide an unmistakable static first frame for reduced motion. No flashing or moving collision regions.

Separate tree trunk/canopy/apple; cloud body/face and rain drops (3 frames); pond rim/water/ripples/leaf and fish; house roof/wall recolor mask/door/windows; all decorations independently. Plant stages share a bottom anchor; the current sprout uses grass. The friend's happy reaction uses a CSS hop and separate star; thinking uses a gentle tilt and food bubble. Keep these layers separate from the character artwork.

Layer order: sky, rainbow, distant hill, near hill/path, tree/house, pond/grass/rock, animals, beds/plants, seed tray, hints, drag ghost, modal. Outdoor decorations are a scaled 2:1 yard overlay matching the editor arrangement. Layer exceptions belong in renderer code, never baked into a background.

## Interaction mapping

`Garden.tsx` owns button hitboxes, scene coordinates and pointer capture. `data-soil` identifies beds: seed drops plant, cloud drops water, sun drops warm. Taps treat all beds. `Activities.tsx` owns `data-basket`, count dots and the house yard's percentage positions. Artwork never contains game logic. Keep public Art props `id`/`color`, stable IDs, touch labels, z-index and drop target attributes when replacing art.

## Copy-ready Gemini prompt

> Create replacement artwork for Little Wonders, a Vietnamese children's garden game for ages 4–6. Use a flat, friendly storybook style: simple rounded shapes, bright flat fills, no outlines, one darker tone for shade, big dot eyes with a highlight. Sky #bfe6f7, grass #8fd083, yellow #ffc93c, red #f0605d, cream-white puppy #fff6e5 with cheeks #ffb3a7. Images must remain clear at 60–200 displayed pixels. No text, logos or watermarks. Do not imitate a living artist or use commercial characters.
>
> Match the supplied project-owned SVG references. Lucky the puppy: small, chubby and cream-white, round head, floppy tan ears, dot eyes with a highlight, small dark nose, pink tongue and pink cheeks, a small purple bow at the neck, short curled tail; a rounded cartoon, not a realistic dog. The little reindeer: warm brown, cream belly and muzzle, two small antlers, a red-brown nose and pink cheeks. Bird blue-gray/yellow beak; butterfly pink upper/yellow lower wings; ladybug terracotta/moss spots; worm pale green; fish orange-yellow facing right. Keep proportions, shapes and palette identical across poses. First provide a character reference sheet for approval, then separate asset files.
>
> Object IDs: tree, cloud, sun, flower, carrot, berry, butterfly, worm, bug, bird, puppy, reindeer, fish, apple, house, rainbow, rock, grass, pond, basket, star, tomato, pumpkin, corn, watermelon. Output each as ID.png, transparent RGBA 512×512 with about 7% padding and bottom-center anchor matching (60,112) in the existing 120×120 canvas. Do not crop or change aspect ratio. Carrot must stay unmistakably orange; berries red/pink. House needs a separate wall recolor mask. Separate trunk/canopy/apple, cloud/rain, pond rim/water/ripple/leaf/fish, roof/walls/doors and decorations. Do not bake in UI, touch zones or game logic.
>
> Backgrounds: sky 2400×1400 opaque; hill-back and hill-front 2400×1400 transparent; path 1200×1400 transparent; soil 512×256 transparent; house-yard 1160×560 opaque. Do not draw interactive creatures into backgrounds. Optional sprites: idle 2–4 frames, touch 3–4, butterfly/fish movement 4, rain 3, gentle discovery 3. Every frame shares canvas/pivot. Static ID.png poses are mandatory because the MVP currently uses CSS animation. Name extra frames ID-idle-01.png, ID-touch-01.png, ID-move-01.png or ID-discover-01.png; provide a separate frame-rate manifest and reduced-motion pose.
>
> Use only content permitted for public distribution. Record model, generation date, full prompt, project-owned reference sources, applicable usage terms and edits. Do not assert rights without checking current terms. Avoid unclear third-party sources.

## Replacement checklist

- [ ] Record provenance/rights in both `public/assets/PROVENANCE` documents.
- [ ] Approve reference consistency, child suitability and absence of text.
- [ ] Save under stable IDs in `public/assets`; preserve Art props, dimensions, pivots and labels.
- [ ] Preserve DOM hitboxes, data-soil/data-basket, pointer capture, stacking and percentage positions.
- [ ] Verify all five wall colors, old saved arrangements, outdoor decoration scale and the friend feedback layers.
- [ ] Check iPad/desktop bounds, touch/drag and reduced motion.
- [ ] Add new image inventory to service-worker precaching and content hashing when URLs are not hashed; bundle-only precaching does not automatically include new PNGs.
- [ ] Run typecheck, lint, tests, build, Playwright and offline checks; verify PNG app icons/manifest.
- [ ] Update both handoffs and provenance; mark complete only when gameplay and restoration still work.
