# Bàn giao mỹ thuật — Little Wonders

Bản hiện tại dùng SVG/vector tạm do lập trình viên tạo trong dự án, không có ảnh Gemini hoặc ảnh stock. Không coi đây là mỹ thuật production. Trò chơi phải luôn chơi được trong lúc thay hình. Khi thêm hoặc thay asset, cập nhật tài liệu này trong cùng commit.

## Định hướng

Khu vườn cổ tích ấm áp dành cho trẻ Việt Nam 4–6 tuổi. Nét viền xanh rêu mềm, nhân vật tròn và thân thiện, ánh sáng ban ngày tản đều từ góc trên phải. Bảng màu hiện tại: trời xanh nhạt `#dceceb`, cỏ `#d1dfa9`, viền `#52684e`, hoa vàng `#e9bd58`, thỏ kem `#fff5df`, má hồng `#edb9a6`, mái nhà đỏ đất `#bc7f70`. Không dùng tương phản chói, bóng đổ cứng, chi tiết nhỏ gây nhiễu hoặc nhân vật đáng sợ. Không viết chữ trong ảnh.

## Nguồn và quy cách chung

Mọi ID bên dưới hiện được vẽ tại `src/components/Art.tsx`, component `Art`, trong viewBox `0 0 120 120`. Vị trí tương tác thuộc `Garden.tsx` hoặc `Activities.tsx`, không thuộc file hình. Hiện chưa có file rời cho từng ID. Tên target dưới đây là tên dành cho lần thay artwork, không phải file đang tồn tại.

Asset riêng: xuất PNG RGBA nền trong suốt, 512×512, tỉ lệ 1:1, kèm SVG nếu công cụ cung cấp vector sạch. Giữ nội dung chính trong khoảng 8–112/120 để không cắt khi rung. Giữ điểm neo mặc định giữa đáy (60,112); nhà và cây không di chuyển nền. Không crop alpha sát mép. Không thay kích thước hitbox theo đường alpha.

## Danh mục đầy đủ

