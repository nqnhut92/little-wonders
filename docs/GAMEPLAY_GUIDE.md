[Tiếng Việt](GAMEPLAY_GUIDE.vi.md)

# Gameplay & QA Testing Guide (Little Wonders)

This document lists every feature, control, hotspot and rule currently implemented in the codebase for manual playtesting and bug verification.

## 1. Valley Map & Region Unlocking

- The game opens on the **Valley Map** with 6 regions: **Vườn nhà** (Home Garden), **Ao sen** (Lotus Pond), **Rừng nhỏ** (Small Forest), **Bãi biển** (Sunny Beach), **Đồi tuyết** (Snowy Hill), and **Núi sao** (Starry Mountain).
- **Current status**: Only **Vườn nhà** (`ready: true`) is open for regular play. The other 5 regions currently have `ready: false` (shown as **Coming soon**).
- **How to test the 5 later regions**: Open the **Adult Corner** (gear button at the bottom right of the map) → pass the math gate (`7 + 5 = 12`) → **Dọn khu vườn** tab → toggle **Bật Dev mode**. Dev mode temporarily opens all 6 regions for inspection without persisting progress to the real profile.
- **Unlock rule (when `ready: true`)**: Finding **85%** of a region's `counted` discoveries (`src/data/regions.ts`) unlocks the next region. Unlocked regions never relock; chance-based discoveries (`rare_*`, `shooting_star`) are excluded from the denominator.

## 2. HUD & Global Controls

- **Top-left**:
  - **Back to map** button (visible only inside a region).
  - **Lucky** guide bar with the lightbulb **Hint** button (tap to cycle and speak hints).
- **Top-right**:
  - **Sound On/Off** (defaults to **off**, stored per browser): toggles sound effects, Vietnamese voice clips and background music (cross-fading between map and region tracks).
  - **Discovery Notebook** (`Sổ khám phá`): shows all recorded discoveries (crops, pals, events, dishes, story chapters).
  - **Garden Kitchen** (`Bếp của vườn`, visible only inside a region).
  - **Day / Night toggle** (visible only inside a region, synced via `scene.time`): switches scene palettes and time-of-day hotspots.
- **Bottom-right (map only)**: **Adult Corner** gear button.
- **Portrait touch screens**: Displays a full-screen rotate prompt (`Con xoay màn hình ngang để nhìn cả khu vườn nhé!`).

## 3. Gardening, Care & Harvest

Available in regions with soil beds (**Vườn nhà**, **Ao sen**, **Rừng nhỏ**). **Bãi biển**, **Đồi tuyết**, and **Núi sao** hide the seed tray automatically.

1. **Soil beds**: Starts with **3 beds**, expanding up to **6 beds** as distinct crops are harvested.
2. **Planting**: Pick a seed from the bottom tray and tap an empty bed (stage `0 → 1`).
   - **Vườn nhà (7 crops)**: Hướng dương, Cà rốt, Dâu, Cà chua, Bí ngô, Bắp, Dưa hấu.
   - **Ao sen (2 crops)**: Hoa sen, Hoa súng.
   - **Rừng nhỏ (2 crops)**: Việt quất, Hạt dẻ.
3. **Water & Sun**: Drag or tap **Rain cloud** (water) and **Sun** (warmth) onto planted beds. Each full water + sun round advances growth by one stage (`1 Seed → 2 Sprout → 3 Grown → 4 Ripe`).
4. **Harvest**: Tap a ripe crop (stage 4) to add it to the **basket** (max **9** per item).
5. **Rare variants (chance-based)**: Harvesting has a small chance to record `rare_carrot_twin`, `rare_pumpkin_giant`, or `rare_berry_heart`.
6. **Direct gathering (`gather`)**: Tap the apple tree (Vườn nhà), coconut palm or shells (Bãi biển), or snowy pine (Đồi tuyết) to add items directly to the basket.

## 4. Garden Kitchen (17 Recipes + Surprise Dish)

