import { Task } from '../../types';

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  count: number;
  badgeColor: string;
  isCompleted?: boolean;
  onTaskClick: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: Task['status']) => void;
  nextStatus?: Task['status'];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  count, 
  badgeColor, 
  isCompleted, 
  onTaskClick, 
  onStatusChange,
  nextStatus,
  loading,
  hasMore,
  onLoadMore
}: KanbanColumnProps) {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className={`ml-2 px-2 py-1 text-xs rounded-full bg-${badgeColor}-100 text-${badgeColor}-800`}>
            {count}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {tasks.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            {loading ? '加载中...' : '没有任务'}
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div 
                key={task.id}
                className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => onTaskClick(task)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{task.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${task.priority === 'high' || task.priority === 'urgent' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-100`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <span>房间: {task.roomNumber}</span>
                  <span>{task.createdAt}</span>
                </div>
                
                {!isCompleted && onStatusChange && nextStatus && (
                  <button 
                    className="mt-2 w-full py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(task, nextStatus);
                    }}
                  >
                    移动到 {nextStatus === 'in_progress' ? '进行中' : nextStatus === 'review' ? '待确认' : '已完成'}
                  </button>
                )}
              </div>
            ))}
            
            {hasMore && (
              <div className="text-center py-2">
                <button 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
                  onClick={onLoadMore}
                  disabled={loading}
                >
                  {loading ? '加载中...' : '加载更多'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 