import { Task } from '../../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  count: number;
  badgeColor: 'yellow' | 'blue' | 'purple' | 'green' | 'red' | 'gray';
  onTaskClick: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: Task['status']) => void;
  nextStatus?: Task['status'];
  isCompleted?: boolean;
}

export default function KanbanColumn({ 
  title,
  status,
  tasks,
  count,
  badgeColor,
  onTaskClick,
  onStatusChange,
  nextStatus,
  isCompleted = false
}: KanbanColumnProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span className={`px-2 py-1 text-xs bg-${badgeColor}-100 text-${badgeColor}-800 rounded-full`}>
            {count}
          </span>
        </div>
      </div>
      <div className="p-4 kanban-scroll overflow-y-auto" style={{height: 'calc(100vh - 250px)'}}>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard 
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
                onStatusChange={onStatusChange}
                nextStatus={nextStatus}
                isCompleted={isCompleted}
              />
            ))
          ) : (
            <div className="text-center p-4 text-gray-400">
              暂无任务
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 