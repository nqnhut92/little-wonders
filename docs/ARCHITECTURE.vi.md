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
- `api/index.ts`, `api/_lib/security.ts`: OAuth, session ký, ownership và CSRF.

## Lưu và xung đột

World schema 1 chứa ID khám phá và các field `{value,clock,device}`. Khám phá merge theo union. Chỉnh sửa mới dùng bộ đếm logic lớn hơn mọi clock đã thấy, không dùng giờ máy. Mỗi lần mở app sinh writer ID ngẫu nhiên để các tab không tạo cùng cặp writer/clock. Clock bằng nhau chọn writer theo thứ tự ký tự. Clock kiểu timestamp cũ vẫn tương thích: chỉnh sửa sau tăng vượt chúng.

Storage event chỉ merge tab khác khi cùng hồ sơ. Mỗi hồ sơ có bản dự phòng riêng. Request của lựa chọn hồ sơ cũ không thay lựa chọn hiện tại. Bữa ăn đang làm, bữa đã xong, luống cây, màu nhà và trang trí được lưu dài hạn. Thay đổi quan trọng lưu ngay rồi gửi batch; lỗi mạng/401 giữ pending. Retry khi có mạng và mỗi 30 giây.

Server UPDATE merge dưới khóa hàng. Retry giống nhau không tăng revision. Đơn vị xung đột là field: hai bố cục đồng thời chọn một bố cục toàn bộ, không union đồ trang trí. Bộ đếm logic giữ thứ tự đã quan sát, không suy ra thứ tự thời gian thực giữa thiết bị mất kết nối. Client cũ/mới và chỉnh cùng field vẫn cần kiểm thử trước phát hành. Không thu lịch sử từng cú chạm.

## Lưu trữ và bảo mật

`parents` chỉ chứa Google subject; `profiles` chứa owner, nickname, world JSONB có version và revision. Khám phá và thiết kế là thành viên gọn trong document này. `schema_migrations` theo dõi migration; `rate_limits` chứa bucket hash ngắn hạn.

Parent identity lấy từ session ký, không nhận user ID do client khai báo. Mọi thao tác hồ sơ lọc parent ID. POST cần Origin chính xác và header riêng. OAuth kiểm state ký, nonce, chữ ký Google, issuer và audience. Cookie Secure, HttpOnly, SameSite=Lax. API xác thực dùng no-store và không được service worker cache.

## Ngoại tuyến và hiển thị

Service worker precache shell và bundle. Cache ID phụ thuộc nội dung build; worker mới chờ đóng tab cũ, không ngắt trò chơi. SVG scale theo tỉ lệ cảnh có giới hạn; reduced-motion tắt animation. Âm thanh chỉ bắt đầu sau thao tác và được giới hạn tần suất. Lời nói dùng giọng Việt nếu có, còn hình ảnh và hiệu ứng tổng hợp vẫn dùng được khi không có giọng.
