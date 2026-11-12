[English](ARCHITECTURE.md)

# Kiến trúc

React, TypeScript strict, Vite và CSS Modules trực tiếp dựng DOM và SVG. Pointer capture gốc xử lý thao tác chạm và chuột mượt mà, không cần game engine nặng nề hay backend chạy liên tục.

## Luồng dữ liệu

Garden/Activities → Action có kiểu → `apply` → `World` → lưu `localStorage` tức thì → debounce 1,5 giây → API serverless có xác thực → PostgreSQL `merge_world` nguyên tử.

- `src/game/engine.ts`: điều kiện cây lớn, tặng quà, nấu ăn, khám phá và gộp (merge) các trường dữ liệu; hoàn toàn độc lập với trình dựng hình.
- `src/game/lunch.ts`: trạng thái Lời mời của bạn thú và bộ chuyển đổi cách phát âm tiếng Việt tự nhiên cho Lucky, Tuần Lộc nhỏ và Capybara.
- `src/game/hints.ts`: gợi ý theo ngữ cảnh dựa trên trạng thái cây trồng, giỏ đồ, bạn thú và khám phá hiện tại.
- `src/game/visitors.ts` & `src/game/events.ts`: các hàm chọn thuần cho khách thăm vườn và sự kiện bất ngờ khi bé nghỉ tay (nhận hàm sinh số ngẫu nhiên tiêm từ ngoài).
- `src/data`: danh mục khám phá, cây trồng, bạn đồng hành (`pals.ts`), công thức nấu ăn, vùng đất, cảnh theo dữ liệu (`scenes.ts`) và quy tắc tương tác.
- `src/components`: bộ tranh SVG chibi biểu cảm (`Art.tsx` cùng các bản vẽ trong `ArtFlat.tsx` và `ArtFlatMore.tsx`, cảnh nền tràn viền và bản đồ thung lũng trong `SceneBackdrop.tsx`, hiệu ứng phát sáng cho đèn trong `PaintFilters.tsx`), trình dựng cảnh theo dữ liệu (`Garden.tsx`), bản đồ thung lũng (`ValleyMap.tsx`), bếp, bạn thú, ngôi nhà, đàn gỗ và sổ khám phá.
- `src/services`: lưu trữ cục bộ, hàng đợi gửi lại (retry) và âm thanh Web Audio / đọc giọng nói (`little-wonders-audio` lưu theo trình duyệt, mặc định tắt). `App.tsx` điều phối hồ sơ, vùng đất và các bảng hoạt động.
- `src/styles`: biến thiết kế (`tokens.css`) cùng kiểu vòng focus và thanh cuộn dùng chung. `src/ui`: bộ điều khiển vùng cuộn độc lập framework. `src/components/Icons.tsx`: icon giao diện.
- `api/index.ts` và `api/_lib/security.ts`: Google OAuth, phiên đăng nhập có chữ ký, kiểm tra quyền sở hữu hồ sơ và chống CSRF.

## Lưu trữ và giải quyết xung đột

World schema 2 (schema 1 vẫn được chấp nhận và tự nâng cấp khi đọc qua hàm thuần, idempotent `upgradeWorld`) lưu `epoch`, danh sách ID khám phá và các trường có nhãn `{value, clock, device}`. Khám phá được gộp theo phép hợp (union). Giá trị `epoch` cao hơn (tăng khi gọi `resetAll`; mặc định 0 nếu khuyết) sẽ thay thế toàn bộ dữ liệu của `epoch` thấp hơn. Các trường bắt đầu bằng `n.` là bộ đếm đơn điệu chỉ tăng: giá trị số lớn hơn luôn thắng bất kể clock để số lần tặng quà và mở truyện của bạn thú không bao giờ bị lùi. `mergeWorld` (TypeScript) và `merge_world` (`migrations/002_world_v2.sql`) thực thi cùng một tập quy tắc và được kiểm chứng chéo trong `tests/world-v2.test.ts`.

ID khám phá tuân theo mẫu `/^[a-z0-9_]{1,32}$/` và phân nhóm theo tiền tố (`harvest_`, `rare_`, `region_`, `pal_`, `story_`, `dish_`). Toàn bộ định danh, mẫu kiểm tra và giới hạn nằm tại `src/data/ids.ts`. Mỗi chỉnh sửa mới tăng bộ đếm logic vượt lên trên mọi clock đã thấy, kết hợp UUID thiết bị sinh ngẫu nhiên mỗi lần mở ứng dụng để phân xử khi bằng clock.

