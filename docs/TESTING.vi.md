[English](TESTING.md)

# Kiểm thử

Chạy `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` và `npm run docs:check`.

Vitest kiểm luật chơi, biến thể bữa ăn, clock logic, lưu/retry, backup hồ sơ, session hết hạn/sửa giả, CSRF và ownership. PGlite thực thi migration PostgreSQL thật và truy vấn API qua adapter Neon thay thế; không chứng minh kết nối Neon thật.

Cài trình duyệt bằng `npx playwright install --with-deps chromium webkit`, rồi `npm run test:e2e`. Test dùng production preview để chạy service worker. Chromium kiểm desktop; project WebKit dùng viewport iPad có touch. Chọn browser hệ thống bằng `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Đặt `PLAYWRIGHT_BROWSERS_PATH` tới nơi ghi được nếu cần.

Luồng browser gồm trồng/sổ tay, lưu nhà, bữa đúng/sai, kéo, reload offline, reduced motion, giới hạn cảnh, tưới đúng luống, UI hết session, phản hồi hồ sơ trễ, bữa chưa xong, merge tab và trang trí ngoài vườn. Kết quả chỉ báo sau khi chạy; project cấu hình không mặc nhiên là đã kiểm chứng.

## Bằng chứng môi trường và kiểm tra tay

Môi trường triển khai đã chạy Chromium, Vitest, typecheck, lint và production build. Tải WebKit bị `403 Domain forbidden` tại `cdn.playwright.dev`; lưu draft cấu hình cũng lỗi. Chưa có credentials Google/Neon hoặc iPad vật lý. Các tích hợp đó chưa kiểm chứng.

Trước phát hành, kiểm iPad Safari thật: multi-touch, xoay, safe area, bàn phím nickname, reduced motion, giọng Việt, thêm màn hình chính và mở offline. Kiểm Google thật, xung đột hai thiết bị, cô lập tài khoản khác và retry sau hết session.

`scripts/capture.mjs` dùng chạm thật từ vườn trống đến đủ 18 khám phá, chụp 19 ảnh, reload thiết kế và ghi page error. Không cấy progress fixture. Kết quả ở `artifacts/screenshots/` được ignore.

## API giả lập và service worker

Hai regression test tài khoản dùng `page.route` để giả lập hết session và phản hồi hồ sơ sai thứ tự. Khối describe của chúng tắt service worker để fetch WebKit không đi qua worker đang điều khiển và né routing của Playwright. Chỉ test giả lập áp dụng cấu hình này; test offline vẫn dùng worker production thật. Test phản hồi trễ chờ request đầu thực sự bị chặn rồi mới chọn hồ sơ thứ hai; không dùng sleep hoặc handler rỗng thay cho race.
