[English](GAMEPLAY_GUIDE.md)

# Hướng dẫn chơi & Checklist kiểm thử (Little Wonders)

Tài liệu này mô tả chi tiết toàn bộ tính năng, nút điều khiển, điểm chạm, câu chuyện và quy tắc đang có trong mã nguồn để người lớn chơi thử và kiểm thử lỗi.

## 1. Bản đồ thung lũng & Mở khóa vùng đất

- Game mở trực tiếp vào **Bản đồ thung lũng** gồm 6 vùng: **Vườn nhà**, **Ao sen**, **Rừng nhỏ**, **Bãi biển**, **Đồi tuyết**, **Núi sao**.
- **Trạng thái hiện tại**: Chỉ **Vườn nhà** (`ready: true`) mở sẵn cho bé. 5 vùng còn lại hiện đặt `ready: false` (trạng thái **Sắp có**).
- **Cách test 5 vùng sau**: Mở **Góc người lớn** (nút bánh răng góc dưới phải trên bản đồ) → giải cổng toán (`7 + 5 = 12`) → tab **Dọn khu vườn** → bấm **Bật Dev mode**. Khi bật Dev mode, cả 6 vùng đều mở tạm để vào kiểm tra mà không lưu tiến độ vào hồ sơ thật.
- **Quy tắc mở vùng (khi `ready: true`)**: Cả 6 vùng dùng **cùng một cách tính**: khám phá đủ **85%** số mục cốt lõi ban ngày (`counted` trong `src/data/regions.ts`) của vùng trước để mở vùng tiếp theo. Món bếp, chương truyện pal, khám phá ban đêm, cây trồng phụ và khám phá may rủi (`rare_*`, `shooting_star`) là mục thưởng không tính vào mẫu số:
  - **Vườn nhà**: `14` mục → cần **12**
  - **Ao sen**: `13` mục → cần **12**
  - **Rừng nhỏ**: `11` mục → cần **10**
  - **Bãi biển**: `13` mục → cần **12**
  - **Đồi tuyết**: `13` mục → cần **12**
  - **Núi sao**: `11` mục → cần **10**

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

Cả **6 vùng** đều có luống đất và khay hạt giống riêng theo từng vùng:

1. **Số luống đất**: Bắt đầu với **3 luống**, tự mở dần tối đa **6 luống** khi bé thu hoạch thêm loại cây mới.
2. **Gieo hạt**: Chọn hạt giống ở khay dưới màn hình rồi chạm vào luống đất trống (giai đoạn `0 → 1`).
   - **Vườn nhà (7 loại)**: Hướng dương, Cà rốt, Dâu, Cà chua, Bí ngô, Bắp, Dưa hấu.
   - **Ao sen (2 loại)**: Hoa sen, Hoa súng.
   - **Rừng nhỏ (2 loại)**: Việt quất, Hạt dẻ.
   - **Bãi biển (2 loại)**: Dứa thơm, Chuối vàng.
   - **Đồi tuyết (2 loại)**: Bạc hà tuyết, Nam việt quất.
   - **Núi sao (2 loại)**: Khế ngôi sao, Hoa dạ hương.
3. **Tưới nước & Sưởi nắng**: Dùng **Mây mưa** (tưới nước) và **Mặt trời** (sưởi ấm) — có thể kéo thả hoặc chạm vào luống cây. Mỗi lượt đủ nước + nắng giúp cây lớn lên một giai đoạn (`1 Hạt → 2 Mầm → 3 Lớn → 4 Chín`).
4. **Thu hoạch**: Chạm vào cây đã chín (giai đoạn 4) để cất vào **giỏ đồ** (tối đa **9** đơn vị mỗi loại).
5. **Biến thể hiếm (may rủi)**: Khi thu hoạch có xác suất nhỏ nhận khám phá hiếm (`rare_carrot_twin`, `rare_pumpkin_giant`, `rare_berry_heart`).
6. **Thu thập trực tiếp (`gather`)**: Chạm vào cây táo (Vườn nhà), mật ong rừng (Rừng nhỏ), cây dừa hoặc vỏ sò (Bãi biển), cây thông (Đồi tuyết) để nhận nguyên liệu vào giỏ mà không cần trồng.

## 4. Bếp của vườn (27 công thức + Món bất ngờ)

Bấm biểu tượng **Nồi** ở góc trên phải để mở Bếp. Chọn **1 đến 3 nguyên liệu** đang có trong giỏ rồi bấm nấu:

