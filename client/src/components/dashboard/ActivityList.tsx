import { FileText, Bot, CheckCircle, X, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Activity } from "../../types/dashboard";
import { formatRelativeTime } from "../../utils/format";

interface ActivityListProps {
  activities: Activity[];
  onViewAll?: () => void;
}

const CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    ring: string;
    iconColor: string;
    text: string;
  }
> = {
  upload: {
    icon: FileText,
    ring: "ring-indigo-500/25",
    iconColor: "text-indigo-600",
    text: "上传了新简历",
  },
  screening: {
    icon: Bot,
    ring: "ring-violet-500/25",
    iconColor: "text-violet-600",
    text: "AI 筛选完成",
  },
  pass: {
    icon: CheckCircle,
    ring: "ring-emerald-500/25",
    iconColor: "text-emerald-600",
    text: "通过初筛",
  },
  reject: {
    icon: X,
    ring: "ring-red-500/25",
    iconColor: "text-red-600",
    text: "未通过筛选",
  },
  interview: {
    icon: Mail,
    ring: "ring-orange-500/25",
    iconColor: "text-orange-600",
    text: "收到面试邀请",
  },
};

function ActivityItem({
  activity,
  isLast,
}: {
  activity: Activity;
  isLast: boolean;
}) {
  const navigate = useNavigate();
  const cfg = CONFIG[activity.type] ?? CONFIG.upload;
  const Icon = cfg.icon;

  return (
    <div className="relative flex gap-0">
      <div className="flex w-8 shrink-0 flex-col items-center pt-1">
        <span
          className={`z-[1] flex h-7 w-7 items-center justify-center rounded-full bg-white ring-2 ${cfg.ring}`}
        >
          <Icon className={`h-3.5 w-3.5 ${cfg.iconColor}`} strokeWidth={2} />
        </span>
        {!isLast ? (
          <span
            className="mt-1 w-px flex-1 min-h-[1.25rem] bg-zinc-200"
            aria-hidden
          />
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => navigate("/app/resumes")}
        className="group min-w-0 flex-1 rounded-xl py-1.5 pl-3 pr-2 text-left transition-colors hover:bg-zinc-50/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
      >
        <p className="text-[13px] leading-snug text-zinc-700">
          <span className="font-medium text-zinc-900">
            {activity.resumeName ?? "未知"}
          </span>{" "}
          <span className="text-zinc-600">{cfg.text}</span>
        </p>
        <p className="mt-1 text-[11px] tabular-nums text-zinc-400">
          {formatRelativeTime(activity.createdAt)}
        </p>
      </button>
    </div>
  );
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

export function ActivityList({ activities, onViewAll }: ActivityListProps) {
  const list = deduplicate(activities).slice(0, 8);

  return (
    <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] ring-1 ring-zinc-950/[0.03]">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-100/80 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900">
            最近动态
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">筛选与上传记录</p>
        </div>
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            查看全部
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5">
        {list.length > 0 ? (
          <div className="flex flex-col">
            {list.map((activity, i) => (
              <ActivityItem
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
              className="mt-5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white no-underline shadow-sm transition-colors hover:bg-indigo-700"
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
