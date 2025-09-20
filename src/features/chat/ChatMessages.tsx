import { useEffect, useRef, useCallback, useState } from 'react';
import { Message } from '../../types';

interface ChatMessagesProps {
  messages: Message[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isNewMessage?: boolean;
}

export default function ChatMessages({
  messages,
  loading = false,
  hasMore = false,
  onLoadMore,
  isNewMessage = false
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | null>(null);

  // 自动滚动到底部 - 仅当有新消息时
  useEffect(() => {
    if (isNewMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isNewMessage]);

  // 分页加载时保持滚动位置
  useEffect(() => {
    if (!loading && prevScrollHeight !== null && messagesContainerRef.current) {
      const currentScrollHeight = messagesContainerRef.current.scrollHeight;
      messagesContainerRef.current.scrollTop = currentScrollHeight - prevScrollHeight;
      setPrevScrollHeight(null);
    }
  }, [loading, prevScrollHeight]);


  // 滚动加载更多
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || !hasMore || loading) return;
    
    const { scrollTop } = messagesContainerRef.current;
    // 当滚动到顶部附近时加载更多
    if (scrollTop < 100) {
      // 记录当前滚动高度，以便加载后恢复位置
      if (messagesContainerRef.current) {
        setPrevScrollHeight(messagesContainerRef.current.scrollHeight);
      }
      onLoadMore?.();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div 
      ref={messagesContainerRef}
      className="h-[60vh] bg-white rounded-lg shadow-sm overflow-y-auto chat-scroll p-4" 
      id="messages-container"
    >
      {/* 加载更多提示 */}
      {hasMore && (
        <div className="text-center py-2 text-gray-500 text-sm">
          {loading ? '加载中...' : '上拉加载更多'}
        </div>
      )}
      
      {messages.map(message => (
        <div 
          key={message.id}
          className={`mb-4 ${message.sender === 'guest' ? 'text-left' : 'text-right'}`}
        >
          <div 
            className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'guest' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'
            }`}
          >
            <div>{message.content}</div>
            <div className="text-xs mt-1 opacity-75">{message.timestamp}</div>
            
            {/* 翻译结果区域 */}
            {(message.translation || message.translationLoading || message.translationError) && (
              <div className="mt-2 pt-2 border-t border-opacity-20 border-current">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-medium opacity-75">翻译:</span>
                  {message.translationLoading && (
                    <div className="flex items-center space-x-1">
                      <div className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full"></div>
                      <span className="opacity-75">翻译中...</span>
                    </div>
                  )}
                  {message.translationError && (
                    <span className="opacity-75 text-red-300">翻译失败</span>
                  )}
                  {message.translation && !message.translationLoading && !message.translationError && (
                    <span className="opacity-75 italic">{message.translation}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 