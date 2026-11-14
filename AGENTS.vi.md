[English](AGENTS.md)

# Hướng dẫn kỹ thuật

Dùng checkout hiện tại; không tạo worktree trừ khi được yêu cầu. Dùng Node 22+, `npm ci`, typecheck, lint, `npm run format:check`, Vitest, kiểm tra docs và build. Định dạng bằng `npm run format` (Prettier) trước khi commit. Chạy Playwright khi đổi tương tác.

Giữ chữ và lời nói cho bé bằng tiếng Việt. README và tài liệu kỹ thuật/sản phẩm phải có cặp Anh/Việt đồng bộ có liên kết ở đầu file. Sửa cả hai và chạy `npm run docs:sync` sau rà ý nghĩa, rồi `npm run docs:check`.

Công cụ kỹ thuật dùng tiếng Anh: tên workflow, job và step GitHub Actions, mô tả test và commit message. Quy định chỉ tiếng Việt áp dụng cho gameplay của bé; tài liệu vẫn có cặp EN/VI.

Giữ luật trong `src/game`, nội dung trong `src/data`, asset trong `Art.tsx`, lưu/âm thanh trong `src/services`. Renderer không gọi database. Kiểm session và ownership phía server. Không log/commit credentials. Giữ pending local khi API lỗi. Khám phá merge union; đổi conflict cần migration/test tương thích.

Các tệp giọng nói miền Nam trong `public/assets/voice/*.m4a` được sinh sẵn cục bộ qua `npm run voice:sync` (`scripts/generate-voice.mjs`: sinh tăng dần theo hash nội dung bằng VietVoice-TTS MIT preset `#170` tốc độ `0.85x`, `nfe=32`, đổi `!` thành `.`, nén AAC mono 48 kbps). Mỗi khi thêm hoặc sửa câu thoại cho bé, chạy `npm run voice:sync -- --prune --clean` để chỉ sinh câu mới, cập nhật `src/data/voiceManifest.ts` và xóa sạch cache model tạm trong `/tmp`; tuyệt đối không commit checkpoint model hay môi trường ảo Python.

Dùng asset ID ổn định xuyên suốt `src/components/Art.tsx`, `src/components/ArtFlat.tsx`, `src/components/ArtFlatMore.tsx` và `src/components/SceneBackdrop.tsx`. Không nhúng logic/chữ vào ảnh. Không quảng cáo, theo dõi hành vi, điểm phạt, streak, đếm ngược hoặc Parent Mode.

Giữ cảnh chơi đồng bộ và khớp tuyệt đối với hình nền trên mọi tỉ lệ màn hình (iPad 4:3, iPad Pro ~1.43, PC 16:9) bằng cách đóng gói SVG nền cùng các hotspot/nhân vật tương tác trong stage 16:9 canh giữa (`.garden-stage`, chiều cao 100vh/100dvh). Giữ tọa độ hotspot nằm trong vùng an toàn 4:3 (x từ 13% đến 87%) để không bị tràn ra ngoài màn hình. Đối với thao tác kéo thả cảm ứng, bắt buộc dùng `touch-action: none` (cả CSS lẫn style inline), chặn default ở `pointerdown` để tránh WebKit cuộn màn hình, bọc `setPointerCapture`/`releasePointerCapture` trong `try / catch` và tính dung sai biên viền cho ngón tay trẻ nhỏ.

Commit identity: Nicholas Nguyen <134213451+nqnhut92@users.noreply.github.com>. Không ký commit. Chỉ push khi được cho phép trong hội thoại hiện tại, trực tiếp lên main theo git-main-workflow.
