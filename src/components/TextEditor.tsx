import React, { useState } from 'react';
import { Copy, Clipboard, Trash2, Wand2, Check, AlertTriangle, Layers, Clock } from 'lucide-react';
import { EngineMode } from '../types/voice';
import { getStats, normalizeText, segmentText } from '../utils/textSegmentation';

interface TextEditorProps {
  text: string;
  onChangeText: (text: string) => void;
  engineMode: EngineMode;
  onSynthesize: () => void;
  isSynthesizing: boolean;
  disabled?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChangeText,
  engineMode,
  onSynthesize,
  isSynthesizing,
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [showSegments, setShowSegments] = useState(false);

  // Engine character limits
  const maxSafeChars = engineMode === 'ai' ? 3000 : 10000;
  const stats = getStats(text);
  const segmentation = segmentText(text, 500);

  const isOverLimit = stats.charCount > maxSafeChars;
  const isCloseToLimit = stats.charCount > maxSafeChars * 0.85;

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy to clipboard', err);
    }
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        onChangeText(clipText);
      }
    } catch {
      // Clipboard access denied, user can paste with keyboard shortcut
    }
  };

  const handleClean = () => {
    const cleanedText = normalizeText(text);
    onChangeText(cleanedText);
    setCleaned(true);
    setTimeout(() => setCleaned(false), 2000);
  };

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <label htmlFor="tts-editor" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Nội dung chuyển đổi
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>{stats.wordCount} từ</span>
            <span aria-hidden="true">·</span>
            <span className={`font-mono tabular-nums ${isOverLimit ? 'font-bold text-red-500' : ''}`}>
              {stats.charCount} / {maxSafeChars} ký tự
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
              <Clock className="h-3 w-3" />
              ~{segmentation.estimatedDurationSec}s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePaste}
            title="Dán từ Clipboard (Ctrl+V)"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Clipboard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Dán</span>
          </button>

          <button
            type="button"
            onClick={handleClean}
            title="Chuẩn hóa dấu cách và khoảng trắng thừa"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {cleaned ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Wand2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{cleaned ? 'Đã lọc' : 'Làm sạch'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            title="Sao chép toàn bộ văn bản"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!text}
            title="Xóa nội dung"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>

      {/* Over-limit warning */}
      {isOverLimit && (
        <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Văn bản đã vượt quá giới hạn an toàn của lượt chuyển đổi ({stats.charCount} / {maxSafeChars} ký tự). Vui lòng rút ngắn hoặc chia nhỏ đoạn văn.
          </span>
        </div>
      )}

      {/* Main Text Area */}
      <div className="relative flex-1 p-3">
        <textarea
          id="tts-editor"
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          disabled={disabled}
          placeholder="Nhập hoặc dán văn bản tiếng Việt hoặc tiếng Anh tại đây... (Ví dụ: Chào mừng quý khách đến với VoiceCraft AI Studio)"
          rows={10}
          className="h-full min-h-[220px] w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 dark:text-slate-100 dark:placeholder-slate-500"
        />
      </div>

      {/* Segmentation Inspector Footer */}
      {segmentation.segments.length > 1 && (
        <div className="border-t border-slate-100 px-4 py-2 text-xs dark:border-slate-800">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowSegments(!showSegments)}
              className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>
                Tự động chia thành {segmentation.segments.length} phân đoạn theo dấu câu
              </span>
            </button>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Giữ nguyên dấu tiếng Việt & ngắt nhịp tự nhiên
            </span>
          </div>

          {showSegments && (
            <div className="mt-2 max-h-36 space-y-1.5 overflow-y-auto rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
              {segmentation.segments.map((seg, i) => (
                <div key={i} className="flex gap-2 border-b border-slate-200/50 pb-1 last:border-0 last:pb-0 dark:border-slate-700/50">
                  <span className="font-mono text-slate-400 tabular-nums">#{i + 1}</span>
                  <span className="line-clamp-2 flex-1">{seg}</span>
                  <span className="font-mono text-slate-400 tabular-nums shrink-0">{seg.length} ký tự</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor Control Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Tự động lưu bản nháp</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>

        <button
          type="button"
          onClick={onSynthesize}
          disabled={!text.trim() || isSynthesizing || isOverLimit}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {isSynthesizing ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Đang xử lý âm thanh...</span>
            </>
          ) : (
            <>
              <span>Tạo giọng nói ngay</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
