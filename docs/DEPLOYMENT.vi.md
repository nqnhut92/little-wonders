[English](DEPLOYMENT.md)

# Triển khai trên Vercel Hobby

Chưa tạo hoặc mua tài nguyên cloud. Dùng Neon free tier và Vercel Hobby đúng điều khoản, theo dõi quota.

1. Tạo Neon PostgreSQL và chạy `migrations/001_initial.sql` trong SQL editor. Script có transaction và chạy lại được. Dùng connection string TLS được cung cấp.
2. Cấu hình Google OAuth Web application với scope `openid`, consent screen và test users nếu cần. Đăng ký callback chính xác `https://YOUR_HOST/api/auth/callback`.
3. Import repository vào Vercel, chọn Node 22+, install `npm ci`, build `npm run build`, output `dist`. `vercel.json` chuyển API vào handler Node serverless.
4. Đặt biến chỉ phía server rồi deploy lại:

| Biến                 | Giá trị                                                         |
| -------------------- | --------------------------------------------------------------- |
| DATABASE_URL         | Connection string Neon                                          |
| GOOGLE_CLIENT_ID     | ID web client Google                                            |
| GOOGLE_CLIENT_SECRET | Secret client Google                                            |
| SESSION_SECRET       | Ít nhất 32 ký tự ngẫu nhiên; tạo bằng `openssl rand -base64 48` |
| APP_URL              | Origin HTTPS chính xác không có dấu / cuối                      |

Không dùng prefix `VITE_` cho secret hoặc commit `.env`. Không cần email của trẻ.

## Local và kiểm tra phát hành

Frontend dùng `npm run dev`. Để chạy API, chép `.env.example` thành `.env.local`, cấu hình Neon phát triển riêng, chạy migration rồi `npx vercel dev`. Callback/origin Google phải khớp. Cookie giữ Secure; thử xác thực local trong secure context tương thích. Dùng origin deploy ổn định thay vì URL preview ngẫu nhiên khi thử OAuth.

Trước phát hành: đăng nhập, tạo nickname, trồng và trang trí; đăng nhập thiết bị thứ hai và chọn cùng hồ sơ. Thử hai parent độc lập, hết phiên/đăng nhập lại, reload offline và retry pending. Test PostgreSQL nhúng không phải test Neon/OAuth thật.

## Cập nhật và riêng tư

Migration sau thêm version mới và sao lưu trước thay đổi phá hủy. Service worker mới hoạt động sau khi đóng tab cũ. Không cache API. Session 30 ngày; account và progress không TTL. Bucket giới hạn hết hạn và được dọn trong request; không cần cron/server.

Đăng xuất xóa cookie nhưng vườn cục bộ vẫn chơi được. Dùng máy tin cậy. Chưa có tự phục vụ xóa/xuất tài khoản; quản trị viên có thể xóa parent trong Neon để cascade hồ sơ. Cần quy trình cho phụ huynh trước khi phát hành rộng rãi.

## Migration tự động

Sau `npm ci`, đặt connection string Neon trong biến server-only `DATABASE_URL` hoặc `.env.local` được ignore, rồi chạy:

```sh
npm run db:migrate
```

Runner kiểm chứng chỉ TLS, lấy advisory lock theo transaction tương thích Neon pooling, chạy file đánh số theo thứ tự và ghi checksum vào `schema_migrations`. Chạy lại bỏ qua version đã áp dụng; file đã áp dụng mà bị sửa sẽ bị từ chối. File lỗi và bản ghi version rollback cùng nhau. Migration trước đó chạy qua SQL Editor được tiếp nhận mà không chạy lại. Thay đổi sau thêm file SQL số mới; không sửa lịch sử đã áp dụng.

Chạy migration một lần từ máy phát triển tin cậy hoặc bước release có kiểm soát trước khi phục vụ schema mới. Không chạy trong browser hoặc mỗi request serverless. Chưa chạy migration Neon thật ở đây vì thiếu DATABASE_URL.
