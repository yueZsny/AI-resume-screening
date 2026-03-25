import React, { type ChangeEvent } from "react";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

export type FilterStatus = "all" | "passed" | "failed" | "pending";
export type SortKey = "score" | "name" | "date";

interface FilterPanelProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: FilterStatus;
  onStatusChange: (v: FilterStatus) => void;
  sortKey: SortKey;
  onSortChange: (v: SortKey) => void;
  resultCount: number;
}

const STATUS_TABS: { label: string; value: FilterStatus; dot: string }[] = [
  { label: "全部", value: "all", dot: "bg-[var(--app-text-muted)]" },
  { label: "通过", value: "passed", dot: "bg-[var(--app-success)]" },
  { label: "淘汰", value: "failed", dot: "bg-[var(--app-danger)]" },
  { label: "待评估", value: "pending", dot: "bg-[var(--app-warning)]" },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "评分排序", value: "score" },
  { label: "姓名排序", value: "name" },
  { label: "时间排序", value: "date" },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortKey,
  onSortChange,
  resultCount,
}) => {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 shadow-[var(--app-shadow-sm)] md:flex-row md:items-center">
      {/* Search */}
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-text-muted)]" />
        <Input
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          placeholder="搜索候选人姓名、岗位…"
          className="h-9 rounded-lg border-[var(--app-border)] bg-[var(--app-surface-raised)] pl-9 text-sm text-[var(--app-text-primary)] placeholder:text-[var(--app-text-muted)] focus:border-[var(--app-primary)] focus:ring-[var(--app-ring)]"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-raised)] p-1">
        {STATUS_TABS.map(({ label, value, dot }) => (
          <button
            key={value}
            type="button"
            onClick={() => onStatusChange(value)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              status === value
                ? "bg-[var(--app-surface)] text-[var(--app-text-primary)] shadow-sm ring-1 ring-[var(--app-border-subtle)]"
                : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Sort + Count */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--app-text-muted)]" />
          <select
            title="排序方式"
            aria-label="排序方式"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-raised)] pl-8 pr-7 text-xs text-[var(--app-text-secondary)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-ring)]"
          >
            {SORT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--app-text-muted)]" />
        </div>
        <span className="whitespace-nowrap text-xs text-[var(--app-text-muted)]">
          共{" "}
          <span className="font-semibold text-[var(--app-text-primary)]">
            {resultCount}
          </span>{" "}
          人
        </span>
      </div>
    </div>
  );
};
