[English](ARTWORK_HANDOFF.md)

# Bàn giao mỹ thuật cho Gemini

## Định hướng và hiện trạng

Chưa tạo artwork production hoặc ảnh Gemini. Game dùng vector tạm tự vẽ nhất quán và vẫn chơi được khi chưa nâng cấp hình. Cập nhật cả hai ngôn ngữ mỗi khi đổi asset hoặc tương tác của nó.

Truyện tranh cổ tích ấm áp cho trẻ Việt 4–6 tuổi: viền rêu mềm #52684e, trời nhạt #dceceb, cỏ #d1dfa9, hoa vàng #e9bd58, thỏ kem #fff5df má hồng #edb9a6, mái đất đỏ #bc7f70. Dùng silhouette tròn, ánh sáng tản từ trên phải. Tránh tương phản gắt, mặt đáng sợ, chi tiết nhỏ rối, chữ, logo và watermark.

## Danh mục đầy đủ và quy cách file

Mọi ID đối tượng dưới đây hiện nằm trong `src/components/Art.tsx`, qua `Art` với viewBox 0 0 120 120. Chưa có file riêng từng đối tượng. Tên đích là ID.png trong `public/assets/`: 512×512, 1:1, PNG RGBA trong suốt; có thể kèm SVG master sạch. Giữ padding 7%, silhouette và điểm neo giữa đáy gần (60,112). Không crop lề trong suốt hoặc tính hitbox từ alpha.

| ID / tên file đích                                                         | Mục đích và tương tác                                   |
| -------------------------------------------------------------------------- | ------------------------------------------------------- |
| tree / tree.png                                                            | Cây táo: rung tán, táo rơi                              |
| cloud / cloud.png                                                          | Mây kéo được; mưa khi chạm/thả                          |
| sun / sun.png                                                              | Nguồn nắng; chạm/thả vào luống                          |
| flower / flower.png                                                        | Hướng dương, hoa vườn, chọn hạt, trang trí, thương hiệu |
| carrot / carrot.png                                                        | Chọn hạt, cây lớn, thức ăn/yêu cầu bữa trưa             |
| berry / berry.png                                                          | Chọn hạt, cây lớn, thức ăn/yêu cầu bữa trưa             |
| butterfly / butterfly.png                                                  | Bướm vườn, trang trí, sổ tay                            |
| worm / worm.png                                                            | Sinh vật hiện từ cỏ                                     |
| bug / bug.png                                                              | Bọ rùa; dùng chung hình cho dế trong sổ                 |
| bird / bird.png                                                            | Chim trên cành; hót và nhảy                             |
| rabbit / rabbit.png                                                        | Thỏ vườn, hướng dẫn, bữa ăn; phản ứng vui/suy nghĩ      |
| fish / fish.png                                                            | Cá trong ao; phản ứng bơi                               |
| apple / apple.png                                                          | Quả rơi, thức ăn/yêu cầu bữa trưa                       |
| house / house.png                                                          | Vườn chính và editor; năm màu tường                     |
| rainbow / rainbow.png                                                      | Nền khám phá mưa+nắng lâu dài                           |
| rock / rock.png                                                            | Nghiêng để lộ bọ rùa                                    |
| grass / grass.png                                                          | Bụi rung và hình đại diện mầm cây                       |
| pond / pond.png                                                            | Mặt nước, lá sen và gợn                                 |
| basket / basket.png                                                        | Đích thả bữa ăn; dấu đếm render riêng                   |
| dish-soup, dish-jam, dish-salad, dish-pie, dish-juice, dish-corncake, dish-applesauce, dish-pumpkinsoup, dish-cornsoup, dish-fruitbowl, dish-tea, dish-smoothie, dish-mystery (.png) | Món đã nấu: kết quả ở bếp, giỏ, quà (bát tạm)           |
| tomato / tomato.png                                                        | Cây trồng: nút hạt, cây chín, giỏ (vector tạm)          |
| pumpkin / pumpkin.png                                                      | Cây trồng: nút hạt, cây chín, giỏ (vector tạm)          |
| corn / corn.png                                                            | Cây trồng: nút hạt, cây chín, giỏ (vector tạm)          |
| watermelon / watermelon.png                                                | Cây trồng: nút hạt, cây chín, giỏ; món cún thích        |
| puppy / puppy.png                                                          | Cún Lucky trắng nhỏ tròn kiểu hoạt hình                 |
| decor-sunflower, decor-pumpkin-lamp (.png)                                 | Đồ trang trí Nhà v2 (đèn bí ngô sáng vào ban đêm)       |
| owl, frog, snail, duck, dragonfly (.png)                                   | Cú đêm, sinh vật đổi chỗ và sinh vật ở Ao sen           |
| windmill, xylophone (.png)                                                 | Đồ chơi trong vườn (chong chóng quay, đàn gỗ 8 thanh)   |
| fx-moon, fx-firefly, fx-shooting-star (.png)                               | Mặt trăng đêm, đom đóm theo tay và sao băng             |
| lotus, waterlily, pond-lantern (.png)                                      | Cây trồng Ao sen (khu 2) và đèn hoa đăng                |
| star / star.png                                                            | Trang trí nhà và ngôi sao phản hồi bữa ăn               |

