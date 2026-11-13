[Tiếng Việt](GAMEPLAY_GUIDE.vi.md)

# Gameplay & QA Testing Guide (Little Wonders)

This document lists every feature, control, hotspot, story and rule currently implemented in the codebase for manual playtesting and bug verification.

## 1. Valley Map & Region Unlocking

- The game opens on the **Valley Map** with 6 regions: **Vườn nhà** (Home Garden), **Ao sen** (Lotus Pond), **Rừng nhỏ** (Small Forest), **Bãi biển** (Sunny Beach), **Đồi tuyết** (Snowy Hill), and **Núi sao** (Starry Mountain).
- **Current status**: Only **Vườn nhà** (`ready: true`) is open for regular play. The other 5 regions currently have `ready: false` (shown as **Coming soon**).
- **How to test the 5 later regions**: Open the **Adult Corner** (gear button at the bottom right of the map) → pass the math gate (`7 + 5 = 12`) → **Dọn khu vườn** tab → toggle **Bật Dev mode**. Dev mode temporarily opens all 6 regions for inspection without persisting progress to the real profile.
- **Unlock rule (when `ready: true`)**: All 6 regions share **the exact same formula**: finding **85%** of a region's core daytime discoveries (`counted` in `src/data/regions.ts`) unlocks the next region. Kitchen dishes, companion story chapters, night-only discoveries, secondary crops and chance-based discoveries (`rare_*`, `shooting_star`) are bonus uncounted discoveries:
  - **Vườn nhà**: `14` counted → **12** needed
  - **Ao sen**: `13` counted → **12** needed
  - **Rừng nhỏ**: `11` counted → **10** needed
  - **Bãi biển**: `13` counted → **12** needed
  - **Đồi tuyết**: `13` counted → **12** needed
  - **Núi sao**: `11` counted → **10** needed

## 2. HUD & Global Controls

- **Top-left**:
  - **Back to map** button (visible only inside a region).
  - **Lucky** guide bar with the lightbulb **Hint** button (tap to cycle and speak hints).
- **Top-right**:
  - **Sound On/Off** (defaults to **off**, stored per browser): toggles sound effects, Vietnamese voice clips and background music (cross-fading between map and region tracks).
  - **Discovery Notebook** (`Sổ khám phá`): shows all recorded discoveries (crops, pals, events, dishes, story chapters).
  - **Region Story** (`Nghe chuyện vùng đất`, visible only inside a region): plays/shows the opening story of the current region.
  - **Garden Kitchen** (`Bếp của vườn`, visible only inside a region).
  - **Day / Night toggle** (visible only inside a region, synced via `scene.time`): switches scene palettes and time-of-day hotspots.
- **Bottom-right (map only)**: **Adult Corner** gear button.
- **Portrait touch screens**: Displays a full-screen rotate prompt (`Con xoay màn hình ngang để nhìn cả khu vườn nhé!`).

## 3. Gardening, Care & Harvest

All **6 regions** have soil beds and their own regional seed tray:

1. **Soil beds**: Starts with **3 beds**, expanding up to **6 beds** as distinct crops are harvested.
2. **Planting**: Pick a seed from the bottom tray and tap an empty bed (stage `0 → 1`).
   - **Vườn nhà (7 crops)**: Hướng dương, Cà rốt, Dâu, Cà chua, Bí ngô, Bắp, Dưa hấu.
   - **Ao sen (2 crops)**: Hoa sen, Hoa súng.
   - **Rừng nhỏ (2 crops)**: Việt quất, Hạt dẻ.
   - **Bãi biển (2 crops)**: Dứa thơm, Chuối vàng.
   - **Đồi tuyết (2 crops)**: Bạc hà tuyết, Nam việt quất.
   - **Núi sao (2 crops)**: Khế ngôi sao, Hoa dạ hương.
3. **Water & Sun**: Drag or tap **Rain cloud** (water) and **Sun** (warmth) onto planted beds. Each full water + sun round advances growth by one stage (`1 Seed → 2 Sprout → 3 Grown → 4 Ripe`).
4. **Harvest**: Tap a ripe crop (stage 4) to add it to the **basket** (max **9** per item).
5. **Rare variants (chance-based)**: Harvesting has a small chance to record `rare_carrot_twin`, `rare_pumpkin_giant`, or `rare_berry_heart`.
6. **Direct gathering (`gather`)**: Tap the apple tree (Vườn nhà), wild honey (Rừng nhỏ), coconut palm or shells (Bãi biển), or snowy pine (Đồi tuyết) to add items directly to the basket.

