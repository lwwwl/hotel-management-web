import { Task } from '../../types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

// 配置dayjs
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

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
  tasks, 
  count, 
  badgeColor, 
  onTaskClick, 
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
                key={task.taskId}
                className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5"
                onClick={() => onTaskClick(task)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{task.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${task.priority === 'high' || task.priority === 'urgent' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-100`}>
                    {task.priorityDisplayName}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <span>房间: {task.roomId}</span>
                  <span>{task.createdAt ? dayjs(Number(task.createdAt)).fromNow() : ''}</span>
                </div>
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