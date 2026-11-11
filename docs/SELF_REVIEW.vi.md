[English](SELF_REVIEW.md)

# Tự đánh giá — 11/11/2026

## Đã sửa sau review

- Session hết hạn vẫn giữ UI đã đăng nhập. 401 nay xóa trạng thái UI tài khoản mà không xóa vườn cục bộ.
- Pointer capture tạo click sau kéo mây/nắng, vô tình chăm cả ba luống. Di chuyển quá 8px chặn click đó.
- Request hồ sơ trễ có thể đè lựa chọn mới. Đã đánh số request, bỏ kết quả cũ, đọc trạng thái hiện tại khi merge và hủy lựa chọn chờ khi đóng modal.
- Bữa chưa xong chỉ ở bộ nhớ. Nay lưu/đồng bộ loại bữa, số món và số lần thử.
- Phản hồi sai chủ yếu nằm ngoài dialog. Nay có yêu cầu bằng hình, phản hồi trong dialog, bong bóng món mong muốn, nghiêng nhẹ và nhảy/ngôi sao khi đúng. Bốn biến thể thay cho hai.
- Trang trí nhà nay hiện cả ngoài vườn chính.
- Chỉnh sửa mới không đọc giờ máy. Mỗi lần mở app có writer ID riêng; storage event cùng hồ sơ merge các tab. Clock cũ vẫn tương thích.

## Giới hạn còn lại

Đây là MVP chơi được, không phải chứng nhận sẵn sàng phát hành. Google OAuth thật, mạng Neon, routing Vercel và iPad Safari thật chưa kiểm chứng. Ba cây, ba đồ trang trí và vị trí trốn cố định vẫn giới hạn độ phong phú. Cần quan sát trẻ chơi để đánh giá thích thú.

Chỉnh cùng field chọn một field toàn bộ; không merge cộng tác từng đồ trang trí. Clock logic không xác định thứ tự thời gian thực giữa máy offline. Cổng phép tính là rào UX, không chứng minh người lớn. Query callback có thể mở UI tài khoản nhưng API bảo vệ vẫn cần session hợp lệ. Chưa tạo artwork production. Chưa push repository.
