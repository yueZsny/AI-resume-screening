import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";

/** Toast 类型 */
type ToastType = "success" | "error" | "warning" | "info";

/** Toast 项 */
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

/** 全局 Toast 状态 */
let toasts: ToastItem[] = [];
let listeners: ((toasts: ToastItem[]) => void)[] = [];

const notify = () => {
  listeners.forEach((fn) => fn([...toasts]));
};

/** Toast 函数 */
const toast = {
  success: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: "success" }];
    notify();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 3000);
  },
  error: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: "error" }];
    notify();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 3000);
  },
  warning: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: "warning" }];
    notify();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 3000);
  },
  info: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: "info" }];
    notify();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 3000);
  },
};

/** Toast 容器组件 - 需要在 App 中渲染 */
function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastItem[]) => setItems(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {items.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

/** 单个 Toast 项 */
function ToastItem({ toast }: { toast: ToastItem }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        animate-slide-in ${styles[toast.type]}
      `}
      role="alert"
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
    </div>
  );
}

// 导出 ToastContainer 供 App 使用
export { ToastContainer };
export default toast;
