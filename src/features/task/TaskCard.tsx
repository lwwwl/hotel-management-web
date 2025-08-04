import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: Task['status']) => void;
  nextStatus?: Task['status'];
  isCompleted?: boolean;
}

export default function TaskCard({
  task,
  onTaskClick,
  onStatusChange,
  nextStatus,
  isCompleted = false
}: TaskCardProps) {
  // 获取优先级样式
  const getPriorityStyle = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 处理状态变更
  const handleStatusChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange && nextStatus) {
      onStatusChange(task, nextStatus);
    }
  };

  // 获取操作按钮
  const getActionButton = () => {
    if (isCompleted) {
      return (
        <span className="text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        </span>
      );
    }

    if (task.status === 'pending') {
      return (
        <button 
          className="text-gray-400 hover:text-blue-600"
          onClick={handleStatusChange}
          title="开始处理"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
      );
    }

    if (task.status === 'in_progress' || task.status === 'review') {
      return (
        <button 
          className="text-gray-400 hover:text-green-600"
          onClick={handleStatusChange}
          title={task.status === 'review' ? '确认完成' : '完成'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
      );
    }

    return null;
  };

  return (
    <div 
      className="task-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer" 
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-800">{task.roomId}</span>
          <span 
            className={`px-2 py-1 text-xs rounded-full ${getPriorityStyle(task.priority)}`}
          >
            {task.priorityDisplayName}
          </span>
        </div>
        {getActionButton()}
      </div>
      <h4 className="font-medium text-gray-800 mb-2">{task.title}</h4>
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{task.department}</span>
        <span>{task.createdAt}</span>
      </div>
    </div>
  );
} 