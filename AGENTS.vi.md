[English](AGENTS.md)

# Hướng dẫn kỹ thuật

Dùng checkout hiện tại; không tạo worktree trừ khi được yêu cầu. Dùng Node 22+, `npm ci`, typecheck, lint, Vitest, kiểm tra docs và build. Chạy Playwright khi đổi tương tác.

Giữ chữ và lời nói cho bé bằng tiếng Việt. README, tài liệu kỹ thuật/sản phẩm và handoff artwork phải có cặp Anh/Việt đồng bộ; theo `docs/DOCUMENTATION.vi.md`. Sửa cả hai và chạy `npm run docs:sync` sau rà ý nghĩa, rồi `npm run docs:check`.

Giữ luật trong `src/game`, nội dung trong `src/data`, asset trong `Art.tsx`, lưu/âm thanh trong `src/services`. Renderer không gọi database. Kiểm session và ownership phía server. Không log/commit credentials. Giữ pending local khi API lỗi. Khám phá merge union; đổi conflict cần migration/test tương thích.

Dùng asset ID ổn định, cập nhật cả hai handoff khi đổi asset hoặc mapping animation. Không nhúng logic/chữ vào ảnh. Không quảng cáo, theo dõi hành vi, điểm phạt, streak, đếm ngược hoặc Parent Mode.

Commit identity: Nicholas Nguyen <134213451+nqnhut92@users.noreply.github.com>. Không ký commit. Không push trừ khi người dùng cho phép về sau; chỉ dẫn hiện tại là không push.
