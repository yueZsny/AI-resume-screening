interface SettingSkeletonProps {
  rows?: number;
  message?: string;
}

export function SettingSkeleton({
  rows = 3,
  message = "加载中...",
}: SettingSkeletonProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-6 rounded-3xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] p-8 shadow-[var(--app-shadow-sm)]">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-48 animate-pulse rounded-2xl bg-[var(--app-skeleton,#f4f4f6)]"
            />
          ))}
        </div>
        <div className="h-3 w-32 animate-pulse rounded-full bg-[var(--app-skeleton,#f4f4f6)]" />
      </div>
      <p className="text-sm text-[var(--app-text-muted,#a1a1aa)]">{message}</p>
    </div>
  );
}
