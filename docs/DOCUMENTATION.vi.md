[English](DOCUMENTATION.md)

# Quy định tài liệu song ngữ

`README.md`, `AGENTS.md`, mọi tài liệu `docs/*.md` và nguồn gốc asset có bản gốc tiếng Anh và bản `.vi.md` tiếng Việt. Hai bản chứa cùng chức năng, giới hạn, lệnh và quyết định; nội dung game cho bé vẫn chỉ tiếng Việt. Mỗi file liên kết bản kia.

Với mỗi thay đổi code/asset, xác định tài liệu liên quan, cập nhật cả hai, kiểm link và rà ý nghĩa. Đổi artwork phải cập nhật cả hai handoff. Chỉ chạy `npm run docs:sync` sau khi rà hai bản; lệnh ghi cặp SHA-256 vào `docs/.translations.json`. Cặp đã có chỉ sửa một file sẽ bị từ chối. Nếu sửa riêng lỗi diễn đạt một ngôn ngữ, vẫn rà và chỉnh bản kia để ghi nhận cách giải thích tương đương.

`npm run docs:check` tự tìm các cặp và lỗi khi thiếu file, thiếu link bản kia, thiếu bản ghi hoặc hash đổi. CI chạy trước build. Tài liệu mới phải có cặp và được đăng ký. Không cập nhật manifest chỉ để giấu lỗi. Cơ chế này phát hiện bản cũ, không chứng minh dịch đúng nghĩa. Vẫn cần người/agent rà nội dung.
