import { useState } from 'react';
import { Chat } from '../../types';
import { useChats } from '../../hooks/useChats';
import ChatQueueTabs from './ChatQueueTabs';
import ChatStats from './ChatStats';
import ChatList from './ChatList';

interface ChatSidebarProps {
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export default function ChatSidebar({ selectedChat, onSelectChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { chats, stats, getQueueCount, verifyChat, activeQueue, setActiveQueue, selectChat } = useChats();

  const handleQuickVerify = (chat: Chat) => {
    if (!chat || chat.verified) return;
    
    if (window.confirm(`确定要验证 ${chat.roomNumber} 房间的 ${chat.guestName} 吗？`)) {
      const updatedChat = verifyChat(chat);
      alert(`${updatedChat.roomNumber} 房间客人验证成功！`);
    }
  };
  
  const handleSelectChat = (chat: Chat) => {
    onSelectChat(chat);
    selectChat(chat);
  };
  
  // 过滤聊天列表
  const filteredChats = chats
    .filter(chat => activeQueue === 'verified' ? chat.verified : !chat.verified)
    .filter(chat => 
      searchQuery ? (
        chat.roomNumber.includes(searchQuery) || 
        chat.guestName.includes(searchQuery)
      ) : true
    );
  
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* 搜索栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">客服工作台</h2>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600">在线</span>
          </div>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="搜索房号或客人姓名..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {/* 会话队列选项卡 */}
      <ChatQueueTabs 
        activeQueue={activeQueue} 
        onChangeQueue={setActiveQueue}
        verifiedCount={getQueueCount('verified')}
        unverifiedCount={getQueueCount('unverified')}
      />

      {/* 统计信息 */}
      <ChatStats stats={stats} />

      {/* 会话列表 */}
      <ChatList
        chats={filteredChats}
        activeQueue={activeQueue}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onQuickVerify={handleQuickVerify}
      />
    </div>
  );
} 