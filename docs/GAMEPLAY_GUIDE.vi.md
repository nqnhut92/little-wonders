[English](GAMEPLAY_GUIDE.md)

# Hướng dẫn chơi & Checklist kiểm thử (Little Wonders)

Tài liệu này mô tả chi tiết toàn bộ tính năng, nút điều khiển, điểm chạm và quy tắc đang có trong mã nguồn để người lớn chơi thử và kiểm thử lỗi.

## 1. Bản đồ thung lũng & Mở khóa vùng đất

- Game mở trực tiếp vào **Bản đồ thung lũng** gồm 6 vùng: **Vườn nhà**, **Ao sen**, **Rừng nhỏ**, **Bãi biển**, **Đồi tuyết**, **Núi sao**.
- **Trạng thái hiện tại**: Chỉ **Vườn nhà** (`ready: true`) mở sẵn cho bé. 5 vùng còn lại hiện đặt `ready: false` (trạng thái **Sắp có**).
- **Cách test 5 vùng sau**: Mở **Góc người lớn** (nút bánh răng góc dưới phải trên bản đồ) → giải cổng toán (`7 + 5 = 12`) → tab **Dọn khu vườn** → bấm **Bật Dev mode**. Khi bật Dev mode, cả 6 vùng đều mở tạm để vào kiểm tra mà không lưu tiến độ vào hồ sơ thật.
- **Quy tắc mở vùng (khi `ready: true`)**: Khám phá đủ **85%** số mục có tính điểm (`counted` trong `src/data/regions.ts`) của vùng trước để mở vùng tiếp theo. Vùng đã mở không bao giờ khóa lại; các khám phá may rủi (`rare_*`, `shooting_star`) không tính vào mẫu số.

## 2. Giao diện HUD & Điều khiển chung

- **Góc trên trái**:
  - Nút **Quay lại bản đồ** (chỉ hiện khi đang ở trong một vùng đất).
  - Thanh hướng dẫn của cún **Lucky** kèm nút bóng đèn **Nghe gợi ý** (bấm để Lucky đọc/hiện gợi ý tiếp theo).
- **Góc trên phải**:
  - **Bật/Tắt âm thanh** (mặc định **tắt**, lưu theo từng trình duyệt): khi bật sẽ phát tiếng hiệu ứng, giọng đọc tiếng Việt và nhạc nền (chuyển bài êm giữa bản đồ và vùng chơi).
  - **Sổ khám phá**: xem toàn bộ mục đã khám phá (gồm nông sản, thú, sự kiện, món ăn, chương truyện).
  - **Nghe chuyện vùng đất** (chỉ hiện khi ở trong vùng đất): nghe/đọc câu chuyện mở đầu của vùng đang chơi.
  - **Bếp của vườn** (chỉ hiện khi ở trong vùng đất).
  - **Chuyển Ngày / Đêm** (chỉ hiện khi ở trong vùng đất, đồng bộ `scene.time`): chuyển bảng màu và các điểm chạm riêng của ban ngày / ban đêm.
- **Góc dưới phải (chỉ trên bản đồ)**: Nút bánh răng **Góc người lớn**.
- **Màn hình dọc trên thiết bị cảm ứng**: Hiển thị thông báo toàn màn hình nhắc xoay ngang (`Con xoay màn hình ngang để nhìn cả khu vườn nhé!`).

## 3. Trồng cây, Chăm sóc & Thu hoạch

Áp dụng ở các vùng có luống đất (**Vườn nhà**, **Ao sen**, **Rừng nhỏ**). Các vùng **Bãi biển**, **Đồi tuyết**, **Núi sao** tự động ẩn khay hạt giống.

1. **Số luống đất**: Bắt đầu với **3 luống**, tự mở dần tối đa **6 luống** khi bé thu hoạch thêm loại cây mới.
2. **Gieo hạt**: Chọn hạt giống ở khay dưới màn hình rồi chạm vào luống đất trống (giai đoạn `0 → 1`).
   - **Vườn nhà (7 loại)**: Hướng dương, Cà rốt, Dâu, Cà chua, Bí ngô, Bắp, Dưa hấu.
   - **Ao sen (2 loại)**: Hoa sen, Hoa súng.
   - **Rừng nhỏ (2 loại)**: Việt quất, Hạt dẻ.
3. **Tưới nước & Sưởi nắng**: Dùng **Mây mưa** (tưới nước) và **Mặt trời** (sưởi ấm) — có thể kéo thả hoặc chạm vào luống cây. Mỗi lượt đủ nước + nắng giúp cây lớn lên một giai đoạn (`1 Hạt → 2 Mầm → 3 Lớn → 4 Chín`).
4. **Thu hoạch**: Chạm vào cây đã chín (giai đoạn 4) để cất vào **giỏ đồ** (tối đa **9** đơn vị mỗi loại).
5. **Biến thể hiếm (may rủi)**: Khi thu hoạch có xác suất nhỏ nhận khám phá hiếm (`rare_carrot_twin`, `rare_pumpkin_giant`, `rare_berry_heart`).
6. **Thu thập trực tiếp (`gather`)**: Chạm vào cây táo (Vườn nhà), cây dừa hoặc vỏ sò (Bãi biển), cây thông (Đồi tuyết) để nhận nguyên liệu vào giỏ mà không cần trồng.

