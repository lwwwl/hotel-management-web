import { useState } from 'react';
import { Chat } from '../types';
import ChatSidebar from '../features/chat/ChatSidebar';
import ChatMain from '../features/chat/ChatMain';
import GuestInfoModal from '../features/chat/modals/GuestInfoModal';
import CreateTaskModal from '../features/chat/modals/CreateTaskModal';
import VerifyModal from '../features/chat/modals/VerifyModal';

export default function ChatPage() {
  // 状态管理
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showGuestInfo, setShowGuestInfo] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingChat, setVerifyingChat] = useState<Chat | null>(null);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 flex">
        {/* 左侧会话列表 */}
        <ChatSidebar 
          selectedChat={selectedChat} 
          onSelectChat={setSelectedChat}
        />
        
        {/* 主要聊天区域 */}
        <ChatMain 
          selectedChat={selectedChat}
          onOpenGuestInfo={() => setShowGuestInfo(true)}
          onOpenCreateTask={() => setShowCreateTaskModal(true)}
        />
      </div>
      
      {/* 模态框组件 */}
      {showGuestInfo && selectedChat && (
        <GuestInfoModal 
          chat={selectedChat} 
          onClose={() => setShowGuestInfo(false)} 
        />
      )}
      
      {showCreateTaskModal && (
        <CreateTaskModal 
          chat={selectedChat} 
          onClose={() => setShowCreateTaskModal(false)} 
        />
      )}
      
      {showVerifyModal && verifyingChat && (
        <VerifyModal 
          chat={verifyingChat} 
          onClose={() => {
            setShowVerifyModal(false);
            setVerifyingChat(null);
          }}
        />
      )}
    </div>
  );
} 