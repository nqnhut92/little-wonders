[English](ARTWORK_HANDOFF.md)

# Bàn giao mỹ thuật cho Gemini

## Định hướng và hiện trạng

Chưa tạo artwork production hoặc ảnh Gemini. Game dùng vector tạm tự vẽ nhất quán và vẫn chơi được khi chưa nâng cấp hình. Cập nhật cả hai ngôn ngữ mỗi khi đổi asset hoặc tương tác của nó.

Truyện tranh phẳng, thân thiện cho trẻ Việt 4–6 tuổi: hình khối tròn đơn giản, màu phẳng tươi, không viền, một tông đậm hơn làm bóng, mắt chấm to #4a3b35 có đốm sáng trắng và má hồng #ffb3a7. Trời #bfe6f7, cỏ #8fd083, vàng #ffc93c, đỏ #f0605d, xanh dương #5fb4e0, tím #9b6bd6, cún trắng kem #fff6e5 đeo nơ tím nhỏ #9b6bd6. Tránh tương phản gắt, mặt đáng sợ, chi tiết nhỏ rối, chữ, logo và watermark.

## Danh mục đầy đủ và quy cách file

Mọi ID đối tượng dưới đây hiện nằm trong `src/components/Art.tsx`, qua `Art` với viewBox 0 0 120 120. Chưa có file riêng từng đối tượng. Tên đích là ID.png trong `public/assets/`: 512×512, 1:1, PNG RGBA trong suốt; có thể kèm SVG master sạch. Giữ padding 7%, silhouette và điểm neo giữa đáy gần (60,112). Không crop lề trong suốt hoặc tính hitbox từ alpha.

| ID / tên file đích                                                                                                                                                                   | Mục đích và tương tác                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| tree / tree.png                                                                                                                                                                      | Cây táo: rung tán, táo rơi                                |
| cloud / cloud.png                                                                                                                                                                    | Mây kéo được; mưa khi chạm/thả                            |
| sun / sun.png                                                                                                                                                                        | Nguồn nắng; chạm/thả vào luống                            |
| flower / flower.png                                                                                                                                                                  | Hướng dương, hoa vườn, chọn hạt, trang trí, thương hiệu   |
| carrot / carrot.png                                                                                                                                                                  | Chọn hạt, cây lớn, thức ăn/yêu cầu bữa trưa               |
| berry / berry.png                                                                                                                                                                    | Chọn hạt, cây lớn, thức ăn/yêu cầu bữa trưa               |
| butterfly / butterfly.png                                                                                                                                                            | Bướm vườn, trang trí, sổ tay                              |
| worm / worm.png                                                                                                                                                                      | Sinh vật hiện từ cỏ                                       |
| bug / bug.png                                                                                                                                                                        | Bọ rùa; dùng chung hình cho dế trong sổ                   |
| bird / bird.png                                                                                                                                                                      | Chim trên cành; hót và nhảy                               |
| puppy / puppy.png                                                                                                                                                                    | Lucky: vườn, hướng dẫn, bữa ăn; phản ứng vui/suy nghĩ     |
| reindeer / reindeer.png                                                                                                                                                              | Bạn thứ hai: Lời mời, quà và chương truyện                |
| fish / fish.png                                                                                                                                                                      | Cá trong ao; phản ứng bơi                                 |
| apple / apple.png                                                                                                                                                                    | Quả rơi, thức ăn/yêu cầu bữa trưa                         |
| house / house.png                                                                                                                                                                    | Vườn chính và editor; năm màu tường                       |
| rainbow / rainbow.png                                                                                                                                                                | Nền khám phá mưa+nắng lâu dài                             |
| rock / rock.png                                                                                                                                                                      | Nghiêng để lộ bọ rùa                                      |
| grass / grass.png                                                                                                                                                                    | Bụi rung và hình đại diện mầm cây                         |
| pond / pond.png                                                                                                                                                                      | Mặt nước, lá sen và gợn                                   |
| basket / basket.png                                                                                                                                                                  | Đích thả bữa ăn; dấu đếm render riêng                     |
| dish-soup, dish-jam, dish-salad, dish-pie, dish-juice, dish-corncake, dish-applesauce, dish-pumpkinsoup, dish-cornsoup, dish-fruitbowl, dish-tea, dish-smoothie, dish-mystery (.png) | Món đã nấu: kết quả ở bếp, giỏ, quà (bát tạm)             |
| tomato / tomato.png                                                                                                                                                                  | Cây trồng: nút hạt, cây chín, giỏ (vector tạm)            |
| pumpkin / pumpkin.png                                                                                                                                                                | Cây trồng: nút hạt, cây chín, giỏ (vector tạm)            |
| corn / corn.png                                                                                                                                                                      | Cây trồng: nút hạt, cây chín, giỏ (vector tạm)            |
| watermelon / watermelon.png                                                                                                                                                          | Cây trồng: nút hạt, cây chín, giỏ; món cún thích          |
| puppy / puppy.png                                                                                                                                                                    | Cún Lucky trắng nhỏ tròn, nhân vật chính thích ăn dưa hấu |
| reindeer / reindeer.png                                                                                                                                                              | Bạn tuần lộc nhỏ đồng hành (đến sau lần thu hoạch đầu)    |
| decor-sunflower, decor-pumpkin-lamp (.png)                                                                                                                                           | Đồ trang trí Nhà v2 (đèn bí ngô sáng vào ban đêm)         |
| owl, frog, snail, duck, dragonfly (.png)                                                                                                                                             | Cú đêm, sinh vật đổi chỗ và sinh vật ở Ao sen             |
| windmill, xylophone (.png)                                                                                                                                                           | Đồ chơi trong vườn (chong chóng quay, đàn gỗ 8 thanh)     |
| fx-moon, fx-firefly, fx-shooting-star (.png)                                                                                                                                         | Mặt trăng đêm, đom đóm theo tay và sao băng               |
| lotus, waterlily, pond-lantern (.png)                                                                                                                                                | Cây trồng Ao sen (khu 2) và đèn hoa đăng                  |
| star / star.png                                                                                                                                                                      | Trang trí nhà và ngôi sao phản hồi bữa ăn                 |

