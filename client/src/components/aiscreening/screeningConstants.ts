export const SCREENING_STATUS_META = {
  pending: {
    badge: "bg-[var(--app-ai-soft,#eff6ff)] text-[var(--app-primary,#0ea5e9)] border border-[var(--app-ai-border,rgba(59,130,246,0.2))]",
    dot: "bg-[var(--app-primary,#0ea5e9)]",
    label: "待筛选",
  },
  passed: {
    badge: "bg-[var(--app-primary,#0ea5e9)] text-white border border-[var(--app-primary,#0ea5e9)]",
    dot: "bg-[var(--app-primary,#0ea5e9)]/30",
    label: "已通过",
  },
  rejected: {
    badge: "bg-[var(--app-surface,#fff)] text-[var(--app-primary,#0ea5e9)] border border-[var(--app-ai-border,rgba(59,130,246,0.2))]",
    dot: "bg-[var(--app-primary,#0ea5e9)]/30",
    label: "已拒绝",
  },
} as const;
