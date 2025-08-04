import { useState, useEffect } from 'react';
import { taskApi, deptApi } from '../../../api';

interface CreateTaskModalProps {
  onClose: () => void;
  onSuccess?: () => void; // 成功回调，用于刷新列表
}

export default function CreateTaskModal({ onClose, onSuccess }: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [newTask, setNewTask] = useState({
    title: '',
    deptId: 0,
    roomId: 0,
    guestId: 0,
    conversationId: 0,
    deadlineTime: 0,
    priority: 'medium',
    description: ''
  });
  
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  
  // 获取部门列表
  useEffect(() => {
    deptApi.getDeptSelectList().then(deptList => {
      // 转换数据格式以匹配组件期望的类型
      const formattedDepts = deptList.map(dept => ({
        id: dept.deptId,
        name: dept.deptName
      }));
      setDepartments(formattedDepts);
      // 设置默认部门
      if (deptList.length > 0) {
        setNewTask(prev => ({...prev, deptId: deptList[0].deptId}));
      }
    }).catch(error => {
      console.error('获取部门列表失败:', error);
    });
  }, []);
  
  const handleInputChange = (field: string, value: string) => {
    setNewTask({
      ...newTask,
      [field]: value
    });
  };
  
  const handleCreateTask = async () => {
    // 表单验证
    if (!newTask.roomId || !newTask.title) {
      setError('请填写房间号和标题');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await taskApi.createTask({
        title: newTask.title,
        description: newTask.description,
        roomId: newTask.roomId,
        deptId: newTask.deptId,
        priority: newTask.priority,
      });
      
      if (response.statusCode === 200) {
        // 成功创建
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        setError(response.message || '创建工单失败');
      }
    } catch (err) {
      console.error('创建工单出错:', err);
      setError('创建工单失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-semibold mb-4">创建新工单</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">房间号</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={newTask.roomId}
                onChange={(e) => handleInputChange('roomId', e.target.value)}
                placeholder="如：301"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg" 
                value={newTask.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                disabled={loading}
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
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">部门</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg" 
              value={newTask.deptId}
              onChange={(e) => handleInputChange('deptId', e.target.value)}
              disabled={loading}
            >
              {departments.length === 0 ? (
                <option value="">加载中...</option>
              ) : (
                departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))
              )}
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
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
            disabled={loading}
          >
            取消
          </button>
          <button 
            className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleCreateTask}
            disabled={loading}
            data-testid="confirm-create-task"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </>
            ) : '创建'}
          </button>
        </div>
      </div>
    </div>
  );
} 