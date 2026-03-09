import { EmailConfigList } from "../../components/setting/email";

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">设置</h1>
      <p className="mt-2 text-gray-600">管理您的账户和邮箱配置</p>

      <div className="mt-8">
        <EmailConfigList />
      </div>
    </div>
  );
}
