import { FileText, Clock, CheckCircle, X } from "lucide-react";
import type { DashboardStats } from "../../types/dashboard";

const METRICS = [
  {
    field: "total" as const,
    icon: FileText,
    accent: "text-indigo-600",
    iconBg: "bg-indigo-500/10",
    desc: "全部简历",
  },
  {
    field: "pending" as const,
    icon: Clock,
    accent: "text-amber-600",
    iconBg: "bg-amber-500/10",
    desc: "等待处理",
  },
  {
    field: "passed" as const,
    icon: CheckCircle,
    accent: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
    desc: "通过筛选",
  },
  {
    field: "rejected" as const,
    icon: X,
    accent: "text-red-600",
    iconBg: "bg-red-500/10",
    desc: "不符合条件",
  },
];

export function StatCardList({ stats }: { stats: DashboardStats }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] ring-1 ring-zinc-950/[0.03]">
      <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.field}
              className="group relative px-5 py-5 transition-colors hover:bg-zinc-50/80 sm:px-6 sm:py-6"
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  {m.desc}
                </span>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${m.iconBg} ${m.accent}`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </div>
              </div>
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-900 lg:text-[2rem]">
                {stats[m.field].toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatCardList;
