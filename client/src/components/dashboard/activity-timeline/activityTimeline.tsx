import { useNavigate } from "react-router-dom";
import type { Activity } from "../../../types/dashboard";
import { formatRelativeTime } from "../../../utils/format";
import {
  ACTIVITY_TYPE_CONFIG,
  getActivityHeadline,
  getActivityKindLabel,
} from "./activityTimelineUtils";

interface ActivityTimelineRowProps {
  activity: Activity;
  isLast: boolean;
  /** 全页列表：展示备注/AI 理由等 */
  showDetail?: boolean;
}

export function ActivityTimelineRow({
  activity,
  isLast,
  showDetail = false,
}: ActivityTimelineRowProps) {
  const navigate = useNavigate();
  const cfg = ACTIVITY_TYPE_CONFIG[activity.type] ?? ACTIVITY_TYPE_CONFIG.upload;
  const Icon = cfg.icon;
  const headline = getActivityHeadline(activity);
  const kindLabel = getActivityKindLabel(activity);
  const desc = activity.description?.trim();
  /** 不与主标题重复的补充说明（如 AI 理由、长备注） */
  const showDescBlock = (() => {
    if (!showDetail || !desc || desc === headline) return false;
    return activity.type === "screening" || desc.length > 36;
  })();

  const goResume = () => {
    navigate("/app/resumes");
  };

  return (
    <div className="relative flex gap-0">
      <div className="flex w-8 shrink-0 flex-col items-center pt-1">
        <span
          className={`z-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--app-surface,#fff)] ring-2 ${cfg.ring}`}
        >
          <Icon className={`h-3.5 w-3.5 ${cfg.iconColor}`} strokeWidth={2} />
        </span>
        {!isLast ? (
          <span
            className="mt-1 min-h-5 w-px flex-1 bg-[var(--app-border,#e4e4e7)]"
            aria-hidden
          />
        ) : null}
      </div>
      <button
        type="button"
        onClick={goResume}
        className="group min-w-0 flex-1 rounded-xl py-1.5 pl-3 pr-2 text-left transition-colors hover:bg-[var(--app-surface-raised,#fafafa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary,#0ea5e9)]/20"
      >
        <p className="text-[13px] leading-snug text-[var(--app-text-secondary,#52525b)]">
          <span className="font-medium text-[var(--app-text-primary,#18181b)]">{headline}</span>
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[var(--app-text-muted,#a1a1aa)]">
          <span className="rounded-md bg-[var(--app-surface-raised,#fafafa)] px-1.5 py-0.5 font-medium text-[var(--app-text-secondary,#52525b)]">
            {kindLabel}
          </span>
          <span className="tabular-nums text-[var(--app-text-muted,#a1a1aa)]">
            {formatRelativeTime(activity.createdAt)}
          </span>
        </p>
        {showDescBlock ? (
          <p className="mt-2 max-h-24 overflow-y-auto rounded-lg bg-[var(--app-surface-raised,#fafafa)] px-2.5 py-2 text-left text-[12px] leading-relaxed text-[var(--app-text-secondary,#52525b)] ring-1 ring-[var(--app-border-subtle,rgba(0,0,0,0.04))]">
            {desc}
          </p>
        ) : null}
      </button>
    </div>
  );
}
