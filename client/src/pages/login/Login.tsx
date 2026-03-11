import { useState, useEffect } from "react";
import { useLoginStore } from "../../store/Login";
import toast from "../../components/Toast";
import { LoginForm, RegisterForm } from "../../components/login";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { token } = useLoginStore();

  useEffect(() => {
    if (token) window.location.href = "/app";
  }, [token]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("redirect") === "unauthorized") {
      toast.error("请先登录后再访问");
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <h2 className="text-2xl font-semibold text-white">AI 简历筛选</h2>
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isLogin ? "欢迎回来" : "创建账户"}
            </h2>
            <p className="mt-2 text-gray-500">
              {isLogin ? "请登录您的账户" : "开始使用 AI 简历筛选"}
            </p>
          </div>

          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => setIsLogin(true)} />
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? (
              <>
                还没有账户?{" "}
                <button onClick={() => setIsLogin(false)} className="text-slate-900 font-medium hover:underline">
                  注册
                </button>
              </>
            ) : (
              <>
                已有账户?{" "}
                <button onClick={() => setIsLogin(true)} className="text-slate-900 font-medium hover:underline">
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