## 4. Garden Kitchen (27 Recipes + Surprise Dish)

Tap the **Pot** icon at the top right to open the Kitchen. Combine **1 to 3 ingredients** from the basket:

| Dish                  | Required ingredients           |
| :-------------------- | :----------------------------- |
| Nước ép dưa hấu       | Dưa hấu (1)                    |
| Nước dừa mát lạnh     | Dừa (1)                        |
| Súp cà chua cà rốt    | Cà rốt + Cà chua               |
| Mứt dâu               | Dâu + Dâu                      |
| Bánh táo bí ngô       | Táo + Bí ngô                   |
| Bánh bắp ngọt         | Bắp + Bắp                      |
| Táo nghiền mật ngọt   | Táo + Táo                      |
| Súp bí ngô cà rốt     | Cà rốt + Bí ngô                |
| Súp bắp bí ngô        | Bắp + Bí ngô                   |
| Trà hoa hướng dương   | Hướng dương + Hướng dương      |
| Sinh tố dưa hấu dâu   | Dưa hấu + Dâu                  |
| Hạt dẻ nướng thơm     | Hạt dẻ + Hạt dẻ                |
| Mứt việt quất         | Việt quất + Việt quất          |
| Trà thông ấm áp       | Táo + Quả thông                |
| Trà sen thơm ngát     | Hoa sen + Hoa sen              |
| Chè hạt sen bắp ngọt  | Bắp + Hoa sen                  |
| Bánh việt quất hạt dẻ | Việt quất + Hạt dẻ             |
| Trà mật ong ấm        | Mật ong rừng + Hướng dương     |
| Nước ép dứa mát       | Dứa thơm + Dứa thơm            |
| Trà bạc hà ấm         | Bạc hà tuyết + Bạc hà tuyết    |
| Bánh nam việt quất    | Táo + Nam việt quất            |
| Nước khế ánh sao      | Khế ngôi sao + Khế ngôi sao    |
| Trà hoa dạ hương      | Hoa dạ hương + Hoa dạ hương    |
| Salad nhiều màu       | Dâu + Cà rốt + Cà chua         |
| Tô trái cây mát       | Táo + Dâu + Dưa hấu            |
| Bánh ánh sao          | Táo + Việt quất + Hướng dương  |
| Tô trái cây nhiệt đới | Chuối vàng + Dừa + Dứa thơm    |
| **Món bất ngờ**       | Any other 1–3 item combination |

## 5. Companions (`Pals`) & Story Chapters

There are **7 companions** (`Lucky`, `Tuần Lộc nhỏ`, `Capybara`, `Sóc nhỏ`, `Rùa con`, `Cánh cụt`, `Cú mèo`). Each companion:

- Has a non-expiring **food wish** and basic table snacks (`freeFoods`, except Tuần Lộc nhỏ) so children can always gift food even with an empty basket.
- Any gift increments `n.gift_<id>` and unlocks **3 story chapters** at **1, 3, and 6** gifts.
- Matching the active wish advances to the next wish in the list.

| Companion        | Appears when                         | Wishes                                                        |
| :--------------- | :----------------------------------- | :------------------------------------------------------------ |
| **Lucky**        | Present in Vườn nhà from start       | Dưa hấu, Táo, Cà rốt, Nước ép dưa hấu                         |
| **Tuần Lộc nhỏ** | After the first harvest              | Dưa hấu, Cà rốt, Táo, Tô trái cây mát                         |
| **Capybara**     | Met at Ao sen (also visits Vườn nhà) | Dưa hấu, Hoa sen, Trà sen thơm ngát, Chè hạt sen bắp ngọt     |
| **Sóc nhỏ**      | Met at Rừng nhỏ                      | Hạt dẻ, Việt quất, Bánh việt quất hạt dẻ, Trà mật ong ấm      |
| **Rùa con**      | Met at Bãi biển                      | Dừa, Dứa thơm, Nước ép dứa mát, Tô trái cây nhiệt đới         |
| **Cánh cụt**     | Met at Đồi tuyết                     | Trà thông ấm áp, Trà bạc hà ấm, Bánh nam việt quất, Táo       |
| **Cú mèo**       | Met at Núi sao                       | Bánh ánh sao, Trà hoa dạ hương, Nước khế ánh sao, Hướng dương |

## 6. Color House & Interactive Toys

