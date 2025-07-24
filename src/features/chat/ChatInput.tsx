import { KeyboardEvent } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onQuickReply: (content: string) => void;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend,
  onQuickReply 
}: ChatInputProps) {
  // 快速回复选项
  const quickReplies = [
    { id: 1, text: '好的，马上安排', content: '好的，马上安排相关服务人员为您处理，请稍候。' },
    { id: 2, text: '需要更多信息', content: '为了更好地为您服务，请提供更多详细信息。' },
    { id: 3, text: '已记录您的需求', content: '已记录您的需求，我们会尽快为您处理。' },
    { id: 4, text: '感谢您的耐心', content: '感谢您的耐心等待，有任何问题请随时联系我们。' }
  ];

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  return (
    <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="输入消息..."
            rows={2}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            data-testid="message-input"
          />
        </div>
        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          onClick={onSend}
          data-testid="send-btn"
        >
          <span>发送</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {quickReplies.map(reply => (
          <button 
            key={reply.id}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
            onClick={() => onQuickReply(reply.content)}
          >
            {reply.text}
          </button>
        ))}
      </div>
    </div>
  );
} 