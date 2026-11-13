[English](README.md)

# Little Wonders

Khu vườn và thung lũng truyện tranh ưu tiên cảm ứng dành cho trẻ em Việt Nam 4–6 tuổi, xây dựng bằng React, TypeScript strict, CSS Modules và Vite. Toàn bộ nhân vật, cảnh nền, món ăn và đạo cụ đều là tranh vector SVG chibi biểu cảm do dự án tự vẽ. Không cần AI trả phí, quảng cáo, theo dõi hành vi hay backend chạy liên tục.

## Tính năng

- **Sáu vùng đất trong thung lũng**: Game mở vào bản đồ thung lũng với **Vườn nhà** sáng sẵn. Khi vùng được bật `ready`, khám phá 85% mục có tính điểm của vùng trước sẽ làm tan sương ở vùng tiếp theo (hiện tại 5 vùng sau đang đặt `ready: false` ở trạng thái sắp có và có thể mở xem thử qua **Chế độ nhà phát triển** trong Góc người lớn):
  - **Ao sen**: trồng hoa sen hồng và hoa súng tím trên mặt nước, gặp **Capybara** đội quả quýt cam ngồi thư giãn bên bờ ao, chạm vào vịt con, chuồn chuồn, ếch xanh, đèn hoa đăng và đàn gỗ bên hồ.
  - **Rừng nhỏ**: trồng việt quất và hạt dẻ, tìm bạn nhím dưới đống lá thu, gặp sóc nhỏ, chim gõ kiến, nhà nấm đỏ và đom đóm ban đêm.
  - **Bãi biển**: lắc cây dừa, nhặt vỏ sò biết hát, tìm cua đỏ dưới cát, đắp lâu đài cát qua ba bước, ngắm sóng vỗ, rùa con và chim hải âu.
  - **Đồi tuyết**: lắc quả thông trên cây thông tuyết, đắp người tuyết qua ba bước, chơi cùng gấu bông tuyết, chim cánh cụt, xe trượt gỗ và bông tuyết sáu cánh.
  - **Núi sao**: ngắm bầu trời qua kính thiên văn đồng, chào ông trăng khuyết mỉm cười, nối sáng chòm sao bạn cún Lucky qua bốn bước và thả đèn ngôi sao.
  - Vùng đã mở sẽ không bao giờ khóa lại, và các khám phá may rủi (`rare_*`, `shooting_star`) không bao giờ làm chậm tiến độ mở vùng của bé.
- **Trồng cây & Thu hoạch**: Gieo hạt, kéo mây mưa tưới nước, gọi mặt trời sưởi ấm và thu hoạch nông sản chín vào giỏ (tối đa 9 mỗi loại). Số luống đất mở dần từ 3 lên 6 khi bé thu hoạch thêm loại cây mới. Lắc cây táo để táo rơi vào giỏ; trong Góc người lớn (tab "Dọn khu vườn"), phụ huynh có thể dọn luống và đồ trang trí của từng vùng (vẫn giữ sổ khám phá, bạn thú, giỏ đồ và vùng đã mở) hoặc đặt lại toàn bộ tiến độ.
- **Ba người bạn đồng hành (`Pals`)**:
  - **Lucky**: chú cún trắng tròn trịa đeo nơ tím nhỏ mê dưa hấu mát lạnh, luôn có mặt ở vườn nhà cùng các món ăn sẵn trên bàn ngay cả khi giỏ trống.
  - **Tuần Lộc nhỏ**: đeo vòng cổ đỏ Giáng sinh và chuông vàng, ghé thăm vườn sau lần thu hoạch đầu tiên.
  - **Capybara**: đội quýt cam ngồi bên Ao sen và về chơi ở vườn nhà sau khi bé làm quen.
  - Mỗi người bạn có Lời mời món ăn không bao giờ hết hạn và 3 chương truyện tiếng Việt ấm áp. Tặng món nào bạn cũng vui và tính vào tiến độ mở truyện; tặng đúng món đang mong muốn sẽ chuyển sang Lời mời tiếp theo.
