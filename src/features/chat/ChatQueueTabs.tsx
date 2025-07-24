interface ChatQueueTabsProps {
  activeQueue: 'verified' | 'unverified';
  onChangeQueue: (queue: 'verified' | 'unverified') => void;
  verifiedCount: number;
  unverifiedCount: number;
}

export default function ChatQueueTabs({ 
  activeQueue, 
  onChangeQueue,
  verifiedCount,
  unverifiedCount 
}: ChatQueueTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        <button 
          className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
            activeQueue === 'verified' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChangeQueue('verified')}
        >
          已验证队列
          <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{verifiedCount}</span>
        </button>
        <button 
          className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
            activeQueue === 'unverified' ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChangeQueue('unverified')}
        >
          待验证队列
          <span className="ml-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">{unverifiedCount}</span>
        </button>
      </div>
    </div>
  );
} 