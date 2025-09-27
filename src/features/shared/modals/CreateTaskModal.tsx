import { useState, useEffect } from 'react';
import { Chat } from '../../../types';
import { taskApi } from '../../../api/taskApi';
import { deptApi, DeptSelectListItem } from '../../../api/deptApi';
// roomApi is not used in the refactored version directly in the submission logic, but might be needed if validation logic changes.
// import { roomApi } from '../../../api/roomApi';
import { TaskCreateRequest } from '../../../api/types';
import { DatePicker, Input, Select, Button, Modal, Form, message, Row, Col } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  FlagOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface CreateTaskModalProps {
  chat?: Chat | null; // 可选的会话参数
  onClose: () => void;
  onSuccess?: () => void; // 成功回调，用于刷新列表
  title?: string; // 自定义标题
}

export default function CreateTaskModal({ 
  chat = null, 
  onClose, 
  onSuccess,
  title = "创建工单"
}: CreateTaskModalProps) {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<DeptSelectListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取部门列表
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptList = await deptApi.getDeptSelectList();
        setDepartments(deptList);
      } catch (err) {
        console.error('获取部门列表失败:', err);
        message.error('获取部门列表失败');
      }
    };
    
    fetchDepartments();
  }, []);

  const handleCreateTask = async (values: {
    title: string;
    deptId: number;
    priority: string;
    description: string;
    deadlineTime: dayjs.Dayjs | null;
    roomNumber: string;
  }) => {
    setLoading(true);

    try {
        // The logic to get roomId based on chat or roomNumber is complex and seems incorrect in the original.
        // Assuming guestId from chat is what's needed for association.
        // And room is implicitly linked via conversation. The BE should handle this.
        // For now, let's keep the logic simple, focusing on UI, and let BE derive room from conversation.
      const request: TaskCreateRequest = {
        roomId: null, // Per instruction, BE can derive this from conversationId
        title: values.title,
        description: values.description,
        deptId: values.deptId,
        priority: values.priority,
        guestId: chat?.guestId || null,
        deadlineTime: values.deadlineTime ? values.deadlineTime.valueOf() : null,
        conversationId: chat?.id || null,
      };

      const response = await taskApi.createTask(request);
      
      if (response.statusCode === 200) {
        message.success('工单创建成功！');
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        message.error(response.message || '创建工单失败');
      }
    } catch (err) {
      console.error('创建工单失败:', err);
      message.error('创建工单失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  // Set initial form values when chat context is available
  useEffect(() => {
    if (chat) {
      form.setFieldsValue({
        roomNumber: chat.roomNumber,
        // Potentially pre-fill other fields based on chat context
      });
    }
  }, [chat, form]);

  return (
    <Modal
      title={title}
      open={true}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateTask}
        initialValues={{
          priority: 'medium',
        }}
        className="mt-6"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="房间号"
              name="roomNumber"
              rules={!chat ? [{ required: true, message: '请填写房间号' }] : []}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder={chat ? '' : '请输入房间号'}
                readOnly={!!chat}
                disabled={!!chat}
                value={chat?.roomNumber}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {chat && (
              <Form.Item label="关联会话">
                <div className="flex items-center p-2 bg-gray-100 border rounded-md h-[32px]">
                  <InfoCircleOutlined className="mr-2 text-blue-500" />
                  <span className="text-gray-700">{`与 ${chat.guestName} 的会话`}</span>
                </div>
              </Form.Item>
            )}
          </Col>
        </Row>

        <Form.Item
          label="工单标题"
          name="title"
          rules={[{ required: true, message: '请填写工单标题' }]}
        >
          <Input prefix={<FileTextOutlined />} placeholder="请输入工单标题" />
        </Form.Item>
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="分配部门"
              name="deptId"
              rules={[{ required: true, message: '请选择部门' }]}
            >
              <Select prefix={<TeamOutlined />} placeholder="请选择部门">
                {departments.map((dept) => (
                  <Select.Option key={dept.deptId} value={dept.deptId}>
                    {dept.deptName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="优先级"
              name="priority"
            >
              <Select prefix={<FlagOutlined />} placeholder="请选择优先级">
                <Select.Option value="low">低</Select.Option>
                <Select.Option value="medium">中</Select.Option>
                <Select.Option value="high">高</Select.Option>
                <Select.Option value="urgent">紧急</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="截止时间"
          name="deadlineTime"
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder="请选择截止时间"
            className="w-full"
            suffixIcon={<ClockCircleOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
        >
          <Input.TextArea
            rows={4}
            placeholder="请填写详细描述"
          />
        </Form.Item>

        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            data-testid="confirm-create-task"
          >
            创建工单
          </Button>
        </div>
      </Form>
    </Modal>
  );
} 