import { useState, useEffect } from "react";
import { Send, Mail, Phone, Search, Filter, User, FileText, Check, X, MailOpen, Settings, Eye } from "lucide-react";
import { 
  getEmailTemplates, 
  sendEmails,
  getEmailRecipients 
} from "../../api/email-template";
import { getEmailConfigs } from "../../api/email";
import type { EmailTemplate, EmailRecipient } from "../../types/email-template";
import type { EmailConfig } from "../../types/email";

interface EmailSenderProps {
  onRefresh?: () => void;
}

// 状态颜色映射
const statusColors = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  passed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-700 border-rose-200',
};

const statusLabels = {
  pending: '待筛选',
  passed: '已通过',
  rejected: '已拒绝',
};

export function EmailSender({ onRefresh }: EmailSenderProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 收件人筛选状态
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'passed' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // 发送表单状态
  const [sendForm, setSendForm] = useState({
    templateId: 0,
    candidateIds: [] as number[],
    subject: "",
    body: "",
    fromEmailId: 0,
  });
  const [sending, setSending] = useState(false);

  // 加载收件人列表
  const loadRecipients = async (status?: 'pending' | 'passed' | 'rejected') => {
    try {
      const data = await getEmailRecipients(status);
      setRecipients(data);
    } catch (error) {
      console.error("加载收件人失败:", error);
    }
  };

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesData, configsData] = await Promise.all([
        getEmailTemplates(),
        getEmailConfigs(),
      ]);
      setTemplates(templatesData);
      setEmailConfigs(configsData);
      // 加载收件人列表（默认全部）
      await loadRecipients();
      // 设置默认发件邮箱
      const defaultConfig = configsData.find(c => c.isDefault) || configsData[0];
      if (defaultConfig) {
        setSendForm(prev => ({ ...prev, fromEmailId: defaultConfig.id }));
      }
    } catch (error) {
      console.error("加载数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 筛选收件人
  const filteredRecipients = recipients.filter(r => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(query) ||
        r.email?.toLowerCase().includes(query) ||
        r.phone?.includes(query)
      );
    }
    return true;
  });

  // 统计各状态数量
  const stats = {
    all: recipients.length,
    pending: recipients.filter(r => r.status === 'pending').length,
    passed: recipients.filter(r => r.status === 'passed').length,
    rejected: recipients.filter(r => r.status === 'rejected').length,
  };

  // 切换状态筛选
  const handleStatusFilter = async (status: 'all' | 'pending' | 'passed' | 'rejected') => {
    setStatusFilter(status);
    if (status === 'all') {
      await loadRecipients();
    } else {
      await loadRecipients(status);
    }
  };

  // 选择模板时填充表单
  const handleSelectTemplate = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSendForm(prev => ({
        ...prev,
        templateId: template.id,
        subject: template.subject,
        body: template.body,
      }));
    }
  };

  // 发送邮件
  const handleSend = async () => {
    if (!sendForm.fromEmailId) {
      alert("请选择发件邮箱");
      return;
    }
    if (!sendForm.subject || !sendForm.body) {
      alert("请填写邮件主题和内容");
      return;
    }
    if (sendForm.candidateIds.length === 0) {
      alert("请选择收件人");
      return;
    }
    
    setSending(true);
    try {
      const result = await sendEmails({
        templateId: sendForm.templateId || undefined,
        candidateIds: sendForm.candidateIds,
        subject: sendForm.subject,
        body: sendForm.body,
        fromEmailId: sendForm.fromEmailId,
      });
      alert(result.message);
      // 重置表单
      setSendForm(prev => ({
        ...prev,
        candidateIds: [],
        subject: "",
        body: "",
      }));
      onRefresh?.();
    } catch (error) {
      console.error("发送邮件失败:", error);
      alert(error instanceof Error ? error.message : "发送失败");
    } finally {
      setSending(false);
    }
  };

  // 邮件变量
  const variables = [
    { key: "{{name}}", desc: "候选人姓名" },
    { key: "{{email}}", desc: "候选人邮箱" },
    { key: "{{phone}}", desc: "候选人电话" },
    { key: "{{status}}", desc: "简历状态" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm text-slate-500">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'all', label: '全部简历', icon: FileText, color: 'bg-slate-100 text-slate-600' },
          { key: 'pending', label: '待筛选', icon: MailOpen, color: 'bg-amber-100 text-amber-600' },
          { key: 'passed', label: '已通过', icon: Check, color: 'bg-emerald-100 text-emerald-600' },
          { key: 'rejected', label: '已拒绝', icon: X, color: 'bg-rose-100 text-rose-600' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleStatusFilter(item.key as 'all' | 'pending' | 'passed' | 'rejected')}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats[item.key as keyof typeof stats]}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 左侧：邮件内容编辑 */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* 头部 */}
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">编辑邮件</h2>
                <p className="text-sm text-slate-500">填写邮件内容和收件人</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* 选择模板 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                选择模板（可选）
              </label>
              <select
                value={sendForm.templateId}
                onChange={(e) => handleSelectTemplate(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
              >
                <option value={0}>-- 选择模板 --</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 发件邮箱 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                发件邮箱 <span className="text-rose-500">*</span>
              </label>
              <select
                value={sendForm.fromEmailId}
                onChange={(e) => setSendForm({ ...sendForm, fromEmailId: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                required
              >
                <option value={0}>-- 选择发件邮箱 --</option>
                {emailConfigs.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.email} {config.isDefault && "⭐"}
                  </option>
                ))}
              </select>
              {emailConfigs.length === 0 && (
                <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <Settings size={12} />
                  暂无邮箱配置，请先在设置中添加邮箱
                </p>
              )}
            </div>

            {/* 邮件主题 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                邮件主题 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={sendForm.subject}
                onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="请输入邮件主题"
              />
            </div>

            {/* 邮件正文 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                邮件正文 <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={sendForm.body}
                onChange={(e) => setSendForm({ ...sendForm, body: e.target.value })}
                rows={8}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm font-mono"
                placeholder="请输入邮件内容，支持变量替换"
              />
            </div>

            {/* 变量提示 */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">可用变量</span>
                <span className="text-xs text-slate-400">点击插入</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {variables.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                    onClick={() => setSendForm(prev => ({ ...prev, body: prev.body + v.key }))}
                  >
                    {v.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：收件人选择 */}
        <div className="xl:col-span-5 space-y-6">
          {/* 收件人选择卡片 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">选择收件人</h2>
                    <p className="text-sm text-slate-500">
                      已选: <span className="font-medium text-emerald-600">{sendForm.candidateIds.length}</span> 人
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="搜索姓名、邮箱或电话..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-slate-50"
                />
              </div>

              {/* 状态筛选 */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={14} className="text-slate-400" />
                {(['all', 'pending', 'passed', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      statusFilter === status
                        ? status === 'all' 
                          ? 'bg-slate-800 text-white shadow-md'
                          : statusColors[status as keyof typeof statusColors] + ' shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'all' ? '全部' : statusLabels[status as keyof typeof statusLabels]}
                    <span className="ml-1.5 text-[10px] opacity-70">
                      ({status === 'all' ? stats.all : stats[status as keyof typeof stats]})
                    </span>
                  </button>
                ))}
              </div>

              {/* 收件人列表 */}
              <div className="border border-slate-200 rounded-xl bg-slate-50 min-h-[200px] max-h-[320px] overflow-hidden">
                {filteredRecipients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <User className="text-slate-300 mb-3" size={40} />
                    <p className="text-sm text-slate-500 font-medium">
                      {searchQuery ? '没有匹配的收件人' : '暂无收件人数据'}
                    </p>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto p-2 space-y-1">
                    {/* 全选按钮 */}
                    <div className="sticky top-0 bg-slate-50 pb-2 border-b border-slate-200 mb-2 px-2">
                      <button
                        type="button"
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        onClick={() =>
                          setSendForm(prev => ({
                            ...prev,
                            candidateIds:
                              prev.candidateIds.length === filteredRecipients.length
                                ? []
                                : filteredRecipients.map(r => r.id),
                          }))
                        }
                      >
                        <Check size={14} />
                        {sendForm.candidateIds.length === filteredRecipients.length ? "清空全部" : "选择全部"}
                      </button>
                    </div>
                    {filteredRecipients.map(r => {
                      const checked = sendForm.candidateIds.includes(r.id);
                      return (
                        <label
                          key={r.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                            checked ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-white border border-transparent'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                            checked 
                              ? 'bg-indigo-600 border-indigo-600' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {checked && <Check className="text-white" size={12} />}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() => {
                              setSendForm(prev => ({
                                ...prev,
                                candidateIds: checked
                                  ? prev.candidateIds.filter(x => x !== r.id)
                                  : [...prev.candidateIds, r.id],
                              }));
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900 truncate">
                                {r.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[r.status]}`}>
                                {statusLabels[r.status]}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              {r.email && (
                                <span className="flex items-center gap-1 truncate max-w-[160px]">
                                  <Mail size={10} /> {r.email}
                                </span>
                              )}
                              {r.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone size={10} /> {r.phone}
                                </span>
                              )}
                            </div>
                          </div>
                          {r.resumeFile && (
                            <FileText size={14} className="text-slate-400 flex-shrink-0" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 py-3.5 bg-white text-slate-700 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Eye size={18} />
              {showPreview ? '隐藏预览' : '预览邮件'}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || emailConfigs.length === 0 || sendForm.candidateIds.length === 0}
              className="flex-[2] py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium shadow-lg shadow-indigo-200"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Send size={18} />
                  发送给 {sendForm.candidateIds.length} 位收件人
                </>
              )}
            </button>
          </div>

          {/* 预览区域 */}
          {showPreview && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">邮件预览</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200">
                    <span className="text-sm text-slate-500">主题：</span>
                    <span className="text-sm font-semibold text-slate-900">{sendForm.subject || "（未填写）"}</span>
                  </div>
                  <div className="min-h-[80px]">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {sendForm.body || "（未填写）"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