| ID / tên file tương lai                                     | Mục đích và vị trí hiện tại                                             | Kích thước, tỉ lệ, nền                | Trạng thái và liên kết                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| tree / tree.png                                             | Cây táo bên trái, Art.tsx                                               | 512², 1:1, trong suốt                 | Đứng yên, rung lá, táo rơi; button Cây táo ghi apple                   |
| cloud / cloud.png                                           | Mây kéo được phía trên, Art.tsx                                         | 512², 1:1, trong suốt                 | Trôi, chạm, mưa; kéo vào data-soil tưới luống, chạm tưới cả ba         |
| sun / sun.png                                               | Nắng kéo được, Art.tsx                                                  | 512², 1:1, trong suốt                 | Tia sáng, phản ứng; kéo/chạm cung cấp nắng                             |
| flower / flower.png                                         | Hướng dương, hoa vườn, trang trí, logo nhỏ, Art.tsx                     | 512², 1:1, trong suốt                 | Mầm dùng grass; hoa trưởng thành, rung, gọi bướm; giữ thân/đáy cố định |
| carrot / carrot.png                                         | Hạt đại diện, cây trưởng thành, thức ăn, Art.tsx                        | 512², 1:1, trong suốt                 | Đứng yên, kéo, được nhận vào giỏ; màu cam dễ phân biệt                 |
| berry / berry.png                                           | Hạt dâu, cây trưởng thành, thức ăn, Art.tsx                             | 512², 1:1, trong suốt                 | Kéo, phản hồi bữa ăn; giữ màu hồng đỏ                                  |
| butterfly / butterfly.png                                   | Bướm sau hoa, trang trí, sổ tay, Art.tsx                                | 512², 1:1, trong suốt                 | Cánh khép/mở, bay, chạm, phát hiện                                     |
| worm / worm.png                                             | Sinh vật hé từ cỏ, Art.tsx                                              | 512², 1:1, trong suốt                 | Uốn mình, chào, xuất hiện; không gộp vào ảnh cỏ                        |
| bug / bug.png                                               | Bọ rùa dưới đá; biểu tượng đại diện nhóm côn trùng/dế trong sổ, Art.tsx | 512², 1:1, trong suốt                 | Hé lộ, nhảy nhẹ, phát hiện; MVP dùng chung hình bọ cho mục dế          |
| bird / bird.png                                             | Chim trên cành, Art.tsx                                                 | 512², 1:1, trong suốt                 | Đứng, nhảy, hót; giữ chân neo trên cành                                |
| rabbit / rabbit.png                                         | Thỏ vườn, bữa ăn, hướng dẫn cuối màn, Art.tsx                           | 512², 1:1, trong suốt                 | Chớp mắt, tai vẫy, vui khi ăn, mời thử lại; không mặt buồn gay gắt     |
| fish / fish.png                                             | Cá xuất hiện trong ao, Art.tsx                                          | 512², 1:1, trong suốt                 | Bơi/quẫy đuôi, chạm; độc lập mặt nước                                  |
| apple / apple.png                                           | Táo rơi từ cây, thức ăn, Art.tsx                                        | 512², 1:1, trong suốt                 | Rơi, kéo, phản hồi; không gộp bóng rơi cố định                         |
| house / house.png                                           | Nhà ngoài vườn và khung sáng tạo, Art.tsx                               | 512², 1:1, trong suốt                 | Tĩnh, chọn màu; cần tách tường thành mask để hỗ trợ năm màu hiện có    |
| rainbow / rainbow.png                                       | Sau khi gặp mưa và nắng, Art.tsx                                        | 512², 1:1, trong suốt                 | Hiện nhẹ sau cảnh, không nhận touch ở vườn                             |
| rock / rock.png                                             | Đá che bọ rùa, Art.tsx                                                  | 512², 1:1, trong suốt                 | Nghiêng/lật, phát hiện; sinh vật riêng                                 |
| grass / grass.png                                           | Bụi cỏ và mầm cây, Art.tsx                                              | 512², 1:1, trong suốt                 | Rung, hé lộ; mầm nhỏ phóng theo chiều cao renderer                     |
| pond / pond.png                                             | Ao nước trái dưới, Art.tsx                                              | 512², 1:1, trong suốt                 | Vòng gợn/động nước, cá riêng; giữ diện tích nước tương đương           |
| basket / basket.png                                         | Drop target bữa trưa, Art.tsx                                           | 512², 1:1, trong suốt                 | Đứng, nhận thức ăn; ba chấm số lượng do app vẽ                         |
| star / star.png                                             | Trang trí sân, Art.tsx                                                  | 512², 1:1, trong suốt                 | Đặt/kéo, không phải huy hiệu tính điểm                                 |
| sky / sky.png                                               | Gradient .garden trong src/style.css                                    | 2400×1400, 12:7, nền kín              | Lớp xa nhất, không nhận touch                                          |
| hill-back / hill-back.png                                   | .hill-back, style.css                                                   | 2400×1400, 12:7, trong suốt           | Đồi sau, độc lập tương tác                                             |
| hill-front / hill-front.png                                 | .hill-front, style.css                                                  | 2400×1400, 12:7, trong suốt           | Đồi trước nhưng dưới đối tượng                                         |
| path / path.png                                             | .path, style.css                                                        | 1200×1400, 6:7, trong suốt            | Lối đất, không nhận touch                                              |
| soil / soil.png                                             | .soil/.soil-mark, style.css                                             | 512×256, 2:1, trong suốt              | Luống trống và đã gieo, data-soil hitbox không đổi                     |
| house-yard / house-yard.png                                 | .house-canvas gradient, style.css                                       | 1160×560, 29:14, nền kín              | Sân để đặt đồ; tọa độ phần trăm giữ nguyên                             |
| icon / icon.svg và icon-180.png, icon-192.png, icon-512.png | public/                                                                 | SVG 192²; PNG 180²,192²,512²; nền kín | Biểu tượng cài ứng dụng, PNG tạo từ SVG gốc, không animation           |

