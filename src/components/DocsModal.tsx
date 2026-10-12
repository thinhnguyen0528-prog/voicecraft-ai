import React from 'react';
import { BookOpen, X, CheckCircle, AlertTriangle, ShieldCheck, Download, Code } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tài liệu kỹ thuật VoiceCraft AI
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nguyên tắc hoạt động, phân biệt công nghệ và tính trung thực tính năng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng tài liệu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {/* Section 1 */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              1. Cam kết trung thực kỹ thuật (Technical Honesty)
            </h4>
            <p>
              VoiceCraft AI được thiết kế với tiêu chuẩn kỹ thuật nghiêm ngặt. Ứng dụng phân biệt rạch ròi giữa <strong>AI Neural Engine</strong> và <strong>Browser TTS (Web Speech API)</strong>:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Không giả lập xuất file:</strong> Web Speech API không hỗ trợ xuất luồng byte nhị phân. Khi dùng chế độ Browser TTS, nút tải file được ẩn hoặc thông báo rõ ràng để người dùng không tải về file rỗng hoặc file giả đổi đuôi.
              </li>
              <li>
                <strong>Không gán nhãn AI cho giọng trình duyệt:</strong> Danh sách giọng trình duyệt hiển thị đúng tên giọng nội bộ của hệ điều hành (Microsoft, Apple, Google local service) và thông báo nếu máy tính chưa cài gói tiếng Việt.
              </li>
              <li>
                <strong>Bảo toàn dữ liệu:</strong> Toàn bộ dấu tiếng Việt (sắc, huyền, hỏi, ngã, nặng), chữ hoa, số và ký tự Unicode được giữ nguyên vẹn 100%, không bị sửa đổi khi chuyển đổi.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              2. So sánh hai chế độ TTS
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <tr>
                    <th className="p-2.5">Đặc tính</th>
                    <th className="p-2.5">AI Neural Engine</th>
                    <th className="p-2.5">Browser Web Speech</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-2.5 font-medium">Mô hình / Nguồn</td>
                    <td className="p-2.5">Gemini 3.8 Flash Lite TTS</td>
                    <td className="p-2.5">window.speechSynthesis</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Định dạng âm thanh</td>
                    <td className="p-2.5">RIFF WAV 24kHz 16-bit Mono</td>
                    <td className="p-2.5">Audio Output phần cứng</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Xuất tệp (.wav)</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">Có (Tải trực tiếp)</td>
                    <td className="p-2.5 text-amber-600 dark:text-amber-400">Không hỗ trợ bởi chuẩn Web</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">14 Phong cách đọc</td>
                    <td className="p-2.5">Nhúng prompt sắc thái vào mô hình</td>
                    <td className="p-2.5">Mô phỏng qua tốc độ/cao độ</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Độ trễ / Kết nối</td>
                    <td className="p-2.5">Qua backend API (~1-2s)</td>
                    <td className="p-2.5">Tức thì, ngoại tuyến (Offline)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              3. Hệ thống 14 Phong cách đọc (Voice Style Profiles)
            </h4>
            <p>
              Mỗi phong cách được thiết kế với hồ sơ riêng biệt:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Chuyên nghiệp &amp; Phát thanh:</strong> MC / Host, Thuyết trình (Presentation), Tin tức (News Anchor), Doanh nghiệp &amp; Đào tạo (Corporate Narration).</li>
              <li><strong>Sáng tạo &amp; Cảm xúc:</strong> Truyền cảm hứng (Inspirational), Kể chuyện (Storytelling), Sách nói (Audiobook), Ấm áp &amp; Sâu lắng (Warm &amp; Emotional), Kịch tính (Dramatic).</li>
              <li><strong>Đời thường &amp; Giáo dục:</strong> Hội thoại đời thường (Natural Conversation), Trợ lý thông minh (Friendly Assistant), Học ngoại ngữ (Language Learning), Chậm rãi &amp; Rõ nghĩa (Slow &amp; Clear), Video ngắn TikTok/Reels (Short-form Content).</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Bảo mật &amp; Quản trị API
            </h4>
            <p>
              Khóa API bí mật (<code className="font-mono">GEMINI_API_KEY</code>) được xử lý hoàn toàn tại server backend (<code className="font-mono">server.ts</code>). Frontend tuyệt đối không truy cập hoặc lưu trữ API keys trong mã nguồn trình duyệt, ngăn chặn hoàn toàn nguy cơ rò rỉ thông tin người dùng.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Đóng tài liệu
          </button>
        </div>
      </div>
    </div>
  );
};
