import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

export interface ResumePaginationBarProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function buildPageItems(
  totalPages: number,
  currentPage: number,
): (number | "...")[] {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => {
      if (totalPages <= 7) return true;
      if (p === 1 || p === totalPages) return true;
      if (Math.abs(p - currentPage) <= 1) return true;
      return false;
    },
  );

  return pages.reduce<(number | "...")[]>((acc, p, idx, arr) => {
    if (idx > 0 && arr[idx - 1] !== p - 1) {
      acc.push("...");
    }
    acc.push(p);
    return acc;
  }, []);
}

export function ResumePaginationBar({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ResumePaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pageItems = buildPageItems(totalPages, currentPage);

  if (totalPages <= 1) {
    return null;
  }

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--app-border,#e4e4e7)] px-6 py-4">
      <div className="flex items-center gap-3">
        <p className="text-xs text-[var(--app-text-secondary,#52525b)]">
          第 {rangeStart}–{rangeEnd} 条，共 {totalCount} 份
        </p>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] px-2 py-1 text-xs text-[var(--app-text-secondary,#52525b)] outline-none focus:border-[var(--app-primary,#0ea5e9)] focus:ring-1 focus:ring-[var(--app-primary,#0ea5e9)]/25"
          aria-label="每页条数"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} 条/页
            </option>
          ))}
        </select>
      </div>

      <nav className="flex items-center gap-1" aria-label="分页">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] text-[var(--app-text-secondary,#52525b)] transition-colors hover:border-[var(--app-border-strong,#d4d4d8)] hover:bg-[var(--app-surface-raised,#fafafa)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--app-surface,#fff)]"
          aria-label="首页"
        >
          <span className="text-xs font-medium">«</span>
        </button>

        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] text-[var(--app-text-secondary,#52525b)] transition-colors hover:border-[var(--app-border-strong,#d4d4d8)] hover:bg-[var(--app-surface-raised,#fafafa)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--app-surface,#fff)]"
          aria-label="上一页"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-0.5">
          {pageItems.map((item, idx) =>
            item === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-8 items-center justify-center text-[var(--app-text-muted,#a1a1aa)]"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`
                  flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors
                  ${
                    item === currentPage
                      ? "border-[var(--app-primary,#0ea5e9)] bg-[var(--app-primary-soft,rgba(14,165,233,0.1))] text-[var(--app-primary,#0ea5e9)]"
                      : "border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] text-[var(--app-text-secondary,#52525b)] hover:border-[var(--app-border-strong,#d4d4d8)] hover:bg-[var(--app-surface-raised,#fafafa)]"
                  }
                `}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] text-[var(--app-text-secondary,#52525b)] transition-colors hover:border-[var(--app-border-strong,#d4d4d8)] hover:bg-[var(--app-surface-raised,#fafafa)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--app-surface,#fff)]"
          aria-label="下一页"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] text-[var(--app-text-secondary,#52525b)] transition-colors hover:border-[var(--app-border-strong,#d4d4d8)] hover:bg-[var(--app-surface-raised,#fafafa)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--app-surface,#fff)]"
          aria-label="末页"
        >
          <span className="text-xs font-medium">»</span>
        </button>
      </nav>
    </div>
  );
}