Các nền hiện nằm trong `src/style.module.css`, tô màu bằng token `--scene-*` trong `src/styles/tokens.css`; đầu ra đích là PNG (có thể kèm SVG master). Tên file này chỉ file thay thế tương lai, chưa tồn tại.

| File đích      | Kích thước / tỉ lệ | Nền        | Mục đích / selector hiện tại |
| -------------- | ------------------ | ---------- | ---------------------------- |
| sky.png        | 2400×1400 / 12:7   | kín        | Gradient trời / .garden      |
| hill-back.png  | 2400×1400 / 12:7   | trong suốt | Đồi xa / .hill-back          |
| hill-front.png | 2400×1400 / 12:7   | trong suốt | Đồi gần / .hill-front        |
| path.png       | 1200×1400 / 6:7    | trong suốt | Lối đất / .path              |
| soil.png       | 512×256 / 2:1      | trong suốt | Luống / .soil                |
| house-yard.png | 1160×560 / 29:14   | kín        | Sân editor / .house-canvas   |

Icon app hiện có: `public/favicon.ico` (16/32/48), `public/favicon.svg`, `public/icon-32.png`, `public/icon-180.png` (nền kín tràn viền), `public/icon-192.png`, `public/icon-512.png` và `public/icon-maskable-192.png`/`-512.png` (tranh nằm trong vùng an toàn 80% ở giữa), do `scripts/make-icons.mjs` dựng từ bản gốc vector `public/favicon.svg`: Lucky phẳng đeo nơ tím ôm quả dưa hấu, bên cạnh có hoa hướng dương, cà rốt và các đốm lấp lánh trên nền trời tia nắng (xem `PROVENANCE.vi.md`). Không animation. Chữ UI, nút cài đặt/âm thanh/sổ, chấm đếm, dấu cộng, focus và mũi tên gợi ý do app render, không sinh trong ảnh. Bong bóng của bạn thú dùng lại ID thức ăn; ngôi sao vui dùng star. Trang trí ngoài vườn dùng lại ID hoa/bướm/ngôi sao đã lưu.

## Một phong cách vẽ (hiện trạng)

