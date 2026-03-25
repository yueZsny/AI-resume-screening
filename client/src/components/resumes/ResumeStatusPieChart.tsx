import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface ResumeStatusPieChartProps {
  total: number;
  pending: number;
  passed: number;
  rejected: number;
}

const STATUS_COLORS = {
  pending: "#f59e0b", // amber-500
  passed: "#10b981",  // emerald-500
  rejected: "#ef4444", // red-500
};

export function ResumeStatusPieChart({
  total,
  pending,
  passed,
  rejected,
}: ResumeStatusPieChartProps) {
  const data: StatusData[] = [
    { name: "等待处理", value: pending, color: STATUS_COLORS.pending },
    { name: "通过筛选", value: passed, color: STATUS_COLORS.passed },
    { name: "不符合条件", value: rejected, color: STATUS_COLORS.rejected },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: StatusData }[];
  }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
    return (
      <div className="rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)]/95 px-3.5 py-2.5 text-sm shadow-[var(--app-shadow)] backdrop-blur-sm">
        <p className="text-xs font-medium text-[var(--app-text-muted,#a1a1aa)]">{item.name}</p>
        <p className="text-base font-semibold tabular-nums text-[var(--app-text-primary,#18181b)]">
          {item.value} 份
          <span className="ml-1.5 text-xs font-normal text-[var(--app-text-muted,#a1a1aa)]">
            ({pct}%)
          </span>
        </p>
      </div>
    );
  };

  if (total === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] shadow-[var(--app-shadow-sm)]">
        <p className="text-sm text-[var(--app-text-muted,#a1a1aa)]">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[240px] flex-col overflow-hidden rounded-3xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] shadow-[var(--app-shadow-sm)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--app-border,#e4e4e7)]/80 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-[var(--app-text-primary,#18181b)]">
            简历状态分布
          </h2>
          <p className="mt-0.5 text-xs text-[var(--app-text-secondary,#52525b)]">
            共 {total.toLocaleString()} 份 · 按状态统计
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--app-warning-soft,#fef3c7)] px-2.5 py-1 text-[11px] font-medium text-[var(--app-warning,#f59e0b)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-warning,#f59e0b)]" />
            待筛选 {pending}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--app-success-soft,#dcfce7)] px-2.5 py-1 text-[11px] font-medium text-[var(--app-success,#22c55e)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-success,#22c55e)]" />
            已通过 {passed}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--app-danger-soft,#fee2e2)] px-2.5 py-1 text-[11px] font-medium text-[var(--app-danger,#ef4444)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-danger,#ef4444)]" />
            已拒绝 {rejected}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-4 pt-2 sm:px-5">
        <div className="relative flex h-[200px] w-full sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    strokeWidth={0}
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                offset={70}
                wrapperStyle={{ outline: "none" }}
              />
            </PieChart>
          </ResponsiveContainer>
          {total > 0 && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <span className="text-2xl font-bold tabular-nums text-[var(--app-text-primary,#18181b)]">
                {total}
              </span>
              <span className="text-xs text-[var(--app-text-secondary,#52525b)]">全部</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
