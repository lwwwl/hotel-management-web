import { useState, useEffect } from 'react';
import { Chat } from '../../types';
import { useChats } from '../../hooks/useChats';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import EmptyChatState from './EmptyChatState';
import TranslateSwitch from './TranslateSwitch';

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
  const { 
    sendMessage, 
    resolveChat, 
    messages, 
    messagesLoading, 
    hasMoreMessages, 
    loadMoreMessages, 
    selectChat, 
    sendingMessage,
    isNewMessage,
    translationLoading,
    translateEnabled,
    selectedLanguage,
    toggleTranslate,
    changeTranslateLanguage
  } = useChats();
  
  // 当选择会话时，加载消息
  useEffect(() => {
    if (selectedChat) {
      selectChat(selectedChat);
    }
  }, [selectedChat, selectChat]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;
    sendMessage(selectedChat.id, newMessage);
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
  
  const handleResolveChat = async () => {
    if (!selectedChat) return;
    if (window.confirm('确定要解决这个会话吗？')) {
      await resolveChat(selectedChat);
    }
  };

  const handleUseQuickReply = (content: string) => {
    setNewMessage(content);
    // 使用setTimeout确保状态已更新
    setTimeout(() => handleSendMessage(), 0);
  };
  
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* 聊天头部 */}
      <ChatHeader 
        chat={selectedChat}
        onOpenGuestInfo={onOpenGuestInfo}
        onOpenCreateTask={onOpenCreateTask}
        onTransfer={handleTransferChat}
        onResolve={handleResolveChat}
      />
      
      {/* 聊天区域 */}
      <div className="flex-1 min-h-0 bg-gray-50 p-4">
        {selectedChat ? (
          <div className="h-full min-h-0 flex flex-col">
            {/* 翻译开关 */}
            <div className="mb-4">
              <TranslateSwitch
                enabled={translateEnabled}
                selectedLanguage={selectedLanguage}
                onToggle={toggleTranslate}
                onLanguageChange={changeTranslateLanguage}
                disabled={!selectedChat || translationLoading}
              />
            </div>
            
            <ChatMessages 
              messages={messages} 
              loading={messagesLoading}
              hasMore={hasMoreMessages}
              onLoadMore={loadMoreMessages}
              isNewMessage={isNewMessage}
            />
            <ChatInput 
              value={newMessage}
              onChange={setNewMessage}
              onSend={handleSendMessage}
              onQuickReply={handleUseQuickReply}
              disabled={sendingMessage}
            />
          </div>
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
} 