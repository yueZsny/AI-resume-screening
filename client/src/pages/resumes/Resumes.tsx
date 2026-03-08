export default function Resumes() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">简历管理</h1>
      <p className="mt-2 text-gray-600">管理所有投递的简历</p>
      
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">简历列表</h2>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
              上传简历
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">暂无简历数据</p>
        </div>
      </div>
    </div>
  );
}
