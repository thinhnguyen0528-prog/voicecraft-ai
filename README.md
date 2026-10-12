# VoiceCraft AI — Premium Multilingual Text-to-Speech Studio

VoiceCraft AI là một nền tảng phòng thu âm thanh kỹ thuật số cao cấp chuyển đổi văn bản thành giọng nói (Text-to-Speech - TTS) đa ngôn ngữ, hỗ trợ chuẩn xác Tiếng Việt (`vi-VN`) và Tiếng Anh-Mỹ (`en-US`), tích hợp 14 phong cách diễn đọc chuyên nghiệp, điều khiển thông số âm học thời gian thực và xuất tệp âm thanh thực tế.

---

## 1. Tính năng nổi bật

- **Dual TTS Engine Architecture:**
  - **AI Neural 24kHz (Gemini 3.8 Flash Lite TTS & Flash TTS):** Tổng hợp giọng nói thần kinh chất lượng phòng thu, phát âm chuẩn thanh điệu tiếng Việt và ngữ điệu tự nhiên tiếng Anh-Mỹ. Xuất file âm thanh thực tế định dạng RIFF WAV (24.0 kHz, Mono, 16-bit uncompressed).
  - **Browser Web Speech API (Local Fallback):** Phát trực tiếp qua phần cứng âm thanh thiết bị mà không cần internet hay API key, độ trễ tức thì, tôn trọng quyền riêng tư.
- **Hệ thống 14 Phong cách đọc (Voice Style Profiles):**
  - **Professional & Broadcast:** MC / Host, Presentation (Thuyết trình), News Anchor (Tin tức thời sự), Corporate Narration (Doanh nghiệp & Đào tạo).
  - **Expressive & Creative:** Inspirational (Truyền cảm hứng), Storytelling (Kể chuyện), Audiobook (Sách nói), Warm & Emotional (Ấm áp & Sâu lắng), Dramatic (Kịch tính).
  - **Everyday & Education:** Natural Conversation (Hội thoại đời thường), Friendly Assistant (Trợ lý ảo), Language Learning (Học ngoại ngữ & Luyện phát âm), Slow & Clear (Chậm rãi & Rõ nghĩa), Short-form Content (Video ngắn TikTok / Reels).
- **Cam kết trung thực kỹ thuật (Technical Honesty):**
  - Không tạo file âm thanh giả mạo (không xuất MP3 rỗng khi dùng Browser TTS).
  - Hiển thị đúng giới hạn và năng lực của từng engine.
  - Bảo toàn 100% dấu câu, thanh điệu tiếng Việt và ký tự số.
- **Trình soạn thảo văn bản thông minh (Text Studio):**
  - Tự động đếm ký tự, đếm từ, ước tính thời lượng đọc.
  - Phân đoạn văn bản dài thông minh theo ranh giới câu (`.`, `!`, `?`, `\n\n`), không ngắt giữa từ.
  - Làm sạch khoảng trắng thừa, lưu trữ bản nháp an toàn trong Local Storage.
- **Trình phát âm thanh Studio (Audio Player):**
  - Scrubbing thanh tiến trình, hiển thị dấu thời gian MM:SS chuẩn xác.
  - Điều chỉnh tốc độ phát lại (0.75× đến 2.0×), trực quan hóa sóng âm thanh (waveform animation).
  - Tải xuống tệp WAV 24kHz nguyên bản chỉ với 1 cú nhấp.
- **Kho kịch bản mẫu & Lịch sử chuyển đổi:**
  - Kịch bản mẫu phong phú theo nhiều lĩnh vực (Gala, tin tức, keynote, truyện cổ tích, học ngoại ngữ).
  - Quản lý lịch sử chuyển đổi ngoại tuyến trên máy khách.

---

## 2. Yêu cầu môi trường

- **Node.js:** Phiên bản 18.0.0 hoặc cao hơn (khuyên dùng Node.js 20 LTS hoặc 22).
- **Trình quản lý gói:** `npm`, `yarn`, `pnpm` hoặc `bun`.
- **Trình duyệt hỗ trợ:** Chrome 80+, Edge 80+, Safari 14.1+, Firefox 85+ (Web Speech API và HTML5 Audio).

---

## 3. Cài đặt và Khởi chạy

### Cài đặt dependencies:
```bash
npm install
```

### Chạy môi trường Development (Full-Stack Express + Vite):
```bash
npm run dev
```
Máy chủ phát triển sẽ khởi động tại `http://localhost:3000`.

### Build Production:
```bash
npm run build
```

### Chạy Production Server:
```bash
npm run start
```

---

## 4. Biến môi trường (Environment Variables)

Tạo tệp `.env` tại thư mục gốc của dự án:

```env
# GEMINI_API_KEY: Bắt buộc để kích hoạt chế độ AI Neural TTS
# Lấy khóa miễn phí hoặc trả phí tại Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY="your-gemini-api-key-here"

# PORT: Cổng chạy server (mặc định 3000)
PORT=3000

# NODE_ENV: 'development' hoặc 'production'
NODE_ENV=production
```

