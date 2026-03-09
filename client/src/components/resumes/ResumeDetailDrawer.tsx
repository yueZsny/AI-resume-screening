import { Loader2, FileText, Eye } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../Drawer';
import type { Resume } from '../../types/resume';
import { formatFileSize, formatDate } from '../../utils/format';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface ResumeDetailDrawerProps {
  resume: Resume | null;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onPreview: (url: string, fileName: string) => void;
}

export function ResumeDetailDrawer({ resume, loading, onOpenChange, onPreview }: ResumeDetailDrawerProps) {
  const handlePreview = () => {
    if (!resume?.resumeFile) return;
    // 从完整路径中提取相对路径 (uploads/resumes/xxx.pdf)
    const fullPath = resume.resumeFile;
    const relativePath = fullPath.replace(/^.*[\\/]uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
    const fileUrl = `${API_BASE_URL}/${relativePath}`;
    onPreview(fileUrl, resume.originalFileName || '简历');
  };

  return (
    <Drawer open={!!resume} onOpenChange={onOpenChange}>
      <DrawerContent className="w-full max-w-2xl">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-xl">简历详情</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto py-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : resume ? (
            <div className="px-6 space-y-6">
              {/* 头部信息区域 */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{resume.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {resume.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium text-gray-500">电话:</span>
                      <span>{resume.phone}</span>
                    </div>
                  )}
                  {resume.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium text-gray-500">邮箱:</span>
                      <span className="truncate">{resume.email}</span>
                    </div>
                  )}
                </div>

                {/* 查看原文件按钮 */}
                {resume.resumeFile && (
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <button
                      onClick={handlePreview}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye size={16} />
                      查看原文件
                    </button>
                  </div>
                )}
              </div>

              {/* 元信息 */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FileText size={14} />
                  <span>{resume.originalFileName}</span>
                  <span className="text-gray-400">({formatFileSize(resume.fileSize)})</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>上传于 {formatDate(resume.createdAt)}</span>
                </div>
              </div>

              {/* 简历完整内容 */}
              {resume.parsedContent && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">简历内容</h3>
                  <div className="text-gray-700 whitespace-pre-wrap text-sm leading-7">
                    {resume.parsedContent}
                  </div>
                </div>
              )}

              {/* 摘要（备用显示） */}
              {resume.summary && !resume.parsedContent && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">AI 解析摘要</h3>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-7">
                    {resume.summary}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">无法加载简历详情</p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