| Món ăn                | Nguyên liệu cần                |
| :-------------------- | :----------------------------- |
| Nước ép dưa hấu       | Dưa hấu (1)                    |
| Nước dừa mát lạnh     | Dừa (1)                        |
| Súp cà chua cà rốt    | Cà rốt + Cà chua               |
| Mứt dâu               | Dâu + Dâu                      |
| Bánh táo bí ngô       | Táo + Bí ngô                   |
| Bánh bắp ngọt         | Bắp + Bắp                      |
| Táo nghiền mật ngọt   | Táo + Táo                      |
| Súp bí ngô cà rốt     | Cà rốt + Bí ngô                |
| Súp bắp bí ngô        | Bắp + Bí ngô                   |
| Trà hoa hướng dương   | Hướng dương + Hướng dương      |
| Sinh tố dưa hấu dâu   | Dưa hấu + Dâu                  |
| Hạt dẻ nướng thơm     | Hạt dẻ + Hạt dẻ                |
| Mứt việt quất         | Việt quất + Việt quất          |
| Trà thông ấm áp       | Táo + Quả thông                |
| Trà sen thơm ngát     | Hoa sen + Hoa sen              |
| Chè hạt sen bắp ngọt  | Bắp + Hoa sen                  |
| Bánh việt quất hạt dẻ | Việt quất + Hạt dẻ             |
| Trà mật ong ấm        | Mật ong rừng + Hướng dương     |
| Nước ép dứa mát       | Dứa thơm + Dứa thơm            |
| Trà bạc hà ấm         | Bạc hà tuyết + Bạc hà tuyết    |
| Bánh nam việt quất    | Táo + Nam việt quất            |
| Nước khế ánh sao      | Khế ngôi sao + Khế ngôi sao    |
| Trà hoa dạ hương      | Hoa dạ hương + Hoa dạ hương    |
| Salad nhiều màu       | Dâu + Cà rốt + Cà chua         |
| Tô trái cây mát       | Táo + Dâu + Dưa hấu            |
| Bánh ánh sao          | Táo + Việt quất + Hướng dương  |
| Tô trái cây nhiệt đới | Chuối vàng + Dừa + Dứa thơm    |
| **Món bất ngờ**       | Bất kỳ tổ hợp 1–3 món nào khác |

## 5. Bạn đồng hành (`Pals`) & Chương truyện

Hiện có **7 bạn đồng hành** (`Lucky`, `Tuần Lộc nhỏ`, `Capybara`, `Sóc nhỏ`, `Rùa con`, `Cánh cụt`, `Cú mèo`). Mỗi bạn:

- Có **Lời mời món ăn** (không bao giờ hết hạn) và một số món cơ bản đặt sẵn trên bàn (`freeFoods`, trừ Tuần Lộc nhỏ) để bé luôn tặng được ngay cả khi giỏ trống.
- Tặng bất kỳ món nào cũng tăng bộ đếm quà (`n.gift_<id>`) và mở lần lượt **3 chương truyện** ở mốc **1, 3, 6** lần tặng.
- Tặng đúng món bạn đang mong muốn sẽ đổi sang Lời mời tiếp theo.

| Bạn              | Xuất hiện khi                         | Món hay mong muốn                                             |
| :--------------- | :------------------------------------ | :------------------------------------------------------------ |
| **Lucky**        | Có sẵn ở Vườn nhà                     | Dưa hấu, Táo, Cà rốt, Nước ép dưa hấu                         |
| **Tuần Lộc nhỏ** | Sau lần thu hoạch đầu tiên            | Dưa hấu, Cà rốt, Táo, Tô trái cây mát                         |
| **Capybara**     | Gặp ở Ao sen (tự ghé Vườn nhà sau đó) | Dưa hấu, Hoa sen, Trà sen thơm ngát, Chè hạt sen bắp ngọt     |
| **Sóc nhỏ**      | Gặp ở Rừng nhỏ                        | Hạt dẻ, Việt quất, Bánh việt quất hạt dẻ, Trà mật ong ấm      |
| **Rùa con**      | Gặp ở Bãi biển                        | Dừa, Dứa thơm, Nước ép dứa mát, Tô trái cây nhiệt đới         |
| **Cánh cụt**     | Gặp ở Đồi tuyết                       | Trà thông ấm áp, Trà bạc hà ấm, Bánh nam việt quất, Táo       |
| **Cú mèo**       | Gặp ở Núi sao                         | Bánh ánh sao, Trà hoa dạ hương, Nước khế ánh sao, Hướng dương |

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
- **Lá sen to** → chạm để hiện **Nòng nọc nhỏ**.
- **Thuyền giấy** (`build` 3 bước): Chạm 3 lần để gấp và thả thuyền lướt sóng.
- **Vịt con**, **Chuồn chuồn**, **Ếch xanh**, **Đèn hoa đăng**, **Chim bói cá** (`dayOnly`), **Bạn Capybara**, **Đàn gỗ bên ao**.
- **Ban đêm**: **Đom đóm bên ao** (`nightOnly`), **Trăng soi mặt ao** (khi trời tối và đã gặp cá).

