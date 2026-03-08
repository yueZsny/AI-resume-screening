export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
      <p className="mt-2 text-gray-600">欢迎使用 AI 简历筛选系统</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">简历总数</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">1,234</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">待筛选</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">56</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">匹配成功</div>
          <div className="mt-2 text-3xl font-bold text-green-600">128</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">面试邀请</div>
          <div className="mt-2 text-3xl font-bold text-purple-600">42</div>
        </div>
      </div>
    </div>
  );
}
