import CreateTaskModal from '../../shared/modals/CreateTaskModal';

interface TaskCreateTaskModalProps {
  onClose: () => void;
  onSuccess?: () => void; // 成功回调，用于刷新列表
}

export default function TaskCreateTaskModal({ onClose, onSuccess }: TaskCreateTaskModalProps) {
  return (
    <CreateTaskModal
      onClose={onClose}
      onSuccess={onSuccess}
      title="创建新工单"
    />
  );
} 