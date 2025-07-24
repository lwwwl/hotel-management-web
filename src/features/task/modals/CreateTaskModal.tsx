import { useState } from 'react';
import { Task } from '../../../types';
import { useTasks } from '../../../hooks/useTasks';

interface CreateTaskModalProps {
  onClose: () => void;
}

export default function CreateTaskModal({ onClose }: CreateTaskModalProps) {
  const { createNewTask } = useTasks({ department: '', priority: '' });
  
  const [newTask, setNewTask] = useState({
    roomNumber: '',
    title: '',
    department: 'housekeeping',
    priority: 'medium' as const,
    description: ''
  });
  
  const handleInputChange = (field: string, value: string) => {
    setNewTask({
      ...newTask,
      [field]: value
    });
  };
  
  const handleCreateTask = () => {
    if (!newTask.roomNumber || !newTask.title) {
      alert('请填写房间号和标题');
      return;
    }
    
    createNewTask({
      roomNumber: newTask.roomNumber,
      title: newTask.title,
      description: newTask.description,
      department: newTask.department,
      priority: newTask.priority as Task['priority'],
    });
    
    alert('工单创建成功！');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-semibold mb-4">创建新工单</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">房间号</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={newTask.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                placeholder="如：301"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg" 
                value={newTask.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newTask.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="工单标题"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">部门</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg" 
              value={newTask.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
            >
              <option value="housekeeping">客房部</option>
              <option value="maintenance">维修部</option>
              <option value="food">餐饮部</option>
              <option value="concierge">礼宾部</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
              value={newTask.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="详细描述工单内容"
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
            创建
          </button>
        </div>
      </div>
    </div>
  );
} 