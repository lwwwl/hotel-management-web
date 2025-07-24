interface SLAMonitorModalProps {
  onClose: () => void;
}

export default function SLAMonitorModal({ onClose }: SLAMonitorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4">
        <h3 className="text-lg font-semibold mb-4">SLA监控看板</h3>
        
        {/* SLA指标 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-800">按时完成率</h4>
            <p className="text-2xl font-bold text-green-600">92%</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800">平均响应时间</h4>
            <p className="text-2xl font-bold text-yellow-600">15分钟</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-red-800">逾期工单</h4>
            <p className="text-2xl font-bold text-red-600">3</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">今日完成</h4>
            <p className="text-2xl font-bold text-blue-600">18</p>
          </div>
        </div>

        {/* 逾期工单列表 */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">逾期工单</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <span className="font-medium text-red-800">301房 - 空调维修</span>
                <span className="text-sm text-red-600 ml-2">逾期2小时</span>
              </div>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg">催办</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <span className="font-medium text-red-800">205房 - 客房清洁</span>
                <span className="text-sm text-red-600 ml-2">逾期30分钟</span>
              </div>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg">催办</button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
} 