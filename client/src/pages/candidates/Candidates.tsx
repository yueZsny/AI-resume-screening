export default function Candidates() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">候选人</h1>
      <p className="mt-2 text-gray-600">查看和管理通过筛选的候选人</p>
      
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">候选人列表</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">暂无候选人数据</p>
        </div>
      </div>
    </div>
  );
}
