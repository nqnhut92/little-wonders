[English](PROVENANCE.md)

# Nguồn hình ảnh

Vector tạm trong game hiện tại viết trực tiếp trong `src/components/Art.tsx`; nền dùng `src/style.module.css`. Không chủ ý đưa nhân vật có bản quyền bên thứ ba vào. Chủ repository cần chọn giấy phép phân phối trước phát hành rộng rãi.

Bộ icon app (`public/favicon.ico`, `public/icon-32.png`, `public/icon-180.png`, `public/icon-192.png`, `public/icon-512.png`) được xuất ngày 2026-11-11 từ minh họa storybook 1:1 do Gemini tạo (bé thỏ kem má hồng viền xanh rêu ôm hoa hướng dương vàng trên nền cỏ nắng tràn viền, không chữ/khung, resize bằng `sips` và đóng gói ICO). Khi thay tiếp artwork trong game bằng Gemini, ghi model, ngày, prompt, nguồn reference, điều khoản sử dụng áp dụng và chỉnh sửa sau đó. Không mặc nhiên cho rằng ảnh sinh ra có quyền dùng không giới hạn. Theo handoff artwork song ngữ trong `docs`.

`public/favicon.svg`, `public/icon-maskable-192.png` và `public/icon-maskable-512.png` được tạo từ `public/icon-512.png` bằng `scripts/make-icons.mjs` (2026-11-11): SVG bọc một bản 128px bo góc; icon maskable đặt minh họa ở 78% trên một bản mờ của chính nó. Không thêm nội dung sinh mới.

Font giao diện là Nunito, đóng gói từ `@fontsource/nunito` (giấy phép SIL Open Font License 1.1) với subset `latin` và `vietnamese` ở các độ đậm 400, 600, 700 và 800. Icon giao diện trong `src/components/Icons.tsx` được vẽ riêng cho dự án; logo Google trên nút đăng nhập là logo của Google và chỉ dùng để nhận diện nhà cung cấp đó.
