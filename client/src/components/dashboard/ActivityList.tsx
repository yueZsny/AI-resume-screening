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
    <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] ring-1 ring-zinc-950/[0.03]">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-100/80 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900">
            最近动态
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            投递候选人相关动态（姓名指候选人，非操作人）
          </p>
        </div>
        <Link
          to="/app/activities"
          className="text-xs font-semibold text-sky-600 no-underline transition-colors hover:text-sky-700"
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
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-linear-to-b from-zinc-50/80 to-transparent px-6 py-10 text-center ring-1 ring-inset ring-zinc-950/[0.04]">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/80">
              <FileText className="h-7 w-7 text-zinc-300" strokeWidth={1.25} />
            </div>
            <p className="text-sm font-medium text-zinc-600">暂无动态</p>
            <p className="mt-1 max-w-[240px] text-xs text-zinc-400">
              上传或筛选简历后，这里会展示时间线
            </p>
            <Link
              to="/app/resumes"
              className="mt-5 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white no-underline shadow-sm transition-colors hover:bg-sky-700"
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