- **Color House** (tap the house in Vườn nhà):
  - Switch between **5 wall colors**.
  - Drag and drop or tap to place up to **30 decorations** in the garden.
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
- **Lá sen to** → reveals **Nòng nọc nhỏ**.
- **Thuyền giấy** (`build`, 3 taps to fold and sail on the pond).
- **Vịt con**, **Chuồn chuồn**, **Ếch xanh**, **Đèn hoa đăng**, **Chim bói cá** (`dayOnly`), **Bạn Capybara**, **Đàn gỗ bên ao**.
- **Nighttime**: **Đom đóm bên ao** (`nightOnly`), **Trăng soi mặt ao** (at night once fish is discovered).

### Rừng nhỏ (Small Forest)

- **Nhà nấm tí hon**, **Chim gõ kiến**, **Mật ong rừng** (`gather` → Mật ong rừng).
- **Đống lá khô** → reveals **Bạn nhím**.
- **Khúc gỗ rỗng** → reveals **Bạn cáo nhỏ**.
- **Nhà cây nhỏ** (`build`, 3 taps to add the ladder and leafy roof).
- **Bạn Sóc nhỏ** (`dayOnly`).
- **Cú mèo trong rừng** (`nightOnly`), **Đom đóm** (`nightOnly`), **Hươu sao ban đêm** (`nightOnly`).

### Bãi biển (Sunny Beach)

- **Cây dừa** (`gather` → Dừa), **Vỏ sò** (`gather` → Vỏ sò).
- **Lâu đài cát** (`build`, 3 taps to complete and record discovery).
- **Ụ cát nhỏ** → reveals **Bạn cua**.
- **Vũng nước biển** → reveals **Sao biển**.
- **Sóng biển**, **Chim hải âu** (`dayOnly`), **Cá heo** (`dayOnly`), **Ngọn hải đăng** (`nightOnly`), **Bạn Rùa con**.

### Đồi tuyết (Snowy Hill)

- **Cây thông phủ tuyết** (`gather` → Quả thông).
- **Người tuyết** (`build`, 3 taps to complete).
- **Lều tuyết Iglu** (`build`, 3 taps to stack ice blocks and dome).
- **Đụn tuyết xốp** → reveals **Cáo tuyết trắng**.
- **Gấu bông tuyết**, **Xe trượt tuyết**, **Bông tuyết**, **Suối nước nóng**, **Cực quang** (`nightOnly`), **Bạn Cánh cụt**.

### Núi sao (Starry Mountain)

- Note: No daytime sun or rain cloud (`sky: false`).
- **Kính thiên văn**, **Ông trăng**, **Đèn ngôi sao**, **Bạn Cú mèo**, **Sao băng**, **Đá thiên thạch**, **Sao chổi**.
- **Đám mây bồng bềnh** → reveals **Thỏ ngọc trên mây**.
- **Chòm sao** (`build`, 4 taps to complete).

## 8. Idle Surprise Events & Seasonal Events

- **Idle surprises**: After ~45–90 seconds without interaction:
  - **Daytime**: Butterflies, Lucky waving, or Rainbow (if both `rain` and `sun` have been discovered).
  - **Nighttime**: **Shooting star** (`shooting_star`, recorded in the Notebook) or Lucky waving.
- **Seasonal events (`src/game/seasons.ts`)**:
  - Automatically detected from the lunar calendar: **Tết** (lunar month 12 days 28+ or month 1 days 1–7) shows _Hoa mai ngày Tết_; **Trung thu** (lunar month 8 days 13–16) shows _Đèn ông sao Trung thu_.
  - **Quick browser testing**: Append `?season=tet` or `?season=mid_autumn` to the URL (e.g. `http://localhost:5174/?season=tet`).

## 9. Adult Corner (`AdultCorner`)

Accessible only from the **Valley Map** (bottom-right gear button), gated by `7 + 5 = 12`:

- **Lưu khu vườn tab**:
  - Displays local save / cloud sync status.
  - **Tiếp tục với Google**: Under `npm run dev`, signs into a local test parent backed by PGlite (`.local-db/`) to test child profile creation/switching/deletion and multi-tab sync without configuring Google OAuth or Neon.
- **Dọn khu vườn tab**:
  - **Dọn lại một khu**: Clears planted beds (and decorations for Vườn nhà) for that region while preserving the Notebook, companions, basket and unlocked regions.
  - **Bắt đầu lại tất cả**: Resets all progress back to a fresh state.
  - **Dev mode**: Temporarily unlocks all 6 regions for testing.

## 10. Region Stories & 21 Companion Story Chapters

### Opening Region Stories (`src/data/scenes.ts`)

Tap the **Region Story** book button in the top-right HUD to hear the current region's story:

