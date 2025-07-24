import { Task } from '../../../types';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-semibold mb-4">工单详情</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">房间号</label>
              <p className="text-lg font-semibold">{task.roomNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">优先级</label>
              <p className="text-lg font-semibold">{task.priority}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">标题</label>
            <p className="text-lg font-semibold">{task.title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">部门</label>
            <p className="text-lg font-semibold">{task.department}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">描述</label>
            <p className="text-gray-800">{task.description}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">创建时间</label>
            <p className="text-gray-800">{task.createdAt}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">当前状态</label>
            <p className="text-gray-800">{task.status}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
} 