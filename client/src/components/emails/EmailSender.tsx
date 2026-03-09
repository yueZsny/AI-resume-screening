import { useState, useEffect } from "react";
import { Send, Mail } from "lucide-react";
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

export function EmailSender({ onRefresh }: EmailSenderProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 发送表单状态
  const [sendForm, setSendForm] = useState({
    templateId: 0,
    candidateIds: [] as number[],
    subject: "",
    body: "",
    fromEmailId: 0,
  });
  const [sending, setSending] = useState(false);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesData, configsData, recipientsData] = await Promise.all([
        getEmailTemplates(),
        getEmailConfigs(),
        getEmailRecipients(),
      ]);
      setTemplates(templatesData);
      setEmailConfigs(configsData);
      setRecipients(recipientsData);
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
    { key: "{{position}}", desc: "应聘职位" },
  ];

  if (loading) {
    return <div className="text-center text-gray-500 py-8">加载中...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左侧：邮件内容 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">邮件内容</h2>
        
        <div className="space-y-4">
          {/* 选择模板 */}
          <div>
            <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-1">
              选择模板（可选）
            </label>
            <select
              id="template-select"
              value={sendForm.templateId}
              onChange={(e) => handleSelectTemplate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>-- 选择模板 --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* 邮件主题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮件主题
            </label>
            <input
              type="text"
              value={sendForm.subject}
              onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入邮件主题"
            />
          </div>

          {/* 邮件正文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮件正文
            </label>
            <textarea
              value={sendForm.body}
              onChange={(e) => setSendForm({ ...sendForm, body: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="请输入邮件内容，支持变量替换"
            />
          </div>

          {/* 变量提示 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">可用变量：</p>
            <div className="flex flex-wrap gap-2">
              {variables.map((v) => (
                <span
                  key={v.key}
                  className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600 cursor-pointer hover:bg-blue-50 hover:border-blue-200"
                  onClick={() => setSendForm(prev => ({ ...prev, body: prev.body + v.key }))}
                  title="点击插入"
                >
                  {v.key} ({v.desc})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：收件人和发件设置 */}
      <div className="space-y-6">
        {/* 发件设置 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">发件设置</h2>
          
          <div className="space-y-4">
            {/* 选择发件邮箱 */}
            <div>
              <label htmlFor="from-email-select" className="block text-sm font-medium text-gray-700 mb-1">
                发件邮箱
              </label>
              <select
                id="from-email-select"
                value={sendForm.fromEmailId}
                onChange={(e) => setSendForm({ ...sendForm, fromEmailId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={0}>-- 选择发件邮箱 --</option>
                {emailConfigs.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.email} {config.isDefault && "(默认)"}
                  </option>
                ))}
              </select>
              {emailConfigs.length === 0 && (
                <p className="mt-1 text-xs text-yellow-600">
                  暂无邮箱配置，请先在设置中添加邮箱
                </p>
              )}
            </div>

            {/* 收件人选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收件人
              </label>
              <div className="border border-gray-300 rounded-lg p-4 min-h-[120px] bg-gray-50">
                {recipients.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">
                    暂无收件人数据
                  </p>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                      <span>当前已选择: {sendForm.candidateIds.length} 人</span>
                      <button
                        type="button"
                        className="text-blue-600 hover:underline text-xs"
                        onClick={() =>
                          setSendForm(prev => ({
                            ...prev,
                            candidateIds:
                              prev.candidateIds.length === recipients.length
                                ? []
                                : recipients.map(r => r.id),
                          }))
                        }
                      >
                        {sendForm.candidateIds.length === recipients.length ? "清空" : "全选"}
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {recipients.map(r => {
                        const checked = sendForm.candidateIds.includes(r.id);
                        return (
                          <label
                            key={r.id}
                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4"
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
                            <span className="text-sm text-gray-900">
                              {r.username || r.email}
                            </span>
                            <span className="text-xs text-gray-500">({r.email})</span>
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 发送按钮 */}
            <button
              onClick={handleSend}
              disabled={sending || emailConfigs.length === 0}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  发送邮件
                </>
              )}
            </button>
          </div>
        </div>

        {/* 发送预览 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">预览</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">主题：</span>
              <span className="text-sm font-medium text-gray-900">{sendForm.subject || "（未填写）"}</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {sendForm.body || "（未填写）"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
