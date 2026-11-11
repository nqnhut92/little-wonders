[English](README.md)

# Little Wonders

Khu vườn truyện tranh ưu tiên cảm ứng, dành cho trẻ Việt Nam 4–6 tuổi, dùng React, TypeScript strict, CSS Modules và Vite. Hình ảnh là SVG/vector tạm tự tạo. Không cần AI trả phí, quảng cáo, theo dõi hành vi hoặc backend liên tục.

## Đã triển khai

- Khu vườn liên tục với phản ứng khác nhau của cây, mây, nắng, ao, động vật và hoa.
- Ba luống/loại cây; cần cả nước và nắng để lớn.
- Bốn biến thể bữa thỏ: ba cà rốt, ba món tự chọn, hai dâu, một táo. Yêu cầu bằng hình, phản ứng nhẹ và lưu bữa chưa xong hỗ trợ trẻ chưa đọc.
- Năm màu tường, ba loại trang trí và bố cục lưu hiện ở vườn chính.
- Sổ có 18 khám phá ý nghĩa, không khóa hoạt động cơ bản.
- Lưu cục bộ tức thì, backup theo hồ sơ, merge nhiều tab cùng hồ sơ, gửi batch/retry và cache shell ngoại tuyến.
- Google OpenID Connect cho phụ huynh, nickname cho bé, API Neon kiểm ownership, CSRF và cookie session bảo mật.

Google/Neon cần cấu hình bên ngoài. Chơi khách dùng local được; Vite riêng không chạy API. OAuth thật, Neon qua mạng, routing Vercel và iPad Safari vật lý chưa kiểm chứng. Xem [review](docs/SELF_REVIEW.vi.md) và [bàn giao mỹ thuật](docs/ARTWORK_HANDOFF.vi.md).

## Chạy và kiểm thử

Dùng Node 22+ và checkout hiện tại; không cần worktree.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run docs:check
npm run build
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

Dùng `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` cho Chromium hệ thống hoặc `PLAYWRIGHT_BROWSERS_PATH` ghi được. Browser test phục vụ production build. Chạy full-stack local: chép `.env.example` sang `.env.local`, cấu hình Neon phát triển và callback Google, chạy `migrations/001_initial.sql`, rồi `npx vercel dev`. Cookie Secure cần secure context tương thích.

## Deploy

1. Tạo Neon free tier và chạy `migrations/001_initial.sql` trong SQL editor.
2. Cấu hình Google OAuth web client với `openid` và callback chính xác `https://YOUR_HOST/api/auth/callback`.
3. Import Vercel dùng `vercel.json`: `npm ci`, `npm run build`, output `dist`.
4. Đặt biến server-only `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (32+ ký tự ngẫu nhiên), `APP_URL` (origin HTTPS chính xác, không / cuối).
5. Kiểm đăng nhập, tạo nickname, khôi phục hai máy, hết session và nối lại mạng trước phát hành.

Không commit secret hoặc dùng `VITE_` cho chúng. Chưa tạo/mua cloud resource. Xem [triển khai](docs/DEPLOYMENT.vi.md).

## Chính sách dữ liệu

Khám phá merge union. Field có stamp dùng bộ đếm logic vượt mọi chỉnh sửa đã thấy, writer ID riêng mỗi lần mở app để phân xử khi bằng clock. Chỉnh sửa mới không đọc giờ máy; clock cũ vẫn tương thích. Chỉnh đồng thời cùng field chọn một giá trị toàn bộ, gồm cả bố cục trang trí. Không phải editor cộng tác từng đồ. Server merge nguyên tử, retry giống nhau không tăng revision. Không lưu lịch sử từng cú chạm. Xem [kiến trúc](docs/ARCHITECTURE.vi.md).

## Tài liệu và ảnh

Mỗi README/tài liệu có cặp EN/VI liên kết đầu trang. Cập nhật cả hai khi hành vi/hướng dẫn đổi; rà ý nghĩa rồi chạy `npm run docs:sync` ghi hash. `npm run docs:check` chạy trong CI, từ chối bản dịch thiếu, chưa ghi nhận hoặc thay đổi. Hash phát hiện lệch phiên bản, không kiểm chứng dịch đúng nghĩa. Xem [quy định tài liệu](docs/DOCUMENTATION.vi.md).

Khi production preview chạy, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture.mjs` dùng chạm thật để tìm đủ 18 khám phá và chụp 19 ảnh, gồm lưu qua reload. Không cấy progress fixture. File ở `artifacts/screenshots/` được ignore.

Xem [gameplay](docs/GAMEPLAY.vi.md), [kiểm thử](docs/TESTING.vi.md), [việc tiếp theo](docs/TODO.vi.md).
