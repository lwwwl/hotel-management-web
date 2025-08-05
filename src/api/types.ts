export interface ApiResponse<T> {
  statusCode: number; // Changed from code to statusCode to match API response
  message: string;
  data: T;
  timestamp: number;
  error: null | string;
}

export interface PaginatedResponse<T> {
  statusCode: number; // Changed from code to statusCode to match API response
  message: string;
  data: {
    total: number;
    records: T[];
  };
  timestamp: number;
  error: null | string;
}

// Task List API types
export interface TaskListRequest {
  requireTaskColumnList: TaskColumnRequest[];
  departmentId?: number | null;
  priority?: string | null;
}

export interface TaskColumnRequest {
  taskStatus: string;
  lastTaskId?: number | null;
  lastTaskCreateTime?: number | null;
}

export interface TaskListColumnBO {
  tasks: TaskListItemBO[];
  taskCount: number;
  taskStatus: string; // Changed from number to string to match API response
  taskStatusDisplayName: string;
}

export interface TaskListItemBO {
  taskId: number;
  title: string;
  description: string;
  roomId: number;
  roomName: string;
  guestId: number;
  guestName: string;
  deptId: number;
  deptName: string;
  taskStatus: string; // Changed from number to string to match API response
  taskStatusDisplayName: string;
  priority: string; // Added missing priority field
  priorityDisplayName: string; // Added missing priorityDisplayName field
  createTime: number; // 改为毫秒时间戳
  updateTime: number; // 改为毫秒时间戳
}

// Task API types
export interface TaskColumn {
  status: string;
  count: number;
  tasks: TaskListItem[];
}

export interface TaskListItem {
  id: number;
  title: string;
  description: string;
  priority: string;
  priorityDisplayName: string;
  status: string;
  statusDisplayName: string;
  roomId: number;
  roomName: string;
  guestId: number;
  guestName: string;
  deptId: number;
  deptName: string;
  createdAt: number;
}

export interface TaskDetail {
  id: number;
  roomId: number;
  roomName: string;
  guestId: number;
  guestName: string;
  deptId: number;
  deptName: string;
  title: string;
  description: string;
  priority: string;
  priorityDisplayName: string; // 优先级显示名称
  status: string;
  statusDisplayName: string; // 状态显示名称
  createdAt: number; // 改为毫秒时间戳
  creator: string;
  executor?: string;
  operateRecords: TaskOperateRecord[];
}

export interface TaskOperateRecord {
  id: number;
  taskId: number;
  operateType: string;
  operateUser: string;
  operateTime: number; // 改为毫秒时间戳
  operateContent: string;
}

// Task request types
export interface TaskDetailRequest {
  taskId: number;
}

export interface TaskCreateRequest {
  roomId: number | null;
  title: string;
  description: string;
  deptId: number;
  priority: string;
  guestId: number | null;
  // 截止时间，时间戳
  deadlineTime: number | null;
  conversationId: number | null;
}

export interface TaskUpdateRequest {
  id: number;
  title: string;
  description: string;
  priority: string;
}

export interface TaskChangeStatusRequest {
  id: number;
  status: string;
}

// Chat API types
export interface ChatMessage {
  id: number;
  sender: 'guest' | 'agent';
  content: string;
  timestamp: string;
  translation?: string;
}

export interface ChatConversation {
  id: number;
  roomNumber: string;
  guestName: string;
  lastMessage: string;
  lastTime: string;
  verified: boolean;
  language: string;
  checkInDate: string;
  checkOutDate: string;
  statusText: string;
  messages: ChatMessage[];
} 