Tap the **Pot** icon at the top right to open the Kitchen. Combine **1 to 3 ingredients** from the basket:

| Dish                | Required ingredients           |
| :------------------ | :----------------------------- |
| Nước ép dưa hấu     | Dưa hấu (1)                    |
| Nước dừa mát lạnh   | Dừa (1)                        |
| Súp cà chua cà rốt  | Cà rốt + Cà chua               |
| Mứt dâu             | Dâu + Dâu                      |
| Bánh táo bí ngô     | Táo + Bí ngô                   |
| Bánh bắp ngọt       | Bắp + Bắp                      |
| Táo nghiền mật ngọt | Táo + Táo                      |
| Súp bí ngô cà rốt   | Cà rốt + Bí ngô                |
| Súp bắp bí ngô      | Bắp + Bí ngô                   |
| Trà hoa hướng dương | Hướng dương + Hướng dương      |
| Sinh tố dưa hấu dâu | Dưa hấu + Dâu                  |
| Hạt dẻ nướng thơm   | Hạt dẻ + Hạt dẻ                |
| Mứt việt quất       | Việt quất + Việt quất          |
| Trà thông ấm áp     | Táo + Quả thông                |
| Salad nhiều màu     | Dâu + Cà rốt + Cà chua         |
| Tô trái cây mát     | Táo + Dâu + Dưa hấu            |
| Bánh ánh sao        | Táo + Việt quất + Hướng dương  |
| **Món bất ngờ**     | Any other 1–3 item combination |

## 5. Companions (`Pals`) & Story Chapters

There are **7 companions** (`Lucky`, `Tuần Lộc nhỏ`, `Capybara`, `Sóc nhỏ`, `Rùa con`, `Cánh cụt`, `Cú mèo`). Each companion:

- Has a non-expiring **food wish** and basic table snacks (`freeFoods`, except Tuần Lộc nhỏ) so children can always gift food even with an empty basket.
- Any gift increments `n.gift_<id>` and unlocks **3 story chapters** at **1, 3, and 6** gifts.
- Matching the active wish advances to the next wish in the list.

| Companion        | Appears when                         | Wishes                                                              |
| :--------------- | :----------------------------------- | :------------------------------------------------------------------ |
| **Lucky**        | Present in Vườn nhà from start       | Dưa hấu, Táo, Cà rốt, Nước ép dưa hấu                               |
| **Tuần Lộc nhỏ** | After the first harvest              | Dưa hấu, Cà rốt, Táo, Tô trái cây mát                               |
| **Capybara**     | Met at Ao sen (also visits Vườn nhà) | Dưa hấu, Hoa sen, Bắp, Trà hoa hướng dương                          |
| **Sóc nhỏ**      | Met at Rừng nhỏ                      | Hạt dẻ, Việt quất, Hạt dẻ nướng thơm, Mứt việt quất                 |
| **Rùa con**      | Met at Bãi biển                      | Dừa, Nước dừa mát lạnh, Dưa hấu, Nước ép dưa hấu                    |
| **Cánh cụt**     | Met at Đồi tuyết                     | Trà thông ấm áp, Táo nghiền mật ngọt, Súp bí ngô cà rốt, Táo        |
| **Cú mèo**       | Met at Núi sao                       | Bánh ánh sao, Trà hoa hướng dương, Hướng dương, Sinh tố dưa hấu dâu |

## 6. Color House & Interactive Toys

- **Color House** (tap the house in Vườn nhà):
  - Switch between **5 wall colors**.
  - Place up to **30 decorations** in the garden.
- **Pentatonic Xylophone** (Vườn nhà & Ao sen): **8 bars**, supports multi-touch.
- **Windmill** (Vườn nhà): Tap to spin.

## 7. Region Hotspots

Some hotspots are **reveal pairs** (`reveal` → `revealed`): tap the cover object first to uncover the critter. Some only appear during daytime (`dayOnly`) or nighttime (`nightOnly`).

### Vườn nhà (Home Garden)

