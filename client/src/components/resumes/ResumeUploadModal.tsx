import { useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { formatFileSize } from '../../utils/format';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
  uploading: boolean;
}

export function ResumeUploadModal({
  isOpen,
  onClose,
  selectedFile,
  onFileChange,
  onUpload,
  uploading,
}: ResumeUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">上传简历</h3>
          <button
            aria-label="关闭弹窗"
            onClick={() => {
              onClose();
              onFileChange(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => {
                const file = e.target.files?.[0];
                onFileChange(file || null);
              }}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer block">
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-md">
                    <FileText className="text-white" size={32} />
                  </div>
                  <p className="text-slate-900 font-medium text-lg mb-1">{selectedFile.name}</p>
                  <p className="text-slate-500 text-sm">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <p className="text-blue-600 text-sm mt-3 font-medium">点击更换文件</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                    <Upload className="text-slate-400" size={32} />
                  </div>
                  <p className="text-slate-600 font-medium">点击或拖拽文件到此处上传</p>
                  <p className="text-slate-400 text-sm mt-2">支持 PDF、Word 文档，最大 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            aria-label="取消"
            onClick={() => {
              onClose();
              onFileChange(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors font-medium"
          >
            取消
          </button>
          <button
            onClick={onUpload}
            disabled={!selectedFile || uploading}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {uploading && <Loader2 className="animate-spin" size={18} />}
            {uploading ? '上传中...' : '上传简历'}
          </button>
        </div>
      </div>
    </div>
  );
}
