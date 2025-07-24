export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    total: number;
    records: T[];
  };
}

// Task List API types
export interface TaskListRequest {
  requireTaskColumnList: TaskColumnRequest[];
  departmentId?: number | null;
  priority?: number | null;
}

export interface TaskColumnRequest {
  taskStatus: string;
  lastTaskId?: number | null;
  lastTaskCreateTime?: string | null;
}

export interface TaskListColumnBO {
  tasks: TaskListItemBO[];
  taskCount: number;
  taskStatus: number;
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
  taskStatus: number;
  taskStatusDisplayName: string;
  createTime: string;
  updateTime: string;
}

// Task API types
export interface TaskColumn {
  status: string;
  count: number;
  tasks: TaskListItem[];
}

export interface TaskListItem {
  id: number;
  roomNumber: string;
  title: string;
  description: string;
  department: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface TaskDetail {
  id: number;
  roomNumber: string;
  title: string;
  description: string;
  department: string;
  priority: string;
  status: string;
  createdAt: string;
  creator: string;
  executor?: string;
  operateRecords: TaskOperateRecord[];
}

export interface TaskOperateRecord {
  id: number;
  taskId: number;
  operateType: string;
  operateUser: string;
  operateTime: string;
  operateContent: string;
}

// Task request types
export interface TaskCreateRequest {
  roomNumber: string;
  title: string;
  description: string;
  department: string;
  priority: string;
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