[English](README.md)

# Little Wonders

Khu vườn truyện tranh ưu tiên cảm ứng, dành cho trẻ Việt Nam 4–6 tuổi, dùng React, TypeScript strict, CSS Modules và Vite. Hình ảnh là SVG/vector tạm tự tạo. Không cần AI trả phí, quảng cáo, theo dõi hành vi hoặc backend liên tục.

## Đã triển khai

- Game mở vào bản đồ thung lũng: **Vườn nhà** sáng sẵn, **Ao sen** mở khóa kèm hoạt ảnh sương tan khi đạt khoảng 70% khám phá có tính điểm của vườn, và mỗi khu sau mở theo cùng cách khi xong khu trước: **Rừng nhỏ** (trồng việt quất và hạt dẻ, nhím trốn trong lá, sóc, chim gõ kiến, nhà nấm chỉ để ngắm, đom đóm ban đêm), **Bãi biển** (lắc cây dừa, nhặt vỏ sò, tìm cua dưới cát, đắp lâu đài cát từng bước, sóng biển, rùa con, hải âu), **Đồi tuyết** (đắp người tuyết, gấu bông tuyết, chim cánh cụt, xe trượt tuyết, bông tuyết, quả thông) và **Núi sao** (kính thiên văn, ông trăng cười, chòm sao hình thỏ sáng dần từng ngôi, đèn ngôi sao, sao băng). Ở bếp, dừa thành nước dừa và hai hạt dẻ thành hạt dẻ nướng. Khu đã mở không bao giờ khóa lại, và khám phá may rủi (`rare_*`, `shooting_star`) không tính vào ngưỡng.
- Cây trồng lớn qua bốn giai đoạn hạt, mầm, lớn và chín theo từng vòng tưới nước và sưởi nắng, rồi hái vào giỏ (tối đa 9 mỗi loại). Bảy cây ở vườn (hướng dương, cà rốt, dâu, cà chua, bí ngô, bắp và dưa hấu do Lucky mang tới) cùng hai cây ở Ao sen (hoa sen, hoa súng) trồng trên luống (mở từ 3 tới 6 luống). Lắc cây táo rơi táo vào giỏ, giữ nút chổi một giây (rồi xác nhận bằng icon có) dọn luống, giỏ và đồ trang trí nhưng giữ nguyên sổ tay, bạn thú và khu đã mở.
- Hai bạn thú với Lời mời không hết hạn và chương truyện: **Lucky** (nhân vật chính, cún trắng hoạt hình tròn trịa thích dưa hấu, có sẵn cùng món cơ bản trên bàn; giọng nói đọc `"Lắc-ki"`) và **Tuần Lộc nhỏ** (bạn đồng hành đến sau lần hái đầu tiên, cũng thích dưa hấu). Món nào cũng được nhận và tính lượt tặng mở truyện; tặng đúng món sẽ xoay sang Lời mời mới.
- Bếp (nút nồi) nấu một đến ba món trong giỏ với 12 công thức (cùng món bất ngờ luôn ăn được).
- Trang trí nhà có năm màu tường và tối đa 30 đồ đặt, gồm hoa hướng dương và đèn bí ngô mở theo thu hoạch (hiện bóng mờ trước khi mở, không hiện số đếm hay phần trăm).
- Lớp vui tự do: Ngày/Đêm đồng bộ (`scene.time`) có trăng, sao, đom đóm theo tay, hoa khép và cú mèo; đàn gỗ 8 thanh ngũ cung hỗ trợ nhiều ngón; chong chóng quay theo gió; ếch và ốc sên đổi chỗ; khách thăm theo cây và ngày/đêm; tổ hợp bất ngờ; sự kiện bất ngờ nhẹ (45–90 giây khi rảnh). Giọng nói/âm thanh mặc định tắt và lưu theo từng trình duyệt.
- Giao diện theo ngôn ngữ thiết kế của chủ dự án: chế độ Sáng, Tối và Theo hệ thống (Hệ thống → Sáng → Tối → Hệ thống), cảnh full màn hình co giãn theo màn, các nút nổi trên cảnh thay cho header và thanh dưới, font Nunito tự host có subset tiếng Việt, một kiểu vòng focus, thanh cuộn mảnh, splash và skeleton khi chờ. Nút dành cho bé tối thiểu 56px. Chế độ giao diện chỉ đổi khung giao diện; tranh cảnh giữ nguyên.
- Lưu cục bộ tức thì, backup theo hồ sơ, merge nhiều tab cùng hồ sơ, gửi batch/retry và cache shell ngoại tuyến.
- Google OpenID Connect cho phụ huynh, nickname cho bé, API Neon kiểm ownership, CSRF và cookie session bảo mật.