> **Lưu ý bảo mật:** `GEMINI_API_KEY` chỉ được đọc ở phía máy chủ (`server.ts`). Mã nguồn phía client không bao giờ có quyền truy cập trực tiếp vào biến này, đảm bảo an toàn tuyệt đối trước nguy cơ lộ khóa API.

---

## 5. Cấu hình AI TTS Providers

### Google AI Studio (Gemini 3.8 Flash Lite TTS) — Mặc định
- Mô hình: `gemini-3.8-flash-lite-tts` (đọc văn bản tốc độ cao) và `gemini-3.8-flash-tts` (chế độ siêu biểu cảm).
- Giọng đọc hỗ trợ: `Kore` (Nữ), `Puck` (Nam), `Charon` (Nam trầm), `Fenrir` (Nam kịch tính), `Zephyr` (Nữ dịu êm).
- Hỗ trợ đa ngôn ngữ bao gồm Tiếng Việt và Tiếng Anh.

### Google Cloud Text-to-Speech API (Tùy chọn mở rộng)
Để kết nối Google Cloud TTS v1 cho dự án doanh nghiệp:
1. Tạo Service Account trên Google Cloud Console với quyền `Cloud Text-to-Speech API User`.
2. Tải tệp JSON credentials hoặc cấp `GOOGLE_CLOUD_API_KEY`.
3. Khai báo biến môi trường trên server: `GOOGLE_CLOUD_API_KEY="AIza..."`.

---

## 6. Hướng dẫn kiểm thử chức năng

| Hạng mục kiểm thử | Các bước thực hiện | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Phát tiếng Việt (AI)** | Nhập câu tiếng Việt có dấu, chọn giọng Kore, bấm "Tạo giọng nói ngay". | Âm thanh phát rõ tiếng Việt, chuẩn thanh điệu, hiển thị thanh tiến trình và cho phép tải WAV. |
| **Phát tiếng Anh (AI)** | Chọn ngôn ngữ English (en-US), nạp kịch bản Keynote, bấm tạo. | Giọng đọc phát âm chuẩn ngữ điệu Mỹ, đúng thời lượng. |
| **Browser TTS** | Chuyển sang tab "Browser TTS", bấm phát văn bản. | Trình duyệt đọc trực tiếp qua Web Speech API, nút xuất tệp thông báo giới hạn trung thực. |
| **Điều chỉnh tốc độ** | Kéo slider tốc độ về 1.5× và bấm nghe thử. | Nhịp đọc nhanh hơn rõ rệt tương ứng với thông số. |
| **Xuất tệp WAV** | Bấm nút "Tải tệp âm thanh (.wav)" sau khi tổng hợp AI. | Tệp `.wav` được tải về máy, mở được trên VLC, QuickTime hoặc Windows Media Player với chất lượng 24kHz. |
| **Lưu bản nháp** | Nhập văn bản, tải lại trang (F5). | Nội dung văn bản được khôi phục nguyên vẹn từ Local Storage. |

---

## 7. Hướng dẫn Triển khai (Deployment)

### Triển khai Full-Stack lên Google Cloud Run / Render / VPS:
Do VoiceCraft AI tích hợp endpoint API Node.js/Express (`server.ts`) để bảo vệ API key:
1. Chạy lệnh build: `npm run build`
2. Thiết lập lệnh khởi động: `npm run start` (hoặc `node server.ts`)
3. Khai báo biến môi trường `GEMINI_API_KEY` trong bảng điều khiển máy chủ.

### Triển khai Frontend riêng lên Vercel:
Nếu muốn triển khai giao diện tĩnh lên Vercel:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Tạo Vercel Serverless Function tại `/api/tts/synthesize.ts` để ủy quyền các lệnh gọi `@google/genai`.

---

## 8. Các giới hạn kỹ thuật đã biết của Browser TTS

1. **Khả năng xuất âm thanh:** Chuẩn Web Speech API của W3C không cung cấp AudioNode hoặc ArrayBuffer của giọng nói đọc ra. Do đó không thể trích xuất trực tiếp tệp âm thanh nhị phân trên trình duyệt.
2. **Gói giọng đọc phụ thuộc hệ điều hành:** Trình duyệt trên máy tính/điện thoại chỉ đọc được tiếng Việt nếu hệ điều hành của người dùng đã cài đặt gói ngôn ngữ tiếng Việt (ví dụ: gói ngôn ngữ Microsoft HoaiMy trên Windows 11 hoặc Apple Linh trên macOS).
3. **Giải pháp:** Sử dụng chế độ **AI Neural 24kHz** của VoiceCraft AI để đảm bảo 100% người dùng trên mọi thiết bị đều nghe được giọng tiếng Việt chuẩn chất lượng cao và có thể tải tệp âm thanh về máy.
