# frontend-react

Vite React workspace dùng để phát triển, test và build SPA cho Web Oto.

## Purpose

- `frontend-react/` là source workspace của ứng dụng React.
- `frontend-react/dist/` là production build output.
- `frontend/` là thư mục frontend active sau cutover.
- Khi release/cutover local, build output từ `frontend-react/dist` phải được copy vào `frontend/`.

## Environment

- `VITE_API_BASE_URL` là biến môi trường chuẩn cho client.
- Trong local dev, Vite proxy `/api` sang `VITE_PROXY_TARGET` (mặc định `http://localhost:8080`).
- Nếu không set `VITE_API_BASE_URL`, app fallback sang same-origin `/api`.

## Commands

```bash
npm install
npm run dev
npm test
npm run build
```

## Cutover workflow

1. Chạy `npm run build` trong `frontend-react/`.
2. Copy nội dung từ `frontend-react/dist/` sang `frontend/`.
3. Đảm bảo `frontend/index.html` là React SPA entrypoint và `frontend/assets/` tồn tại.
4. Không dùng các legacy runtime pages riêng lẻ nữa; frontend active chỉ còn SPA entrypoint trong `frontend/`.
