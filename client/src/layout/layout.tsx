import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Briefcase,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
  Palette,
} from "lucide-react";
import { useLoginStore } from "../store/Login";
import { UserInfo } from "../components/UserInfo";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

const navItems = [
  { path: "/app", label: "仪表盘", icon: LayoutDashboard },
  { path: "/app/resumes", label: "简历管理", icon: FileText },
  { path: "/app/aiscreening", label: "AI 筛选", icon: Briefcase },
  { path: "/app/screening-template", label: "筛选模版", icon: ClipboardList },
  { path: "/app/emails", label: "邮件群发", icon: Mail },
  { path: "/app/demo", label: "主题 Demo", icon: Palette },
  { path: "/app/settings", label: "设置", icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const { user } = useLoginStore();

  const [expanded, setExpanded] = useState(
    () => localStorage.getItem("sidebar-expanded") !== "false",
  );

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-[var(--app-page-bg,#f8f9fc)]">
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 flex flex-col z-40 overflow-hidden
          bg-[var(--app-sidebar-bg,#ffffff)] border-r border-[var(--app-sidebar-border,rgba(0,0,0,0.05))]
          transition-[width] duration-200 ease-out
          ${expanded ? "w-60" : "w-[72px]"}
        `}
      >
        {/* 顶栏：品牌 + 侧栏开关 */}
        <div className="shrink-0 border-b border-[var(--app-sidebar-border,rgba(0,0,0,0.05))]">
          {expanded ? (
            <div className="flex items-center gap-1 pl-4 pr-2 py-[18px]">
              <Link
                to="/app"
                className="flex min-w-0 flex-1 items-center gap-3 no-underline"
                title="简历筛选"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-[#0ea5e9] to-[#3b82f6] text-white shadow-[0_2px_8px_rgba(14,165,233,0.35)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <path
                      d="M2 17l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.6"
                    />
                    <path
                      d="M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                    />
                  </svg>
                </div>
                <span className="truncate text-[15px] font-semibold tracking-tight text-[var(--app-sidebar-text-primary,#1a1a2e)]">
                  简历筛选
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                title="收起侧栏"
                aria-label="收起侧边栏"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent transition-colors hover:bg-[var(--app-sidebar-hover-bg,#f3f4f6)] text-[var(--app-sidebar-text-muted,#9ca3af)] hover:text-[var(--app-sidebar-hover-text,#374151)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary,rgba(14,165,233,0.25))] focus-visible:ring-offset-2"
              >
                <PanelLeftClose
                  className="h-[18px] w-[18px]"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-3 py-4">
              <Link
                to="/app"
                className="flex shrink-0 no-underline"
                title="简历筛选"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-linear-to-br from-[#667eea] to-[#764ba2] text-white shadow-[0_2px_8px_rgba(102,126,234,0.35)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <path
                      d="M2 17l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.6"
                    />
                    <path
                      d="M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                    />
                  </svg>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                title="展开侧栏"
                aria-label="展开侧边栏"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent transition-colors hover:bg-[var(--app-sidebar-hover-bg,#f3f4f6)] text-[var(--app-sidebar-text-muted,#9ca3af)] hover:text-[var(--app-sidebar-hover-text,#374151)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary,rgba(14,165,233,0.25))] focus-visible:ring-offset-2"
              >
                <PanelLeftOpen
                  className="h-[17px] w-[17px]"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/app" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                title={expanded ? undefined : item.label}
                className={`
                  flex items-center rounded-[10px] no-underline text-[14px] font-medium
                  transition-all duration-150 group
                  ${expanded ? "gap-3 px-3.5 py-2.5" : "justify-center px-2 py-2.5"}
                  ${
                    isActive
                      ? "bg-linear-to-r from-[var(--app-sidebar-nav-active-from)] to-[var(--app-sidebar-nav-active-to)] text-[var(--app-sidebar-nav-active-text)]"
                      : "text-[var(--app-sidebar-text-secondary)] hover:bg-[var(--app-sidebar-hover-bg)] hover:text-[var(--app-sidebar-hover-text)]"
                  }
                `}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0 transition-transform duration-150 group-hover:scale-105" />
                {expanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 主题切换 */}
        <div className={`shrink-0 ${expanded ? "px-3 pt-3 pb-1" : "px-2 pt-3 pb-1"}`}>
          <ThemeSwitcher compact={!expanded} />
        </div>

        {/* User */}
        <div
          className={`border-t border-[var(--app-sidebar-border,rgba(0,0,0,0.05))] shrink-0 ${expanded ? "px-3 py-3" : "px-2 py-3"}`}
        >
          <UserInfo username={user?.username} compact={!expanded} />
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
          flex min-h-0 flex-1 flex-col overflow-y-auto
          transition-[margin] duration-200 ease-out
          ${expanded ? "ml-60" : "ml-[72px]"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
