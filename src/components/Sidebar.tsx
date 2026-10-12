import React from 'react';
import { Sparkles, History, FileText, Settings, ShieldCheck, Download, VolumeX } from 'lucide-react';
import { EngineMode } from '../types/voice';
import { SAMPLE_SCRIPTS } from '../data/sampleTexts';

interface SidebarProps {
  currentTab: 'studio' | 'history' | 'samples' | 'settings';
  onSelectTab: (tab: 'studio' | 'history' | 'samples' | 'settings') => void;
  engineMode: EngineMode;
  historyCount: number;
  onLoadSample: (scriptId: string) => void;
  isAiConfigured: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  engineMode,
  historyCount,
  onLoadSample,
  isAiConfigured,
}) => {
  return (
    <aside className="flex flex-col justify-between border-r border-slate-200/80 bg-white/60 p-4 transition-colors lg:w-64 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <span className="px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Điều hướng
          </span>
          <nav className="mt-2 space-y-1">
            <button
              type="button"
              onClick={() => onSelectTab('studio')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                currentTab === 'studio'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Phòng thu âm (Studio)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('history')}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                currentTab === 'history'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <History className="h-4 w-4" />
                <span>Lịch sử chuyển đổi</span>
              </div>
              {historyCount > 0 && (
                <span className="font-mono text-[11px] text-slate-400 tabular-nums dark:text-slate-500">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('samples')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                currentTab === 'samples'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Kho kịch bản mẫu</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                currentTab === 'settings'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Cài đặt & API Engines</span>
            </button>
          </nav>
        </div>

        {/* Quick Sample Scripts */}
        <div>
          <span className="px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Nạp mẫu nhanh
          </span>
          <div className="mt-2 space-y-1">
            {SAMPLE_SCRIPTS.slice(0, 4).map((script) => (
              <button
                key={script.id}
                type="button"
                onClick={() => {
                  onLoadSample(script.id);
                  onSelectTab('studio');
                }}
                className="group flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-600 dark:text-slate-300 dark:group-hover:text-indigo-400">
                  {script.title}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {script.language === 'vi-VN' ? 'Tiếng Việt' : 'English'} · {script.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Engine Status & Truthfulness Notice */}
      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span>Trạng thái Engine</span>
          </div>

          <div className="mt-2 space-y-1 text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span>Chế độ:</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {engineMode === 'ai' ? 'Gemini 3.8 TTS' : 'Browser Web Speech'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Xuất âm thanh:</span>
              {engineMode === 'ai' ? (
                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <Download className="h-3 w-3" />
                  WAV 24kHz
                </span>
              ) : (
                <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                  <VolumeX className="h-3 w-3" />
                  Chỉ phát trực tiếp
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
