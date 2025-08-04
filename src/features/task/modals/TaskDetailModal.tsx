import { useEffect, useState } from 'react';
import { Task } from '../../../types';
import { taskApi, TaskDetail, TaskOperateRecord } from '../../../api';
import { formatTimestamp } from '../../../utils/dateUtils';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  
  // 获取任务详情
  useEffect(() => {
    const fetchTaskDetail = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await taskApi.getTaskDetail(task.taskId);
        if (response.statusCode === 200) {
          setTaskDetail(response.data);
        } else {
          setError(response.message || '获取任务详情失败');
        }
      } catch (err) {
        console.error('获取任务详情出错:', err);
        setError('获取任务详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskDetail();
  }, [task.taskId]);
  
  // 渲染操作记录
  const renderOperateRecords = (records: TaskOperateRecord[]) => {
    if (!records || records.length === 0) {
      return <p className="text-gray-500 italic">暂无操作记录</p>;
    }
    
    return (
      <div className="space-y-3">
        {records.map(record => (
          <div key={record.id} className="border-l-2 border-gray-300 pl-3 py-1">
            <div className="flex justify-between">
              <span className="font-medium">{record.operateUser}</span>
              <span className="text-sm text-gray-500">{formatTimestamp(record.operateTime)}</span>
            </div>
            <p className="text-sm">{record.operateType}: {record.operateContent}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">工单详情</h3>
        
        {loading && (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            <p>{error}</p>
            <button
              className="mt-2 text-sm text-blue-600 hover:underline"
              onClick={() => taskApi.getTaskDetail(task.taskId)}
            >
              重试
            </button>
          </div>
        )}
        
        {!loading && !error && (taskDetail || task) && (
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">基本信息</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">房间号</label>
                  <p className="text-lg font-semibold">{taskDetail?.roomId || task.roomId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">优先级</label>
                  <p className="text-lg font-semibold">{taskDetail?.priorityDisplayName || task.priorityDisplayName}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">标题</label>
                <p className="text-lg font-semibold">{taskDetail?.title || task.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">部门</label>
                <p className="text-lg font-semibold">{taskDetail?.deptName || task.deptName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">描述</label>
                <p className="text-gray-800 whitespace-pre-line">{taskDetail?.description || task.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">创建时间</label>
                  <p className="text-gray-800">{formatTimestamp(taskDetail?.createdAt || task.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">当前状态</label>
                  <p className="text-gray-800">{taskDetail?.statusDisplayName || task.statusDisplayName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">创建人</label>
                  <p className="text-gray-800">{taskDetail?.creator || '未知'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">执行人</label>
                  <p className="text-gray-800">{taskDetail?.executor || '暂无'}</p>
                </div>
              </div>
            </div>
            
            {/* 操作记录 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">操作记录</h4>
              {taskDetail && renderOperateRecords(taskDetail.operateRecords)}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 mt-6">
          <button 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
} 