import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Upload, Mail } from 'lucide-react';
import { getResumes, uploadResume, deleteResume, getResume, importResumesFromEmail } from '../../api/resume';
import { getEmailConfigs } from '../../api/email';
import type { Resume } from '../../types/resume';
import type { EmailConfig } from '../../types/email';
import {
  ResumeList,
  ResumeUploadModal,
  ResumeDetailDrawer,
  PdfPreviewModal,
  EmailImportModal,
} from '../../components/resumes';

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewResume, setViewResume] = useState<Resume | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<{ url: string; fileName: string } | null>(null);

  // 从邮箱导入相关状态
  const [showImportModal, setShowImportModal] = useState(false);
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [loadingConfigs, setLoadingConfigs] = useState(false);

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

  // 加载邮箱配置列表
  const loadEmailConfigs = async () => {
    setLoadingConfigs(true);
    try {
      const data = await getEmailConfigs();
      setEmailConfigs(data);
      // 默认选择第一个配置
      if (data.length > 0) {
        setSelectedConfigId(data[0].id);
      }
    } catch (error) {
      console.error('加载邮箱配置失败:', error);
      toast.error('加载邮箱配置失败');
    } finally {
      setLoadingConfigs(false);
    }
  };

  // 打开导入弹窗
  const handleOpenImportModal = async () => {
    setShowImportModal(true);
    await loadEmailConfigs();
  };

  // 从邮箱导入简历
  const handleImportFromEmail = async () => {
    if (!selectedConfigId) {
      toast.error('请选择邮箱配置');
      return;
    }

    setImporting(true);
    try {
      const result = await importResumesFromEmail({
        configId: selectedConfigId,
      });
      toast.success(`成功导入 ${result.imported} 份简历`);
      setShowImportModal(false);
      setSelectedConfigId(null);
      loadResumes();
    } catch (error) {
      console.error('从邮箱导入失败:', error);
      toast.error('从邮箱导入失败');
    } finally {
      setImporting(false);
    }
  };

  // 处理文件选择
  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }
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
            <div className="flex gap-3">
              <button
                onClick={handleOpenImportModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Mail size={18} />
                从邮箱导入
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Upload size={18} />
                上传简历
              </button>
            </div>
          </div>
        </div>

        <ResumeList
          resumes={resumes}
          loading={loading}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>

      {/* 上传弹窗 */}
      <ResumeUploadModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedFile(null);
        }}
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        uploading={uploading}
      />

      {/* 查看简历详情抽屉 */}
      <ResumeDetailDrawer
        resume={viewResume}
        loading={viewLoading}
        onOpenChange={(open) => !open && setViewResume(null)}
        onPreview={(url, fileName) => setPdfPreview({ url, fileName })}
      />

      {/* PDF 预览模态框 */}
      <PdfPreviewModal
        isOpen={!!pdfPreview}
        onClose={() => setPdfPreview(null)}
        url={pdfPreview?.url || null}
        fileName={pdfPreview?.fileName || null}
      />

      {/* 从邮箱导入弹窗 */}
      <EmailImportModal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setSelectedConfigId(null);
        }}
        emailConfigs={emailConfigs}
        loadingConfigs={loadingConfigs}
        selectedConfigId={selectedConfigId}
        onConfigChange={setSelectedConfigId}
        onImport={handleImportFromEmail}
        importing={importing}
      />
    </div>
  );
}
