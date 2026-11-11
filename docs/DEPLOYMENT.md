# Đưa lên Vercel Hobby

Không có tài nguyên cloud được tự tạo. Dùng Neon free tier và Vercel Hobby theo điều khoản của nhà cung cấp; theo dõi quota của tài khoản.

1. Tạo Neon PostgreSQL. Mở SQL editor và chạy toàn bộ `migrations/001_initial.sql`. Script có transaction và có thể chạy lại. Dùng connection string có TLS được Neon cung cấp.
2. Google Cloud Console: tạo OAuth consent screen và OAuth client loại Web application. Chỉ yêu cầu scope `openid`. Thêm test users nếu ứng dụng còn ở chế độ thử nghiệm. Redirect URI phải là `https://ten-mien-cua-ban/api/auth/callback` chính xác. Không cần email cho trẻ.
3. Import repository vào Vercel. Framework Vite, Node 22+, install `npm ci`, build `npm run build`, output `dist`. `vercel.json` chuyển các đường API về handler Node serverless.
4. Đặt biến server-only dưới đây trong project settings rồi deploy lại. Không đặt prefix `VITE_`.

| Biến                 | Giá trị                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| DATABASE_URL         | Connection string Neon                                                        |
| GOOGLE_CLIENT_ID     | ID OAuth web client                                                           |
| GOOGLE_CLIENT_SECRET | Secret OAuth                                                                  |
| SESSION_SECRET       | Chuỗi ngẫu nhiên tối thiểu 32 ký tự, ví dụ tạo bằng `openssl rand -base64 48` |
| APP_URL              | Origin HTTPS chính xác, không có dấu `/` cuối                                 |

## Kiểm tra thật sau deploy

Người lớn mở bánh răng, trả lời cổng xác nhận, chọn Tiếp tục với Google, tạo nickname. Gieo cây và trang trí. Đăng nhập cùng tài khoản trên thiết bị thứ hai, chọn hồ sơ và kiểm tra phục hồi. Đăng xuất/xóa cookie rồi tiếp tục chơi: dữ liệu phải còn trên máy, sau đăng nhập lại cùng hồ sơ phải gửi được. Tắt mạng sau khi shell đã được cache, tải lại, khám phá thêm rồi kết nối lại.

Không cấu hình OAuth preview URL ngẫu nhiên; dùng một origin ổn định cho môi trường thử nghiệm. Muốn thử toàn bộ local: `npx vercel dev`, `.env.local` với đúng origin/callback và Neon phát triển riêng. `npm run dev` chỉ phục vụ frontend, nên tài khoản/đồng bộ cần môi trường serverless.

## Cập nhật và dữ liệu

Migration mới phải có version mới. Sao lưu dữ liệu trước migration có thay đổi phá hủy. Cache ID thay theo build; worker chờ đóng tab cũ, không reload gameplay đột ngột. API không được cache. Session 30 ngày, account và progress không có TTL. Rate-limit buckets tự được dọn ở các lần POST sau. Không có cron hoặc server nền.

Đăng xuất xóa cookie; khu vườn cục bộ vẫn còn để tiếp tục chơi. Dùng thiết bị tin cậy, không dùng hồ sơ trên máy công cộng. MVP chưa có giao diện xóa tài khoản/xuất dữ liệu; quản trị viên có thể xóa parent theo ID trong Neon, cascade xóa hồ sơ. Cần bổ sung quy trình tự phục vụ trước khi cung cấp rộng rãi.
