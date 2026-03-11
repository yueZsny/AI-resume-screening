import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { register as registerApi } from "../../api/login";
import toast from "../Toast";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerApi({ username: data.username, email: data.email, password: data.password });
      toast.success("注册成功，请登录！");
      onSuccess?.();
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "注册失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", { message: "两次密码输入不一致" });
      return;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
        <input
          type="text"
          placeholder="请输入用户名"
          {...form.register("username", { required: "请输入用户名", minLength: { value: 2, message: "用户名至少2位" } })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
        />
        {form.formState.errors.username && <p className="mt-1 text-sm text-red-500">{form.formState.errors.username.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
        <input
          type="email"
          placeholder="your@email.com"
          {...form.register("email", { required: "请输入邮箱", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "请输入有效的邮箱地址" } })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
        />
        {form.formState.errors.email && <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register("password", { required: "请输入密码", minLength: { value: 6, message: "密码至少6位" } })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
        />
        {form.formState.errors.password && <p className="mt-1 text-sm text-red-500">{form.formState.errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">确认密码</label>
        <input
          type="password"
          placeholder="再次输入密码"
          {...form.register("confirmPassword", { required: "请再次输入密码" })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
        />
        {form.formState.errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            处理中...
          </span>
        ) : (
          "注册"
        )}
      </button>
    </form>
  );
}
