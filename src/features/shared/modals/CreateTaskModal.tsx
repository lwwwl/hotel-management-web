import { useState, useEffect } from 'react';
import { Chat } from '../../../types';
import { taskApi } from '../../../api/taskApi';
import { deptApi, DeptSelectListItem } from '../../../api/deptApi';
import { roomApi } from '../../../api/roomApi';
import { TaskCreateRequest } from '../../../api/types';
import { DatePicker, Input, Select, Button, Modal, Form, message } from 'antd';
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
    // 如果没有会话，房间号是必填的
    if (!chat && !values.roomNumber) {
      message.error('请填写房间号');
      return;
    }

    setLoading(true);

    try {
      let roomId: number | null = null;
      
      if (chat) {
        // 如果有会话，使用会话ID作为房间ID
        roomId = chat.id;
      } else if (values.roomNumber) {
        // 如果没有会话但有房间号，根据房间号获取房间ID
        try {
          const roomResponse = await roomApi.getRoomDetail(values.roomNumber);
          if (roomResponse.statusCode === 200) {
            roomId = roomResponse.data.id;
          } else {
            message.error('房间号不存在，请检查后重试');
            return;
          }
        } catch {
          message.error('房间号不存在，请检查后重试');
          return;
        }
      }

      const request: TaskCreateRequest = {
        roomId: roomId || null,
        title: values.title,
        description: values.description,
        deptId: values.deptId,
        priority: values.priority,
        guestId: null, // 按要求不传值
        deadlineTime: values.deadlineTime ? values.deadlineTime.valueOf() : null, // 可以为null
        conversationId: chat?.id || null, // 如果有会话，使用会话ID；否则不传值
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

  return (
    <Modal
      title={title}
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateTask}
        initialValues={{
          roomNumber: chat?.roomNumber || '',
          title: '',
          deptId: undefined,
          priority: 'medium',
          description: '',
          deadlineTime: null,
        }}
      >
        <Form.Item
          label="房间号"
          name="roomNumber"
          rules={!chat ? [{ required: true, message: '请填写房间号' }] : []}
        >
          <Input
            placeholder={chat ? '' : '请输入房间号'}
            readOnly={!!chat}
            disabled={!!chat}
          />
        </Form.Item>

        {/* 关联会话信息 */}
        {chat && (
          <Form.Item label="关联会话">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
              关联会话：{chat.guestName}
            </div>
          </Form.Item>
        )}

        <Form.Item
          label="工单标题"
          name="title"
          rules={[{ required: true, message: '请填写工单标题' }]}
        >
          <Input placeholder="AI自动生成或手动输入" />
        </Form.Item>

        <Form.Item
          label="分配部门"
          name="deptId"
          rules={[{ required: true, message: '请选择部门' }]}
        >
          <Select placeholder="请选择部门">
            {departments.map((dept) => (
              <Select.Option key={dept.deptId} value={dept.deptId}>
                {dept.deptName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="优先级"
          name="priority"
        >
          <Select>
            <Select.Option value="low">低</Select.Option>
            <Select.Option value="medium">中</Select.Option>
            <Select.Option value="high">高</Select.Option>
            <Select.Option value="urgent">紧急</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="截止时间"
          name="deadlineTime"
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder="请选择截止时间"
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
        >
          <Input.TextArea
            rows={3}
            placeholder="AI根据对话内容自动生成"
          />
        </Form.Item>

        <div className="flex justify-end space-x-2 mt-6">
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