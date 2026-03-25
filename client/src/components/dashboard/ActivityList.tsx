import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { Activity } from "../../types/dashboard";
import { ActivityTimelineRow } from "./activity-timeline";

interface ActivityListProps {
  activities: Activity[];
}

function deduplicate(activities: Activity[]): Activity[] {
  const seen = new Set<string>();
  return activities.filter((a) => {
    const t = new Date(a.createdAt).getTime();
    const minute = Number.isFinite(t) ? Math.floor(t / 60_000) : 0;
    const key = `${a.resumeId ?? ""}-${a.type}-${a.resumeName ?? ""}-${minute}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function ActivityList({ activities }: ActivityListProps) {
  const list = deduplicate(activities).slice(0, 8);

  return (
    <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] shadow-[var(--app-shadow-sm)] ring-1 ring-[var(--app-border-subtle,rgba(0,0,0,0.04))] dark:ring-[var(--app-border-subtle,rgba(255,255,255,0.06))]">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[var(--app-border,#e4e4e7)]/80 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-[var(--app-text-primary,#18181b)]">
            最近动态
          </h2>
          <p className="mt-0.5 text-xs text-[var(--app-text-secondary,#52525b)]">
            投递候选人相关动态（姓名指候选人，非操作人）
          </p>
        </div>
        <Link
          to="/app/activities"
          className="text-xs font-semibold text-[var(--app-primary,#0ea5e9)] no-underline transition-colors hover:text-[var(--app-primary-hover,#0284c7)]"
        >
          查看全部
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5">
        {list.length > 0 ? (
          <div className="flex flex-col">
            {list.map((activity, i) => (
              <ActivityTimelineRow
                key={activity.id}
                activity={activity}
                isLast={i === list.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-[var(--app-surface-raised,#fafafa)] px-6 py-10 text-center ring-1 ring-inset ring-[var(--app-border-subtle,rgba(0,0,0,0.04))] dark:ring-[var(--app-border-subtle,rgba(255,255,255,0.06))]">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--app-surface,#fff)] shadow-sm ring-1 ring-[var(--app-border,#e4e4e7)]">
              <FileText className="h-7 w-7 text-[var(--app-text-muted,#a1a1aa)]" strokeWidth={1.25} />
            </div>
            <p className="text-sm font-medium text-[var(--app-text-secondary,#52525b)]">暂无动态</p>
            <p className="mt-1 max-w-[240px] text-xs text-[var(--app-text-muted,#a1a1aa)]">
              上传或筛选简历后，这里会展示时间线
            </p>
            <Link
              to="/app/resumes"
              className="mt-5 rounded-full bg-[var(--app-primary,#0ea5e9)] px-4 py-2 text-xs font-semibold text-white no-underline shadow-sm transition-colors hover:bg-[var(--app-primary-hover,#0284c7)]"
            >
              前往简历库
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityList;
