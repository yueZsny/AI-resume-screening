import { useEffect } from "react";
import { Filter, X } from "lucide-react";
import type { PreFilterConfig } from "./preFilterUtils";
import { getDefaultPreFilter } from "./preFilterUtils";

export type PreFilterModalProps = {
  open: boolean;
  onClose: () => void;
  config: PreFilterConfig;
  onConfigChange: (config: PreFilterConfig) => void;
  onApply?: (config: PreFilterConfig) => void;
  /** 当前关联模版名称，为 null 时显示默认提示 */
  templateName?: string | null;
  /** 清空时同时取消模版关联 */
  onClear?: () => void;
};

export function PreFilterModal({
  open,
  onClose,
  config,
  onConfigChange,
  onApply,
  templateName,
  onClear,
}: PreFilterModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleClear = () => {
    onConfigChange(getDefaultPreFilter());
    onClear?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prefilter-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-[var(--app-overlay,rgba(15,23,42,0.4))] backdrop-blur-sm"
        aria-hidden
      />

      <div className="relative flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] shadow-[0_25px_50px_-12px_rgba(15,23,42,0.25)] sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface-raised,#fafafa)]/80 px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--app-violet,#8b5cf6)] to-[var(--app-violet,#7c3aed)] text-white shadow-[var(--app-shadow-sm)]">
              <Filter className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h2
                id="prefilter-modal-title"
                className="truncate text-base font-semibold text-[var(--app-text-primary,#18181b)]"
              >
                {templateName
                  ? `预筛选条件 · ${templateName}`
                  : "自定义预筛选条件"}
              </h2>
              <p className="truncate text-xs text-[var(--app-text-muted,#a1a1aa)]">
                {templateName
                  ? "当前筛选条件来自该模版，可调整后重新应用"
                  : "先按条件筛一遍，再进行 AI 筛选"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2.5 text-[var(--app-text-muted,#a1a1aa)] transition-colors hover:bg-[var(--app-surface,#fff)] hover:text-[var(--app-text-primary,#18181b)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-violet,#8b5cf6)] focus-visible:ring-offset-2"
            title="关闭"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="prefilter-keywords"
                className="mb-2 block text-sm font-medium text-[var(--app-text-primary,#18181b)]"
              >
                关键词
              </label>
              <textarea
                id="prefilter-keywords"
                value={config.keywords}
                onChange={(e) =>
                  onConfigChange({ ...config, keywords: e.target.value })
                }
                placeholder="多个关键词用逗号，空格或换行分隔。例：React, 3年, 硕士"
                rows={4}
                className="w-full resize-y rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface-raised,#fafafa)]/40 px-4 py-3 text-sm leading-relaxed text-[var(--app-text-primary,#18181b)] placeholder:text-[var(--app-text-muted,#a1a1aa)] focus:border-[var(--app-violet,#8b5cf6)] focus:bg-[var(--app-surface,#fff)] focus:outline-none focus:ring-2 focus:ring-[var(--app-violet-active-ring,rgba(139,92,246,0.2))]"
              />
              <p className="mt-1.5 text-xs text-[var(--app-text-muted,#a1a1aa)]">
                在姓名、邮箱、简历内容、AI 摘要中搜索
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--app-text-primary,#18181b)]">
                关键词匹配
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onConfigChange({ ...config, keywordMode: "or" })
                  }
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    config.keywordMode === "or"
                      ? "border-[var(--app-violet-active-border,#c4b5fd)] bg-[var(--app-violet-active-bg,#ede9fe)] text-[var(--app-violet-active-text,#5b21b6)] ring-1 ring-[var(--app-violet-active-border,#c4b5fd)]"
                      : "border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] text-[var(--app-text-secondary,#52525b)] hover:bg-[var(--app-surface-raised,#fafafa)]"
                  }`}
                >
                  满足任一
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onConfigChange({ ...config, keywordMode: "and" })
                  }
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    config.keywordMode === "and"
                      ? "border-[var(--app-violet-active-border,#c4b5fd)] bg-[var(--app-violet-active-bg,#ede9fe)] text-[var(--app-violet-active-text,#5b21b6)] ring-1 ring-[var(--app-violet-active-border,#c4b5fd)]"
                      : "border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] text-[var(--app-text-secondary,#52525b)] hover:bg-[var(--app-surface-raised,#fafafa)]"
                  }`}
                >
                  全部满足
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="prefilter-minScore"
                className="mb-2 block text-sm font-medium text-[var(--app-text-primary,#18181b)]"
              >
                最低匹配分
              </label>
              <input
                id="prefilter-minScore"
                type="number"
                min={0}
                max={100}
                value={config.minScore ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  onConfigChange({
                    ...config,
                    minScore:
                      v === "" ? null : Math.min(100, Math.max(0, Number(v))),
                  });
                }}
                placeholder="不填则不限制"
                className="h-11 w-full rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] px-3.5 text-sm text-[var(--app-text-primary,#18181b)] placeholder:text-[var(--app-text-muted,#a1a1aa)] focus:border-[var(--app-violet,#8b5cf6)] focus:outline-none focus:ring-2 focus:ring-[var(--app-violet-active-ring,rgba(139,92,246,0.2))]"
              />
              <p className="mt-1 text-xs text-[var(--app-text-muted,#a1a1aa)]">
                仅对已有 AI 评分的简历生效
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="prefilter-dateFrom"
                  className="mb-1.5 block text-xs font-medium text-[var(--app-text-secondary,#52525b)]"
                >
                  导入时间起
                </label>
                <input
                  id="prefilter-dateFrom"
                  type="date"
                  value={config.dateFrom}
                  onChange={(e) =>
                    onConfigChange({ ...config, dateFrom: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] px-3 text-sm text-[var(--app-text-primary,#18181b)] focus:border-[var(--app-violet,#8b5cf6)] focus:outline-none focus:ring-2 focus:ring-[var(--app-violet-active-ring,rgba(139,92,246,0.2))]"
                />
              </div>
              <div>
                <label
                  htmlFor="prefilter-dateTo"
                  className="mb-1.5 block text-xs font-medium text-[var(--app-text-secondary,#52525b)]"
                >
                  导入时间止
                </label>
                <input
                  id="prefilter-dateTo"
                  type="date"
                  value={config.dateTo}
                  onChange={(e) =>
                    onConfigChange({ ...config, dateTo: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] px-3 text-sm text-[var(--app-text-primary,#18181b)] focus:border-[var(--app-violet,#8b5cf6)] focus:outline-none focus:ring-2 focus:ring-[var(--app-violet-active-ring,rgba(139,92,246,0.2))]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 border-t border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface-raised,#fafafa)]/90 px-4 py-3.5 sm:px-5">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] px-4 py-2.5 text-sm font-medium text-[var(--app-text-secondary,#52525b)] shadow-[var(--app-shadow-sm)] transition-colors hover:bg-[var(--app-surface-raised,#fafafa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-border-strong,#d4d4d8)]"
          >
            清空
          </button>
          <button
            type="button"
            onClick={() => {
              onConfigChange(config);
              onApply?.(config);
              onClose();
            }}
            className="rounded-xl bg-[var(--app-violet,#8b5cf6)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--app-shadow-primary)] transition-colors hover:bg-[var(--app-violet,#8b5cf6)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-violet,#8b5cf6)] focus-visible:ring-offset-2"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
}
