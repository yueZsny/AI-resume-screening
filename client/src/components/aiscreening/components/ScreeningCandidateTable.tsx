import {
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Resume } from "../../../types/resume";

type ResumeStatus = Resume["status"];

const STATUS_ROW: Record<
  ResumeStatus,
  { label: string; badge: string; Icon: typeof Clock }
> = {
  pending: {
    label: "待筛选",
    badge:
      "bg-[var(--app-warning-soft)] text-[var(--app-warning)] border border-[var(--app-border)]",
    Icon: Clock,
  },
  passed: {
    label: "已通过",
    badge:
      "bg-[var(--app-primary-soft)] text-[var(--app-primary)] border border-[var(--app-border)]",
    Icon: CheckCircle2,
  },
  rejected: {
    label: "已拒绝",
    badge:
      "bg-[var(--app-surface-raised)] text-[var(--app-text-secondary)] border border-[var(--app-border)]",
    Icon: XCircle,
  },
};

function getInitials(name: string) {
  const t = name.trim();
  if (!t) return "?";
  return t.slice(0, 1).toUpperCase();
}

function scoreDisplayClass(score: number) {
  if (score >= 80) return "text-[var(--app-primary,#0ea5e9)]";
  if (score >= 60) return "text-[var(--app-ai-text,#1e40af)]";
  return "text-[var(--app-text-muted,#a1a1aa)]";
}

interface ScreeningCandidateTableProps {
  resumes: Resume[];
  selectedResumeId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  formatDateShort: (iso: string) => string;
  /** 本会话 AI 结果中的分，用于尚未合并进 resume.score 时展示 */
  screeningScores?: Map<number, number>;
}

export function ScreeningCandidateTable({
  resumes,
  selectedResumeId,
  onSelect,
  onDelete,
  formatDateShort,
  screeningScores,
}: ScreeningCandidateTableProps) {
  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-[var(--app-ai-border,rgba(59,130,246,0.2))]/90 bg-[var(--app-surface-raised,#fafafa)]/95 backdrop-blur-sm">
          <tr className="text-[11px] font-semibold uppercase tracking-wide text-[var(--app-text-muted,#a1a1aa)]">
            <th className="whitespace-nowrap px-3 py-2.5 pl-4">候选人</th>
            <th className="whitespace-nowrap px-3 py-2.5 normal-case">
              <span className="block leading-tight">匹配分</span>
              <span className="mt-0.5 block text-[10px] font-normal tracking-normal text-[var(--app-text-muted,#a1a1aa)]">
                状态
              </span>
            </th>
            <th className="min-w-[180px] px-3 py-2.5">联系方式</th>
            <th className="whitespace-nowrap px-3 py-2.5">导入时间</th>
            <th className="w-24 whitespace-nowrap px-3 py-2.5 pr-4 text-right">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--app-ai-border,rgba(59,130,246,0.2))]/80 bg-[var(--app-surface,#fff)]/50">
          {resumes.map((resume) => {
            const selected = selectedResumeId === resume.id;
            const meta = STATUS_ROW[resume.status];
            const Icon = meta.Icon;
            const scoreVal =
              resume.score ?? screeningScores?.get(resume.id) ?? null;
            return (
              <tr
                key={resume.id}
                id={`candidate-${resume.id}`}
                tabIndex={0}
                aria-selected={selected ? "true" : "false"}
                onClick={() => onSelect(resume.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(resume.id);
                  }
                }}
                className={`cursor-pointer transition-colors hover:bg-[var(--app-primary-soft)]/60 ${
                  selected
                    ? "bg-[var(--app-primary-soft)]/50 ring-1 ring-inset ring-[var(--app-ai-border,rgba(59,130,246,0.2))]"
                    : ""
                }`}
              >
                <td className="align-middle px-3 py-3 pl-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        selected
                          ? "bg-[var(--app-primary,#0ea5e9)] text-white"
                          : "bg-[var(--app-surface-raised,#fafafa)] text-[var(--app-text-secondary,#52525b)] ring-1 ring-[var(--app-border)]"
                      }`}
                      aria-hidden
                    >
                      {getInitials(resume.name)}
                    </div>
                    <span className="font-semibold text-[var(--app-text-primary,#18181b)]">
                      {resume.name}
                    </span>
                  </div>
                </td>
                <td className="align-middle px-3 py-3">
                  <div className="flex flex-col items-start gap-1">
                    {scoreVal != null ? (
                      <span
                        className={`text-sm font-black tabular-nums leading-none ${scoreDisplayClass(scoreVal)}`}
                        title="AI 匹配分"
                      >
                        {scoreVal}
                        <span className="ml-0.5 text-[9px] font-bold text-[var(--app-text-muted,#a1a1aa)]">
                          分
                        </span>
                      </span>
                    ) : (
                      <span
                        className="text-xs font-semibold tabular-nums text-[var(--app-text-muted,#a1a1aa)]/50"
                        title="尚未生成匹配分"
                      >
                        —
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${meta.badge}`}
                    >
                      <Icon
                        className="h-3 w-3 shrink-0 opacity-90"
                        aria-hidden
                      />
                      {meta.label}
                    </span>
                  </div>
                </td>
                <td className="align-middle px-3 py-3">
                  <div className="flex flex-col gap-1 text-[11px] text-[var(--app-text-secondary,#52525b)]">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Mail
                        className="h-3.5 w-3.5 shrink-0 text-[var(--app-text-muted,#a1a1aa)]"
                        aria-hidden
                      />
                      <span className="truncate">{resume.email || "—"}</span>
                    </span>
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Phone
                        className="h-3.5 w-3.5 shrink-0 text-[var(--app-text-muted,#a1a1aa)]"
                        aria-hidden
                      />
                      <span className="truncate">{resume.phone || "—"}</span>
                    </span>
                  </div>
                </td>
                <td className="align-middle whitespace-nowrap px-3 py-3 text-[11px] tabular-nums text-[var(--app-text-secondary,#52525b)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar
                      className="h-3.5 w-3.5 shrink-0 text-[var(--app-text-muted,#a1a1aa)]"
                      aria-hidden
                    />
                    {formatDateShort(resume.createdAt)}
                  </span>
                </td>
                <td className="align-middle px-3 py-3 pr-4 text-right">
                  <div className="inline-flex items-center justify-end gap-0.5">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-[var(--app-text-secondary,#52525b)] transition-colors hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-primary,#0ea5e9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-ring)]"
                      aria-label={`查看 ${resume.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(resume.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-[var(--app-text-secondary,#52525b)] transition-colors hover:bg-[var(--app-danger-soft)] hover:text-[var(--app-danger,#ef4444)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-danger,#ef4444)]/40"
                      aria-label={`删除 ${resume.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(resume.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
