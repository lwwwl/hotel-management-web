import CreateTaskModal from '../../shared/modals/CreateTaskModal';
import { Chat } from '../../../types';

interface ChatCreateTaskModalProps {
  chat: Chat | null;
  onClose: () => void;
}

export default function ChatCreateTaskModal({ chat, onClose }: ChatCreateTaskModalProps) {
  return (
    <CreateTaskModal
      chat={chat}
      onClose={onClose}
      title="生成工单"
    />
  );
} 