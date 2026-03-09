import { useState } from "react";
import { EmailTemplateList } from "../../components/emails/EmailTemplateList";
import { EmailSender } from "../../components/emails/EmailSender";
import { Send, Mail } from "lucide-react";

export default function EmailTemplates() {
  const [activeTab, setActiveTab] = useState<"templates" | "send">("templates");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">邮件群发</h1>
      <p className="mt-2 text-gray-600">管理邮件模板并群发邮件给候选人</p>

      {/* 标签页切换 */}
      <div className="mt-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("templates")}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
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
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
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

      {/* 内容区域 */}
      <div className="mt-6">
        {activeTab === "templates" && <EmailTemplateList />}
        {activeTab === "send" && <EmailSender />}
      </div>
    </div>
  );
}
