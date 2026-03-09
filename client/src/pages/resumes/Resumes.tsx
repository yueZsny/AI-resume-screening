import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, FileText, Trash2, X, Loader2, Eye, File, ExternalLink } from 'lucide-react';
import { getResumes, uploadResume, deleteResume, getResume } from '../../api/resume';
import type { Resume } from '../../types/resume';
import { formatFileSize, formatDate } from '../../utils/format';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../../components/Drawer';
import { Modal } from '../../components/Modal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewResume, setViewResume] = useState<Resume | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<{ url: string; fileName: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载简历列表
  const loadResumes = async () => {
    setLoading(true);
    try {
      const data = await getResumes();
      setResumes(data);
    } catch (error) {
      console.error('加载简历失败:', error);
      toast.error('加载简历失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!validTypes.includes(file.type)) {
        toast.error('只支持 PDF、Word 文档');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('文件大小不能超过 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // 上传简历
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('请选择文件');
      return;
    }

    setUploading(true);
    try {
      await uploadResume({
        file: selectedFile,
        name: selectedFile.name.replace(/\.(pdf|docx|doc)$/i, ''),
      });
      toast.success('上传成功');
      setShowModal(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      loadResumes();
    } catch (error) {
      console.error('上传失败:', error);
      toast.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 删除简历
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这份简历吗？')) return;
    
    try {
      await deleteResume(id);
      toast.success('删除成功');
      loadResumes();
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  };

  // 查看简历详情
  const handleView = async (id: number) => {
    setViewLoading(true);
    try {
      const data = await getResume(id);
      setViewResume(data);
    } catch (error) {
      console.error('获取简历详情失败:', error);
      toast.error('获取简历详情失败');
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">简历管理</h1>
      <p className="mt-2 text-gray-600">管理所有投递的简历</p>
      
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">简历列表</h2>
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Upload size={18} />
              上传简历
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">暂无简历数据</p>
          </div>
        ) : (
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
                <button
                  aria-label="查看简历"
                  onClick={() => handleView(resume.id)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye size={18} />
                </button>
                <button
                  aria-label="删除简历"
                  onClick={() => handleDelete(resume.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 上传弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">上传简历</h3>
              <button
                aria-label="关闭弹窗"
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
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
                  onChange={handleFileChange}
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
                  setShowModal(false);
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading && <Loader2 className="animate-spin" size={18} />}
                {uploading ? '上传中...' : '上传'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 查看简历详情抽屉 */}
      <Drawer open={!!viewResume} onOpenChange={(open) => !open && setViewResume(null)}>
        <DrawerContent className="w-full max-w-2xl">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-xl">简历详情</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto py-6">
            {viewLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : viewResume ? (
              <div className="px-6 space-y-6">
                {/* 头部信息区域 */}
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{viewResume.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {viewResume.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium text-gray-500">电话:</span>
                        <span>{viewResume.phone}</span>
                      </div>
                    )}
                    {viewResume.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium text-gray-500">邮箱:</span>
                        <span className="truncate">{viewResume.email}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 查看原文件按钮 */}
                  {viewResume.resumeFile && (
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <button
                        onClick={() => {
                          // 从完整路径中提取相对路径 (uploads/resumes/xxx.pdf)
                          const fullPath = viewResume.resumeFile || '';
                          const relativePath = fullPath.replace(/^.*[\\/]uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
                          const fileUrl = `${API_BASE_URL}/${relativePath}`;
                          setPdfPreview({ url: fileUrl, fileName: viewResume.originalFileName || '简历' });
                        }}
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
                    <File size={14} />
                    <span>{viewResume.originalFileName}</span>
                    <span className="text-gray-400">({formatFileSize(viewResume.fileSize)})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>上传于 {formatDate(viewResume.createdAt)}</span>
                  </div>
                </div>

                {/* 简历完整内容 */}
                {viewResume.parsedContent && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">简历内容</h3>
                    <div className="text-gray-700 whitespace-pre-wrap text-sm leading-7">
                      {viewResume.parsedContent}
                    </div>
                  </div>
                )}

                {/* 摘要（备用显示） */}
                {viewResume.summary && !viewResume.parsedContent && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">AI 解析摘要</h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-7">
                      {viewResume.summary}
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

      {/* PDF 预览模态框 */}
      <Modal
        isOpen={!!pdfPreview}
        onClose={() => setPdfPreview(null)}
        title={pdfPreview?.fileName}
        size="xl"
      >
        <div className="h-[70vh]">
          <iframe
            src={pdfPreview?.url}
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        </div>
        {pdfPreview && (
          <div className="mt-4 flex justify-center">
            <a
              href={pdfPreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={16} />
              在新窗口打开
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