Các nền hiện nằm trong `src/style.module.css`, tô màu bằng token `--scene-*` trong `src/styles/tokens.css`; đầu ra đích là PNG (có thể kèm SVG master). Tên file này chỉ file thay thế tương lai, chưa tồn tại.

| File đích      | Kích thước / tỉ lệ | Nền        | Mục đích / selector hiện tại |
| -------------- | ------------------ | ---------- | ---------------------------- |
| sky.png        | 2400×1400 / 12:7   | kín        | Gradient trời / .garden      |
| hill-back.png  | 2400×1400 / 12:7   | trong suốt | Đồi xa / .hill-back          |
| hill-front.png | 2400×1400 / 12:7   | trong suốt | Đồi gần / .hill-front        |
| path.png       | 1200×1400 / 6:7    | trong suốt | Lối đất / .path              |
| soil.png       | 512×256 / 2:1      | trong suốt | Luống / .soil                |
| house-yard.png | 1160×560 / 29:14   | kín        | Sân editor / .house-canvas   |

Icon app hiện có: `public/favicon.ico` (16/32/48), `public/favicon.svg`, `public/icon-32.png`, `public/icon-180.png` (nền kín tràn viền), `public/icon-192.png`, `public/icon-512.png` và `public/icon-maskable-192.png`/`-512.png` (tranh nằm trong vùng an toàn 80% ở giữa), xuất từ minh họa storybook do Gemini tạo (thỏ kem ôm hoa hướng dương, xem `PROVENANCE.vi.md`). Không animation. Chữ UI, nút cài đặt/âm thanh/sổ, chấm đếm, dấu cộng, focus và mũi tên gợi ý do app render, không sinh trong ảnh. Bong bóng thỏ dùng lại ID thức ăn; ngôi sao vui dùng star. Trang trí ngoài vườn dùng lại ID hoa/bướm/ngôi sao đã lưu.

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