- **Bếp của vườn**: Kết hợp 1 đến 3 nguyên liệu trong giỏ để nấu 17 công thức (các món súp, mứt dâu, mứt việt quất, salad, bánh nướng, nước ép, bánh bắp, táo nghiền, tô trái cây, trà hoa hướng dương, sinh tố, nước dừa, hạt dẻ nướng, trà thông và bánh ánh sao, cùng món bất ngờ lúc nào cũng măm được).
- **Ngôi nhà sắc màu & Vui chơi tự do**: Đổi 5 màu sơn tường và đặt tối đa 30 món trang trí. Chuyển đổi Ngày/Đêm đồng bộ (`scene.time`) với mặt trăng, sao, đom đóm bay theo tay, hoa ngủ đêm và cú mèo; gõ đàn gỗ ngũ cung 8 thanh hỗ trợ chạm nhiều ngón; quay chong chóng gió; và bắt gặp các sự kiện bất ngờ dịu dàng khi bé nghỉ tay. Âm thanh và giọng đọc tiếng Việt mặc định tắt và lưu riêng trên từng trình duyệt; nhạc nền nhẹ nhàng phát khi bật loa.
- **Giao diện ưu tiên trẻ nhỏ & Đồng bộ đám mây**: Bảng màu sáng kiểu truyện tranh đồng nhất cho cả khung cảnh lẫn các nút điều khiển; bố cục tràn màn hình (`56px+` cho nút của bé, nút quay lại góc trên trái khi ở trong khu chơi, nút bánh răng `44px` của người lớn chỉ hiện ở bản đồ thung lũng); font Nunito tự host đầy đủ dấu tiếng Việt; lưu tức thì vào `localStorage` kèm đồng bộ đa tab và PostgreSQL serverless (`merge_world` schema v2) qua Google OpenID Connect dành cho phụ huynh.

Xem thêm [kiến trúc](docs/ARCHITECTURE.vi.md) và [nguồn hình ảnh](public/assets/PROVENANCE.vi.md).

## Chạy và kiểm thử

Dùng Node 22+ ngay trên checkout hiện tại:

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run format:check
npm test
npm run docs:check
npm run build
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

Dùng `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` cho Chromium hệ thống hoặc đặt `PLAYWRIGHT_BROWSERS_PATH` tới thư mục ghi được. Bộ kiểm thử trình duyệt chạy trên bản build production đặt ở `dist-e2e`, tách khỏi `dist`. Để chạy bộ thứ hai cùng lúc trong cùng checkout, đặt riêng `E2E_PORT` và `E2E_OUT_DIR` cho nó (ví dụ `E2E_PORT=4174 E2E_OUT_DIR=dist-e2e-2`).

### Chơi thử cục bộ không cần cấu hình đám mây

`npm run dev` chạy cả giao diện Vite lẫn API thật trên cơ sở dữ liệu PGlite cục bộ tại `.local-db/` (được Git bỏ qua; tự động chạy migration khi khởi động). Trong Góc người lớn ở màn hình bản đồ, bấm "Tiếp tục với Google" sẽ đăng nhập ngay tài khoản phụ huynh thử nghiệm cục bộ để kiểm thử hồ sơ và đồng bộ đa tab/thiết bị mà không cần cấu hình Google OAuth hay Neon. Có thể mở `http://<ip-máy-tính>:5173` trên iPad cùng mạng Wi-Fi để thử cảm ứng thật. Xóa `.local-db/` nếu muốn tạo lại dữ liệu từ đầu.

## Triển khai (Deploy)

1. Tạo cơ sở dữ liệu Neon PostgreSQL.
2. Cấu hình Google OAuth web client với scope `openid` và callback `https://YOUR_HOST/api/auth/callback`.
3. Import dự án vào Vercel theo `vercel.json`: cài đặt `npm ci`, build `node scripts/migrate.mjs --optional && npm run build`, thư mục đầu ra `dist`. Các tệp SQL đánh số trong `migrations/` tự động chạy khi build nếu có `DATABASE_URL` (kèm khóa tư vấn advisory lock và kiểm tra mã băm SHA-256).
4. Đặt các biến môi trường phía server `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (tối thiểu 32 ký tự ngẫu nhiên) và `APP_URL` (origin HTTPS chính xác, không có dấu `/` cuối), đồng thời bật Vercel Web Analytics trên bảng điều khiển.

Tuyệt đối không commit khóa bí mật hoặc đặt tiền tố `VITE_` cho chúng.

## Tài liệu và bộ icon

Mọi tài liệu markdown đều có cặp bản dịch Anh/Việt đồng bộ được liên kết ngay dòng đầu tiên (`README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `public/assets/PROVENANCE.md`). Sau khi cập nhật cả hai ngôn ngữ và rà soát ngữ nghĩa, chạy `npm run docs:sync -- --reviewed` và kiểm tra lại bằng `npm run docs:check`.

Lệnh `node scripts/make-icons.mjs` dựng toàn bộ bộ icon ứng dụng PNG và ICO từ tệp vector gốc `public/favicon.svg`.
