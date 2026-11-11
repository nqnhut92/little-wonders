[English](ARTWORK_HANDOFF.md)

# Bàn giao mỹ thuật cho Gemini

## Định hướng và hiện trạng

Chưa tạo artwork production hoặc ảnh Gemini. Game dùng vector tạm tự vẽ nhất quán và vẫn chơi được khi chưa nâng cấp hình. Cập nhật cả hai ngôn ngữ mỗi khi đổi asset hoặc tương tác của nó.

Truyện tranh cổ tích ấm áp cho trẻ Việt 4–6 tuổi: viền rêu mềm #52684e, trời nhạt #dceceb, cỏ #d1dfa9, hoa vàng #e9bd58, thỏ kem #fff5df má hồng #edb9a6, mái đất đỏ #bc7f70. Dùng silhouette tròn, ánh sáng tản từ trên phải. Tránh tương phản gắt, mặt đáng sợ, chi tiết nhỏ rối, chữ, logo và watermark.

## Danh mục đầy đủ và quy cách file

Mọi ID đối tượng dưới đây hiện nằm trong `src/components/Art.tsx`, qua `Art` với viewBox 0 0 120 120. Chưa có file riêng từng đối tượng. Tên đích là ID.png trong `public/assets/`: 512×512, 1:1, PNG RGBA trong suốt; có thể kèm SVG master sạch. Giữ padding 7%, silhouette và điểm neo giữa đáy gần (60,112). Không crop lề trong suốt hoặc tính hitbox từ alpha.

| ID / tên file đích        | Mục đích và tương tác                                   |
| ------------------------- | ------------------------------------------------------- |
| tree / tree.png           | Cây táo: rung tán, táo rơi                              |
| cloud / cloud.png         | Mây kéo được; mưa khi chạm/thả                          |
| sun / sun.png             | Nguồn nắng; chạm/thả vào luống                          |
| flower / flower.png       | Hướng dương, hoa vườn, chọn hạt, trang trí, thương hiệu |
| carrot / carrot.png       | Chọn hạt, cây lớn, thức ăn/yêu cầu bữa trưa             |
| berry / berry.png         | Chọn hạt, cây lớn, thức ăn/yêu cầu bữa trưa             |
| butterfly / butterfly.png | Bướm vườn, trang trí, sổ tay                            |
| worm / worm.png           | Sinh vật hiện từ cỏ                                     |
| bug / bug.png             | Bọ rùa; dùng chung hình cho dế trong sổ                 |
| bird / bird.png           | Chim trên cành; hót và nhảy                             |
| rabbit / rabbit.png       | Thỏ vườn, hướng dẫn, bữa ăn; phản ứng vui/suy nghĩ      |
| fish / fish.png           | Cá trong ao; phản ứng bơi                               |
| apple / apple.png         | Quả rơi, thức ăn/yêu cầu bữa trưa                       |
| house / house.png         | Vườn chính và editor; năm màu tường                     |
| rainbow / rainbow.png     | Nền khám phá mưa+nắng lâu dài                           |
| rock / rock.png           | Nghiêng để lộ bọ rùa                                    |
| grass / grass.png         | Bụi rung và hình đại diện mầm cây                       |
| pond / pond.png           | Mặt nước, lá sen và gợn                                 |
| basket / basket.png       | Đích thả bữa ăn; dấu đếm render riêng                   |
| star / star.png           | Trang trí nhà và ngôi sao phản hồi bữa ăn               |

Các nền hiện nằm trong `src/style.module.css`; đầu ra đích là PNG (có thể kèm SVG master). Tên file này chỉ file thay thế tương lai, chưa tồn tại.

| File đích      | Kích thước / tỉ lệ | Nền        | Mục đích / selector hiện tại |
| -------------- | ------------------ | ---------- | ---------------------------- |
| sky.png        | 2400×1400 / 12:7   | kín        | Gradient trời / .garden      |
| hill-back.png  | 2400×1400 / 12:7   | trong suốt | Đồi xa / .hill-back          |
| hill-front.png | 2400×1400 / 12:7   | trong suốt | Đồi gần / .hill-front        |
| path.png       | 1200×1400 / 6:7    | trong suốt | Lối đất / .path              |
| soil.png       | 512×256 / 2:1      | trong suốt | Luống / .soil                |
| house-yard.png | 1160×560 / 29:14   | kín        | Sân editor / .house-canvas   |

Icon hiện có: `public/icon.svg` (viewBox vuông 192) và `public/icon-180.png`, `icon-192.png`, `icon-512.png`, PNG vuông nền kín raster từ SVG đó. Không animation. Chữ UI, nút cài đặt/âm thanh/sổ, chấm đếm, dấu cộng, focus và mũi tên gợi ý do app render, không sinh trong ảnh. Bong bóng thỏ dùng lại ID thức ăn; ngôi sao vui dùng star. Trang trí ngoài vườn dùng lại ID hoa/bướm/ngôi sao đã lưu.

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
> ID đối tượng: tree, cloud, sun, flower, carrot, berry, butterfly, worm, bug, bird, rabbit, fish, apple, house, rainbow, rock, grass, pond, basket, star. Xuất mỗi ID.png, RGBA trong suốt 512×512, padding khoảng 7%, neo giữa đáy khớp (60,112) trong canvas 120×120 hiện tại. Không crop/đổi tỉ lệ. Cà rốt phải rõ màu cam; dâu đỏ/hồng. Nhà cần mask tường đổi màu riêng. Tách thân/tán/táo, mây/mưa, bờ/nước/gợn/lá/cá, mái/tường/cửa và trang trí. Không nhúng UI, vùng chạm hoặc luật chơi.
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
- [ ] Cập nhật cả hai handoff, provenance và TODO; chỉ đánh xong khi gameplay/khôi phục còn hoạt động.
