import { useEffect, useState } from 'react';
import { Task } from '../../../types';
import { taskApi, TaskDetail } from '../../../api';
import { formatTimestamp } from '../../../utils/dateUtils';
import { Modal, Spin, Button, Descriptions, Timeline, message, Tag, Card, Row, Col, Typography, Divider } from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [remindLoading, setRemindLoading] = useState(false);
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

  const handleRemind = async () => {
    setRemindLoading(true);
    try {
      const response = await taskApi.remindTask(task.taskId);
      if (response.statusCode === 200) {
        message.success('催办成功');
      } else {
        message.error(response.message || '催办失败');
      }
    } catch (err) {
      console.error('催办任务出错:', err);
      message.error('催办失败，请稍后重试');
    } finally {
      setRemindLoading(false);
    }
  };

  const getPriorityTagColor = (priority: string) => {
    switch (priority) {
      case '高': return 'red';
      case '紧急': return 'red';
      case '中': return 'orange';
      case '低': return 'blue';
      default: return 'default';
    }
  }

  return (
    <Modal
      title={<Title level={4}>工单详情</Title>}
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button key="remind" type="primary" onClick={handleRemind} loading={remindLoading}>
          催办
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
        <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
          <Card bordered={false}>
            <Title level={5}>{taskDetail?.title || task.title}</Title>
            <Row gutter={[16, 16]} className="mt-4">
              <Col span={12}>
                <InfoCircleOutlined className="mr-2" />
                <Text strong>房间号: </Text>
                <Text>{taskDetail?.roomId || task.roomId}</Text>
              </Col>
              <Col span={12}>
                <CheckCircleOutlined className="mr-2" />
                <Text strong>当前状态: </Text>
                <Tag color="cyan">{taskDetail?.statusDisplayName || task.statusDisplayName}</Tag>
              </Col>
              <Col span={12}>
                <ClockCircleOutlined className="mr-2" />
                <Text strong>优先级: </Text>
                <Tag color={getPriorityTagColor(taskDetail?.priorityDisplayName || task.priorityDisplayName || '')}>
                  {taskDetail?.priorityDisplayName || task.priorityDisplayName}
                </Tag>
              </Col>
              <Col span={12}>
                <TeamOutlined className="mr-2" />
                <Text strong>部门: </Text>
                <Text>{taskDetail?.deptName || task.deptName}</Text>
              </Col>
              <Col span={12}>
                <UserOutlined className="mr-2" />
                <Text strong>创建人: </Text>
                <Text>{taskDetail?.creator || '未知'}</Text>
              </Col>
              <Col span={12}>
                <UserOutlined className="mr-2" />
                <Text strong>执行人: </Text>
                <Text>{taskDetail?.executor || '暂无'}</Text>
              </Col>
               <Col span={12}>
                <ClockCircleOutlined className="mr-2" />
                <Text strong>创建时间: </Text>
                <Text>{formatTimestamp(taskDetail?.createdAt || task.createdAt)}</Text>
              </Col>
              {taskDetail?.deadlineTime && (
                <Col span={12}>
                  <ClockCircleOutlined className="mr-2" style={{ color: 'red' }}/>
                  <Text strong style={{ color: 'red' }}>截止时间: </Text>
                  <Text style={{ color: 'red' }}>{formatTimestamp(taskDetail.deadlineTime)}</Text>
                </Col>
              )}
            </Row>
            
            <Divider />

            <Title level={5}><FileTextOutlined className="mr-2" />详细描述</Title>
            <div className="whitespace-pre-line text-gray-600 bg-gray-100 p-3 rounded-md">
              {taskDetail?.description || task.description}
            </div>
          </Card>

          {taskDetail && taskDetail.operateRecords && taskDetail.operateRecords.length > 0 && (
            <Card bordered={false}>
               <Title level={5}><HistoryOutlined className="mr-2" />操作记录</Title>
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
            </Card>
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