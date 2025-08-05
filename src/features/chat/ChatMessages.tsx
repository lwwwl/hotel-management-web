import { useEffect, useRef, useCallback } from 'react';
import { Message } from '../../types';

interface ChatMessagesProps {
  messages: Message[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function ChatMessages({ messages, loading = false, hasMore = false, onLoadMore }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 滚动加载更多
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || !hasMore || loading) return;
    
    const { scrollTop } = messagesContainerRef.current;
    // 当滚动到顶部附近时加载更多
    if (scrollTop < 100) {
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
      className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto chat-scroll p-4" 
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
            {message.translation && (
              <div className="text-xs mt-1 opacity-75 italic">
                <span className="text-yellow-300">翻译:</span> <span>{message.translation}</span>
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 