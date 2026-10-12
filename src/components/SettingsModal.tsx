import React from 'react';
import { Settings, CheckCircle2, AlertCircle, X, ShieldCheck, Key, Database, Cpu } from 'lucide-react';
import { BackendStatus } from '../services/aiSpeechService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendStatus: BackendStatus | null;
  onClearCache: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  backendStatus,
  onClearCache,
}) => {
  if (!isOpen) return null;

  const isGeminiReady = backendStatus?.gemini?.configured ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cài đặt & Trạng thái Engine TTS
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kiểm soát kết nối backend, bảo mật khóa API và bộ nhớ đệm
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cài đặt"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5 text-xs">
          {/* Gemini Engine Card */}
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  Gemini 3.8 Neural Speech Engine
                </span>
              </div>
              {isGeminiReady ? (
                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Đang hoạt động (Ready)
                </span>
              ) : (
                <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Cần thiết lập API Key
                </span>
              )}
            </div>

            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Mô hình: <code className="font-mono text-indigo-600 dark:text-indigo-400">gemini-3.8-flash-lite-tts</code> &amp; <code className="font-mono text-indigo-600 dark:text-indigo-400">gemini-3.8-flash-tts</code>
            </p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Định dạng xuất: RIFF WAV 24kHz Mono 16-bit studio chất lượng cao. Khóa API được lưu trữ an toàn phía máy chủ qua biến môi trường <code className="font-mono">GEMINI_API_KEY</code>, không bao giờ lộ ra trình duyệt.
            </p>
          </div>

          {/* Google Cloud TTS Adapter Info */}
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="font-bold text-slate-900 dark:text-white">
                Google Cloud Text-to-Speech API Adapter
              </span>
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Hệ thống đã có sẵn adapter cho Google Cloud TTS v1 (WaveNet &amp; Neural2). Bạn có thể cấu hình biến <code className="font-mono">GOOGLE_CLOUD_API_KEY</code> trong môi trường triển khai server để mở rộng thêm các voice chuyên biệt.
            </p>
          </div>

          {/* Browser Web Speech API */}
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-slate-900 dark:text-white">
                Trình duyệt Web Speech API (Offline fallback)
              </span>
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Luôn khả dụng trực tiếp trên thiết bị của bạn mà không cần bất kỳ API key nào. Không gửi dữ liệu lên mạng, hoạt động ngoại tuyến.
            </p>
          </div>

          {/* Cache & Local storage */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                Bộ nhớ đệm & Bản nháp
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                Xóa toàn bộ bản nháp và lịch sử được lưu trong Local Storage
              </p>
            </div>
            <button
              type="button"
              onClick={onClearCache}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Xóa bộ nhớ đệm
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Đã hiểu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
