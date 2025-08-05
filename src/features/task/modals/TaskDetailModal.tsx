import { useEffect, useState } from 'react';
import { Task } from '../../../types';
import { taskApi, TaskDetail } from '../../../api';
import { formatTimestamp } from '../../../utils/dateUtils';
import { Modal, Spin, Button, Descriptions, Timeline, message } from 'antd';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  
  // 获取任务详情
  useEffect(() => {
    const fetchTaskDetail = async () => {
      setLoading(true);
      
      try {
        const response = await taskApi.getTaskDetail(task.taskId);
        if (response.statusCode === 200) {
          setTaskDetail(response.data);
        } else {
          message.error(response.message || '获取任务详情失败');
        }
      } catch (err) {
        console.error('获取任务详情出错:', err);
        message.error('获取任务详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskDetail();
  }, [task.taskId]);

  return (
    <Modal
      title="工单详情"
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
      width={800}
      destroyOnClose
    >
      {loading ? (
        <div className="py-10 text-center">
          <Spin size="large" />
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      ) : (taskDetail || task) ? (
        <div className="space-y-6">
          {/* 基本信息 */}
          <Descriptions title="基本信息" bordered column={2}>
            <Descriptions.Item label="房间号" span={1}>
              {taskDetail?.roomId || task.roomId}
            </Descriptions.Item>
            <Descriptions.Item label="优先级" span={1}>
              {taskDetail?.priorityDisplayName || task.priorityDisplayName}
            </Descriptions.Item>
            <Descriptions.Item label="标题" span={2}>
              {taskDetail?.title || task.title}
            </Descriptions.Item>
            <Descriptions.Item label="部门" span={1}>
              {taskDetail?.deptName || task.deptName}
            </Descriptions.Item>
            <Descriptions.Item label="当前状态" span={1}>
              {taskDetail?.statusDisplayName || task.statusDisplayName}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={1}>
              {formatTimestamp(taskDetail?.createdAt || task.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="创建人" span={1}>
              {taskDetail?.creator || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="执行人" span={1}>
              {taskDetail?.executor || '暂无'}
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              <div className="whitespace-pre-line">
                {taskDetail?.description || task.description}
              </div>
            </Descriptions.Item>
          </Descriptions>
          
          {/* 操作记录 */}
          {taskDetail && taskDetail.operateRecords && taskDetail.operateRecords.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-4">操作记录</h4>
              <Timeline>
                {taskDetail.operateRecords.map(record => (
                  <Timeline.Item key={record.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{record.operateUser}</p>
                        <p className="text-sm text-gray-600">
                          {record.operateType}: {record.operateContent}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(record.operateTime)}
                      </span>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          暂无数据
        </div>
      )}
    </Modal>
  );
} 