Sự kiện `storage` giữa các tab chỉ gộp thay đổi khi cùng một hồ sơ. Thay đổi quan trọng được lưu ngay vào `localStorage` rồi gửi theo đợt lên server; nếu lỗi mạng hoặc hết phiên (401), dữ liệu đang chờ vẫn được giữ nguyên trên máy và tự thử lại khi có mạng hoặc mỗi 30 giây. Câu lệnh `UPDATE` trên server gộp nguyên tử dưới khóa dòng (row lock) và không tăng `revision` nếu nhận lại cùng một nội dung.

## Cơ sở dữ liệu và bảo mật

Bảng `parents` chỉ lưu định danh Google `sub`; bảng `profiles` lưu khóa ngoại chủ sở hữu, tên gọi của bé, cột JSONB `world` và số `revision`. Bảng `schema_migrations` theo dõi các bản nâng cấp SQL; bảng `rate_limits` lưu các nhóm giới hạn tần suất đã băm ngắn hạn.

Danh tính phụ huynh luôn lấy từ cookie phiên có chữ ký (`HttpOnly`, `Secure`, `SameSite=Lax`), không bao giờ tin ID từ phía client gửi lên. Mọi truy vấn đọc/ghi hồ sơ đều lọc theo `parent_id`. Các yêu cầu `POST` kiểm tra chính xác `Origin` và header riêng. Luồng OAuth kiểm tra `state` có chữ ký, `nonce`, chữ ký JWT của Google, `issuer` và `audience`. Phản hồi API có xác thực luôn gắn `Cache-Control: no-store` và không lưu trong bộ nhớ đệm của service worker.

## Cây trồng, thu hoạch và giỏ đồ

Mỗi luống đất được lưu ở trường `plot.<vùng>.<ô>` với cấu trúc `{kind, stage, water, sun, rounds?}`: `stage = 0` là ô đất trống, `1..4` tương ứng hạt giống, nảy mầm, cây lớn và chín. Mỗi vòng tưới đủ nước và sưởi nắng sẽ tích lũy tiến độ theo thông số `care` của từng loại cây (`src/data/crops.ts`). Hành động `harvest` đưa nông sản chín vào `basket` (tối đa 9 mỗi loại), làm trống luống, mở khóa `harvest_<cây>` cùng `pal_reindeer`, đồng thời quay xác suất `1/8` cho các biến thể cây trồng hiếm (`rare_carrot_twin`, `rare_pumpkin_giant`, `rare_berry_heart`).

Hành động `shake` nhặt các vật phẩm trong cảnh (`apple`, `coconut`, `shell`, `pinecone`) bỏ vào giỏ. `resetRegion` (chỉ ở góc người lớn, từng khu đã mở một) làm trống luống cây của khu đó, thêm đồ trang trí nhà nếu là Vườn nhà, nhưng giữ nguyên khám phá, vùng đất đã mở, tiến độ kết bạn và giỏ đồ; `resetAll` (cũng ở góc người lớn, phải xác nhận lần hai) xóa toàn bộ qua `epoch` mới. Góc người lớn nằm sau phép cộng và có hai tab: lưu khu vườn (đăng nhập Google, hồ sơ) và dọn khu vườn. Số lượng luống đất ở vườn nhà (từ 3 đến 6) được suy ra trực tiếp từ số khám phá `harvest_*` khác nhau.

## Bếp của vườn

Công thức nấu ăn được khai báo trong `src/data/recipes.ts` (14 công thức nguyên liệu đã sắp xếp cùng món bất ngờ `dish_mystery`). Hành động `cook` dùng từ 1 đến 3 nguyên liệu thô đang có trong giỏ và thêm món ăn vừa nấu (`dish_*`, tối đa 9) vào giỏ cũng như sổ khám phá. Tổ hợp không khớp công thức chuẩn sẽ tạo ra `dish_mystery` để bé luôn được thưởng khi thử nghiệm. Mỗi món ăn đều có hình minh họa riêng trong `src/components/ArtFlatMore.tsx`.

## Vùng đất, bạn đồng hành và cảnh theo dữ liệu