### Rừng nhỏ

- **Nhà nấm tí hon**, **Chim gõ kiến**, **Mật ong rừng** (`gather` → Mật ong rừng).
- **Đống lá khô** → chạm để hiện **Bạn nhím**.
- **Khúc gỗ rỗng** → chạm để hiện **Bạn cáo nhỏ**.
- **Nhà cây nhỏ** (`build` 3 bước): Chạm 3 lần để bắc thang, dựng mái lá hoàn chỉnh.
- **Bạn Sóc nhỏ** (`dayOnly`).
- **Cú mèo trong rừng** (`nightOnly`), **Đom đóm** (`nightOnly`), **Hươu sao ban đêm** (`nightOnly`).

### Bãi biển

- **Cây dừa** (`gather` → Dừa), **Vỏ sò** (`gather` → Vỏ sò).
- **Lâu đài cát** (`build` 3 bước): Chạm 3 lần để đắp hoàn chỉnh và ghi nhận khám phá.
- **Ụ cát nhỏ** → chạm để hiện **Bạn cua**.
- **Vũng nước biển** → chạm để hiện **Sao biển**.
- **Sóng biển**, **Chim hải âu** (`dayOnly`), **Cá heo** (`dayOnly`), **Ngọn hải đăng** (`nightOnly`), **Bạn Rùa con**.

### Đồi tuyết

- **Cây thông phủ tuyết** (`gather` → Quả thông).
- **Người tuyết** (`build` 3 bước): Chạm 3 lần để đắp hoàn chỉnh.
- **Lều tuyết Iglu** (`build` 3 bước): Chạm 3 lần để xếp gạch và đắp mái vòm.
- **Đụn tuyết xốp** → chạm để hiện **Cáo tuyết trắng**.
- **Gấu bông tuyết**, **Xe trượt tuyết**, **Bông tuyết**, **Suối nước nóng**, **Cực quang** (`nightOnly`), **Bạn Cánh cụt**.

### Núi sao

- Lưu ý: Không có mặt trời và mây mưa ban ngày (`sky: false`).
- **Kính thiên văn**, **Ông trăng**, **Đèn ngôi sao**, **Bạn Cú mèo**, **Sao băng**, **Đá thiên thạch**, **Sao chổi**.
- **Đám mây bồng bềnh** → chạm để hiện **Thỏ ngọc trên mây**.
- **Chòm sao** (`build` 4 bước): Chạm 4 lần để nối sáng hoàn chỉnh.

## 8. Sự kiện bất ngờ & Sự kiện theo mùa

- **Sự kiện khi đứng yên (`idle`)**: Khoảng 45–90 giây không thao tác, game tự kích hoạt ngẫu nhiên:
  - **Ban ngày**: Đàn bướm bay ngang, Lucky vẫy đuôi, hoặc Cầu vồng (nếu đã từng tưới mưa và gọi nắng).
  - **Ban đêm**: **Sao băng** (`shooting_star`, có ghi nhận vào Sổ khám phá) hoặc Lucky vẫy đuôi.
- **Sự kiện theo mùa (`src/game/seasons.ts`)**:
  - Tự nhận theo âm lịch: **Tết** (28–30 tháng Chạp và mùng 1–7 tháng Giêng) hiện _Hoa mai ngày Tết_; **Trung thu** (13–16 tháng 8 âm lịch) hiện _Đèn ông sao Trung thu_.
  - **Cách test nhanh trên trình duyệt**: Thêm `?season=tet` hoặc `?season=mid_autumn` vào cuối URL (ví dụ `http://localhost:5174/?season=tet`).

## 9. Góc người lớn (`AdultCorner`)

Chỉ mở được tại màn hình **Bản đồ thung lũng** (nút bánh răng góc dưới phải), qua cổng toán `7 + 5 = 12`:

- **Tab Lưu khu vườn**:
  - Xem trạng thái lưu cục bộ / đồng bộ đám mây.
  - Bấm **Tiếp tục với Google**: Khi chạy `npm run dev`, nút này đăng nhập ngay tài khoản thử nghiệm cục bộ dùng PGlite (`.local-db/`) để test tạo/chọn/xóa hồ sơ bé và đồng bộ nhiều tab mà không cần cấu hình Google OAuth hay Neon.
- **Tab Dọn khu vườn**:
  - **Dọn lại một khu**: Xóa luống trồng (và đồ trang trí nếu là Vườn nhà) của riêng vùng đó; giữ nguyên sổ khám phá, bạn thú, giỏ đồ và các vùng đã mở.
  - **Bắt đầu lại tất cả**: Xóa sạch toàn bộ tiến độ về trạng thái ban đầu.
  - **Dev mode**: Bật/tắt chế độ mở tạm tất cả 6 vùng để kiểm tra.

