import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { login } from "../../api/login";
import { useLoginStore } from "../../store/Login";
import toast from "../../utils/toast";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormData>();
  const { login: storeLogin } = useLoginStore();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      storeLogin(await login(data));
      toast.success("登录成功");
      window.location.href = "/app";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
        <input
          type="email"
          placeholder="your@email.com"
          {...form.register("email", {
            required: "请输入邮箱",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "请输入有效的邮箱地址" }
          })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register("password", {
            required: "请输入密码",
            minLength: { value: 6, message: "密码至少6位" }
          })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
        />
        {form.formState.errors.password && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.password.message}</p>
        )}
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
          "登录"
        )}
      </button>
    </form>
  );
}
