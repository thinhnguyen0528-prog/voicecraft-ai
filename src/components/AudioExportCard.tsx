import React, { useState } from 'react';
import { Download, FileAudio, ShieldAlert, Check, Copy, ExternalLink, HardDrive } from 'lucide-react';
import { EngineMode, SynthesisResult } from '../types/voice';
import { downloadAudioFile, formatBytes, generateAudioFilename } from '../utils/audioExport';

interface AudioExportCardProps {
  engineMode: EngineMode;
  synthesisResult: SynthesisResult | null;
  onSwitchToAi: () => void;
}

export const AudioExportCard: React.FC<AudioExportCardProps> = ({
  engineMode,
  synthesisResult,
  onSwitchToAi,
}) => {
  const [customFilename, setCustomFilename] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // If in Browser TTS Mode: Show honest limitation card
  if (engineMode === 'browser') {
    return (
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 transition-colors dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
            <ShieldAlert className="h-5 w-5" />
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-200">
              Xuất tệp âm thanh (Audio Export)
            </h4>
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              Web Speech API của trình duyệt chỉ phát trực tiếp qua phần cứng âm thanh và <strong>không cung cấp luồng nhị phân (PCM/WAV/MP3)</strong> để tải về. VoiceCraft AI tuân thủ nguyên tắc trung thực kỹ thuật và không tạo tệp giả mạo.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={onSwitchToAi}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <span>Chuyển sang chế độ AI Neural để tải tệp WAV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI TTS Mode
  const hasAudio = Boolean(synthesisResult?.audioBlob || synthesisResult?.audioUrl);

  const handleDownload = () => {
    if (!synthesisResult) return;
    const filename = customFilename.trim()
      ? (customFilename.endsWith('.wav') ? customFilename : `${customFilename}.wav`)
      : synthesisResult.fileName;

    downloadAudioFile(synthesisResult.audioBlob, filename);
  };

  const handleCopyAudioData = async () => {
    if (!synthesisResult?.audioBase64) return;
    try {
      const dataUri = `data:audio/wav;base64,${synthesisResult.audioBase64}`;
      await navigator.clipboard.writeText(dataUri);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Tải xuống & Xuất tệp âm thanh thực tế
          </span>
        </div>

        {hasAudio && (
          <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {formatBytes(synthesisResult?.fileSizeBytes || 0)}
          </span>
        )}
      </div>

      {hasAudio && synthesisResult ? (
        <div className="mt-4 space-y-3">
          {/* File Spec Grid */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs sm:grid-cols-4 dark:bg-slate-800/60">
            <div>
              <span className="text-[10px] text-slate-400">Định dạng</span>
              <p className="font-mono font-medium text-slate-700 dark:text-slate-200">RIFF WAV</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Tần số mẫu</span>
              <p className="font-mono font-medium text-slate-700 dark:text-slate-200">24.0 kHz</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Kênh âm thanh</span>
              <p className="font-mono font-medium text-slate-700 dark:text-slate-200">Mono 16-bit</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Dung lượng thực</span>
              <p className="font-mono font-medium text-slate-700 dark:text-slate-200">
                {formatBytes(synthesisResult.fileSizeBytes)}
              </p>
            </div>
          </div>

          {/* Custom filename input */}
          <div>
            <label
              htmlFor="custom-audio-filename"
              className="text-[11px] font-medium text-slate-600 dark:text-slate-400"
            >
              Tên tệp tải xuống (Tùy chọn)
            </label>
            <div className="mt-1 flex items-center">
              <input
                id="custom-audio-filename"
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder={synthesisResult.fileName}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownload}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Download className="h-4 w-4" />
              <span>Tải tệp âm thanh (.wav)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAudioData}
              title="Sao chép Data URI base64 để nhúng web hoặc dev"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Sao chép Data URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Tệp âm thanh chuẩn phòng thu (.wav) sẽ sẵn sàng để tải xuống ngay sau khi tổng hợp.
        </div>
      )}
    </div>
  );
};