Google/Neon cần cấu hình bên ngoài. Chơi khách dùng local được; Vite riêng không chạy API. OAuth thật, Neon qua mạng, routing Vercel và iPad Safari vật lý chưa kiểm chứng. Xem [bàn giao mỹ thuật](docs/ARTWORK_HANDOFF.vi.md) và [kiến trúc](docs/ARCHITECTURE.vi.md).

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

### Chơi local không cần đăng nhập

`npm run dev` cũng chạy API thật trên database PGlite local ở `.local-db/` (bị ignore; migration tự chạy khi khởi động). Trong Góc người lớn, "Tiếp tục với Google" đăng nhập một phụ huynh thử nghiệm local mà không mở Google, nên có thể thử hồ sơ và đồng bộ giữa các tab hoặc thiết bị mà không cần Neon hay Google. Mở `http://<ip-máy-tính>:5173` trên iPad cùng mạng để thử bằng cảm ứng thật. Xóa `.local-db/` để chơi lại từ đầu. Phần này chỉ có trong dev server; bản build production dùng đăng nhập Google thật.

## Deploy

1. Tạo database Neon PostgreSQL free tier.
2. Cấu hình Google OAuth web client với `openid` và callback chính xác `https://YOUR_HOST/api/auth/callback`.
3. Import Vercel dùng `vercel.json`: install `npm ci`, build `node scripts/migrate.mjs --optional && npm run build`, output `dist`. Khi đã đặt `DATABASE_URL` trên Vercel, các file đánh số trong `migrations/` tự động chạy khi build kèm advisory lock và kiểm checksum (hoặc chạy tay `npm run db:migrate`).
4. Đặt biến server-only `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (32+ ký tự ngẫu nhiên), `APP_URL` (origin HTTPS chính xác, không `/` cuối), và bật Vercel Web Analytics trong project dashboard (`@vercel/analytics/react` đã gắn trong `src/main.tsx`).
5. Kiểm đăng nhập, tạo nickname, khôi phục hai máy, hết session và nối lại mạng trước phát hành.

Không commit secret hoặc dùng `VITE_` cho chúng. Chưa tạo/mua cloud resource.

## Chính sách dữ liệu

Khám phá merge union (world schema 2 thêm `epoch` và bộ đếm `n.*` chỉ tăng; xem kiến trúc). Field có stamp dùng bộ đếm logic vượt mọi chỉnh sửa đã thấy, writer ID riêng mỗi lần mở app để phân xử khi bằng clock. Chỉnh sửa mới không đọc giờ máy; clock cũ vẫn tương thích. Chỉnh đồng thời cùng field chọn một giá trị toàn bộ, gồm cả bố cục trang trí. Không phải editor cộng tác từng đồ. Server merge nguyên tử, retry giống nhau không tăng revision. Không lưu lịch sử từng cú chạm. Xem [kiến trúc](docs/ARCHITECTURE.vi.md).

## Tài liệu và ảnh

Mỗi README/tài liệu có cặp EN/VI liên kết đầu trang. Cập nhật cả hai khi hành vi/hướng dẫn đổi; rà ý nghĩa rồi chạy `npm run docs:sync` ghi hash. `npm run docs:check` chạy trong CI, từ chối bản dịch thiếu, chưa ghi nhận hoặc thay đổi. Hash phát hiện lệch phiên bản, không kiểm chứng dịch đúng nghĩa.

Khi production preview chạy, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture.mjs` dùng chạm thật để tìm đủ 18 khám phá và chụp 19 ảnh, gồm lưu qua reload. Không cấy progress fixture. File ở `artifacts/screenshots/` được ignore. Đặt `CAPTURE_THEME=light|dark`, `CAPTURE_VIEWPORT=1180x820` và `CAPTURE_DIR` để chụp một chế độ giao diện và kích thước vào thư mục khác, dùng cho việc duyệt trước/sau.

`npm test` cũng chạy hợp đồng của bộ điều khiển theme bằng `node --test`. `node scripts/make-icons.mjs` tạo lại `public/favicon.svg` và icon maskable từ `public/icon-512.png`.