Cỏ/đồi/lối đi chưa có texture hoặc các lớp tiền cảnh rời ngoài danh mục trên. Không ghi các đối tượng chưa triển khai thành asset hiện có. Các nút, chữ, icon bánh răng, ký hiệu âm thanh, sổ tay, chấm đếm, dấu cộng, focus và gợi ý là UI do app render, không phải ảnh cần Gemini tạo.

## Nhất quán nhân vật

Thỏ: thân kem tròn, đầu gần tròn, hai tai dài với lòng tai hồng, hai mắt chấm đen nhỏ, mũi chữ V, hai má hồng; không thêm quần áo giữa các tư thế. Giữ đầu khoảng 55% chiều cao thân kể cả tai. Chim: thân xanh xám bầu dục, mỏ vàng hướng phải, chân ngắn. Bướm: cánh trên hồng, cánh dưới vàng, thân xanh rêu mảnh, hai râu. Bọ rùa: vỏ đỏ đất, chấm rêu; sâu xanh nhạt nhiều đốt; cá vàng cam hướng phải. Mây và nắng có mắt chấm, miệng cười nhẹ. Dùng một sheet tham chiếu trước khi tạo các tư thế; giữ seed/reference của công cụ nếu có.

## Animation và phân lớp

Bản tạm dùng CSS transform, không có sprite sheet. Để thay nhanh, trước tiên cung cấp một pose chuẩn khớp pivot cho mỗi ID và giữ animation CSS. Nếu nâng cấp sprite:

- Idle 2–4 frame ở 4–6 fps cho thỏ/chim/cá/sâu; tôn trọng reduced motion bằng frame tĩnh đầu tiên.
- Touch reaction 3–4 frame ngắn dưới 0,8 giây: lá rung, tai vẫy, chim nhảy, đá nghiêng.
- Movement 4 frame cho bướm/cá; chu kỳ không dịch vị trí collision box.
- Discovery 3 frame xuất hiện nhẹ; không nhấp nháy sáng hoặc che các mục tiêu khác.
- Mây tách thân/mặt, giọt mưa riêng 3 frame. Cây tách thân, tán và táo; táo rơi do renderer di chuyển, không vẽ trajectory vào nền.
- Ao tách bờ, nước, gợn, lá nổi; cá ở lớp giữa nước và gợn. Nhà tách mái, tường có mask đổi màu, cửa/cửa sổ; đồ trang trí độc lập.
- Cây trồng dùng cùng điểm neo cho hạt/mầm/trưởng thành. SVG tạm dùng grass cho mầm; không cần chờ hay thêm stage logic vào ảnh.

Thứ tự: trời → cầu vồng → đồi xa → đồi gần/lối → cây/nhà → ao/cỏ/đá → sinh vật → luống/cây trồng → khay hạt → gợi ý → drag ghost → modal. Ngoại lệ được quyết định trong renderer, không baked-in vào artwork.

## Prompt Gemini — sao chép nguyên khối

