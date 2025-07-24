import { Chat } from '../../../types';

interface GuestInfoModalProps {
  chat: Chat;
  onClose: () => void;
}

export default function GuestInfoModal({ chat, onClose }: GuestInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">客人信息</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">姓名:</span>
            <span>{chat.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">房间号:</span>
            <span>{chat.roomNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">入住时间:</span>
            <span>{chat.checkInDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">预计离店:</span>
            <span>{chat.checkOutDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">验证状态:</span>
            <span className={chat.verified ? 'text-green-600' : 'text-red-600'}>
              {chat.verified ? '已验证' : '未验证'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">会话状态:</span>
            <span>{chat.statusText}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">语言:</span>
            <span>{chat.language || '中文'}</span>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
} 