Cả sáu vùng đất (`garden`, `pond`, `forest`, `beach`, `snow`, `stars`) được định nghĩa trong `src/data/regions.ts` (`ready`, `after`, `counted`, ngưỡng mở `0.7`) cùng bố cục điểm chạm trong `src/data/scenes.ts`. Những vùng không trồng cây (`beach`, `snow`, `stars`) tự động ẩn khay hạt giống, và `sky: false` ở `stars` ẩn mặt trời cùng mây mưa ban ngày.

Các loại điểm chạm gồm có `gather` (thêm `coconut`, `shell` hoặc `pinecone` vào giỏ) và `build` (đắp lâu đài cát, người tuyết hoặc nối chòm sao lớn dần qua từng lần chạm và ghi nhận khám phá ở bước cuối). Mỗi vùng đất có cảnh nền vector 1600×900 riêng trong `src/components/SceneBackdrop.tsx` với bảng màu Ngày/Đêm và chuyển động môi trường (gợn nước, lá thu rơi, sóng biển, tuyết rơi, cực quang và sao lấp lánh) tự động dừng khi bật `prefers-reduced-motion: reduce`.

Hàm thuần `regionsToOpen` trong `src/game/regions.ts` mở khóa vùng tiếp theo ngay khi đạt 70% khám phá có tính điểm của vùng trước đó và ghi `region_<id>_open` vào `discoveries`, giúp trạng thái mở vùng được gộp theo phép hợp và không bao giờ khóa lại. Các khám phá may rủi (`rare_*`, `shooting_star`) không tính vào mẫu số mở vùng.

Ba người bạn đồng hành trong `src/data/pals.ts` (`puppy`, `reindeer`, `capybara`) dùng các bộ đếm đơn điệu `n.gift_<id>` và `n.wish_<id>` để mở khóa 3 chương truyện cho mỗi bạn (`[1, 3, 6]` lần tặng quà) và xoay vòng Lời mời món ăn không hết hạn.

## Ngôn ngữ thiết kế giao diện

Toàn bộ màu sắc, độ bo góc và font chữ được định nghĩa bằng biến CSS trong `src/styles/tokens.css` với bảng màu Sáng kiểu truyện tranh đồng nhất cho cả khung điều khiển lẫn khung cảnh, còn nền cảnh tự chuyển giữa bảng màu Ngày/Đêm theo trạng thái `scene.time` trong game.

Màn hình cảnh phủ kín `100dvh` với các cụm nút nổi hiệu ứng kính mờ: cún Lucky hướng dẫn kèm nút gợi ý ở góc dưới trái, nút quay lại ở góc trên trái khi đang ở trong vùng đất (nằm cạnh bộ đếm giỏ đồ), dải nút hoạt động của bé (`56px+`) dọc góc trên phải, và duy nhất một nút bánh răng Góc người lớn (`44px`) ở góc dưới phải tại màn hình bản đồ thung lũng. Các vật thể trong cảnh co giãn theo đơn vị `--u: min(1cqw, 1.9cqh)`, được kiểm chứng bằng Playwright trên các kích thước màn hình iPad, desktop và màn hình siêu rộng.

## Hoạt động ngoại tuyến và hiển thị

Service worker lưu sẵn (precache) khung ứng dụng và toàn bộ tài nguyên đóng gói, bao gồm các tệp font Nunito `.woff2` tự host (`latin` và `vietnamese`). Âm thanh phát các nốt ngũ cung êm dịu và đọc lời thoại tiếng Việt sau khi người dùng tương tác và bật loa. Sau mỗi lần deploy, trang tự nhận bản mới: `src/services/update.ts` hỏi `sw.js` mới mỗi 30 phút khi tab đang hiện và mỗi khi tab quay lại phía trước, cho service worker mới tiếp quản (`SKIP_WAITING`) rồi chỉ tải lại trang khi tab đang bị ẩn, không có hộp thoại, đếm ngược hay nút nào; tiến độ đang chờ trong bộ nhớ cục bộ vẫn được giữ. Nhạc nền lặp một bản CC0 ở bản đồ thung lũng và một bản khác khi vào vùng đất (`public/assets/music-*.{m4a,mp3}`, được precache để chơi offline), chuyển bản bằng cross-fade, tự nhỏ lại khi đang đọc lời thoại và tạm dừng khi tab bị ẩn.
