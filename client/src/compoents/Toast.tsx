import React from "react";
import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
};

// Toast 图标映射
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

// Toast 样式映射
const toastClasses: Record<ToastType, string> = {
  success: "border-green-500/50 bg-green-50 dark:bg-green-950/30",
  error: "border-red-500/50 bg-red-50 dark:bg-red-950/30",
  warning: "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/30",
  info: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/30",
};

/**
 * 轻量提示弹窗 - 无阻塞的轻量提示，自动消失，不打断用户操作
 * 
 * @param message - 提示消息
 * @param type - 提示类型：success | error | warning | info
 * @param duration - 显示时长（毫秒），默认 3000ms
 * 
 * @example
 * // 成功提示
 * toast.success("登录成功");
 * 
 * // 错误提示
 * toast.error("登录失败，请检查用户名和密码");
 * 
 * // 警告提示
 * toast.warning("您的登录状态即将过期");
 * 
 * // 信息提示
 * toast.info("正在加载数据...");
 */
export function toast({ message, type = "info", duration = 3000 }: ToastProps) {
  const icon = toastIcons[type];
  const toastClass = toastClasses[type];

  sonnerToast.custom((id) => (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        bg-white dark:bg-zinc-900
        ${toastClass}
        animate-in slide-in-from-top-2 fade-in duration-200
      `}
    >
      {icon}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {message}
      </span>
      <button
        onClick={() => sonnerToast.dismiss(id)}
        className="ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="关闭提示"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  ), {
    duration: duration,
  });
}

// 便捷方法
toast.success = (message: string, duration?: number) => 
  toast({ message, type: "success", duration });

toast.error = (message: string, duration?: number) => 
  toast({ message, type: "error", duration });

toast.warning = (message: string, duration?: number) => 
  toast({ message, type: "warning", duration });

toast.info = (message: string, duration?: number) => 
  toast({ message, type: "info", duration });

export default toast;