## 10. Câu chuyện vùng đất & 21 chương truyện bạn đồng hành

### Câu chuyện mở đầu 6 vùng đất (`src/data/scenes.ts`)

Bấm nút **Nghe chuyện vùng đất** (biểu tượng cuốn sách ở góc trên phải) để nghe:

- **Vườn nhà**: _"Ngày xửa ngày xưa, dưới nắng mai ấm áp, khu vườn nhỏ luôn mở cửa đón các bạn thú và những mầm xanh biết lớn."_
- **Ao sen**: _"Bên bờ ao sen thơm ngát, gió nhẹ ru từng lá sen xanh và kể chuyện chú vịt con tập bơi."_
- **Rừng nhỏ**: _"Trong khu rừng xanh rì rào tiếng lá, bạn Sóc nhỏ cất giữ hạt dẻ thơm và rủ nhím con đi tìm quả ngọt."_
- **Bãi biển**: _"Trên bãi cát vàng óng ánh nắng, sóng biển hát rì rào đưa bạn Rùa con lên bờ nghe vỏ sò kể chuyện."_
- **Đồi tuyết**: _"Giữa đồi tuyết trắng xóa êm như bông, bạn Cánh cụt và gấu con cùng nhau nặn người tuyết mũi cà rốt."_
- **Núi sao**: _"Trên đỉnh núi cao gần bầu trời đêm, bạn Cú mèo thắp đèn ngôi sao và kể chuyện về từng chòm sao sáng."_

### 21 chương truyện của 7 bạn đồng hành (`src/data/pals.ts`, mở ở mốc 1 / 3 / 6 quà)

- **Lucky**:
  1. Hôm nay Lucky đánh hơi thấy mùi dưa hấu ngọt lịm. Gâu! Lucky thích nhất là dưa hấu mát lạnh.
  2. Lucky chạy quanh các luống đất, vẫy đuôi tít mù khi thấy mầm xanh nhú lên dưới nắng.
  3. Cuối ngày Lucky nằm cạnh bạn Tuần Lộc nhỏ, hai đứa cùng nhìn mặt trời lặn thật êm.
- **Tuần Lộc nhỏ**:
  1. Bạn Tuần Lộc nhỏ gõ nhẹ đôi móng nhỏ xíu ngoài cổng vườn rồi mỉm cười chào Lucky.
  2. Bạn Tuần Lộc nhỏ cũng mê vị ngọt mát của dưa hấu đỏ giống hệt Lucky luôn đấy!
  3. Đêm xuống, cặp sừng nhỏ của bạn Tuần Lộc lấp lánh dưới ánh trăng cùng đom đóm.
- **Capybara**:
  1. Bạn Capybara đội quả quýt cam tròn xoe trên đầu, ngồi thư giãn bên bờ ao sen mát rượi.
  2. Vịt con và bạn ếch xanh thích leo lên lưng Capybara ngồi hóng gió, cả bọn cùng cười tít mắt.
  3. Chiều mát, Capybara mang hương sen về vườn nhà nằm phơi nắng cùng Lucky và Tuần Lộc nhỏ.
- **Sóc nhỏ**:
  1. Sóc nhỏ ôm đầy hai má hạt dẻ thơm lừng, nhảy thoăn thoắt trên cành thông xanh.
  2. Mỗi sáng trong rừng nhỏ, Sóc nhỏ lại đếm xem hôm nay hái được mấy trái việt quất tím.
  3. Sóc nhỏ giấu sẵn vài hạt dẻ ngon nhất để dành mời Lucky và con mỗi khi ghé thăm.
- **Rùa con**:
  1. Rùa con bò thật chậm trên bãi cát vàng, lắng nghe tiếng sóng biển vỗ rì rào.
  2. Mỗi khi nắng lên, Rùa con thích uống một ngụm nước dừa mát lạnh dưới bóng dừa xanh.
  3. Ban đêm, Rùa con ngắm bọt sóng lấp lánh rồi kể chuyện biển cả cho vỏ sò nghe.
- **Cánh cụt**:
  1. Bạn Cánh cụt đi lạch bạch trên đồi tuyết trắng, vỗ cánh chào từng bông tuyết rơi.
  2. Trời lạnh mà có một tách trà thông ấm áp thì Cánh cụt thích mê luôn đấy!
  3. Chiều xuống, Cánh cụt cùng gấu bông tuyết trượt vèo trên đồi tuyết cười vang.
- **Cú mèo**:
  1. Bạn Cú mèo mở to đôi mắt tròn xoe trên đỉnh núi sao, đếm từng ngôi sao sáng.
  2. Đêm yên tĩnh, Cú mèo thích nhâm nhi trà hoa hướng dương và nghe gió hát.
  3. Cú mèo thuộc tên mọi chòm sao trên trời để kể cho con và Lucky nghe mỗi tối.
