interface ChatQueueTabsProps {
  activeQueue: 'mine' | 'unassigned';
  onChangeQueue: (queue: 'mine' | 'unassigned') => void;
  mineCount: number;
  unassignedCount: number;
}

export default function ChatQueueTabs({ 
  activeQueue, 
  onChangeQueue,
  mineCount,
  unassignedCount 
}: ChatQueueTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        <button 
          className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
            activeQueue === 'mine' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChangeQueue('mine')}
        >
          我处理的
          <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{mineCount}</span>
        </button>
        <button 
          className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
            activeQueue === 'unassigned' ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChangeQueue('unassigned')}
        >
          待分配
          <span className="ml-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">{unassignedCount}</span>
        </button>
      </div>
    </div>
  );
} 