- Cảnh phủ kín màn hình, từ khoảng 4:3 (iPad) đến 21:9 (desktop siêu rộng). Nền phải kéo tới mọi mép và chịu được bị cắt; vật co giãn theo giá trị nhỏ hơn giữa chiều rộng và 1,9 lần chiều cao. Nút nổi ở góc trên trái (thỏ hướng dẫn, khoảng 460×72px) và dọc góc trên phải (cột rộng 70px); tránh đặt chi tiết nền quan trọng ở các vùng đó.
- Các bảng kính nổi trên cảnh (khay hạt, thỏ hướng dẫn). Tranh phía sau bị làm mờ và sáng lên; đừng đặt chi tiết cần thấy ở đó.
- Trên hộp thoại, tranh nằm trên nền sáng ở cả hai chế độ nên viền xanh rêu luôn rõ. Không tự thêm hình nền hay bóng đổ.
- Bản đêm của các nền cảnh và vùng mờ trên bản đồ cho các khu đánh dấu sắp có sẽ được mô tả tại đây khi các tính năng đó được làm.
- Icon giao diện (loa, sổ, cài đặt, gợi ý, đóng, trạng thái lưu, chế độ giao diện) là vector trong repo ở `src/components/Icons.tsx`, không thuộc phần bàn giao này.
- Icon app chốt sẽ được vẽ lại cùng bộ tranh: bản gốc 1024px, bản nền kín tràn viền cho icon Apple 180px, bản maskable riêng với chủ thể nằm trong 80% ở giữa, và SVG vector cho favicon. `favicon.svg` hiện tại bọc một bản raster nhỏ, còn các file maskable do `scripts/make-icons.mjs` tạo ra.

## Nhất quán nhân vật

Thỏ: thân/đầu kem tròn, tai dài lòng hồng, mắt chấm, mũi V, má hồng; không đổi quần áo giữa pose. Giữ tỉ lệ đầu/tai theo SVG tham chiếu. Chim: thân bầu xanh xám, mỏ vàng hướng phải, chân ngắn. Bướm: cánh trên hồng, dưới vàng, thân rêu mảnh, hai râu. Bọ rùa: áo đất đỏ chấm rêu; sâu xanh nhạt; cá vàng cam hướng phải. Mây/nắng mắt chấm và cười nhẹ. Duyệt reference sheet trước; dùng lại reference/seed nếu model hỗ trợ.

## Animation và lớp

Hiện dùng CSS, không có sprite sheet. Đầu ra bắt buộc đầu tiên là một pose tĩnh khớp mỗi ID và pivot CSS. Sprite tương lai tùy chọn phải giữ canvas/pivot: idle 2–4 frame ở 4–6 fps cho thỏ/chim/cá/sâu; touch 3–4 frame dưới 0,8 giây; bướm/cá di chuyển 4 frame; discovery 3 frame nhẹ. Có frame đầu tĩnh rõ cho reduced motion. Không chớp sáng hoặc dịch vùng collision.

Tách thân cây/tán/táo; thân/mặt mây và giọt mưa (3 frame); bờ ao/nước/gợn/lá và cá; mái nhà/mask đổi màu tường/cửa/cửa sổ; mọi trang trí độc lập. Giai đoạn cây cùng neo đáy; mầm hiện dùng grass. Thỏ vui dùng CSS nhảy và star riêng; suy nghĩ nghiêng nhẹ kèm bong bóng thức ăn. Giữ các lớp này tách khỏi ảnh thỏ.

Thứ tự: trời, cầu vồng, đồi xa, đồi gần/lối, cây/nhà, ao/cỏ/đá, động vật, luống/cây, khay hạt, gợi ý, drag ghost, modal. Trang trí ngoài vườn là overlay sân tỉ lệ 2:1 thu nhỏ theo bố cục editor. Ngoại lệ lớp thuộc renderer, không vẽ dính vào nền.

## Mapping tương tác

`Garden.tsx` quản lý hitbox button, tọa độ cảnh, pointer capture. `data-soil` xác định luống: thả hạt gieo, mây tưới, nắng sưởi. Chạm chăm cả ba luống. `Activities.tsx` quản lý `data-basket`, chấm đếm và tọa độ phần trăm sân nhà. Artwork không chứa luật chơi. Giữ props Art `id`/`color`, ID ổn định, nhãn touch, z-index và thuộc tính đích thả khi thay ảnh.

## Prompt Gemini sao chép dùng ngay