Mọi hình trong game hiện là vector do dự án tự vẽ trong `src/components/Art.tsx`, nền cảnh và bản đồ thung lũng nằm trong `src/components/SceneBackdrop.tsx`, tất cả theo một phong cách phẳng: màu phẳng, không viền, không bộ lọc chất liệu (hình vẽ nằm trong `ArtFlat.tsx` và `ArtFlatMore.tsx`; `PaintFilters.tsx` chỉ còn hiệu ứng phát sáng cho đèn). Lucky đeo nơ tím nhỏ, không phải vòng cổ. Các tranh Gemini từng được dùng ngắn (nền, bản đồ, Lucky, tuần lộc, nhà, cây, mặt trời, mây, hoa, giỏ, đá, cú, ếch và một chú thỏ không dùng) được giữ ở `art-archive/gemini/` và không được đóng gói. Icon app dùng cùng Lucky phẳng đó. Tranh thay thế phải là một bộ đầy đủ, đồng nhất; đừng trộn lẻ vài ảnh vẽ trở lại.

## Các khu sau (vector tạm)

Rừng nhỏ, bãi biển, đồi tuyết và núi sao dùng nền SVG vẽ (`src/components/SceneBackdrop.tsx`) và placeholder vector trong `Art.tsx`. Danh sách cần vẽ lại, cùng quy cách đồ vật như trên (512×512 trong suốt, neo giữa-đáy):

| Khu       | ID                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Rừng nhỏ  | blueberry, chestnut, mushroom-house (chỉ để trang trí, không bao giờ là đồ ăn), leafpile, hedgehog, squirrel, woodpecker         |
| Bãi biển  | coconut-tree, coconut, shell, sand, crab, sandcastle-1 (ụ cát kèm xô và xẻng), sandcastle-2, sandcastle-3, wave, turtle, seagull |
| Đồi tuyết | pine-snow, pinecone, snowman-1, snowman-2, snowman-3, polar-bear (gấu con, tròn và mềm), penguin, sled, snowflake                |
| Núi sao   | telescope, moon-face, constellation-1 đến constellation-4 (cún Lucky vẽ dần từng ngôi sao; giữ vị trí các sao), star-lantern     |
| Bếp       | dish-coconut, dish-chestnut                                                                                                      |

Nền: bg-forest, bg-beach, bg-snow và bg-stars, 3200×1800 nền kín, hình quan trọng nằm trong 60% ở giữa, có bản đêm cho rừng, biển và tuyết (núi sao luôn là ban đêm). Giữ yên vùng hướng dẫn góc dưới trái và cột nút bên phải.

## Khung giao diện quanh tranh

Giao diện theo chế độ Sáng, Tối và Theo hệ thống; tranh thì không. Giao một phiên bản cho mỗi asset. Tranh phải dễ nhìn cạnh cả hai khung.

| Token         | Sáng    | Tối     | Dùng cho                          |
| ------------- | ------- | ------- | --------------------------------- |
| `--bg`        | #faf8ee | #131b1a | Trang phía sau cảnh               |
| `--surface`   | #fffbee | #1d2826 | Hộp thoại và bảng                 |
| `--surface-2` | #f2f1df | #27342f | Ô và nút phụ                      |
| `--text`      | #3b523f | #e8eedd | Chữ giao diện                     |
| `--muted`     | #5a6f5b | #adbcaa | Chữ phụ                           |
| `--accent`    | #52684e | #a8cf8f | Hành động chính, vòng focus       |
| `--plate`     | #fff9e9 | #e9ecd9 | Nền sáng phía sau tranh trên bảng |

- Cảnh phủ kín màn hình, từ khoảng 4:3 (iPad) đến 21:9 (desktop siêu rộng). Nền phải kéo tới mọi mép và chịu được bị cắt; vật co giãn theo giá trị nhỏ hơn giữa chiều rộng và 1,9 lần chiều cao. Nút nổi ở góc trên trái (Lucky hướng dẫn, khoảng 460×72px) và dọc góc trên phải (cột rộng 70px); tránh đặt chi tiết nền quan trọng ở các vùng đó.
- Các bảng kính nổi trên cảnh (khay hạt, Lucky hướng dẫn). Tranh phía sau bị làm mờ và sáng lên; đừng đặt chi tiết cần thấy ở đó.
- Trên hộp thoại, tranh nằm trên nền sáng ở cả hai chế độ nên các hình màu nhạt vẫn rõ. Không tự thêm hình nền hay bóng đổ.
- Bản đêm của các nền cảnh và vùng mờ trên bản đồ cho các khu đánh dấu sắp có sẽ được mô tả tại đây khi các tính năng đó được làm.
- Icon giao diện (loa, sổ, cài đặt, gợi ý, đóng, trạng thái lưu, chế độ giao diện) là vector trong repo ở `src/components/Icons.tsx`, không thuộc phần bàn giao này.
- Icon app theo đúng tranh trong game: `public/favicon.svg` là bản gốc vector, icon Apple 180px nền kín tràn viền, các bản maskable giữ Lucky trong 80% ở giữa. Sửa bản gốc rồi chạy `node scripts/make-icons.mjs`.

