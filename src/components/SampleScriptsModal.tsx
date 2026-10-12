import React from 'react';
import { FileText, X, Check, ArrowRight } from 'lucide-react';
import { SAMPLE_SCRIPTS, SampleScript } from '../data/sampleTexts';
import { SupportedLanguage } from '../types/voice';

interface SampleScriptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScript: (script: SampleScript) => void;
  currentLanguage: SupportedLanguage;
}

export const SampleScriptsModal: React.FC<SampleScriptsModalProps> = ({
  isOpen,
  onClose,
  onSelectScript,
  currentLanguage,
}) => {
  const [filterLang, setFilterLang] = React.useState<'all' | 'vi-VN' | 'en-US'>('all');

  if (!isOpen) return null;

  const filteredScripts = SAMPLE_SCRIPTS.filter((s) => {
    if (filterLang === 'all') return true;
    return s.language === filterLang;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Kho kịch bản mẫu chất lượng cao
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Các đoạn văn bản đã được biên tập chuẩn dấu câu và nhịp điệu cho từng phong cách
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng kho kịch bản"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 dark:border-slate-800">
          <span className="text-xs text-slate-400">Lọc theo ngôn ngữ:</span>
          <button
            type="button"
            onClick={() => setFilterLang('all')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              filterLang === 'all'
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Tất cả ({SAMPLE_SCRIPTS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterLang('vi-VN')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              filterLang === 'vi-VN'
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Tiếng Việt (vi-VN)
          </button>
          <button
            type="button"
            onClick={() => setFilterLang('en-US')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              filterLang === 'en-US'
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            English (en-US)
          </button>
        </div>

        {/* Script Cards Grid */}
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto p-5 sm:grid-cols-2">
          {filteredScripts.map((script) => (
            <div
              key={script.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition-all hover:border-indigo-400 hover:shadow-sm dark:border-slate-800 dark:hover:border-indigo-500"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {script.title}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {script.category}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {script.content}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {script.language === 'vi-VN' ? 'Tiếng Việt' : 'English'} · Gợi ý giọng {script.voiceId}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onSelectScript(script);
                    onClose();
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <span>Áp dụng kịch bản</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
