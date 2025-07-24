import { useState } from 'react';
import { Chat } from '../../types';
import { useChats } from '../../hooks/useChats';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import EmptyChatState from './EmptyChatState';

interface ChatMainProps {
  selectedChat: Chat | null;
  onOpenGuestInfo: () => void;
  onOpenCreateTask: () => void;
}

export default function ChatMain({ 
  selectedChat, 
  onOpenGuestInfo,
  onOpenCreateTask
}: ChatMainProps) {
  const [newMessage, setNewMessage] = useState('');
  const { sendMessage, resolveChat } = useChats();
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    sendMessage(selectedChat, newMessage);
    setNewMessage('');
  };

  const handleTransferChat = () => {
    if (!selectedChat) return;
    const agent = prompt('转接给哪位客服？');
    if (agent) {
      // 这里将来会调用API
      alert(`已将会话转接给 ${agent}`);
    }
  };
  
  const handleResolveChat = () => {
    if (!selectedChat) return;
    if (window.confirm('确定要解决这个会话吗？')) {
      resolveChat(selectedChat);
      alert('会话已标记为解决');
    }
  };

  const handleUseQuickReply = (content: string) => {
    setNewMessage(content);
    // 使用setTimeout确保状态已更新
    setTimeout(() => handleSendMessage(), 0);
  };
  
  return (
    <div className="flex-1 flex flex-col">
      {/* 聊天头部 */}
      <ChatHeader 
        chat={selectedChat}
        onOpenGuestInfo={onOpenGuestInfo}
        onOpenCreateTask={onOpenCreateTask}
        onTransfer={handleTransferChat}
        onResolve={handleResolveChat}
      />
      
      {/* 聊天区域 */}
      <div className="flex-1 bg-gray-50 p-4">
        {selectedChat ? (
          <div className="h-full flex flex-col">
            <ChatMessages messages={selectedChat.messages} />
            <ChatInput 
              value={newMessage}
              onChange={setNewMessage}
              onSend={handleSendMessage}
              onQuickReply={handleUseQuickReply}
            />
          </div>
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
} 