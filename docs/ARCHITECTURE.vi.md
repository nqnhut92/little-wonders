[English](ARCHITECTURE.md)

# Kiến trúc

React, TypeScript strict, Vite và CSS Modules render DOM/SVG. Không cần Phaser cho cảnh nhỏ này; pointer capture hỗ trợ chạm và chuột. Không có backend chạy liên tục hoặc dịch vụ AI trả phí.

## Luồng dữ liệu

Garden/Activities → Action có kiểu → apply → World → localStorage tức thì → debounce 1,5 giây → API serverless có xác thực → PostgreSQL merge_world nguyên tử.

- `src/game/engine.ts`: điều kiện cây, khám phá và merge field; độc lập renderer.
- `src/game/lunch.ts`: bốn biến thể bữa ăn và luật nhận món/đếm.
- `src/game/hints.ts`: gợi ý theo trạng thái cây/khám phá hiện tại.
- `src/data`: danh mục khám phá, lời thoại và điều kiện tương tác.
- `src/components`: SVG, khu vườn, nhà, bữa ăn và sổ tay.
- `src/services`: lưu, retry, âm thanh. `App.tsx` điều phối hồ sơ và navigation.
- `src/styles`: token thiết kế (`tokens.css`) và bản sao cục bộ của các khối focus và thanh cuộn dùng chung. `src/ui`: bộ điều khiển theme và vùng cuộn, không phụ thuộc framework. `src/components/Icons.tsx`: icon giao diện.
- `api/index.ts`, `api/_lib/security.ts`: OAuth, session ký, ownership và CSRF.

## Lưu và xung đột

World schema 2 (schema 1 vẫn được nhận và nâng cấp khi đọc bằng hàm thuần, idempotent `upgradeWorld`) chứa `epoch`, ID khám phá và các field `{value,clock,device}`. Khám phá merge theo union. `epoch` cao hơn (tăng bởi action `resetAll`, thiếu thì coi là 0) thay thế toàn bộ world của epoch thấp hơn. Field tên `n.<tên>` là bộ đếm: giá trị lớn hơn luôn thắng bất kể clock, nên tiến độ không bao giờ lùi. `mergeWorld` (TypeScript) và `merge_world` (migration 002) cài cùng quy tắc, và `tests/world-v2.test.ts` chạy cả hai trên cùng fixture. ID khám phá gồm chữ thường, số, gạch dưới tối đa 32 ký tự, có tiền tố nhóm; API kiểm theo mẫu thay vì danh sách cố định, cho phép 200 khám phá và 200 field, và kiểm từng field theo mẫu key (`api/index.ts`). Định danh, mẫu và giới hạn nằm ở `src/data/ids.ts`. Migration 001 không bao giờ bị sửa. Khi đang deploy, API cũ có thể gọi hàm SQL mới với payload v1, vẫn hợp lệ; client bản trước đợt này tải lại world schema 2 sẽ bỏ bản trên máy và lấy lại từ server. Chỉnh sửa mới dùng bộ đếm logic lớn hơn mọi clock đã thấy, không dùng giờ máy. Mỗi lần mở app sinh writer ID ngẫu nhiên để các tab không tạo cùng cặp writer/clock. Clock bằng nhau chọn writer theo thứ tự ký tự. Clock kiểu timestamp cũ vẫn tương thích: chỉnh sửa sau tăng vượt chúng.

Storage event chỉ merge tab khác khi cùng hồ sơ. Mỗi hồ sơ có bản dự phòng riêng. Request của lựa chọn hồ sơ cũ không thay lựa chọn hiện tại. Bữa ăn đang làm, bữa đã xong, luống cây, màu nhà và trang trí được lưu dài hạn. Thay đổi quan trọng lưu ngay rồi gửi batch; lỗi mạng/401 giữ pending. Retry khi có mạng và mỗi 30 giây.

Server UPDATE merge dưới khóa hàng. Retry giống nhau không tăng revision. Đơn vị xung đột là field: hai bố cục đồng thời chọn một bố cục toàn bộ, không union đồ trang trí. Bộ đếm logic giữ thứ tự đã quan sát, không suy ra thứ tự thời gian thực giữa thiết bị mất kết nối. Client cũ/mới và chỉnh cùng field vẫn cần kiểm thử trước phát hành. Không thu lịch sử từng cú chạm.

