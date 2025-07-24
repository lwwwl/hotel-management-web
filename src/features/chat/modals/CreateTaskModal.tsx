import { useState } from 'react';
import { Chat, TaskForm } from '../../../types';

interface CreateTaskModalProps {
  chat: Chat;
  onClose: () => void;
}

export default function CreateTaskModal({ chat, onClose }: CreateTaskModalProps) {
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: '',
    department: '',
    priority: 'medium',
    description: '',
  });

  const handleCreateTask = () => {
    if (!taskForm.title || !taskForm.department) {
      alert('请填写标题和部门');
      return;
    }

    alert('工单创建成功！');
    onClose();
  };

  const handleInputChange = (field: keyof TaskForm, value: string) => {
    setTaskForm({
      ...taskForm,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">生成工单</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">房间号</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={chat.roomNumber}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">工单标题</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={taskForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="AI自动生成或手动输入"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分配部门</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg" 
              value={taskForm.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
            >
              <option value="">请选择</option>
              <option value="housekeeping">客房部</option>
              <option value="maintenance">维修部</option>
              <option value="food">餐饮部</option>
              <option value="concierge">礼宾部</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={taskForm.priority}
              onChange={(e) => handleInputChange('priority', e.target.value as TaskForm['priority'])}
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="urgent">紧急</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
              value={taskForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="AI根据对话内容自动生成"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            取消
          </button>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={handleCreateTask}
            data-testid="confirm-create-task"
          >
            创建工单
          </button>
        </div>
      </div>
    </div>
  );
} 