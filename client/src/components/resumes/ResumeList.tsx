import { Loader2, FileText, Eye, Trash2 } from 'lucide-react';
import type { Resume } from '../../types/resume';
import { formatFileSize, formatDate } from '../../utils/format';

interface ResumeListProps {
  resumes: Resume[];
  loading: boolean;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ResumeList({ resumes, loading, onView, onDelete }: ResumeListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500 text-center py-8">暂无简历数据</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {resumes.map((resume) => (
        <div key={resume.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{resume.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                {resume.email && <span>{resume.email}</span>}
                {resume.phone && <span>{resume.phone}</span>}
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                  {resume.fileType?.toUpperCase()}
                </span>
                <span>{formatFileSize(resume.fileSize)}</span>
                <span>{formatDate(resume.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="查看简历"
              onClick={() => onView(resume.id)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye size={18} />
            </button>
            <button
              aria-label="删除简历"
              onClick={() => onDelete(resume.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
