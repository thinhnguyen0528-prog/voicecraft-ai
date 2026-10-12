import React, { useState } from 'react';
import {
  Mic,
  Presentation,
  Radio,
  Briefcase,
  Sparkles,
  BookOpen,
  Headphones,
  Heart,
  Flame,
  MessageSquare,
  Bot,
  GraduationCap,
  Volume2,
  Zap,
  Info,
  Check,
} from 'lucide-react';
import { EngineMode, StyleCategory, VoiceStyleId, VoiceStyleProfile } from '../types/voice';
import { VOICE_STYLE_PROFILES } from '../data/voiceStyles';

interface VoiceStyleSelectorProps {
  selectedStyleId: VoiceStyleId;
  onSelectStyle: (styleId: VoiceStyleId) => void;
  engineMode: EngineMode;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Mic,
  Presentation,
  Radio,
  Briefcase,
  Sparkles,
  BookOpen,
  Headphones,
  Heart,
  Flame,
  MessageSquare,
  Bot,
  GraduationCap,
  Volume2,
  Zap,
};

export const VoiceStyleSelector: React.FC<VoiceStyleSelectorProps> = ({
  selectedStyleId,
  onSelectStyle,
  engineMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<StyleCategory | 'all'>('all');

  const filteredStyles =
    activeCategory === 'all'
      ? VOICE_STYLE_PROFILES
      : VOICE_STYLE_PROFILES.filter((s) => s.category === activeCategory);

  const selectedProfile = VOICE_STYLE_PROFILES.find((s) => s.id === selectedStyleId);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Phong cách diễn đọc (Voice Styles)
            </span>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              · 14 phong cách
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {engineMode === 'ai'
              ? 'Ánh xạ chỉ dẫn âm sắc và nhịp điệu tới mô hình AI Neural'
              : 'Mô phỏng nhịp điệu & cao độ tương ứng bằng thiết lập trình duyệt'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Tất cả (14)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('broadcast')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              activeCategory === 'broadcast'
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Chuyên nghiệp (4)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('creative')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              activeCategory === 'creative'
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Cảm xúc (5)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('everyday')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              activeCategory === 'everyday'
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Đời thường (5)
          </button>
        </div>
      </div>

      {/* Style Grid */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filteredStyles.map((style) => {
          const isSelected = selectedStyleId === style.id;
          const IconComp = ICON_MAP[style.iconName] || Sparkles;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`flex items-start gap-3 rounded-lg border p-2.5 text-left transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/60 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40'
                  : 'border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isSelected
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <IconComp className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                    {style.name}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {style.vietnameseName}
                </div>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-400 dark:text-slate-500">
                  {style.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail / Honesty Note on Selected Profile */}
      {selectedProfile && (
        <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedProfile.name} ({selectedProfile.vietnameseName}):
              </span>{' '}
              <span>{selectedProfile.limitations}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
