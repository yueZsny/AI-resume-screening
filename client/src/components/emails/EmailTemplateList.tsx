import { useState, useEffect } from "react";
import { Modal, ConfirmModal } from "../../components/Modal";
import { 
  getEmailTemplates, 
  createEmailTemplate, 
  updateEmailTemplate, 
  deleteEmailTemplate 
} from "../../api/email-template";
import type { EmailTemplate, CreateEmailTemplateData } from "../../types/email-template";
import { Plus, Edit, Trash2, Mail, FileText, Clock, ArrowRight } from "lucide-react";

interface EmailTemplateListProps {
  onRefresh?: () => void;
}

export function EmailTemplateList({ onRefresh }: EmailTemplateListProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  
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
    <div className="space-y-6">
      {/* 顶部标题区 */}
      <div className="flex items-center justify-between">
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
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all group overflow-hidden"
            >
              <div className="p-5 flex items-start gap-4">
                {/* 图标 */}
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                
                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{template.name}</h3>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Clock size={12} />
                      {template.subject.length > 20 ? template.subject.slice(0, 20) + '...' : template.subject}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {template.body}
                  </p>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openModal(template)}
                    className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="编辑"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ show: true, template })}
                    className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="删除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* 底部信息栏 */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail size={14} />
                    主题: {template.subject}
                  </span>
                </div>
                <button 
                  onClick={() => openModal(template)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                  使用此模板
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
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
              rows={10}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm font-mono bg-slate-50"
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
