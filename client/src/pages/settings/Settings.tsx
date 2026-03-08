export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">设置</h1>
      <p className="mt-2 text-gray-600">系统配置和个性化设置</p>
      
      <div className="mt-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900">账户设置</h2>
          <p className="mt-2 text-gray-500">管理您的账户信息</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900">通知设置</h2>
          <p className="mt-2 text-gray-500">配置系统通知偏好</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900">AI 配置</h2>
          <p className="mt-2 text-gray-500">调整 AI 筛选参数</p>
        </div>
      </div>
    </div>
  );
}