> Tạo bộ minh họa thay thế cho game Little Wonders dành cho trẻ Việt Nam 4–6 tuổi. Phong cách truyện tranh cổ tích ấm áp, hình dáng tròn rõ, màu pastel dịu, viền xanh rêu #52684e, ánh sáng ban ngày mềm từ trên phải, nền trời #dceceb, cỏ #d1dfa9. Nhân vật thân thiện và dễ đọc ở kích thước hiển thị 60–200 px. Không tạo chữ, logo, watermark, chữ tiếng Anh hoặc tiếng Việt trong ảnh. Không dùng nhân vật thương mại hoặc bắt chước họa sĩ đang sống.
>
> Dùng hình tham chiếu SVG hiện tại của dự án để giữ silhouette và tỷ lệ: thỏ kem #fff5df, tai dài lòng hồng, má #edb9a6, mắt chấm và mũi V; chim xanh xám mỏ vàng; bướm cánh hồng trên/vàng dưới; bọ rùa đỏ đất chấm rêu; sâu xanh nhạt; cá vàng cam. Giữ nhân vật giống nhau tuyệt đối giữa pose và sheet, cùng nguồn sáng và độ dày viền. Trước tiên xuất một character reference sheet để kiểm tra, rồi xuất asset riêng, không gộp tất cả vào một hình.
>
> Danh sách ID: tree, cloud, sun, flower, carrot, berry, butterfly, worm, bug, bird, rabbit, fish, apple, house, rainbow, rock, grass, pond, basket, star. Mỗi file PNG RGBA trong suốt 512×512, content padding khoảng 7%, pivot giữa đáy tương ứng (60,112) trong viewBox 120×120 hiện tại. Không crop sát hoặc đổi aspect ratio. Giữ màu cam rõ cho carrot, đỏ/hồng cho berry để trẻ phân loại. House phải có lớp tường/mask riêng đổi được năm màu. Tách tree thành thân/tán và apple; cloud và rain riêng; pond bờ/nước/gợn/lá, fish riêng. Không đưa trò chơi, vùng click hoặc chữ hướng dẫn vào hình.
>
> Nền riêng: sky 2400×1400 nền kín; hill-back và hill-front 2400×1400 alpha; path 1200×1400 alpha; soil 512×256 alpha; house-yard 1160×560 nền kín. Chúng phải ghép lớp liên tục, không che mục tiêu tương tác. Không vẽ sinh vật hay đồ tương tác vào nền.
>
> Với rabbit/bird/fish/worm cung cấp idle 2–4 frame, touch 3–4 frame; butterfly cung cấp 4 frame bay; tree/rock/grass cung cấp phản ứng nhẹ 3–4 frame; cloud rain 3 frame. Mỗi frame giữ cùng canvas và pivot, không tự dịch hitbox. Kèm pose tĩnh rõ cho reduced motion. Xuất từng frame PNG riêng có hậu tố -idle-01, -touch-01, -move-01, -discover-01; ghi kích thước và frame rate trong manifest riêng. Không giả lập UI thành artwork. Chưa có hệ sprite trong MVP, vì vậy file pose chuẩn tên ID.png là đầu ra bắt buộc để thay ngay mà không thay luật chơi.
>
> Chỉ dùng nội dung được phép phân phối công khai. Ghi lại công cụ/model, ngày tạo, prompt, reference nguồn do dự án sở hữu, điều khoản sử dụng và mọi chỉnh sửa. Không khẳng định quyền sử dụng khi chưa kiểm tra điều khoản hiện hành. Không tạo ảnh cuối cùng từ tài nguyên có nguồn không rõ.

## Checklist thay thế

- [ ] Lưu provenance và quyền sử dụng trong `public/assets/PROVENANCE.md`; không lấy ảnh không rõ nguồn.
- [ ] Chốt reference sheet và đánh giá phù hợp trẻ nhỏ, không chữ trong ảnh.
- [ ] Đặt file theo ID ổn định dưới `public/assets/`; Art adapter giữ nguyên props `id`/`color`, viewBox và accessible label nằm ở button.
- [ ] Giữ hitbox DOM, data-soil, pointer capture, z-index và tọa độ phần trăm. Không tính collision theo pixel ảnh.
- [ ] Tách tường nhà đổi màu; thử đủ năm màu và các trang trí được lưu trước đó.
- [ ] Thử các kích thước iPad, kéo chạm, reduced motion và desktop; hình không cắt hoặc che mục tiêu.
- [ ] Chạy typecheck, lint, Vitest, production build và Playwright. Kiểm tra offline có cache các file ảnh mới: service worker hiện tự cache bundle, với PNG mới cần thêm inventory vào precache.
- [ ] Kiểm tra icon PNG và manifest, cập nhật cache hash theo nội dung asset nếu tên URL không có hash.
- [ ] Cập nhật tài liệu này và TODO theo asset thực tế. Chỉ đánh dấu hoàn tất khi game vẫn chơi và phục hồi tiến trình được.
