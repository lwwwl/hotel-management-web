import { Chat } from '../../types';

interface ChatListProps {
  chats: Chat[];
  activeQueue: 'mine' | 'unassigned';
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
      {/* 我处理的会话列表 */}
      {activeQueue === 'mine' && (
        <div>
          <div className="p-2 bg-blue-50 text-blue-800 text-sm">我处理的会话</div>
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
                    {chat.roomNumber} - {chat.guestName}
                  </div>
                  <div className="text-sm text-gray-600">{chat.lastMessage}</div>
                  <div className="text-xs text-gray-400">{chat.lastTime}</div>
                </div>
                <span className={`px-2 py-1 text-xs rounded whitespace-nowrap min-w-[50px] text-center ${
                  chat.statusText === '已解决' 
                    ? 'bg-green-100 text-green-800' 
                    : chat.statusText === '未解决'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>{chat.statusText}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 待分配会话列表 */}
      {activeQueue === 'unassigned' && (
        <div>
          <div className="p-2 bg-orange-50 text-orange-800 text-sm">待分配会话</div>
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
                    {chat.roomNumber} - {chat.guestName}
                  </div>
                  <div className="text-sm text-gray-600">{chat.lastMessage}</div>
                  <div className="text-xs text-gray-400">{chat.lastTime}</div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 text-xs rounded whitespace-nowrap min-w-[50px] text-center ${
                    chat.statusText === '已解决' 
                      ? 'bg-green-100 text-green-800' 
                      : chat.statusText === '未解决'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>{chat.statusText}</span>
                  <button 
                    onClick={() => onQuickVerify(chat)}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    接受处理
                  </button>
                </div>
              </div>
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