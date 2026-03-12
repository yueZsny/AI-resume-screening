import { useState, useEffect } from "react";
import { Modal, ConfirmModal } from "../../components/Modal";
import { 
  getEmailTemplates, 
  createEmailTemplate, 
  updateEmailTemplate, 
  deleteEmailTemplate 
} from "../../api/email-template";
import type { EmailTemplate, CreateEmailTemplateData } from "../../types/email-template";
import { Plus, Edit, Trash2, FileText, Mail, ChevronLeft, ChevronRight, Send } from "lucide-react";

const PAGE_SIZE = 6;

interface EmailTemplateListProps {
  onRefresh?: () => void;
  onUseTemplate?: (template: EmailTemplate) => void;
}

export function EmailTemplateList({ onRefresh, onUseTemplate }: EmailTemplateListProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // 模板弹窗状态
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState<CreateEmailTemplateData>({
    name: "",
    subject: "",
    body: "",
  });
  
  // 删除确认弹窗
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; template: EmailTemplate | null }>({
    show: false,
    template: null,
  });

  // 加载模板
  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await getEmailTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("加载模板失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // 默认选中第一个模板
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  // 分页
  const totalPages = Math.max(1, Math.ceil(templates.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTemplates = templates.slice(startIndex, startIndex + PAGE_SIZE);

  // 数据变少时若当前页超出范围，则回到最后一页
  useEffect(() => {
    if (templates.length > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [templates.length, totalPages, currentPage]);

  // 切换页时若当前选中项不在本页，则选中本页第一项
  useEffect(() => {
    if (templates.length === 0) return;
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageTemplates = templates.slice(start, start + PAGE_SIZE);
    if (pageTemplates.length > 0 && selectedTemplate) {
      const isOnCurrentPage = pageTemplates.some((t) => t.id === selectedTemplate.id);
      if (!isOnCurrentPage) {
        setSelectedTemplate(pageTemplates[0]);
      }
    }
  }, [currentPage]);

  // 打开弹窗
  const openModal = (template?: EmailTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: "",
        subject: "",
        body: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await updateEmailTemplate(editingTemplate.id, formData);
      } else {
        await createEmailTemplate(formData);
      }
      closeModal();
      loadTemplates();
      onRefresh?.();
    } catch (error) {
      console.error("保存模板失败:", error);
      alert(error instanceof Error ? error.message : "保存失败");
    }
  };

  // 删除模板
  const handleDelete = async () => {
    if (!deleteConfirm.template) return;
    try {
      await deleteEmailTemplate(deleteConfirm.template.id);
      setDeleteConfirm({ show: false, template: null });
      loadTemplates();
      onRefresh?.();
    } catch (error) {
      console.error("删除模板失败:", error);
      alert(error instanceof Error ? error.message : "删除失败");
    }
  };

  // 邮件变量
  const variables = [
    { key: "{{name}}", desc: "候选人姓名" },
    { key: "{{email}}", desc: "候选人邮箱" },
    { key: "{{phone}}", desc: "候选人电话" },
    { key: "{{position}}", desc: "应聘职位" },
  ];

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 顶部标题区 */}
      <div className="shrink-0 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">邮件模板</h2>
            <p className="text-sm text-slate-500">管理您的邮件模板，快速发送个性化邮件</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 font-medium shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          新建模板
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-sm text-slate-500">加载中...</span>
          </div>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">暂无邮件模板</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            创建您的第一个邮件模板，快速筛选候选人并发送通知
          </p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            创建第一个模板
          </button>
        </div>
      ) : (
        <>
        {/* 固定高度容器，左右各自内部滚动 */}
        <div className="flex-1 flex gap-6 min-h-0 mt-6">
          {/* 左侧：模板列表 + 分页 */}
          <div className="w-1/3 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {/* 列表区域：内部滚动 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {paginatedTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? "bg-indigo-50 border-indigo-300 shadow-md"
                      : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedTemplate?.id === template.id
                        ? "bg-indigo-500"
                        : "bg-gradient-to-br from-indigo-50 to-purple-50"
                    }`}>
                      <FileText className={`w-5 h-5 ${selectedTemplate?.id === template.id ? "text-white" : "text-indigo-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{template.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {template.createdAt ? new Date(template.createdAt).toLocaleDateString('zh-CN') : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页：固定在底部 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 shrink-0 bg-slate-50 rounded-b-2xl">
                <span className="text-sm text-slate-500">
                  共 {templates.length} 条，第 {currentPage}/{totalPages} 页
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="上一页"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="下一页"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：预览区域 */}
          <div className="flex-1 min-h-0">
            {selectedTemplate ? (
              <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* 预览头部：固定 */}
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">预览</h3>
                    <div className="flex items-center gap-2">
                      {onUseTemplate && (
                        <button
                          onClick={() => onUseTemplate(selectedTemplate)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                          title="去使用这个模板"
                        >
                          <Send className="w-4 h-4" />
                          去使用这个模板
                        </button>
                      )}
                      <button
                        onClick={() => openModal(selectedTemplate)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ show: true, template: selectedTemplate })}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 邮件内容预览：内部滚动 */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="mb-4">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">主题</label>
                    <p className="mt-1 text-slate-900 font-medium">{selectedTemplate.subject}</p>
                  </div>
                  <div className="min-h-0 flex flex-col">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">正文</label>
                    <div className="mt-2 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[320px]">
                      {selectedTemplate.body}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">点击左侧模板查看预览</p>
                </div>
              </div>
            )}
          </div>
        </div>
        </>
      )}

      {/* 模板编辑弹窗 */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingTemplate ? "编辑邮件模板" : "新建邮件模板"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              form="template-form"
              className="px-5 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-200"
            >
              保存模板
            </button>
          </>
        }
      >
        <form id="template-form" onSubmit={handleSubmit} className="space-y-5">
          {/* 模板名称 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              模板名称 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-slate-50"
              placeholder="例如：面试邀请模板"
              required
            />
          </div>
          
          {/* 邮件主题 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              邮件主题 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-slate-50"
              placeholder="例如：{{name}}，恭喜您通过初筛！"
              required
            />
          </div>
          
          {/* 邮件正文 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              邮件正文 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm font-mono bg-slate-50 max-h-[320px] overflow-y-auto"
              placeholder="尊敬的 {{name}} 您好：&#10;&#10;感谢您投递我们公司的 {{position}} 职位..."
              required
            />
          </div>
          
          {/* 变量提示 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">变量说明</span>
              <span className="text-xs text-slate-400">点击上方输入框使用</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {variables.map((v) => (
                <span
                  key={v.key}
                  className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs text-indigo-700 font-medium"
                >
                  {v.key}
                  <span className="text-slate-400 ml-1">- {v.desc}</span>
                </span>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, template: null })}
        onConfirm={handleDelete}
        title="删除模板"
        message={`确定要删除模板"${deleteConfirm.template?.name}"吗？此操作不可恢复。`}
        confirmText="删除"
        confirmVariant="danger"
      />
    </div>
  );
}

// 导出模板类型供外部使用
export type { EmailTemplate, CreateEmailTemplateData };
