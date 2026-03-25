import { useId } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WeeklyBarChartProps {
  data?: { day: string; count: number }[];
}


const DEFAULT_WEEK = [
  { day: "周一", count: 0 },
  { day: "周二", count: 0 },
  { day: "周三", count: 0 },
  { day: "周四", count: 0 },
  { day: "周五", count: 0 },
  { day: "周六", count: 0 },
  { day: "周日", count: 0 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)]/95 px-3.5 py-2.5 text-sm shadow-[var(--app-shadow)] backdrop-blur-sm dark:bg-[var(--app-surface,#161b22)]/95">
      <p className="text-xs font-medium text-[var(--app-text-muted,#a1a1aa)]">{label}</p>
      <p className="text-base font-semibold tabular-nums text-[var(--app-primary,#0ea5e9)]">
        {payload[0].value}{" "}
        <span className="text-xs font-normal text-[var(--app-text-muted,#a1a1aa)]">份</span>
      </p>
    </div>
  );
};

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const gradId = useId().replace(/:/g, "");
  const barFill = `url(#${gradId})`;

  const chartData = data?.length ? data : DEFAULT_WEEK;
  const dataMax = Math.max(...chartData.map((d) => d.count), 0);
  const yMax = Math.max(4, dataMax <= 0 ? 4 : Math.ceil(dataMax * 1.2));
  const allZero = chartData.every((d) => d.count === 0);

  return (
    <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] shadow-[var(--app-shadow-sm)] ring-1 ring-[var(--app-border-subtle,rgba(0,0,0,0.04))] dark:ring-[var(--app-border-subtle,rgba(255,255,255,0.06))]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--app-border,#e4e4e7)]/80 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-[var(--app-text-primary,#18181b)]">
            本周简历趋势
          </h2>
          <p className="mt-0.5 text-xs text-[var(--app-text-secondary,#52525b)]">
            按创建时间统计的每日新增
          </p>
        </div>
        {allZero ? (
          <span className="rounded-full border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface-raised,#fafafa)] px-2.5 py-1 text-[11px] font-medium text-[var(--app-text-secondary,#52525b)]">
            本周暂无新增
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-4 pt-2 sm:px-5">
        <div className="relative flex-1 rounded-2xl bg-[var(--app-surface-raised,#fafafa)] p-3 ring-1 ring-inset ring-[var(--app-border-subtle,rgba(0,0,0,0.04))] dark:ring-[var(--app-border-subtle,rgba(255,255,255,0.06))] sm:p-4">
          <div className="h-[200px] w-full sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barCategoryGap="24%"
                margin={{ top: 12, right: 6, left: -4, bottom: 4 }}
              >
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="5 5"
                  stroke="#cbd5e1"
                  strokeOpacity={0.65}
                />
                <XAxis
                  dataKey="day"
                  axisLine={{ stroke: "#94a3b8" }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
                />
                <YAxis
                  domain={[0, yMax]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  allowDecimals={false}
                  width={32}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
                />
                <Bar
                  dataKey="count"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                  fill={barFill}
                  fillOpacity={allZero ? 0.25 : 1}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barFill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyBarChart;
