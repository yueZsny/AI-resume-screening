import { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown, Settings, Mail, Pencil, Save, X, Camera } from "lucide-react";
import { useLoginStore } from "../store/Login";
import { getProfile, updateProfile } from "../api/profile";
import { Modal } from "./Modal";
import toast from "./Toast";

interface UserInfoProps {
  username?: string;
}

export function UserInfo({ username: propsUsername }: UserInfoProps) {
  const logout = useLoginStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<{ username: string; email: string; avatar: string | null } | null>(null);
  const [editForm, setEditForm] = useState({ username: "", email: "" });
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取用户信息
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setEditForm({ username: data.username, email: data.email });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // 优先使用 props传入的用户名，其次使用接口返回的用户名
  const displayUsername = propsUsername || profile?.username || "用户";
  const displayAvatar = newAvatar || profile?.avatar;

  // 处理头像选择
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    // 验证文件大小 (最大 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("图片大小不能超过 2MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // 将图片转换为 base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64 = reader.result as string;
        // 直接使用 base64 作为头像 URL
        setNewAvatar(base64);
        toast.success("头像上传成功");
        setIsUploadingAvatar(false);
      };

      reader.onerror = () => {
        toast.error("图片读取失败，请重试");
        setIsUploadingAvatar(false);
      };
    } catch (error) {
      console.error("Failed to process avatar:", error);
      toast.error("头像处理失败，请重试");
      setIsUploadingAvatar(false);
    }

    // 清空 input 以便重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleEditProfile = () => {
    setIsOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.username.trim()) {
      toast.error("用户名不能为空");
      return;
    }
    setIsSaving(true);
    try {
      const updated = await updateProfile({
        username: editForm.username,
        avatar: newAvatar || undefined,
      });
      setProfile(updated);
      setNewAvatar(null);
      setIsEditing(false);
      toast.success("个人信息更新成功");
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "更新失败，请稍后重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ username: profile?.username || "", email: profile?.email || "" });
    setNewAvatar(null);
    setIsEditing(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex items-center gap-2 hover:bg-gray-100/80 rounded-full px-1.5 py-1.5 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayUsername}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-white">
                {displayUsername.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            {displayUsername}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100/50 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 用户信息头部 */}
            

            <div className="py-1.5">
              <button
                onClick={handleEditProfile}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-150"
              >
                <User className="w-4 h-4 text-gray-400" />
                个人信息
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-150"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                设置
              </button>
            </div>

            <div className="border-t border-gray-100 mt-1.5 pt-1.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        aria-label="退出登录"
        className="flex md:hidden items-center justify-center w-9 h-9 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {/* 个人信息弹窗 */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setIsEditing(false);
        }}
        title="个人信息"
        size="md"
      >
        <div className="flex flex-col items-center py-4">
          {/* 头像区域 */}
          <div className="mb-4 relative group">
            <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayUsername}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {(isEditing ? editForm.username : profile?.username || "用户").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {/* 编辑模式下的上传按钮 */}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="上传头像"
            />
          </div>

          {/* 编辑模式 */}
          {isEditing ? (
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">用户名</p>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入用户名"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">邮箱</p>
                  <p className="text-sm font-medium text-gray-900">{profile?.email || "-"}</p>
                  <p className="text-xs text-gray-400 mt-1">邮箱不可修改</p>
                </div>
              </div>
            </div>
          ) : (
            /* 查看模式 */
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">用户名</p>
                  <p className="text-sm font-medium text-gray-900">{profile?.username || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">邮箱</p>
                  <p className="text-sm font-medium text-gray-900">{profile?.email || "-"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                取消
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              编辑
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}
