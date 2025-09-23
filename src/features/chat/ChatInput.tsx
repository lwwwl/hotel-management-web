import { KeyboardEvent, useState } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onQuickReply: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend,
  onQuickReply,
  disabled = false
}: ChatInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 快速回复选项
  const quickReplies = [
    { id: 1, text: '好的，马上安排', content: '好的，马上安排相关服务人员为您处理，请稍候。' },
    { id: 2, text: '需要更多信息', content: '为了更好地为您服务，请提供更多详细信息。' },
    { id: 3, text: '已记录您的需求', content: '已记录您的需求，我们会尽快为您处理。' },
    { id: 4, text: '感谢您的耐心', content: '感谢您的耐心等待，有任何问题请随时联系我们。' }
  ];

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };
  
  return (
    <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <textarea 
            className={`w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="输入消息..."
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            data-testid="message-input"
            style={{ height: '50px' }}
          />
          {/* 展开按钮在编辑框内部 */}
          <button 
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={() => setIsExpanded(true)}
            disabled={disabled}
            title="展开编辑器"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
            </svg>
          </button>
        </div>
        <button 
          className={`px-6 rounded-lg flex items-center space-x-2 ${
            disabled 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={onSend}
          disabled={disabled}
          data-testid="send-btn"
          style={{ height: '50px' }}
        >
          <span>{disabled ? '发送中...' : '发送'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {quickReplies.map(reply => (
          <button 
            key={reply.id}
            className={`px-3 py-1 text-sm rounded-full ${
              disabled 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onQuickReply(reply.content)}
            disabled={disabled}
          >
            {reply.text}
          </button>
        ))}
      </div>
      
      {/* 展开的编辑器模态框 */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90vw] h-[70vh] max-w-4xl flex flex-col">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">编辑消息</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* 编辑器区域 */}
            <div className="flex-1 p-4 flex flex-col">
              <textarea
                className={`w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="在这里输入详细消息..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                style={{ minHeight: '300px' }}
              />
            </div>
            
            {/* 模态框底部按钮 */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onSend();
                  setIsExpanded(false);
                }}
                disabled={disabled}
                className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                  disabled 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <span>{disabled ? '发送中...' : '发送'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 