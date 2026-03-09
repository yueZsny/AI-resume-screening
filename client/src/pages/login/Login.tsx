import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login, register } from "../../api/login";
import { useLoginStore } from "../../store/Login";
import toast from "../../components/Toast";
import { LoginForm, RegisterForm } from "../../components/login";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: storeLogin, token } = useLoginStore();

  // 反向守卫：已登录则跳转到后台
  useEffect(() => {
    if (token) {
      window.location.href = "/app";
    }
  }, [token]);

  // 检测是否从路由守卫重定向过来
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect") === "unauthorized") {
      toast.error("请先登录后再访问");
    }
  }, []);

  const registerForm = useForm<RegisterFormData>();

  const onLogin = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await login(data);
      storeLogin(res);
      toast.success("登录成功");
      window.location.href = "/app";
    } catch (err) {
      const message = err instanceof Error ? err.message : "登录失败";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setError("");
    setIsLoading(true);
    try {
      await register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success("注册成功，请登录！");
      setIsLogin(true);
      registerForm.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "注册失败";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧装饰 */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div>
          <h2 className="text-2xl font-semibold text-white">AI 简历筛选</h2>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            智能筛选人才<br />提升招聘效率
          </h1>
          <p className="mt-4 text-slate-400 text-lg">
            利用 AI 技术自动分析和匹配候选人，让招聘更智能、更高效
          </p>
        </div>
        <p className="text-slate-500 text-sm">© 2026 AI Resume Screening</p>
      </div>

      {/* 右侧表单 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* 标题 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isLogin ? "欢迎回来" : "创建账户"}
            </h2>
            <p className="mt-2 text-gray-500">
              {isLogin ? "请登录您的账户" : "开始使用 AI 简历筛选"}
            </p>
          </div>

          {isLogin ? (
            <LoginForm
              onSubmit={onLogin}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <RegisterForm
              onSubmit={onRegister}
              isLoading={isLoading}
              error={error}
            />
          )}

          {/* 切换 */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? (
              <>
                还没有账户?{" "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setError(""); }}
                  className="text-slate-900 font-medium hover:underline"
                >
                  注册
                </button>
              </>
            ) : (
              <>
                已有账户?{" "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(""); registerForm.reset(); }}
                  className="text-slate-900 font-medium hover:underline"
                >
                  登录
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
