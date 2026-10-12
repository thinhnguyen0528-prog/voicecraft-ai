import React, { useState } from 'react';
import { User, Sparkles, Laptop, Search, AlertCircle, Check } from 'lucide-react';
import { AIVoice, BrowserVoiceInfo, EngineMode, SupportedLanguage } from '../types/voice';
import { AI_VOICES } from '../data/aiVoices';

interface VoiceSelectorProps {
  engineMode: EngineMode;
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  browserVoices: BrowserVoiceInfo[];
  language: SupportedLanguage;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  engineMode,
  selectedVoiceId,
  onSelectVoice,
  browserVoices,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter browser voices by selected language prefix
  const langPrefix = language.split('-')[0]; // 'vi' or 'en'
  const filteredBrowserVoices = browserVoices.filter((v) => {
    const matchesLang = v.lang.toLowerCase().startsWith(langPrefix);
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  const allFilteredBrowserVoices = searchQuery
    ? browserVoices.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredBrowserVoices;

  const hasMatchingLangVoices = filteredBrowserVoices.length > 0;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {engineMode === 'ai' ? (
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Laptop className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          )}
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {engineMode === 'ai' ? 'Danh sách giọng AI Neural' : 'Giọng đọc trình duyệt (Web Speech)'}
          </span>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {engineMode === 'ai'
            ? `${AI_VOICES.length} giọng sẵn sàng`
            : `${filteredBrowserVoices.length} giọng tương thích`}
        </span>
      </div>

      {/* Browser search input */}
      {engineMode === 'browser' && browserVoices.length > 3 && (
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm giọng đọc hệ thống..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
      )}

      {/* Voice List for AI Engine */}
      {engineMode === 'ai' ? (
        <div className="mt-3 space-y-2">
          {AI_VOICES.map((voice) => {
            const isSelected = selectedVoiceId === voice.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => onSelectVoice(voice.id)}
                className={`flex w-full items-start justify-between rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40'
                    : 'border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {voice.name}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      ({voice.gender === 'female' ? 'Nữ' : 'Nam'})
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
                      · {voice.tone}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {voice.description}
                  </p>
                </div>

                <div className="ml-2 shrink-0 pt-0.5">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Voice List for Browser TTS */
        <div className="mt-3 space-y-2">
          {!hasMatchingLangVoices && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <span className="font-semibold">
                    Không tìm thấy giọng đọc {language === 'vi-VN' ? 'tiếng Việt' : 'ngôn ngữ này'} cài sẵn trên trình duyệt.
                  </span>
                  <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
                    Hệ điều hành của bạn chưa cài gói giọng đọc này. Bạn có thể chọn giọng hệ thống khác bên dưới hoặc chuyển sang chế độ <strong>AI Neural</strong> để phát âm chuẩn xác.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {allFilteredBrowserVoices.length > 0 ? (
              allFilteredBrowserVoices.map((voice) => {
                const isSelected = selectedVoiceId === voice.id;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => onSelectVoice(voice.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40'
                        : 'border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                          {voice.name}
                        </span>
                        {voice.isDefault && (
                          <span className="text-[10px] text-slate-400">· Mặc định</span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        {voice.lang} {voice.isLocalService ? '(Local)' : '(Network)'}
                      </span>
                    </div>

                    <div
                      className={`ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-400'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                Đang quét danh sách giọng đọc từ trình duyệt...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
