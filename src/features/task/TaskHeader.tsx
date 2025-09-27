import { useEffect, useState } from 'react';
import { deptApi, DeptSelectListItem } from '../../api';
import { Select } from 'antd';

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
              <Select
                style={{ width: 180 }}
                placeholder="所有部门"
                value={filters.department || undefined}
                onChange={(value) => updateFilter('department', value)}
                loading={loading}
                allowClear
              >
                {departments.map(dept => (
                  <Select.Option key={dept.deptId} value={String(dept.deptId)}>
                    {dept.deptName}
                  </Select.Option>
                ))}
              </Select>
              
              <Select
                style={{ width: 180 }}
                placeholder="所有优先级"
                value={filters.priority || undefined}
                onChange={(value) => updateFilter('priority', value)}
                allowClear
              >
                <Select.Option value="">所有优先级</Select.Option>
                <Select.Option value="low">低</Select.Option>
                <Select.Option value="medium">中</Select.Option>
                <Select.Option value="high">高</Select.Option>
                <Select.Option value="urgent">紧急</Select.Option>
              </Select>
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