import React from 'react';
import { History, Trash2, ArrowUpRight, Copy, Check, Clock, Volume2, X } from 'lucide-react';
import { HistoryItem } from '../types/voice';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyText = async (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Lịch sử chuyển đổi ({history.length})
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Xóa tất cả
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng bảng lịch sử"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 dark:text-slate-500">
              Chưa có bản ghi nào trong lịch sử. Các lượt tạo giọng nói sẽ tự động lưu trữ tại đây.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="group relative cursor-pointer rounded-xl border border-slate-200/80 p-3 transition-all hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(item.timestamp).toLocaleTimeString()} · {new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {item.engine === 'ai' ? 'AI Neural' : 'Browser'}
                  </span>
                </div>

                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  {item.text}
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.voiceName}
                    </span>
                    <span>·</span>
                    <span>{item.styleName}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{item.charCount} ký tự</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => handleCopyText(item, e)}
                      title="Sao chép văn bản"
                      className="rounded p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      title="Xóa bản ghi này"
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 p-3 text-center text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Dữ liệu lịch sử được lưu trữ bảo mật trong trình duyệt của bạn (Local Storage).
        </div>
      </div>
    </div>
  );
};