- **Cây táo** (`tree`): Shake to drop an apple into the basket.
- **Chim trên cành** (`dayOnly`), **Cú mèo trên cành** (`nightOnly`).
- **Chong chóng**, **Ngôi Nhà Sắc Màu**, **Đàn gỗ**.
- **Ao nước** → reveals **Cá nhỏ**.
- **Đá có bọ rùa** → reveals **Bọ rùa**.
- **Bụi cỏ có tiếng dế** → reveals **Sâu nhỏ**.
- **Hoa bên nhà** → reveals **Bướm** (`dayOnly`).
- **Góc Của Lucky**, **Bạn Tuần Lộc nhỏ** (once unlocked), **Bạn Capybara** (once met).
- **Nighttime**: Interactive **fireflies** follow touch/pointer movement in the sky.

### Ao sen (Lotus Pond)

- **Mặt ao sen** → reveals **Cá trong ao sen**.
- **Vịt con**, **Chuồn chuồn**, **Ếch xanh**, **Đèn hoa đăng**, **Bạn Capybara**, **Đàn gỗ bên ao**.

### Rừng nhỏ (Small Forest)

- **Nhà nấm tí hon**, **Chim gõ kiến**.
- **Đống lá khô** → reveals **Bạn nhím**.
- **Bạn Sóc nhỏ**.
- **Cú mèo trong rừng** (`nightOnly`), **Đom đóm** (`nightOnly`).

### Bãi biển (Sunny Beach)

- **Cây dừa** (`gather` → Dừa), **Vỏ sò** (`gather` → Vỏ sò).
- **Lâu đài cát** (`build`, 3 taps to complete and record discovery).
- **Ụ cát nhỏ** → reveals **Bạn cua**.
- **Sóng biển**, **Chim hải âu**, **Bạn Rùa con**.

### Đồi tuyết (Snowy Hill)

- **Cây thông phủ tuyết** (`gather` → Quả thông).
- **Người tuyết** (`build`, 3 taps to complete).
- **Gấu bông tuyết**, **Xe trượt tuyết**, **Bông tuyết**, **Bạn Cánh cụt**.

### Núi sao (Starry Mountain)

- Note: No daytime sun or rain cloud (`sky: false`).
- **Kính thiên văn**, **Ông trăng**, **Đèn ngôi sao**, **Bạn Cú mèo**, **Sao băng**.
- **Chòm sao** (`build`, 4 taps to complete).

## 8. Idle Surprise Events & Seasonal Events

- **Idle surprises**: After ~45–90 seconds without interaction:
  - **Daytime**: Butterflies, Lucky waving, or Rainbow (if both `rain` and `sun` have been discovered).
  - **Nighttime**: **Shooting star** (`shooting_star`, recorded in the Notebook) or Lucky waving.
- **Seasonal events (`src/game/seasons.ts`)**:
  - Automatically detected from the lunar calendar: **Tết** (lunar month 12 days 28+ or month 1 days 1–7) shows _Hoa mai ngày Tết_; **Trung thu** (lunar month 8 days 13–16) shows _Đèn ông sao Trung thu_.
  - **Quick browser testing**: Append `?season=tet` or `?season=mid_autumn` to the URL (e.g. `http://localhost:5173/?season=tet`).

## 9. Adult Corner (`AdultCorner`)

Accessible only from the **Valley Map** (bottom-right gear button), gated by `7 + 5 = 12`:

- **Lưu khu vườn tab**:
  - Displays local save / cloud sync status.
  - **Tiếp tục với Google**: Under `npm run dev`, signs into a local test parent backed by PGlite (`.local-db/`) to test child profile creation/switching/deletion and multi-tab sync without configuring Google OAuth or Neon.
- **Dọn khu vườn tab**:
  - **Dọn lại một khu**: Clears planted beds (and decorations for Vườn nhà) for that region while preserving the Notebook, companions, basket and unlocked regions.
  - **Bắt đầu lại tất cả**: Resets all progress back to a fresh state.
  - **Dev mode**: Temporarily unlocks all 6 regions for testing.
