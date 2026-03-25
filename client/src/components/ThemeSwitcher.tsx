import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore, type ThemeMode } from "../store/theme";

const OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: React.ReactNode;
  title: string;
}[] = [
  {
    value: "light",
    label: "浅色",
    icon: <Sun className="size-[15px]" strokeWidth={2} />,
    title: "浅色模式",
  },
  {
    value: "dark",
    label: "深色",
    icon: <Moon className="size-[15px]" strokeWidth={2} />,
    title: "深色模式",
  },
  {
    value: "system",
    label: "系统",
    icon: <Monitor className="size-[15px]" strokeWidth={2} />,
    title: "跟随系统",
  },
];

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useThemeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || compact) return;
    const activeBtn = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-value="${mode}"]`,
    );
    if (!activeBtn) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setIndicatorStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [mode, compact]);

  if (compact) {
    const active = OPTIONS.find((o) => o.value === mode);
    return (
      <button
        type="button"
        onClick={() => {
          const idx = OPTIONS.findIndex((o) => o.value === mode);
          const next = OPTIONS[(idx + 1) % OPTIONS.length];
          setMode(next.value);
        }}
        title={active?.title}
        aria-label={active?.title}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-zinc-400 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-700 active:scale-90"
      >
        <span className="transition-transform duration-300">
          {active?.icon}
        </span>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-1 rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface-raised,#fafafa)] p-1"
      role="group"
      aria-label="选择主题"
    >
      {/* 滑动指示器 */}
      <div
        className="pointer-events-none absolute top-1 bottom-1 rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-out"
        style={{
          ...indicatorStyle,
          opacity: mounted ? 1 : 0,
        }}
        aria-hidden
      />

      {OPTIONS.map((opt) => {
        const isActive = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            data-value={opt.value}
            onClick={() => setMode(opt.value)}
            title={opt.title}
            aria-label={opt.title}
            aria-pressed={isActive ? "true" : undefined}
            className={`
              relative z-10 flex w-full items-center gap-2 rounded-lg px-3 py-2
              text-[13px] font-medium transition-colors duration-200
              ${
                isActive
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-600"
              }
            `}
          >
            <span
              className={`transition-transform duration-300 ${
                isActive ? "scale-110" : ""
              }`}
            >
              {opt.icon}
            </span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
