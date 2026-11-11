# Hướng dẫn phát triển

- Dùng checkout hiện tại. Không tạo Git worktree trừ khi người dùng yêu cầu.
- Giao diện, lời thoại và tài liệu sản phẩm dùng tiếng Việt. README dùng tiếng Anh. Không thêm nội dung bắt trẻ phải đọc để chơi.
- Node 22+, `npm ci`. Kiểm tra `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`; chạy Playwright khi thay đổi luồng tương tác.
- Tách luật chơi trong `src/game`, nội dung trong `src/data`, hình ảnh trong `src/components/Art.tsx`, lưu/âm thanh trong `src/services`. Không truy cập database từ renderer.
- Không log hoặc commit bí mật. Session và quyền sở hữu phải kiểm tra trong API; dữ liệu client không xác định parent ID.
- Khám phá hợp nhất theo union. Không thay đổi conflict policy nếu chưa có migration và kiểm thử. Giữ dữ liệu cục bộ khi API lỗi.
- Các ID hình ảnh ổn định. Khi thêm hoặc sửa asset, cập nhật `docs/ARTWORK_HANDOFF.md`. Không nhúng luật chơi hay chữ trong hình.
- Không quảng cáo, theo dõi hành vi, điểm phạt, streak, đếm ngược hoặc cơ chế ép quay lại. Không thêm Parent Mode.
- Commit identity: Nicholas Nguyen <134213451+nqnhut92@users.noreply.github.com>. Không ký commit.
