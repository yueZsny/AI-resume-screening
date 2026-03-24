import { useEffect } from "react";
import { Loader2, Sparkles, X, Briefcase } from "lucide-react";
import type { AiConfig } from "../../types/ai";

export type AiScreeningSettingsModalProps = {
  open: boolean;
  onClose: () => void;
  jobRequirements: string;
  onJobRequirementsChange: (value: string) => void;
  aiConfigs: AiConfig[];
  loadingAiConfigs: boolean;
  selectedAiConfigId: number | null;
  onSelectConfigId: (configId: number) => void;
  onBatchScreen: () => void;
  screeningAll: boolean;
  batchDisabled: boolean;
};

export function AiScreeningSettingsModal({
  open,
  onClose,
  jobRequirements,
  onJobRequirementsChange,
  aiConfigs,
  loadingAiConfigs,
  selectedAiConfigId,
  onSelectConfigId,
  onBatchScreen,
  screeningAll,
  batchDisabled,
}: AiScreeningSettingsModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-settings-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm transition-opacity"
        aria-hidden
      />

      <div className="relative flex max-h-[min(92vh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-zinc-200/90 bg-white shadow-[0_25px_50px_-12px_rgba(15,23,42,0.25)] sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md shadow-sky-600/25">
              <Briefcase className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h2
                id="ai-settings-modal-title"
                className="truncate text-base font-semibold text-zinc-900"
              >
                岗位要求与 AI 配置
              </h2>
              <p className="truncate text-xs text-zinc-500">
                保存后用于单次筛选与批量筛选
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2.5 text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
            title="关闭"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="ai-job-requirements"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                岗位要求
              </label>
              <textarea
                id="ai-job-requirements"
                value={jobRequirements}
                onChange={(e) => onJobRequirementsChange(e.target.value)}
                placeholder="例如：3 年以上前端经验，熟悉 React、TypeScript，有 B 端产品经验……"
                rows={7}
                className="w-full resize-y rounded-xl border border-zinc-200/90 bg-zinc-50/40 px-4 py-3 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/80"
              />
              <p className="mt-1.5 text-xs text-zinc-500">
                描述越具体，匹配度与评估理由越稳定。
              </p>
            </div>

            <div>
              <label
                htmlFor="ai-config-select"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                AI 模型配置
              </label>
              {loadingAiConfigs ? (
                <div className="flex h-12 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60">
                  <Loader2
                    className="h-5 w-5 animate-spin text-zinc-400"
                    aria-hidden
                  />
                  <span className="sr-only">加载配置中</span>
                </div>
              ) : aiConfigs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-amber-200/80 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
                  暂无可用配置，请先在设置中创建 AI 配置。
                </div>
              ) : (
                <select
                  id="ai-config-select"
                  title="选择 AI 配置"
                  value={selectedAiConfigId ?? ""}
                  onChange={(e) => onSelectConfigId(Number(e.target.value))}
                  className="h-12 w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 text-sm text-zinc-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200/80"
                >
                  {aiConfigs
                    .filter((config) => config.id !== null)
                    .map((config) => (
                      <option key={config.id} value={config.id!}>
                        {config.name} · {config.model}
                      </option>
                    ))}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-zinc-100 bg-zinc-50/90 px-4 py-3.5 sm:flex-row sm:justify-end sm:gap-3 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200/90 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
          >
            完成
          </button>
          <button
            type="button"
            onClick={onBatchScreen}
            disabled={batchDisabled}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-600/25 transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {screeningAll ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden />
            )}
            批量筛选全部简历
          </button>
        </div>
      </div>
    </div>
  );
}
