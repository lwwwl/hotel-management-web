import { useState } from 'react';
import { Task } from '../types';
import TaskHeader from '../features/task/TaskHeader';
import KanbanBoard from '../features/task/KanbanBoard';
import CreateTaskModal from '../features/task/modals/CreateTaskModal';
import TaskDetailModal from '../features/task/modals/TaskDetailModal';
import SLAMonitorModal from '../features/task/modals/SLAMonitorModal';

export default function TaskPage() {
  // 状态管理
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showSLAModal, setShowSLAModal] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [filters, setFilters] = useState({
    department: '',
    priority: ''
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* 工单页面头部 */}
      <TaskHeader 
        filters={filters}
        onFilterChange={setFilters}
        onCreateTask={() => setShowCreateTaskModal(true)}
        onOpenSLAMonitor={() => setShowSLAModal(true)}
      />
      
      {/* 看板区域 */}
      <KanbanBoard 
        filters={filters}
        onTaskClick={(task) => {
          setSelectedTask(task);
          setShowTaskDetail(true);
        }}
      />
      
      {/* 模态框组件 */}
      {showCreateTaskModal && (
        <CreateTaskModal onClose={() => setShowCreateTaskModal(false)} />
      )}
      
      {showSLAModal && (
        <SLAMonitorModal onClose={() => setShowSLAModal(false)} />
      )}
      
      {showTaskDetail && selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => {
            setShowTaskDetail(false);
            setSelectedTask(null);
          }} 
        />
      )}
    </div>
  );
} 