## 4. Bếp của vườn (17 công thức + Món bất ngờ)

Bấm biểu tượng **Nồi** ở góc trên phải để mở Bếp. Chọn **1 đến 3 nguyên liệu** đang có trong giỏ rồi bấm nấu:

| Món ăn              | Nguyên liệu cần                |
| :------------------ | :----------------------------- |
| Nước ép dưa hấu     | Dưa hấu (1)                    |
| Nước dừa mát lạnh   | Dừa (1)                        |
| Súp cà chua cà rốt  | Cà rốt + Cà chua               |
| Mứt dâu             | Dâu + Dâu                      |
| Bánh táo bí ngô     | Táo + Bí ngô                   |
| Bánh bắp ngọt       | Bắp + Bắp                      |
| Táo nghiền mật ngọt | Táo + Táo                      |
| Súp bí ngô cà rốt   | Cà rốt + Bí ngô                |
| Súp bắp bí ngô      | Bắp + Bí ngô                   |
| Trà hoa hướng dương | Hướng dương + Hướng dương      |
| Sinh tố dưa hấu dâu | Dưa hấu + Dâu                  |
| Hạt dẻ nướng thơm   | Hạt dẻ + Hạt dẻ                |
| Mứt việt quất       | Việt quất + Việt quất          |
| Trà thông ấm áp     | Táo + Quả thông                |
| Salad nhiều màu     | Dâu + Cà rốt + Cà chua         |
| Tô trái cây mát     | Táo + Dâu + Dưa hấu            |
| Bánh ánh sao        | Táo + Việt quất + Hướng dương  |
| **Món bất ngờ**     | Bất kỳ tổ hợp 1–3 món nào khác |

## 5. Bạn đồng hành (`Pals`) & Chương truyện

Hiện có **7 bạn đồng hành** (`Lucky`, `Tuần Lộc nhỏ`, `Capybara`, `Sóc nhỏ`, `Rùa con`, `Cánh cụt`, `Cú mèo`). Mỗi bạn:

- Có **Lời mời món ăn** (không bao giờ hết hạn) và một số món cơ bản đặt sẵn trên bàn (`freeFoods`, trừ Tuần Lộc nhỏ) để bé luôn tặng được ngay cả khi giỏ trống.
- Tặng bất kỳ món nào cũng tăng bộ đếm quà (`n.gift_<id>`) và mở lần lượt **3 chương truyện** ở mốc **1, 3, 6** lần tặng.
- Tặng đúng món bạn đang mong muốn sẽ đổi sang Lời mời tiếp theo.

| Bạn              | Xuất hiện khi                         | Món hay mong muốn                                                   |
| :--------------- | :------------------------------------ | :------------------------------------------------------------------ |
| **Lucky**        | Có sẵn ở Vườn nhà                     | Dưa hấu, Táo, Cà rốt, Nước ép dưa hấu                               |
| **Tuần Lộc nhỏ** | Sau lần thu hoạch đầu tiên            | Dưa hấu, Cà rốt, Táo, Tô trái cây mát                               |
| **Capybara**     | Gặp ở Ao sen (tự ghé Vườn nhà sau đó) | Dưa hấu, Hoa sen, Bắp, Trà hoa hướng dương                          |
| **Sóc nhỏ**      | Gặp ở Rừng nhỏ                        | Hạt dẻ, Việt quất, Hạt dẻ nướng thơm, Mứt việt quất                 |
| **Rùa con**      | Gặp ở Bãi biển                        | Dừa, Nước dừa mát lạnh, Dưa hấu, Nước ép dưa hấu                    |
| **Cánh cụt**     | Gặp ở Đồi tuyết                       | Trà thông ấm áp, Táo nghiền mật ngọt, Súp bí ngô cà rốt, Táo        |
| **Cú mèo**       | Gặp ở Núi sao                         | Bánh ánh sao, Trà hoa hướng dương, Hướng dương, Sinh tố dưa hấu dâu |

## 6. Ngôi nhà sắc màu & Đồ chơi tương tác

- **Ngôi nhà sắc màu** (chạm vào nhà ở Vườn nhà):
  - Đổi **5 màu sơn tường**.
  - Kéo thả hoặc chạm để đặt tối đa **30 món trang trí** lên sân vườn.
- **Đàn gỗ ngũ cung** (chạm vào đàn gỗ ở Vườn nhà hoặc Ao sen): Gồm **8 thanh**, hỗ trợ chạm nhiều ngón cùng lúc.
- **Chong chóng** (Vườn nhà): Chạm để quay.

## 7. Điểm chạm (`Hotspot`) chi tiết theo từng vùng

Một số điểm chạm là **ẩn/hiện (`reveal` → `revealed`)**: chạm vật che trước thì nhân vật mới hiện ra. Một số chỉ hiện ban ngày (`dayOnly`) hoặc ban đêm (`nightOnly`).

