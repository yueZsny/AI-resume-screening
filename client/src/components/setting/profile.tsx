import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getProfile, updateProfile } from "../../api/profile";
import {
  User,
  Mail,
  Save,
  Camera,
  CheckCircle2,
  AlertCircle,
  Shield,
  Loader2,
  Undo2,
} from "lucide-react";
import toast from "../../utils/toast";
import { useLoginStore } from "../../store/Login";
import { SettingSkeleton } from "./SettingSkeleton";

// ============================================================================
// Types
// ============================================================================

interface ProfileData {
  username: string;
  email: string;
  avatar: string | null;
}

interface ProfileFormData {
  username: string;
  avatar: string | null;
}

interface UseProfileReturn {
  profile: ProfileData | null;
  formData: ProfileFormData;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  isAvatarUploading: boolean;
  updateField: <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => void;
  handleAvatarChange: (file: File) => void;
  save: () => Promise<boolean>;
  reset: () => void;
}

// ============================================================================
// useProfile Hook
// ============================================================================

function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({ username: "", avatar: null });
  const [originalData, setOriginalData] = useState<ProfileFormData>({ username: "", avatar: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const pendingAvatarRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getProfile();
        setProfile(data);
        const initial = { username: data.username, avatar: data.avatar };
        setFormData(initial);
        setOriginalData(initial);
      } catch {
        toast.error("加载个人信息失败");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchProfile();
  }, []);

  const isDirty = useMemo(
    () => formData.username !== originalData.username || formData.avatar !== originalData.avatar,
    [formData, originalData]
  );

  const updateField = useCallback(<K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAvatarChange = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("图片大小不能超过 2MB");
      return;
    }

    setIsAvatarUploading(true);
    try {
      const reader = new FileReader();
      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          pendingAvatarRef.current = reader.result as string;
          resolve();
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      setFormData((prev) => ({ ...prev, avatar: pendingAvatarRef.current }));
      toast.success("头像已更新，保存后生效");
    } catch {
      toast.error("头像处理失败");
    } finally {
      setIsAvatarUploading(false);
    }
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    const trimmedUsername = formData.username.trim();
    if (!trimmedUsername) {
      toast.error("用户名不能为空");
      return false;
    }

    const snapshot = { username: profile?.username ?? "", avatar: profile?.avatar ?? null };

    setProfile((prev) => prev ? { ...prev, username: trimmedUsername, avatar: formData.avatar ?? prev.avatar } : null);
    setOriginalData({ username: trimmedUsername, avatar: formData.avatar });
    setIsSaving(true);

    try {
      const updated = await updateProfile({
        username: trimmedUsername,
        avatar: formData.avatar || undefined,
      });

      setProfile(updated);
      setOriginalData({ username: updated.username, avatar: updated.avatar });
      setFormData({ username: updated.username, avatar: updated.avatar });

      const setUser = useLoginStore.getState().setUser;
      setUser({ username: updated.username, avatar: updated.avatar });

      toast.success("个人信息已更新");
      return true;
    } catch (error: unknown) {
      setProfile((prev) => prev ? { ...prev, username: snapshot.username, avatar: snapshot.avatar } : null);
      setOriginalData(snapshot);
      setFormData((prev) => ({ ...prev, username: snapshot.username, avatar: snapshot.avatar }));

      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "保存失败");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, profile]);

  const reset = useCallback(() => {
    setFormData({ username: originalData.username, avatar: originalData.avatar });
  }, [originalData]);

  return {
    profile,
    formData,
    isLoading,
    isSaving,
    isDirty,
    isAvatarUploading,
    updateField,
    handleAvatarChange,
    save,
    reset,
  };
}

// ============================================================================
// Validation
// ============================================================================

function useValidation(username: string, isEditing: boolean) {
  return useMemo(() => {
    if (!isEditing) return { valid: true, message: "" };
    if (!username.trim()) return { valid: false, message: "用户名不能为空" };
    if (username.length < 2) return { valid: false, message: "用户名至少需要2个字符" };
    if (username.length > 20) return { valid: false, message: "用户名不能超过20个字符" };
    return { valid: true, message: "" };
  }, [username, isEditing]);
}

