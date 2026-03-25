import {
  Upload,
  FileText,
  Loader2,
  Mail,
  AlertCircle,
  CheckCircle2,
  Inbox,
  File,
} from "lucide-react";
import { Modal } from "../Modal";
import { formatFileSize } from "../../utils/format";
import type { EmailConfig } from "../../types/email";

// ============================================================================
// Types
// ============================================================================

export type ResumeModalType = "upload" | "import";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ResumeModalType;
  selectedFile?: File | null;
  onFileChange?: (file: File | null) => void;
  onUpload?: () => void;
  uploading?: boolean;
  emailConfigs?: EmailConfig[];
  loadingConfigs?: boolean;
  selectedConfigId?: number | null;
  onConfigChange?: (id: number | null) => void;
  onImport?: () => void;
  importing?: boolean;
}

// ============================================================================
// Upload Section Components
// ============================================================================

const ACCEPT_TYPES = ".pdf,.doc,.docx";

interface DropZoneProps {
  selectedFile: File | null;
  onFileChange?: (file: File | null) => void;
}

const DropZone = ({ selectedFile, onFileChange }: DropZoneProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileChange?.(file ?? null);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileChange?.(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const getFileIcon = () => {
    const ext = selectedFile?.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="h-8 w-8" />;
    if (ext === "docx" || ext === "doc") return <File className="h-8 w-8" />;
    return <Upload className="h-8 w-8" />;
  };

  const getFileGradient = () => {
    if (!selectedFile) return "from-[var(--app-skeleton,#f4f4f6)] to-[var(--app-border,#e4e4e7)]";
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "from-[var(--app-danger,#ef4444)] to-[var(--app-danger,#ef4444)]";
    if (ext === "docx" || ext === "doc") return "from-[var(--app-primary,#0ea5e9)] to-[var(--app-primary,#0ea5e9)]";
    return "from-[var(--app-primary,#0ea5e9)] to-[var(--app-primary,#0ea5e9)]";
  };

  const inputId = "resume-upload-input";

  return (
    <>
      <input
        id={inputId}
        type="file"
        accept={ACCEPT_TYPES}
        className="sr-only"
        onChange={handleInputChange}
        aria-label="选择简历文件（PDF 或 Word）"
      />
      <label
        htmlFor={inputId}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          block overflow-hidden rounded-2xl border-2 border-dashed
          ${selectedFile ? "border-[var(--app-primary,#0ea5e9)]/20 bg-[var(--app-primary-soft,rgba(14,165,233,0.1))]/40" : "border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface-raised,#fafafa)]/30"}
          ${onFileChange ? "cursor-pointer transition-colors hover:border-[var(--app-border-strong,#d4d4d8)] hover:bg-[var(--app-surface-raised,#fafafa)]/50" : ""}
        `}
      >
        <div className="p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            {/* Icon */}
            <div
              className={`
              flex h-14 w-14 items-center justify-center rounded-2xl
              bg-linear-to-br ${getFileGradient()} shadow-md
            `}
            >
              <div className="text-white">{getFileIcon()}</div>
            </div>

            {selectedFile ? (
              <>
                {/* File Info */}
                <div>
                  <p className="text-sm font-semibold text-[var(--app-text-primary,#18181b)] mb-0.5 truncate max-w-[20rem]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[var(--app-text-secondary,#52525b)]">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </>
            ) : (
              /* Empty state */
              <div>
                <p className="text-sm font-semibold text-[var(--app-text-primary,#18181b)] mb-1">
                  点击或拖拽文件到此处
                </p>
                <p className="text-xs text-[var(--app-text-muted,#a1a1aa)]">
                  支持 PDF、Word 文档，最大 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      </label>
    </>
  );
};

// ============================================================================
// Import Section Components
// ============================================================================

interface ImportSectionProps {
  emailConfigs: EmailConfig[];
  loadingConfigs: boolean;
  selectedConfigId: number | null;
  onConfigChange: (id: number | null) => void;
}

const ImportSection = ({
  emailConfigs,
  loadingConfigs,
  selectedConfigId,
  onConfigChange,
}: ImportSectionProps) => {
  if (loadingConfigs) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--app-primary,#0ea5e9)] to-[var(--app-primary,#0ea5e9)] shadow-[var(--app-shadow-primary)]">
          <Loader2 className="h-7 w-7 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (emailConfigs.length === 0) {
    return (
      <div className="space-y-6 py-6 text-center">
        {/* Empty State */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--app-skeleton,#f4f4f6)] to-[var(--app-border,#e4e4e7)] shadow-inner">
            <Inbox className="h-10 w-10 text-[var(--app-text-muted,#a1a1aa)]" />
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-[var(--app-text-primary,#18181b)]">
            暂无邮箱配置
          </h3>
          <p className="text-sm text-[var(--app-text-secondary,#52525b)]">
            请先在设置中添加邮箱配置后再导入简历
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Config Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text-secondary,#52525b)]">
          <Mail className="h-4 w-4 text-[var(--app-primary,#0ea5e9)]" />
          选择邮箱账号
        </label>
        <div className="relative">
          <select
            aria-label="选择邮箱账号"
            value={selectedConfigId || ""}
            onChange={(e) => onConfigChange(Number(e.target.value) || null)}
            className="
              w-full appearance-none rounded-xl border border-[var(--app-border,#e4e4e7)]
              bg-[var(--app-surface,#fff)] px-4 py-3 pr-10 text-sm text-[var(--app-text-primary,#18181b)]
              focus:border-[var(--app-primary,#0ea5e9)] focus:outline-none focus:ring-2
              focus:ring-[var(--app-ring,#rgba(14,165,233,0.2))] transition-all
              cursor-pointer hover:border-[var(--app-primary,#0ea5e9)]/20
            "
          >
            <option value="">请选择邮箱</option>
            {emailConfigs.map((config) => (
              <option key={config.id} value={config.id}>
                {config.email}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--app-primary,#0ea5e9)]/10 bg-gradient-to-br from-[var(--app-primary-soft,rgba(14,165,233,0.1))]/90 to-[var(--app-primary-soft,rgba(14,165,233,0.1))]/80 p-5">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--app-primary,#0ea5e9)]/10" />

        <div className="relative flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--app-primary,#0ea5e9)]/10">
            <AlertCircle className="h-5 w-5 text-[var(--app-primary,#0ea5e9)]" />
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-[var(--app-text-primary,#18181b)]">
              导入说明
            </h4>
            <p className="text-sm leading-relaxed text-[var(--app-text-secondary,#52525b)]">
              系统将自动扫描该邮箱最近{" "}
              <span className="font-semibold text-[var(--app-primary,#0ea5e9)]">7 天</span>{" "}
              的邮件，查找包含 PDF 或 Word 格式简历附件的邮件并导入。
            </p>
          </div>
        </div>
      </div>

      {/* Selected Config Preview */}
      {selectedConfigId && (
        <div className="rounded-xl bg-[var(--app-surface-raised,#fafafa)] p-4">
          {(() => {
            const config = emailConfigs.find((c) => c.id === selectedConfigId);
            if (!config) return null;
            return (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--app-primary,#0ea5e9)] to-[var(--app-primary,#0ea5e9)] shadow-[var(--app-shadow-sm)]">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--app-text-primary,#18181b)]">
                    {config.email}
                  </p>
                  <p className="text-xs text-[var(--app-text-secondary,#52525b)]">
                    将从此邮箱导入简历附件
                  </p>
                </div>
                <CheckCircle2 className="ml-auto h-5 w-5 text-[var(--app-success,#22c55e)]" />
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export function ResumeModal({
  isOpen,
  onClose,
  type,
  selectedFile,
  onFileChange,
  onUpload,
  uploading,
  emailConfigs = [],
  loadingConfigs,
  selectedConfigId,
  onConfigChange,
  onImport,
  importing,
}: ResumeModalProps) {
  const handleClose = () => {
    if (type === "upload" && onFileChange) {
      onFileChange(null);
    }
    onClose();
  };

  const isUpload = type === "upload";

  const getModalTitle = () => {
    if (isUpload) {
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--app-primary,#0ea5e9)] to-[var(--app-primary,#0ea5e9)] shadow-[var(--app-shadow-sm)]">
            <Upload className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-[var(--app-text-primary,#18181b)]">上传简历</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--app-primary,#0ea5e9)] to-[var(--app-primary,#0ea5e9)] shadow-[var(--app-shadow-sm)]">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-[var(--app-text-primary,#18181b)]">从邮箱导入</span>
      </div>
    );
  };

  const getSubmitButtonContent = () => {
    if (isUpload) {
      return (
        <>
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          {uploading ? "上传中..." : "开始上传"}
        </>
      );
    }
    return (
      <>
        {importing && <Loader2 className="h-4 w-4 animate-spin" />}
        {importing ? "导入中..." : "开始导入"}
      </>
    );
  };

  const isSubmitDisabled = isUpload
    ? !selectedFile || uploading
    : !selectedConfigId || importing || emailConfigs.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getModalTitle()}
      size="md"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <button
            onClick={handleClose}
            className="
              rounded-xl border border-[var(--app-border,#e4e4e7)] bg-[var(--app-surface,#fff)] px-4 py-2
              text-sm font-medium text-[var(--app-text-secondary,#52525b)]
              hover:bg-[var(--app-surface-raised,#fafafa)] hover:border-[var(--app-border-strong,#d4d4d8)]
              transition-all disabled:opacity-50
            "
          >
            取消
          </button>
          <button
            onClick={isUpload ? onUpload : onImport}
            disabled={isSubmitDisabled}
            className="
              flex items-center gap-1.5 rounded-xl
              bg-[var(--app-primary,#0ea5e9)] px-4 py-2 text-sm font-medium text-white
              shadow-[var(--app-shadow-sm)] hover:bg-[var(--app-primary-hover,#0284c7)]
              transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--app-primary,#0ea5e9)]
            "
          >
            {getSubmitButtonContent()}
          </button>
        </div>
      }
    >
      {isUpload ? (
        <DropZone
          selectedFile={selectedFile || null}
          onFileChange={onFileChange}
        />
      ) : (
        <ImportSection
          emailConfigs={emailConfigs}
          loadingConfigs={loadingConfigs || false}
          selectedConfigId={selectedConfigId || null}
          onConfigChange={onConfigChange || (() => {})}
        />
      )}
    </Modal>
  );
}
