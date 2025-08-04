import api from './axiosConfig';
import { 
  ApiResponse, 
  TaskColumn, 
  TaskDetail, 
  TaskCreateRequest, 
  TaskUpdateRequest, 
  TaskChangeStatusRequest,
  TaskListRequest,
  TaskListColumnBO,
  TaskDetailRequest
} from './types';

export const taskApi = {
  /**
   * 获取任务列表
   * @param request 任务列表请求参数，包含过滤条件和分页信息
   */
  getTaskList: async (request: TaskListRequest) => {
    const response = await api.post<ApiResponse<TaskListColumnBO[]>>('/task/list', request);
    return response.data;
  },

  /**
   * 获取任务看板列表
   * @param department 部门筛选
   * @param priority 优先级筛选
   */
  getTaskColumns: async (department?: string, priority?: string) => {
    const params = { department, priority };
    const response = await api.get<ApiResponse<TaskColumn[]>>('/task/columns', { params });
    return response.data;
  },

  /**
   * 获取任务详情
   * @param taskId 任务ID
   */
  getTaskDetail: async (taskId: number) => {
    const request: TaskDetailRequest = { taskId };
    const response = await api.post<ApiResponse<TaskDetail>>('/task/detail', request);
    return response.data;
  },

  /**
   * 创建新任务
   * @param task 任务信息
   */
  createTask: async (task: TaskCreateRequest) => {
    const response = await api.post<ApiResponse<number>>('/task/create', task);
    return response.data;
  },

  /**
   * 更新任务信息
   * @param task 任务信息
   */
  updateTask: async (task: TaskUpdateRequest) => {
    const response = await api.put<ApiResponse<boolean>>('/task/update', task);
    return response.data;
  },

  /**
   * 删除任务
   * @param id 任务ID
   */
  deleteTask: async (id: number) => {
    const response = await api.delete<ApiResponse<boolean>>(`/task/delete/${id}`);
    return response.data;
  },

  /**
   * 修改任务状态
   * @param taskStatus 任务状态信息
   */
  changeTaskStatus: async (taskStatus: TaskChangeStatusRequest) => {
    const response = await api.put<ApiResponse<boolean>>('/task/status', taskStatus);
    return response.data;
  },

  /**
   * 认领任务
   * @param id 任务ID
   */
  claimTask: async (id: number) => {
    const response = await api.put<ApiResponse<boolean>>(`/task/claim/${id}`);
    return response.data;
  },

  /**
   * 转接任务
   * @param id 任务ID
   * @param userId 新执行人ID
   */
  transferTask: async (id: number, userId: number) => {
    const response = await api.put<ApiResponse<boolean>>(`/task/transfer/${id}`, { userId });
    return response.data;
  },

  /**
   * 添加执行人
   * @param id 任务ID
   * @param userId 执行人ID
   */
  addExecutor: async (id: number, userId: number) => {
    const response = await api.put<ApiResponse<boolean>>(`/task/executor/add/${id}`, { userId });
    return response.data;
  },

  /**
   * 发送任务提醒
   * @param id 任务ID
   */
  sendReminder: async (id: number) => {
    const response = await api.post<ApiResponse<boolean>>(`/task/reminder/${id}`);
    return response.data;
  }
}; 