// ============================================================================
// Avatar Component
// ============================================================================

function Avatar({ src, name, size, isUploading }: { src: string | null; name: string; size: "sm" | "md" | "lg" | "xl"; isUploading?: boolean }) {
  const sizeClasses = { sm: "h-8 w-8 text-xs", md: "h-12 w-12 text-sm", lg: "h-16 w-16 text-xl", xl: "h-24 w-24 text-3xl" };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-sky-500 to-blue-600 shadow-lg ${sizeClasses[size]}`}>
      {isUploading ? (
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      ) : src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-bold text-white">{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ProfileSettings() {
  const {
    profile,
    formData,
    isLoading,
    isSaving,
    isDirty,
    isAvatarUploading,
    updateField,
    handleAvatarChange,
    save,
    reset,
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const validation = useValidation(formData.username, isEditing);
  const hasUsernameWarning = isEditing && formData.username !== (profile?.username ?? "") && !validation.valid;

  useEffect(() => {
    if (isEditing && usernameInputRef.current) {
      usernameInputRef.current.focus();
      usernameInputRef.current.select();
    }
  }, [isEditing]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarChange(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [handleAvatarChange]);

  const onSave = useCallback(async () => {
    const success = await save();
    if (success) setIsEditing(false);
  }, [save]);

  const onCancel = useCallback(() => {
    reset();
    setIsEditing(false);
  }, [reset]);

  const toggleEdit = useCallback(() => {
    if (isEditing && isDirty) {
      if (confirm("有未保存的更改，确定要取消吗？")) onCancel();
    } else {
      setIsEditing(!isEditing);
    }
  }, [isEditing, isDirty, onCancel]);

  const displayAvatar = formData.avatar ?? profile?.avatar ?? null;
  const displayName = formData.username || profile?.username || "未设置用户名";

  if (isLoading) {
    return (
      <SettingSkeleton rows={1} message="加载个人信息..." />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="overflow-hidden rounded-3xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] shadow-sm transition-shadow hover:shadow-md">
        <div className="h-24 bg-linear-to-br from-[var(--app-primary,#0ea5e9)]/10 via-[var(--app-primary,#0ea5e9)]/10 to-indigo-500/10" />

        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-12 left-6">
            <div
              className="relative"
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
            >
              <Avatar src={displayAvatar} name={displayName} size="xl" />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAvatarUploading}
                className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 transition-all duration-200 ${
                  isAvatarHovered || isAvatarUploading ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex flex-col items-center text-white">
                  <Camera className="h-6 w-6" />
                  <span className="mt-1 text-xs font-medium">更换</span>
                </div>
              </button>

              {formData.avatar !== profile?.avatar && formData.avatar && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[var(--app-success,#22c55e)] text-white shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
              aria-label="上传头像"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onCancel}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] px-4 py-2 text-sm font-medium text-[var(--app-text-secondary,#52525b)] shadow-sm transition-all hover:bg-[var(--app-surface-raised,#fafafa)] disabled:opacity-50"
                >
                  <Undo2 className="h-4 w-4" />
                  取消
                </button>
                <button
                  onClick={onSave}
                  disabled={isSaving || !validation.valid}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[var(--app-primary,#0ea5e9)] to-[var(--app-accent,#3b82f6)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? "保存中..." : "保存更改"}
                </button>
              </div>
            ) : (
              <button
                onClick={toggleEdit}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[var(--app-primary,#0ea5e9)] to-[var(--app-accent,#3b82f6)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105"
              >
                编辑资料
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="mt-4 flex items-end justify-between">
            <div>
              {isEditing ? (
                <div className="space-y-1">
                  <input
                    ref={usernameInputRef}
                    type="text"
                    value={formData.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    maxLength={20}
                    placeholder="输入用户名"
                    aria-label="用户名"
                    className={`w-full rounded-lg border-2 bg-[var(--app-surface,#fff)] px-3 py-2 text-xl font-semibold text-[var(--app-text-primary,#18181b)] outline-none transition-colors ${
                      hasUsernameWarning ? "border-[var(--app-warning,#f59e0b)] focus:border-[var(--app-warning,#f59e0b)]" : "border-transparent focus:border-[var(--app-primary,#0ea5e9)]"
                    }`}
                  />
                  {hasUsernameWarning && (
                    <p className="flex items-center gap-1 text-xs text-[var(--app-warning,#f59e0b)]">
                      <AlertCircle className="h-3 w-3" />
                      {validation.message}
                    </p>
                  )}
                </div>
              ) : (
                <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text-primary,#18181b)]">{displayName}</h1>
              )}

              <p className="mt-1 flex items-center gap-2 text-sm text-[var(--app-text-secondary,#52525b)]">
                <Mail className="h-4 w-4" />
                {profile?.email ?? "-"}
              </p>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--app-primary-soft,rgba(14,165,233,0.1))] px-3 py-1 text-xs font-medium text-[var(--app-primary,#0ea5e9)] ring-1 ring-inset ring-[var(--app-primary,#0ea5e9)]/20">
                  <Shield className="h-3 w-3" />
                  个人账户
                </span>
                {profile?.avatar && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--app-success-soft,rgba(34,197,94,0.1))] px-3 py-1 text-xs font-medium text-[var(--app-success,#22c55e)] ring-1 ring-inset ring-[var(--app-success,#22c55e)]/20">
                    <CheckCircle2 className="h-3 w-3" />
                    已上传头像
                  </span>
                )}
                {isDirty && isEditing && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--app-warning-soft,rgba(245,158,11,0.1))] px-3 py-1 text-xs font-medium text-[var(--app-warning,#f59e0b)] ring-1 ring-inset ring-[var(--app-warning,#f59e0b)]/20">
                    <AlertCircle className="h-3 w-3" />
                    有未保存的更改
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="group relative rounded-2xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] p-4 transition-all hover:border-[var(--app-border-strong,#d4d4d8)] hover:shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--app-primary-soft,rgba(14,165,233,0.1))] text-[var(--app-primary,#0ea5e9)] transition-colors group-hover:bg-[var(--app-primary-soft,rgba(14,165,233,0.15))]">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted,#a1a1aa)]">用户名</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => updateField("username", e.target.value)}
                  maxLength={20}
                  placeholder="输入用户名"
                  aria-label="用户名"
                  className={`mt-1 w-full rounded-lg border bg-[var(--app-surface,#fff)] px-2 py-1 text-sm font-medium outline-none transition-colors ${
                    hasUsernameWarning ? "border-[var(--app-warning,#f59e0b)] text-[var(--app-warning,#f59e0b)]" : "border-transparent text-[var(--app-text-primary,#18181b)]"
                  }`}
                />
              ) : (
                <p className="mt-1 text-sm font-medium text-[var(--app-text-primary,#18181b)]">{profile?.username ?? "-"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="group relative rounded-2xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] p-4 transition-all hover:border-[var(--app-border-strong,#d4d4d8)] hover:shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--app-primary-soft,rgba(14,165,233,0.1))] text-[var(--app-primary,#0ea5e9)] transition-colors group-hover:bg-[var(--app-primary-soft,rgba(14,165,233,0.15))]">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted,#a1a1aa)]">邮箱</p>
              <p className="mt-1 text-sm font-medium text-[var(--app-text-primary,#18181b)]">{profile?.email ?? "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help text */}
      {!isEditing && (
        <div className="rounded-2xl border border-dashed border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface-raised,#fafafa)]/40 p-4">
          <p className="flex items-center gap-2 text-sm text-[var(--app-text-secondary,#52525b)]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[var(--app-text-muted,#a1a1aa)]" />
            如需修改邮箱或其他信息，请联系管理员处理。
          </p>
        </div>
      )}
    </div>
  );
}
