import React from 'react';
import { Volume2, Sparkles, Laptop, Globe, Moon, Sun, Settings, Info } from 'lucide-react';
import { EngineMode, SupportedLanguage } from '../types/voice';
import { BackendStatus } from '../services/aiSpeechService';

interface HeaderProps {
  engineMode: EngineMode;
  onSelectEngineMode: (mode: EngineMode) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  backendStatus: BackendStatus | null;
  onOpenSettings: () => void;
  onOpenDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  engineMode,
  onSelectEngineMode,
  language,
  onSelectLanguage,
  darkMode,
  onToggleDarkMode,
  backendStatus,
  onOpenSettings,
  onOpenDocs,
}) => {
  const isAiConfigured = backendStatus?.gemini.configured ?? false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                VoiceCraft AI
              </span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                · Studio
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              Acoustic Synthesis Studio
            </p>
          </div>
        </div>

        {/* Center / Controls: Engine Switcher & Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => onSelectEngineMode('ai')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                engineMode === 'ai'
                  ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Neural 24kHz</span>
              {isAiConfigured && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="API Ready" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onSelectEngineMode('browser')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                engineMode === 'browser'
                  ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Laptop className="h-3.5 w-3.5" />
              <span>Browser TTS</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <select
              value={language}
              onChange={(e) => onSelectLanguage(e.target.value as SupportedLanguage)}
              aria-label="Chọn ngôn ngữ giọng đọc"
              className="h-8 rounded-lg border border-slate-200 bg-white py-1 pr-3 pl-8 text-xs font-medium text-slate-700 transition-colors focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="vi-VN">Tiếng Việt (vi-VN)</option>
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
            </select>
          </div>
        </div>

        {/* Right Zone: Actions & Theme */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenDocs}
            aria-label="Tài liệu kỹ thuật"
            title="Tài liệu kỹ thuật & Giới hạn engine"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Info className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Cài đặt engine & API"
            title="Cài đặt engine & API Keys"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Chuyển chế độ sáng / tối"
            title="Đổi giao diện Sáng / Tối"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
