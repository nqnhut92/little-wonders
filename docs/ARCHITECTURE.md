# Kiến trúc

React quản lý giao diện và SVG. Không dùng Phaser vì số đối tượng nhỏ và cần dùng chung hitbox, khả năng tiếp cận và pointer events trên Safari. Không có vòng lặp canvas liên tục hoặc backend chạy thường trực.

## Luồng dữ liệu

`Garden / Activities → Action → apply → World → localStorage → debounce → /api/progress → PostgreSQL merge_world`.

- `src/game/engine.ts`: luật gieo hạt, nước/nắng, điều kiện khám phá, merge và cấp độ hỗ trợ. Chạy độc lập renderer.
- `src/data/content.ts`: tên, ID, hạt giống, lời gợi ý và 18 khám phá.
- `Garden.tsx`: vị trí thế giới theo phần trăm, pointer capture, giới hạn một thao tác kéo chủ động, hiệu ứng riêng cho từng nhóm vật thể.
- `Activities.tsx`: bữa ăn, thiết kế nhà, sổ tay. Trạng thái dài hạn đi qua Action, không truy cập API trực tiếp.
- `App.tsx`: điều phối navigation, gợi ý sau thời gian khám phá, âm thanh, hồ sơ và lịch gửi.
- `services/progress.ts`: lưu tức thì, bản dự phòng từng hồ sơ và retry. Không ghi lại lịch sử mỗi cú chạm.
- `api/index.ts`: Google OpenID Connect, profiles và progress. `api/_lib/security.ts`: session/CSRF/cookie.

## Curiosity Engine

Action là trigger có kiểu; World chứa trạng thái. `apply` sinh thay đổi thế giới và discovery theo điều kiện: hạt + nước + nắng → cây trưởng thành + bướm; mưa + nắng → cầu vồng. Phát hiện duy nhất theo ID. Hình ảnh và phản hồi dựa trên trạng thái thay vì chỉ đổi thông báo. Lời gợi ý luân phiên; sau thời gian chưa tiến triển, vật liên quan sáng nhẹ. Thao tác chạm mây/nắng là cách đơn giản hơn kéo. Bữa ăn có gợi ý sau ba lựa chọn chưa phù hợp. Có thể thoát bất kỳ hoạt động nào.

## Lưu và xung đột

World schema 1 gồm `discoveries` và `fields`. Mỗi field lưu `{value,clock,device}`. Mỗi chỉnh sửa tăng clock vượt tất cả clock đã thấy. Hợp nhất chọn clock lớn hơn, cùng clock chọn device lớn hơn theo thứ tự ký tự ASCII. Discovery chỉ thêm. Server thực hiện merge trong một UPDATE khóa hàng, không dùng read-then-write dễ race. Retry cùng dữ liệu không tăng revision. Không lưu mỗi lần gửi thành một event mới.

Nhà và bố cục trang trí là các field độc lập; hai thiết bị cùng sửa bố cục sẽ chọn một bố cục theo quy tắc trên. Không tự động trộn các đồ bị xóa. Clock thiết bị lệch có thể ảnh hưởng lựa chọn khi hai thiết bị chưa từng đồng bộ; bản sao cục bộ được giữ. Đây là policy MVP rõ ràng, không phải editor cộng tác.

Dữ liệu được cất ngay khi thao tác quan trọng xảy ra, gửi sau 1,5 giây; retry mỗi 30 giây hoặc sự kiện online. Session hết hạn giữ pending, không ngắt gameplay. Đổi hồ sơ giữ bản cục bộ từng hồ sơ. Kết quả gửi của hồ sơ cũ không được trộn vào hồ sơ mới.

## Database và bảo mật

`parents` chỉ lưu Google subject, không lưu email. `profiles` sở hữu bởi parent, chứa nickname, world JSONB và revision. Discovery và saved creation nằm trong world, tránh nhiều hàng nhỏ; `schema_migrations` version hóa. `rate_limits` giữ bucket hash ngắn hạn. API không tin user ID do client khai báo: parent lấy từ JWT HttpOnly đã ký, mọi SELECT/UPDATE hồ sơ đều có điều kiện parent_id. CSRF yêu cầu exact Origin và header riêng. OAuth state/nonce ký trong cookie ngắn hạn; Google ID token kiểm chữ ký, issuer, audience, nonce. Secure, SameSite=Lax; không cache API.

## Ngoại tuyến và hiệu năng

Service worker cache HTML và bundle cùng origin; API luôn qua mạng. Mỗi build tạo cache ID theo hash HTML chứa tên bundle hash. Worker mới đợi đóng các tab cũ, lần mở tiếp theo nhận shell mới. Không tự refresh giữa lúc chơi. Âm thanh tổng hợp Web Audio chỉ bắt đầu sau thao tác; rate limit 300ms. Chỉ dùng giọng `vi` sẵn có, không dùng giọng tiếng Anh thay thế. SVG phản hồi và biểu tượng hỗ trợ khi không có TTS. Reduced motion tắt animation. Không có asset bên ngoài hoặc canvas Retina quá lớn.
