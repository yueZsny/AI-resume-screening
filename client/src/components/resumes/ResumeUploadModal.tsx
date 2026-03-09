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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">上传简历</h3>
          <button
            aria-label="关闭弹窗"
            onClick={() => {
              onClose();
              onFileChange(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors">
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
            <label htmlFor="resume-upload" className="cursor-pointer">
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <FileText className="text-blue-600 mb-2" size={48} />
                  <p className="text-gray-900 font-medium">{selectedFile.name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <p className="text-blue-600 text-sm mt-2">点击更换文件</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600">点击或拖拽文件到此处上传</p>
                  <p className="text-gray-400 text-sm mt-1">支持 PDF、Word 文档，最大 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            aria-label="关闭弹窗"
            onClick={() => {
              onClose();
              onFileChange(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={onUpload}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading && <Loader2 className="animate-spin" size={18} />}
            {uploading ? '上传中...' : '上传'}
          </button>
        </div>
      </div>
    </div>
  );
}
