# Kiểm thử

## Lệnh

`npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

`npm test` chạy Vitest. PostgreSQL nhúng PGlite thực thi migration thật và các truy vấn API qua adapter Neon được thay bằng PGlite; không cần thông tin Neon để kiểm tra isolation và atomic merge. Đây không phải kiểm chứng kết nối Neon qua mạng.

`npx playwright install --with-deps chromium webkit` rồi `npm run test:e2e`. Suite phục vụ production build để kiểm tra service worker thật. Một project desktop Chromium, một project WebKit viewport iPad nằm ngang có touch. Nếu môi trường có Chromium hệ thống: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --project=chromium`. Nếu cache mặc định không ghi được, đặt `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright`.

## Phạm vi

- Unit: điều kiện nước/nắng, unlock, union, tie-break, snapshot cũ, thiết kế, cấp độ gợi ý.
- Lưu: reload pending, lỗi mạng, retry thành công, session hết hạn.
- API + PostgreSQL: session, origin CSRF, ownership cho đọc/ghi, idempotency, schema validation và giữ creations.
- Trình duyệt: gieo cây → sổ tay; nhà đổi màu/đặt đồ → reload; bữa ăn sai/đúng và đếm; pointer kéo hạt/mây; tải lại offline và giữ discovery mới.

## Kiểm tra thủ công trước phát hành

Trên iPad Safari thật: kéo bằng ngón tay, hai ngón chạm cùng lúc, bàn phím nickname, safe areas, xoay màn hình, reduced motion, bật/tắt âm thanh, giọng Việt có/không có, thêm vào màn hình chính và offline sau đóng/mở. Playwright WebKit không thay thế kiểm tra iPad thật.

Google/Neon thật cần biến môi trường và OAuth callback. Kiểm tra hai parent khác nhau, hai thiết bị cùng sửa nhà, pending qua hết hạn session và reconnect. Không coi test fixture là Google đăng nhập thành công.

Kết quả thực tế của lần triển khai được ghi trong báo cáo cuối; phần chưa chạy không được xem là đã qua.

## Bằng chứng trong môi trường triển khai mã

Ngày 11/11/2026: typecheck, lint, production build, kiểm thử Vitest (luật chơi + lưu + API/PostgreSQL nhúng) và Playwright Chromium đã chạy. Script `scripts/capture.mjs` thực hiện một phiên chạm đầy đủ từ vườn trống tới 18 khám phá, chụp 19 ảnh, tải lại và kiểm tra không có page error. Album nằm trong `artifacts/screenshots/` (không commit).

WebKit chưa cài được: proxy trả `403 Domain forbidden` cho `cdn.playwright.dev`. Yêu cầu lưu miền tải vào cấu hình môi trường cũng không xác nhận được do dịch vụ draft báo lỗi. Chromium dùng executable hệ thống. Không có Google/Neon credentials, nên chưa chạy OAuth thật, Neon qua mạng hoặc đồng bộ hai thiết bị thật. Không có iPad vật lý để kiểm chứng Safari/PWA cài lên màn hình chính.