### Vườn nhà

- **Cây táo** (`tree`): Lắc rơi táo vào giỏ.
- **Chim trên cành** (`dayOnly`), **Cú mèo trên cành** (`nightOnly`).
- **Chong chóng**, **Ngôi Nhà Sắc Màu**, **Đàn gỗ**.
- **Ao nước** → chạm để hiện **Cá nhỏ**.
- **Đá có bọ rùa** → chạm để hiện **Bọ rùa**.
- **Bụi cỏ có tiếng dế** → chạm để hiện **Sâu nhỏ**.
- **Hoa bên nhà** → chạm để hiện **Bướm** (`dayOnly`).
- **Góc Của Lucky**, **Bạn Tuần Lộc nhỏ** (khi đã mở), **Bạn Capybara** (khi đã gặp).
- **Ban đêm**: Có thêm **đom đóm** bay theo tay chạm trên bầu trời.

### Ao sen

- **Mặt ao sen** → chạm để hiện **Cá trong ao sen**.
- **Vịt con**, **Chuồn chuồn**, **Ếch xanh**, **Đèn hoa đăng**, **Bạn Capybara**, **Đàn gỗ bên ao**.

### Rừng nhỏ

- **Nhà nấm tí hon**, **Chim gõ kiến**.
- **Đống lá khô** → chạm để hiện **Bạn nhím**.
- **Bạn Sóc nhỏ**.
- **Cú mèo trong rừng** (`nightOnly`), **Đom đóm** (`nightOnly`).

### Bãi biển

- **Cây dừa** (`gather` → Dừa), **Vỏ sò** (`gather` → Vỏ sò).
- **Lâu đài cát** (`build` 3 bước): Chạm 3 lần để đắp hoàn chỉnh và ghi nhận khám phá.
- **Ụ cát nhỏ** → chạm để hiện **Bạn cua**.
- **Sóng biển**, **Chim hải âu**, **Bạn Rùa con**.

### Đồi tuyết

- **Cây thông phủ tuyết** (`gather` → Quả thông).
- **Người tuyết** (`build` 3 bước): Chạm 3 lần để đắp hoàn chỉnh.
- **Gấu bông tuyết**, **Xe trượt tuyết**, **Bông tuyết**, **Bạn Cánh cụt**.

### Núi sao

- Lưu ý: Không có mặt trời và mây mưa ban ngày (`sky: false`).
- **Kính thiên văn**, **Ông trăng**, **Đèn ngôi sao**, **Bạn Cú mèo**, **Sao băng**.
- **Chòm sao** (`build` 4 bước): Chạm 4 lần để nối sáng hoàn chỉnh.

## 8. Sự kiện bất ngờ & Sự kiện theo mùa

- **Sự kiện khi đứng yên (`idle`)**: Khoảng 45–90 giây không thao tác, game tự kích hoạt ngẫu nhiên:
  - **Ban ngày**: Đàn bướm bay ngang, Lucky vẫy đuôi, hoặc Cầu vồng (nếu đã từng tưới mưa và gọi nắng).
  - **Ban đêm**: **Sao băng** (`shooting_star`, có ghi nhận vào Sổ khám phá) hoặc Lucky vẫy đuôi.
- **Sự kiện theo mùa (`src/game/seasons.ts`)**:
  - Tự nhận theo âm lịch: **Tết** (28–30 tháng Chạp và mùng 1–7 tháng Giêng) hiện _Hoa mai ngày Tết_; **Trung thu** (13–16 tháng 8 âm lịch) hiện _Đèn ông sao Trung thu_.
  - **Cách test nhanh trên trình duyệt**: Thêm `?season=tet` hoặc `?season=mid_autumn` vào cuối URL (ví dụ `http://localhost:5173/?season=tet`).

## 9. Góc người lớn (`AdultCorner`)

Chỉ mở được tại màn hình **Bản đồ thung lũng** (nút bánh răng góc dưới phải), qua cổng toán `7 + 5 = 12`:

- **Tab Lưu khu vườn**:
  - Xem trạng thái lưu cục bộ / đồng bộ đám mây.
  - Bấm **Tiếp tục với Google**: Khi chạy `npm run dev`, nút này đăng nhập ngay tài khoản thử nghiệm cục bộ dùng PGlite (`.local-db/`) để test tạo/chọn/xóa hồ sơ bé và đồng bộ nhiều tab mà không cần cấu hình Google OAuth hay Neon.
- **Tab Dọn khu vườn**:
  - **Dọn lại một khu**: Xóa luống trồng (và đồ trang trí nếu là Vườn nhà) của riêng vùng đó; giữ nguyên sổ khám phá, bạn thú, giỏ đồ và các vùng đã mở.
  - **Bắt đầu lại tất cả**: Xóa sạch toàn bộ tiến độ về trạng thái ban đầu.
  - **Dev mode**: Bật/tắt chế độ mở tạm tất cả 6 vùng để kiểm tra.
