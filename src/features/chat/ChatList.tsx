import { Chat } from '../../types';

interface ChatListProps {
  chats: Chat[];
  activeQueue: 'verified' | 'unverified';
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onQuickVerify: (chat: Chat) => void;
}

export default function ChatList({ 
  chats, 
  activeQueue, 
  selectedChat, 
  onSelectChat,
  onQuickVerify
}: ChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto chat-scroll">
      {/* 已验证会话列表 */}
      {activeQueue === 'verified' && (
        <div>
          <div className="p-2 bg-green-50 text-green-800 text-sm">已验证会话列表</div>
          {chats.map(chat => (
            <div 
              key={chat.id}
              className={`p-3 border-b bg-white hover:bg-gray-50 cursor-pointer ${
                selectedChat?.id === chat.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {chat.guestName}
                  </div>
                  <div className="text-sm text-gray-600">{chat.lastMessage}</div>
                  <div className="text-xs text-gray-400">{chat.lastTime}</div>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">已验证</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 未验证会话列表 */}
      {activeQueue === 'unverified' && (
        <div>
          <div className="p-2 bg-red-50 text-red-800 text-sm">未验证会话列表</div>
          {chats.map(chat => (
            <div 
              key={chat.id}
              className={`p-3 border-b bg-white hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => onSelectChat(chat)}
                >
                  <div className="font-medium">
                    {chat.guestName}
                  </div>
                  <div className="text-sm text-gray-600">{chat.lastMessage}</div>
                  <div className="text-xs text-gray-400">{chat.lastTime}</div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">待验证</span>
                  <button 
                    onClick={() => onQuickVerify(chat)}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    快速验证
                  </button>
                </div>
              z
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {chats.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>暂无会话</p>
        </div>
      )}
    </div>
  );
} 