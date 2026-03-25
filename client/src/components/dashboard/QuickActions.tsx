import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Bot,
  Mail,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

interface QuickActionItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const actions: QuickActionItem[] = [
  { to: "/app", icon: LayoutDashboard, label: "工作台" },
  { to: "/app/resumes", icon: FileText, label: "简历" },
  { to: "/app/aiscreening", icon: Bot, label: "AI 筛选" },
  { to: "/app/emails", icon: Mail, label: "邮件" },
  { to: "/app/emails", icon: Users, label: "面试邀请" },
  { to: "/app/settings", icon: Settings, label: "设置" },
];

export function QuickActions() {
  return (
    <section className="rounded-3xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] px-4 py-5 shadow-[var(--app-shadow-sm)] ring-1 ring-[var(--app-border-subtle,rgba(0,0,0,0.04))] dark:ring-[var(--app-border-subtle,rgba(255,255,255,0.06))] sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--app-text-muted,#a1a1aa)]">
          快捷入口
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={`${action.to}-${action.label}`}
              to={action.to}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface-raised,#fafafa)] px-2 py-3.5 text-center no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--app-primary,#0ea5e9)]/20 hover:bg-[var(--app-surface,#fff)] hover:shadow-md hover:shadow-[var(--app-primary,#0ea5e9)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary,#0ea5e9)]/25"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--app-surface,#fff)] text-[var(--app-primary,#0ea5e9)] shadow-sm ring-1 ring-[var(--app-border,#e4e4e7)] transition-transform duration-200 group-hover:scale-105 group-hover:text-[var(--app-primary-hover,#0284c7)]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="line-clamp-2 text-[11px] font-medium leading-tight text-[var(--app-text-secondary,#52525b)] group-hover:text-[var(--app-text-primary,#18181b)]">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;
