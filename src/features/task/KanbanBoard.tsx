import { Task } from '../../types';
import KanbanColumn from './KanbanColumn';
import { useTasks } from '../../hooks/useTasks';

interface KanbanBoardProps {
  filters: {
    department: string;
    priority: string;
  };
  onTaskClick: (task: Task) => void;
}

export default function KanbanBoard({ filters, onTaskClick }: KanbanBoardProps) {
  const { getColumnTasks, getColumnCount, updateTaskStatus, loading, hasMore, loadMore } = useTasks(filters);
  
  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-4 gap-6 h-full">
        {/* 待处理列 */}
        <KanbanColumn 
          title="待处理" 
          status="pending"
          tasks={getColumnTasks('pending')}
          count={getColumnCount('pending')}
          badgeColor="yellow"
          onTaskClick={onTaskClick}
          onStatusChange={(task, newStatus) => updateTaskStatus(task, newStatus)}
          nextStatus="in_progress"
          loading={loading}
          hasMore={hasMore['pending']}
          onLoadMore={() => loadMore('pending')}
        />
        
        {/* 进行中列 */}
        <KanbanColumn 
          title="进行中" 
          status="in_progress"
          tasks={getColumnTasks('in_progress')}
          count={getColumnCount('in_progress')}
          badgeColor="blue"
          onTaskClick={onTaskClick}
          onStatusChange={(task, newStatus) => updateTaskStatus(task, newStatus)}
          nextStatus="review"
          loading={loading}
          hasMore={hasMore['in_progress']}
          onLoadMore={() => loadMore('in_progress')}
        />
        
        {/* 待确认列 */}
        <KanbanColumn 
          title="待确认" 
          status="review"
          tasks={getColumnTasks('review')}
          count={getColumnCount('review')}
          badgeColor="purple"
          onTaskClick={onTaskClick}
          onStatusChange={(task, newStatus) => updateTaskStatus(task, newStatus)}
          nextStatus="completed"
          loading={loading}
          hasMore={hasMore['review']}
          onLoadMore={() => loadMore('review')}
        />
        
        {/* 已完成列 */}
        <KanbanColumn 
          title="已完成" 
          status="completed"
          tasks={getColumnTasks('completed')}
          count={getColumnCount('completed')}
          badgeColor="green"
          onTaskClick={onTaskClick}
          isCompleted
          loading={loading}
          hasMore={hasMore['completed']}
          onLoadMore={() => loadMore('completed')}
        />
      </div>
    </div>
  );
} 