## Nhất quán nhân vật

Cún Lucky: nhỏ, tròn trịa, lông trắng kem, đầu tròn, tai cụp màu nâu nhạt, mắt chấm có đốm sáng, mũi nhỏ sẫm, lưỡi hồng và má hồng, nơ tím nhỏ ở cổ, đuôi ngắn cong; kiểu hoạt hình bo tròn, không phải chó thật. Tuần Lộc nhỏ: nâu ấm, bụng và mõm màu kem, hai sừng nhỏ, mũi nâu đỏ và má hồng. Không đổi quần áo giữa pose. Giữ tỉ lệ đầu/tai theo SVG tham chiếu. Chim: thân bầu xanh xám, mỏ vàng hướng phải, chân ngắn. Bướm: cánh trên hồng, dưới vàng, thân rêu mảnh, hai râu. Bọ rùa: áo đất đỏ chấm rêu; sâu xanh nhạt; cá vàng cam hướng phải. Mây/nắng mắt chấm và cười nhẹ. Duyệt reference sheet trước; dùng lại reference/seed nếu model hỗ trợ.

## Animation và lớp

Hiện dùng CSS, không có sprite sheet. Đầu ra bắt buộc đầu tiên là một pose tĩnh khớp mỗi ID và pivot CSS. Sprite tương lai tùy chọn phải giữ canvas/pivot: idle 2–4 frame ở 4–6 fps cho cún/tuần lộc/chim/cá/sâu; touch 3–4 frame dưới 0,8 giây; bướm/cá di chuyển 4 frame; discovery 3 frame nhẹ. Có frame đầu tĩnh rõ cho reduced motion. Không chớp sáng hoặc dịch vùng collision.

Tách thân cây/tán/táo; thân/mặt mây và giọt mưa (3 frame); bờ ao/nước/gợn/lá và cá; mái nhà/mask đổi màu tường/cửa/cửa sổ; mọi trang trí độc lập. Giai đoạn cây cùng neo đáy; mầm hiện dùng grass. Phản ứng vui của bạn thú dùng CSS nhảy và star riêng; suy nghĩ nghiêng nhẹ kèm bong bóng thức ăn. Giữ các lớp này tách khỏi ảnh nhân vật.

Thứ tự: trời, cầu vồng, đồi xa, đồi gần/lối, cây/nhà, ao/cỏ/đá, động vật, luống/cây, khay hạt, gợi ý, drag ghost, modal. Trang trí ngoài vườn là overlay sân tỉ lệ 2:1 thu nhỏ theo bố cục editor. Ngoại lệ lớp thuộc renderer, không vẽ dính vào nền.

## Mapping tương tác

`Garden.tsx` quản lý hitbox button, tọa độ cảnh, pointer capture. `data-soil` xác định luống: thả hạt gieo, mây tưới, nắng sưởi. Chạm chăm cả ba luống. `Activities.tsx` quản lý `data-basket`, chấm đếm và tọa độ phần trăm sân nhà. Artwork không chứa luật chơi. Giữ props Art `id`/`color`, ID ổn định, nhãn touch, z-index và thuộc tính đích thả khi thay ảnh.

## Prompt Gemini sao chép dùng ngay

