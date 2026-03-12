export type ToastType = "success" | "error" | "warning" | "info";

/** Toast 项 */
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

/** 全局 Toast 状态 - 导出供 Toast 组件使用 */
export const toastState = {
  toasts: [] as ToastItem[],
  listeners: [] as ((toasts: ToastItem[]) => void)[],
};

const notify = () => {
  toastState.listeners.forEach((fn) => fn([...toastState.toasts]));
};

/** Toast 函数 */
const toast = {
  success: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastState.toasts = [...toastState.toasts, { id, message, type: "success" }];
    notify();
    setTimeout(() => {
      toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
      notify();
    }, 3000);
  },
  error: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastState.toasts = [...toastState.toasts, { id, message, type: "error" }];
    notify();
    setTimeout(() => {
      toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
      notify();
    }, 3000);
  },
  warning: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastState.toasts = [...toastState.toasts, { id, message, type: "warning" }];
    notify();
    setTimeout(() => {
      toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
      notify();
    }, 3000);
  },
  info: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastState.toasts = [...toastState.toasts, { id, message, type: "info" }];
    notify();
    setTimeout(() => {
      toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
      notify();
    }, 3000);
  },
};

export default toast;