## Lưu trữ và bảo mật

`parents` chỉ chứa Google subject; `profiles` chứa owner, nickname, world JSONB có version và revision. Khám phá và thiết kế là thành viên gọn trong document này. `schema_migrations` theo dõi migration; `rate_limits` chứa bucket hash ngắn hạn.

Parent identity lấy từ session ký, không nhận user ID do client khai báo. Mọi thao tác hồ sơ lọc parent ID. POST cần Origin chính xác và header riêng. OAuth kiểm state ký, nonce, chữ ký Google, issuer và audience. Cookie Secure, HttpOnly, SameSite=Lax. API xác thực dùng no-store và không được service worker cache.

## Ngôn ngữ thiết kế giao diện

Màu, bo góc và font là biến CSS trong `src/styles/tokens.css`; `src/style.module.css` không còn màu viết cứng. Bộ token Sáng là mặc định, `:root[data-theme="dark"]` ghi đè. Các vùng cảnh (`.garden`, `.house-canvas`, `.lunch-scene`) lặp lại token Sáng và dùng bảng màu `--scene-*` không theo theme, nên tranh trông giống nhau ở mọi chế độ; tranh đặt trên bảng theo theme nằm trên một nền sáng. Ngày và đêm của game sẽ là trạng thái game, độc lập với chế độ giao diện.

Lựa chọn (`system`, `light`, `dark`) lưu theo trình duyệt trong localStorage với khóa `little-wonders-theme` và không bao giờ đồng bộ. Script nội tuyến trong `index.html` xác định nó trước lần vẽ đầu; `ThemeToggle.tsx` bọc bộ điều khiển, vốn chỉ theo thay đổi hệ thống ở chế độ Theo hệ thống, giữ lựa chọn trong bộ nhớ khi storage bị chặn, đồng bộ giữa các tab và cập nhật `theme-color`. Khóa lưu và màu phải khớp ở cả hai nơi (`tests/design.test.ts`).

Game không có header hay thanh dưới. Cảnh phủ kín viewport (`100dvh`, tính cả vùng an toàn) và các nút nổi trên cảnh: thỏ hướng dẫn kèm nút gợi ý ở góc trên trái, một cột ở góc trên phải (âm thanh, sổ, nghỉ, rồi Góc người lớn, chế độ giao diện và trạng thái lưu). Vật trong cảnh giữ vị trí theo phần trăm; kích thước dùng một đơn vị cảnh `--u: min(1cqw, 1.9cqh)`, nên màn rất rộng hay rất cao không đẩy vật ra ngoài cảnh, và có test trình duyệt kiểm không nút nào che vật chạm được ở cỡ iPad, desktop và siêu rộng. Nút dành cho bé 56px, nút người lớn 44px. Nút nổi, khay hạt và hộp thoại dùng chất liệu kính; ở chế độ Tối các nút có nền gần như đặc vì cảnh luôn sáng. Có nền đặc dự phòng khi không hỗ trợ blur, khi giảm độ trong suốt và ở forced colors. Hộp thoại giữ nút đóng bên ngoài phần cuộn. `index.html` có splash trong `#root`; danh sách hồ sơ hiện skeleton có nhãn; trạng thái lưu là icon, chữ nằm ở nhãn và tooltip.

## Ngoại tuyến và hiển thị

Service worker precache shell và bundle. File font Nunito được tham chiếu từ CSS chứ không từ HTML, nên bản build liệt kê mọi `.woff2` trong bundle vào worker để dùng ngoại tuyến. Cache ID phụ thuộc nội dung build; worker mới chờ đóng tab cũ, không ngắt trò chơi. SVG scale theo tỉ lệ cảnh có giới hạn; reduced-motion tắt animation. Âm thanh chỉ bắt đầu sau thao tác và được giới hạn tần suất. Lời nói dùng giọng Việt nếu có, còn hình ảnh và hiệu ứng tổng hợp vẫn dùng được khi không có giọng.
