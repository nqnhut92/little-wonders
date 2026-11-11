# Tự đánh giá ngày 11/11/2026

## Lỗi xác định và sửa

- UI tài khoản không xóa trạng thái đã đăng nhập khi API trả 401. Phụ huynh có thể không thấy đường đăng nhập lại. Đã xóa trạng thái và danh sách hồ sơ khi nhận 401, giữ khu vườn cục bộ.
- Pointer capture tạo click sau khi kéo mây/nắng; click tưới/sưởi cả ba luống ngoài ý định thả vào một luống. Đã phân biệt kéo vượt 8px và chặn click tiếp theo.
- Chọn hồ sơ có race: phản hồi cũ có thể về sau và ghi đè lựa chọn mới; snapshot lấy trước request cũng có thể bỏ qua chỉnh sửa trong lúc chờ. Đã đánh số request, bỏ phản hồi quá hạn và đọc trạng thái mới nhất khi merge. Đóng modal hủy lựa chọn đang chờ.

## Các giới hạn còn lại

Bản này là MVP chơi được, chưa đủ bằng chứng để coi sẵn sàng phát hành cho trẻ.

- Chưa kiểm chứng Google OAuth, Neon qua mạng, Vercel routing thực tế hoặc Safari trên iPad thật. Test PostgreSQL nhúng không thay thế các kiểm tra này.
- Nội dung vẫn mỏng: chỉ ba cây, hai kiểu bữa ăn, ba đồ trang trí; sinh vật ẩn xuất hiện theo vị trí cố định. Bữa ăn đang làm chưa được lưu. Chưa có đủ biến thể để khẳng định chống nhàm chán dài hạn.
- Phản hồi lựa chọn sai của thỏ chủ yếu dựa vào lời dẫn và chấm đếm; biểu cảm nhân vật và gợi ý bằng hình ảnh cần rõ hơn cho trẻ chưa đọc chữ, đặc biệt khi không có giọng Việt.
- Đổi màu nhà phản ánh ngoài vườn, nhưng bố cục đồ trang trí chỉ hiện trong modal. Sự thay đổi thế giới dài hạn còn hạn chế.
- Conflict policy chọn toàn bộ field, không hợp nhất từng đồ trang trí. Clock thiết bị lệch ảnh hưởng bên thắng; cùng trình duyệt nhiều tab dùng chung device ID có thể tạo tie. Chưa kiểm thử tích hợp đa tab.
- Cổng phép tính là rào cản UX đơn giản, không phải bằng chứng người lớn; URL callback query hiện có thể mở UI tài khoản nhưng API vẫn bắt buộc session hợp lệ.
- Test giao diện trước vòng review chưa có regression cho session hết hạn và kéo mây ảnh hưởng luống khác. Việc các test cũ đều qua không có nghĩa mọi acceptance criterion đã đạt.

Không thay artwork trong vòng review. Không push repository.
