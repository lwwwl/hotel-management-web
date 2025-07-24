import { useEffect, useRef } from 'react';
import { Message } from '../../types';

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto chat-scroll p-4" id="messages-container">
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