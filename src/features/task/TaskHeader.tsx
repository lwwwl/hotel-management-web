import { useEffect, useState } from 'react';
import { deptApi, DeptSelectListItem } from '../../api';

interface TaskHeaderProps {
  filters: {
    department: string;
    priority: string;
  };
  onFilterChange: (filters: { department: string; priority: string }) => void;
  onCreateTask: () => void;
  onOpenSLAMonitor: () => void;
}

export default function TaskHeader({
  filters,
  onFilterChange,
  onCreateTask,
  onOpenSLAMonitor
}: TaskHeaderProps) {
  const [departments, setDepartments] = useState<DeptSelectListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取部门列表
  useEffect(() => {
    setLoading(true);
    deptApi.getDeptSelectList()
      .then(deptList => {
        setDepartments(deptList);
      })
      .catch(err => {
        console.error('获取部门列表失败:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 更新过滤器
  const updateFilter = (field: string, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">工单管理系统</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">系统正常</span>
              </div>
              <div className="text-sm text-gray-600">
                总工单: <span className="font-semibold text-blue-600">18</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 筛选器 */}
            <div className="flex items-center space-x-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                value={filters.department}
                onChange={(e) => updateFilter('department', e.target.value)}
                disabled={loading}
              >
                {departments.map(dept => (
                  <option key={dept.deptId} value={dept.deptId}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
              
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                value={filters.priority}
                onChange={(e) => updateFilter('priority', e.target.value)}
              >
                <option value="">所有优先级</option>
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
            </div>
            
            {/* 操作按钮 */}
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              onClick={onCreateTask}
              data-testid="create-task-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>新建工单</span>
            </button>
            
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={onOpenSLAMonitor}
              data-testid="sla-btn"
            >
              SLA监控
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 