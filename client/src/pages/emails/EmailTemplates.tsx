import { useState } from "react";
import { EmailTemplateList } from "../../components/emails/EmailTemplateList";
import { EmailSender } from "../../components/emails/EmailSender";
import { Send, Mail } from "lucide-react";

export default function EmailTemplates() {
  const [activeTab, setActiveTab] = useState<"templates" | "send">("templates");
  const [initialTemplateId, setInitialTemplateId] = useState<number | null>(null);

  const handleUseTemplate = (template: { id: number }) => {
    setInitialTemplateId(template.id);
    setActiveTab("send");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] min-h-0">
      {/* 标签页切换 */}
      <div className="shrink-0 flex gap-4 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-1 text-sm font-medium transition-colors ${
            activeTab === "templates"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            邮件模板
          </span>
        </button>
        <button
          onClick={() => setActiveTab("send")}
          className={`px-1 text-sm font-medium transition-colors ${
            activeTab === "send"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            发送邮件
          </span>
        </button>
      </div>

      {/* 内容区域：占满剩余高度，内部自行滚动 */}
      <div className="flex-1 min-h-0 overflow-hidden mt-4">
        {activeTab === "templates" && (
          <EmailTemplateList onUseTemplate={handleUseTemplate} />
        )}
        {activeTab === "send" && (
          <EmailSender initialTemplateId={initialTemplateId} onInitialTemplateApplied={() => setInitialTemplateId(null)} />
        )}
      </div>
    </div>
  );
}