> Tạo artwork thay thế cho Little Wonders, game vườn cho trẻ Việt 4–6 tuổi. Phong cách truyện tranh cổ tích ấm áp, silhouette tròn mềm, viền rêu #52684e và ánh sáng tản trên phải. Trời #dceceb, cỏ #d1dfa9, hoa vàng #e9bd58, thỏ kem #fff5df má #edb9a6, mái đất đỏ #bc7f70. Ảnh phải rõ khi hiển thị 60–200 pixel. Không chữ, logo, watermark. Không bắt chước họa sĩ đang sống hoặc dùng nhân vật thương mại.
>
> Khớp SVG tham chiếu thuộc dự án được cung cấp. Thỏ: thân/đầu kem tròn, tai dài lòng hồng, mắt chấm, mũi V, má hồng, không quần áo. Chim xanh xám/mỏ vàng; bướm cánh trên hồng/dưới vàng; bọ rùa đất đỏ/chấm rêu; sâu xanh nhạt; cá vàng cam hướng phải. Giữ tỉ lệ, nét và sáng giống nhau giữa pose. Đầu tiên đưa character reference sheet để duyệt, rồi xuất từng file.
>
> ID đối tượng: tree, cloud, sun, flower, carrot, berry, butterfly, worm, bug, bird, rabbit, fish, apple, house, rainbow, rock, grass, pond, basket, star, tomato, pumpkin, corn, watermelon. Xuất mỗi ID.png, RGBA trong suốt 512×512, padding khoảng 7%, neo giữa đáy khớp (60,112) trong canvas 120×120 hiện tại. Không crop/đổi tỉ lệ. Cà rốt phải rõ màu cam; dâu đỏ/hồng. Nhà cần mask tường đổi màu riêng. Tách thân/tán/táo, mây/mưa, bờ/nước/gợn/lá/cá, mái/tường/cửa và trang trí. Không nhúng UI, vùng chạm hoặc luật chơi.
>
> Nền: sky 2400×1400 kín; hill-back/hill-front 2400×1400 trong suốt; path 1200×1400 trong suốt; soil 512×256 trong suốt; house-yard 1160×560 kín. Không vẽ sinh vật tương tác dính vào nền. Sprite tùy chọn: idle 2–4 frame, touch 3–4, bướm/cá di chuyển 4, mưa 3, khám phá nhẹ 3. Mọi frame cùng canvas/pivot. Pose ID.png tĩnh bắt buộc vì MVP dùng CSS animation. Frame thêm đặt ID-idle-01.png, ID-touch-01.png, ID-move-01.png hoặc ID-discover-01.png; kèm manifest frame-rate riêng và pose reduced-motion.
>
> Chỉ dùng nội dung được phân phối công khai. Ghi model, ngày tạo, prompt đầy đủ, nguồn reference thuộc dự án, điều khoản áp dụng và chỉnh sửa. Không khẳng định quyền khi chưa kiểm điều khoản hiện hành. Tránh nguồn bên thứ ba không rõ.

## Checklist thay thế

- [ ] Ghi provenance/quyền trong cả hai tài liệu `public/assets/PROVENANCE`.
- [ ] Duyệt nhất quán reference, phù hợp trẻ và không chữ.
- [ ] Lưu ID ổn định trong `public/assets`; giữ props Art, kích thước, pivot và nhãn.
- [ ] Giữ hitbox DOM, data-soil/data-basket, pointer capture, thứ tự lớp và tọa độ phần trăm.
- [ ] Kiểm đủ năm màu tường, bố cục cũ, tỉ lệ đồ ngoài vườn và lớp phản hồi thỏ.
- [ ] Kiểm giới hạn iPad/desktop, chạm/kéo và reduced motion.
- [ ] Thêm danh mục ảnh mới vào precache service worker và hash nội dung khi URL không hash; precache bundle không tự thêm PNG mới.
- [ ] Chạy typecheck, lint, test, build, Playwright và offline; kiểm icon PNG/manifest.
- [ ] Cập nhật cả hai handoff và provenance; chỉ đánh xong khi gameplay/khôi phục còn hoạt động.