> Tạo artwork thay thế cho Little Wonders, game vườn cho trẻ Việt 4–6 tuổi. Phong cách truyện tranh phẳng, thân thiện: hình khối tròn đơn giản, màu phẳng tươi, không viền, một tông đậm hơn làm bóng, mắt chấm to có đốm sáng. Trời #bfe6f7, cỏ #8fd083, vàng #ffc93c, đỏ #f0605d, cún trắng kem #fff6e5 má #ffb3a7. Ảnh phải rõ khi hiển thị 60–200 pixel. Không chữ, logo, watermark. Không bắt chước họa sĩ đang sống hoặc dùng nhân vật thương mại.
>
> Khớp SVG tham chiếu thuộc dự án được cung cấp. Cún Lucky: nhỏ, tròn trịa, lông trắng kem, đầu tròn, tai cụp màu nâu nhạt, mắt chấm có đốm sáng, mũi nhỏ sẫm, lưỡi hồng và má hồng, nơ tím nhỏ ở cổ, đuôi ngắn cong; kiểu hoạt hình bo tròn, không phải chó thật. Tuần Lộc nhỏ: nâu ấm, bụng và mõm màu kem, hai sừng nhỏ, mũi nâu đỏ và má hồng. Chim xanh xám/mỏ vàng; bướm cánh trên hồng/dưới vàng; bọ rùa đất đỏ/chấm rêu; sâu xanh nhạt; cá vàng cam hướng phải. Giữ tỉ lệ, hình khối và bảng màu giống nhau giữa pose. Đầu tiên đưa character reference sheet để duyệt, rồi xuất từng file.
>
> ID đối tượng: tree, cloud, sun, flower, carrot, berry, butterfly, worm, bug, bird, puppy, reindeer, fish, apple, house, rainbow, rock, grass, pond, basket, star, tomato, pumpkin, corn, watermelon. Xuất mỗi ID.png, RGBA trong suốt 512×512, padding khoảng 7%, neo giữa đáy khớp (60,112) trong canvas 120×120 hiện tại. Không crop/đổi tỉ lệ. Cà rốt phải rõ màu cam; dâu đỏ/hồng. Nhà cần mask tường đổi màu riêng. Tách thân/tán/táo, mây/mưa, bờ/nước/gợn/lá/cá, mái/tường/cửa và trang trí. Không nhúng UI, vùng chạm hoặc luật chơi.
>
> Nền: sky 2400×1400 kín; hill-back/hill-front 2400×1400 trong suốt; path 1200×1400 trong suốt; soil 512×256 trong suốt; house-yard 1160×560 kín. Không vẽ sinh vật tương tác dính vào nền. Sprite tùy chọn: idle 2–4 frame, touch 3–4, bướm/cá di chuyển 4, mưa 3, khám phá nhẹ 3. Mọi frame cùng canvas/pivot. Pose ID.png tĩnh bắt buộc vì MVP dùng CSS animation. Frame thêm đặt ID-idle-01.png, ID-touch-01.png, ID-move-01.png hoặc ID-discover-01.png; kèm manifest frame-rate riêng và pose reduced-motion.
>
> Chỉ dùng nội dung được phân phối công khai. Ghi model, ngày tạo, prompt đầy đủ, nguồn reference thuộc dự án, điều khoản áp dụng và chỉnh sửa. Không khẳng định quyền khi chưa kiểm điều khoản hiện hành. Tránh nguồn bên thứ ba không rõ.

## Checklist thay thế

- [ ] Ghi provenance/quyền trong cả hai tài liệu `public/assets/PROVENANCE`.
- [ ] Duyệt nhất quán reference, phù hợp trẻ và không chữ.
- [ ] Lưu ID ổn định trong `public/assets`; giữ props Art, kích thước, pivot và nhãn.
- [ ] Giữ hitbox DOM, data-soil/data-basket, pointer capture, thứ tự lớp và tọa độ phần trăm.
- [ ] Kiểm đủ năm màu tường, bố cục cũ, tỉ lệ đồ ngoài vườn và lớp phản hồi của bạn thú.
- [ ] Kiểm giới hạn iPad/desktop, chạm/kéo và reduced motion.
- [ ] Thêm danh mục ảnh mới vào precache service worker và hash nội dung khi URL không hash; precache bundle không tự thêm PNG mới.
- [ ] Chạy typecheck, lint, test, build, Playwright và offline; kiểm icon PNG/manifest.
- [ ] Cập nhật cả hai handoff và provenance; chỉ đánh xong khi gameplay/khôi phục còn hoạt động.
