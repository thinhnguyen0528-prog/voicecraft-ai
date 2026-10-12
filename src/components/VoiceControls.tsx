import React from 'react';
import { Sliders, RotateCcw, Play, Volume2, Sparkles } from 'lucide-react';
import { EngineMode } from '../types/voice';

interface VoiceControlsProps {
  rate: number;
  onChangeRate: (rate: number) => void;
  pitch: number;
  onChangePitch: (pitch: number) => void;
  volume: number;
  onChangeVolume: (volume: number) => void;
  highExpressive: boolean;
  onToggleHighExpressive: (val: boolean) => void;
  onResetDefaults: () => void;
  onAudition: () => void;
  isAuditioning: boolean;
  engineMode: EngineMode;
}

const SPEED_PRESETS = [0.75, 1.0, 1.25, 1.5, 2.0];

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  rate,
  onChangeRate,
  pitch,
  onChangePitch,
  volume,
  onChangeVolume,
  highExpressive,
  onToggleHighExpressive,
  onResetDefaults,
  onAudition,
  isAuditioning,
  engineMode,
}) => {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Thông số điều khiển giọng đọc
          </span>
        </div>

        <button
          type="button"
          onClick={onResetDefaults}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {/* Speaking Rate Control */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300">Tốc độ đọc (Speaking Rate)</span>
            <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              {rate.toFixed(2)}×
            </span>
          </div>

          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.05}
            value={rate}
            onChange={(e) => onChangeRate(parseFloat(e.target.value))}
            aria-label="Tốc độ đọc"
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500"
          />

          {/* Quick preset buttons */}
          <div className="mt-2 flex items-center justify-between gap-1">
            {SPEED_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChangeRate(p)}
                className={`rounded px-2 py-0.5 font-mono text-[11px] tabular-nums transition-colors ${
                  rate === p
                    ? 'bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {p}×
              </button>
            ))}
          </div>
        </div>

        {/* Pitch Control */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300">Cao độ giọng (Pitch)</span>
            <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              {pitch.toFixed(2)}
            </span>
          </div>

          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={pitch}
            onChange={(e) => onChangePitch(parseFloat(e.target.value))}
            aria-label="Cao độ giọng"
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500"
          />

          <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>Trầm (0.5)</span>
            <span>Chuẩn (1.0)</span>
            <span>Bổng (1.5)</span>
          </div>
        </div>

        {/* Volume Control */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Volume2 className="h-3.5 w-3.5" />
              <span>Âm lượng (Volume)</span>
            </span>
            <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <input
            type="range"
            min={0.0}
            max={1.0}
            step={0.05}
            value={volume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            aria-label="Âm lượng"
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500"
          />
        </div>

        {/* AI Expressive Burst Toggle (Gemini 3.8 Flash TTS mode) */}
        {engineMode === 'ai' && (
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-2.5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Mô hình siêu biểu cảm (Flash TTS)
                </span>
              </div>
              <input
                type="checkbox"
                id="high-expressive-toggle"
                checked={highExpressive}
                onChange={(e) => onToggleHighExpressive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Kích hoạt mô hình chất lượng cao khi cần biểu cảm kịch tính, thở gấp và nhấn mạnh mạnh mẽ.
            </p>
          </div>
        )}

        {/* Short audition audition button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onAudition}
            disabled={isAuditioning}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {isAuditioning ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <span>Đang nghe thử giọng...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Nghe thử mẫu giọng ngắn (Audition)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
