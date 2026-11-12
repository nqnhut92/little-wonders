[English](PROVENANCE.md)

# Nguồn hình ảnh

Toàn bộ hình minh họa trong game, nhân vật, cây trồng, món ăn, nền cảnh các vùng đất, điểm nhấn bản đồ thung lũng và nút giao diện đều là tranh vector SVG gốc do dự án tự vẽ trong `src/components/ArtFlat.tsx`, `src/components/ArtFlatMore.tsx` và `src/components/SceneBackdrop.tsx`. Không đóng gói nhân vật bên thứ ba hay ảnh raster sinh tự động.

`public/favicon.svg` là bản gốc vector của icon ứng dụng do dự án tự vẽ (cún trắng Lucky đeo nơ tím nhỏ ôm miếng dưa hấu). `scripts/make-icons.mjs` dựng `public/favicon.ico`, `public/icon-32.png`, `public/icon-180.png`, `public/icon-192.png`, `public/icon-512.png` và các icon maskable từ bản gốc đó.

Font giao diện là Nunito, đóng gói từ `@fontsource/nunito` (giấy phép SIL Open Font License 1.1) với subset `latin` và `vietnamese` ở các độ đậm 400, 600, 700 và 800. Icon giao diện trong `src/components/Icons.tsx` được vẽ riêng cho dự án; logo Google trên nút đăng nhập là logo của Google và chỉ dùng để nhận diện nhà cung cấp đó.

Nhạc nền là tài nguyên của bên thứ ba, đã được hiến tặng cho phạm vi công cộng theo Creative Commons Zero (CC0 1.0), tải từ OpenGameArt.org ngày 2026-11-12:

- `public/assets/music-valley.m4a` (bản đồ thung lũng): "Children's March Theme" của Cleyton Kauffman, <https://opengameart.org/content/childrens-march-theme>. Nén lại từ tệp WAV của tác giả thành AAC mono 80 kbps.
- `public/assets/music-play.mp3` (trong vùng đất): "Happy Lullaby (song17)" của cynicmusic (cynicmusic.com, pixelsphere.org), <https://opengameart.org/content/happy-lullaby-song17>. Tệp MP3 gốc của tác giả, không chỉnh sửa.
