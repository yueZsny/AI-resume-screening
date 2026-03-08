import { LogOut } from "lucide-react";
import { useLoginStore } from "../store/Login";

interface UserInfoProps {
  username?: string;
}

export function UserInfo({ username }: UserInfoProps) {
  const logout = useLoginStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-slate-600">
            {username?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <span className="text-sm text-gray-700">
          {username || "用户"}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">退出</span>
      </button>
    </div>
  );
}