- **Vườn nhà**: _"Ngày xửa ngày xưa, dưới nắng mai ấm áp, khu vườn nhỏ luôn mở cửa đón các bạn thú và những mầm xanh biết lớn."_
- **Ao sen**: _"Bên bờ ao sen thơm ngát, gió nhẹ ru từng lá sen xanh và kể chuyện chú vịt con tập bơi."_
- **Rừng nhỏ**: _"Trong khu rừng xanh rì rào tiếng lá, bạn Sóc nhỏ cất giữ hạt dẻ thơm và rủ nhím con đi tìm quả ngọt."_
- **Bãi biển**: _"Trên bãi cát vàng óng ánh nắng, sóng biển hát rì rào đưa bạn Rùa con lên bờ nghe vỏ sò kể chuyện."_
- **Đồi tuyết**: _"Giữa đồi tuyết trắng xóa êm như bông, bạn Cánh cụt và gấu con cùng nhau nặn người tuyết mũi cà rốt."_
- **Núi sao**: _"Trên đỉnh núi cao gần bầu trời đêm, bạn Cú mèo thắp đèn ngôi sao và kể chuyện về từng chòm sao sáng."_

### 21 Companion Story Chapters (`src/data/pals.ts`, unlocked at 1 / 3 / 6 gifts)

- **Lucky**:
  1. Hôm nay Lucky đánh hơi thấy mùi dưa hấu ngọt lịm. Gâu! Lucky thích nhất là dưa hấu mát lạnh.
  2. Lucky chạy quanh các luống đất, vẫy đuôi tít mù khi thấy mầm xanh nhú lên dưới nắng.
  3. Cuối ngày Lucky nằm cạnh bạn Tuần Lộc nhỏ, hai đứa cùng nhìn mặt trời lặn thật êm.
- **Tuần Lộc nhỏ**:
  1. Bạn Tuần Lộc nhỏ gõ nhẹ đôi móng nhỏ xíu ngoài cổng vườn rồi mỉm cười chào Lucky.
  2. Bạn Tuần Lộc nhỏ cũng mê vị ngọt mát của dưa hấu đỏ giống hệt Lucky luôn đấy!
  3. Đêm xuống, cặp sừng nhỏ của bạn Tuần Lộc lấp lánh dưới ánh trăng cùng đom đóm.
- **Capybara**:
  1. Bạn Capybara đội quả quýt cam tròn xoe trên đầu, ngồi thư giãn bên bờ ao sen mát rượi.
  2. Vịt con và bạn ếch xanh thích leo lên lưng Capybara ngồi hóng gió, cả bọn cùng cười tít mắt.
  3. Chiều mát, Capybara mang hương sen về vườn nhà nằm phơi nắng cùng Lucky và Tuần Lộc nhỏ.
- **Sóc nhỏ**:
  1. Sóc nhỏ ôm đầy hai má hạt dẻ thơm lừng, nhảy thoăn thoắt trên cành thông xanh.
  2. Mỗi sáng trong rừng nhỏ, Sóc nhỏ lại đếm xem hôm nay hái được mấy trái việt quất tím.
  3. Sóc nhỏ giấu sẵn vài hạt dẻ ngon nhất để dành mời Lucky và con mỗi khi ghé thăm.
- **Rùa con**:
  1. Rùa con bò thật chậm trên bãi cát vàng, lắng nghe tiếng sóng biển vỗ rì rào.
  2. Mỗi khi nắng lên, Rùa con thích uống một ngụm nước dừa mát lạnh dưới bóng dừa xanh.
  3. Ban đêm, Rùa con ngắm bọt sóng lấp lánh rồi kể chuyện biển cả cho vỏ sò nghe.
- **Cánh cụt**:
  1. Bạn Cánh cụt đi lạch bạch trên đồi tuyết trắng, vỗ cánh chào từng bông tuyết rơi.
  2. Trời lạnh mà có một tách trà thông ấm áp thì Cánh cụt thích mê luôn đấy!
  3. Chiều xuống, Cánh cụt cùng gấu bông tuyết trượt vèo trên đồi tuyết cười vang.
- **Cú mèo**:
  1. Bạn Cú mèo mở to đôi mắt tròn xoe trên đỉnh núi sao, đếm từng ngôi sao sáng.
  2. Đêm yên tĩnh, Cú mèo thích nhâm nhi trà hoa hướng dương và nghe gió hát.
  3. Cú mèo thuộc tên mọi chòm sao trên trời để kể cho con và Lucky nghe mỗi tối.
