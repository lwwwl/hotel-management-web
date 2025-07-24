import { Chat } from '../../types';

interface ChatHeaderProps {
  chat: Chat | null;
  onOpenGuestInfo: () => void;
  onOpenCreateTask: () => void;
  onTransfer: () => void;
  onResolve: () => void;
}

export default function ChatHeader({ 
  chat, 
  onOpenGuestInfo,
  onOpenCreateTask,
  onTransfer,
  onResolve 
}: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {chat ? (
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-medium text-gray-800">
                  房间 {chat.roomNumber} - {chat.guestName}
                </h3>
                <p className="text-sm text-gray-600">
                  入住时间: {chat.checkInDate}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className={`px-3 py-1 text-sm rounded-full ${
                    chat.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {chat.verified ? '已验证' : '未验证'}
                </span>
                <button 
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={onOpenGuestInfo}
                  data-testid="guest-info-btn"
                >
                  客人信息
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">请选择一个会话</div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            onClick={onOpenCreateTask}
            disabled={!chat}
            data-testid="create-task-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>生成工单</span>
          </button>
          <button 
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            onClick={onTransfer}
            disabled={!chat}
            data-testid="transfer-btn"
          >
            转接
          </button>
          <button 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            onClick={onResolve}
            disabled={!chat}
            data-testid="resolve-btn"
          >
            解决
          </button>
        </div>
      </div>
    </div>
  );
} 