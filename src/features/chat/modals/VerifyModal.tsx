import { useState } from 'react';
import { Chat } from '../../../types';
import { useChats } from '../../../hooks/useChats';

interface VerifyModalProps {
  chat: Chat;
  onClose: () => void;
}

export default function VerifyModal({ chat, onClose }: VerifyModalProps) {
  const [verifyNote, setVerifyNote] = useState('');
  const { verifyChat, rejectChat } = useChats();
  
  const handleApproveVerification = () => {
    verifyChat(chat);
    alert('验证已通过，客人可以正常使用服务');
    onClose();
  };
  
  const handleRejectVerification = () => {
    if (!verifyNote.trim()) {
      alert('请填写拒绝验证的原因');
      return;
    }
    
    rejectChat(chat);
    alert('验证已拒绝，会话将被关闭');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">人工验证客人身份</h3>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">需要人工验证</h4>
                <p className="text-sm text-yellow-700 mt-1">该客人身份信息验证失败，需要前台人工核实</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">房间号</label>
                <p className="text-lg font-semibold">{chat.roomNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">客人姓名</label>
                <p className="text-lg font-semibold">{chat.guestName}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">最近消息</label>
              <p className="text-gray-800 bg-gray-50 p-2 rounded">{chat.lastMessage}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">验证备注</label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                rows={3}
                placeholder="请输入验证情况说明..."
                value={verifyNote}
                onChange={(e) => setVerifyNote(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            取消
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={handleRejectVerification}
            data-testid="reject-verify-btn"
          >
            拒绝验证
          </button>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={handleApproveVerification}
            data-testid="approve-verify-btn"
          >
            通过验证
          </button>
        </div>
      </div>
    </div>
  );
} 